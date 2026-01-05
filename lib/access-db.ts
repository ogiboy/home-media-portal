import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

import { getPortalDbPath } from '@/lib/db-path';

// Role definitions stored in the portal database.
export type RoleName = 'public' | 'admin';

// Permission identifiers for RBAC checks.
export type PermissionName =
  | 'services:read'
  | 'actions:run'
  | 'notifications:read'
  | 'notifications:write'
  | 'admin:all';

const DEFAULT_ROLES: RoleName[] = ['public', 'admin'];
const DEFAULT_PERMISSIONS: PermissionName[] = [
  'services:read',
  'actions:run',
  'notifications:read',
  'notifications:write',
  'admin:all',
];

let db: Database.Database | null = null;

// Initialize the shared portal database connection.
const getDb = () => {
  if (db) {
    return db;
  }

  const dbPath = getPortalDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  ensureSchema(db);
  return db;
};

// Create RBAC and audit tables if needed.
const ensureSchema = (database: Database.Database) => {
  database.exec(
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, login TEXT UNIQUE NOT NULL, display_name TEXT, tailnet_id TEXT, is_active INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL, last_seen_at INTEGER)'
  );
  database.exec(
    'CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL)'
  );
  database.exec(
    'CREATE TABLE IF NOT EXISTS permissions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL)'
  );
  database.exec(
    'CREATE TABLE IF NOT EXISTS role_permissions (role_id INTEGER NOT NULL, permission_id INTEGER NOT NULL, PRIMARY KEY (role_id, permission_id))'
  );
  database.exec(
    'CREATE TABLE IF NOT EXISTS user_roles (user_id INTEGER NOT NULL, role_id INTEGER NOT NULL, PRIMARY KEY (user_id, role_id))'
  );
  database.exec(
    'CREATE TABLE IF NOT EXISTS allowlist (login TEXT PRIMARY KEY, role TEXT NOT NULL, created_at INTEGER NOT NULL)'
  );
  database.exec(
    'CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, actor_login TEXT, actor_name TEXT, action TEXT NOT NULL, service_id TEXT, result TEXT NOT NULL, duration_ms INTEGER, ip TEXT, meta_json TEXT, created_at INTEGER NOT NULL)'
  );

  seedDefaults(database);
};

// Seed default roles and permissions.
const seedDefaults = (database: Database.Database) => {
  const insertRole = database.prepare(
    'INSERT OR IGNORE INTO roles (name) VALUES (@name)'
  );
  DEFAULT_ROLES.forEach((name) => insertRole.run({ name }));

  const insertPerm = database.prepare(
    'INSERT OR IGNORE INTO permissions (name) VALUES (@name)'
  );
  DEFAULT_PERMISSIONS.forEach((name) => insertPerm.run({ name }));

  const roleLookup = database.prepare(
    'SELECT id FROM roles WHERE name = @name'
  );
  const permLookup = database.prepare(
    'SELECT id FROM permissions WHERE name = @name'
  );
  const insertRolePerm = database.prepare(
    'INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (@roleId, @permId)'
  );

  const adminRole = roleLookup.get({ name: 'admin' }) as
    | { id: number }
    | undefined;
  if (adminRole) {
    DEFAULT_PERMISSIONS.forEach((perm) => {
      const permRow = permLookup.get({ name: perm }) as
        | { id: number }
        | undefined;
      if (permRow) {
        insertRolePerm.run({ roleId: adminRole.id, permId: permRow.id });
      }
    });
  }

  const publicRole = roleLookup.get({ name: 'public' }) as
    | { id: number }
    | undefined;
  if (publicRole) {
    ['services:read', 'notifications:read'].forEach((perm) => {
      const permRow = permLookup.get({ name: perm }) as
        | { id: number }
        | undefined;
      if (permRow) {
        insertRolePerm.run({ roleId: publicRole.id, permId: permRow.id });
      }
    });
  }
};

// Resolve role from allowlist; fallback to public.
export const getRoleForLogin = (login: string): RoleName => {
  const database = getDb();
  const row = database
    .prepare('SELECT role FROM allowlist WHERE login = @login')
    .get({ login }) as { role: RoleName } | undefined;
  return row?.role ?? 'public';
};

// Upsert the user record for an authenticated login.
export const upsertUser = (input: {
  login: string;
  displayName?: string;
  tailnetId?: string;
}) => {
  const database = getDb();
  const now = Date.now();
  database
    .prepare(
      'INSERT INTO users (login, display_name, tailnet_id, created_at, last_seen_at) VALUES (@login, @displayName, @tailnetId, @createdAt, @lastSeen) ON CONFLICT(login) DO UPDATE SET display_name = excluded.display_name, tailnet_id = excluded.tailnet_id, last_seen_at = excluded.last_seen_at'
    )
    .run({
      login: input.login,
      displayName: input.displayName ?? null,
      tailnetId: input.tailnetId ?? null,
      createdAt: now,
      lastSeen: now,
    });
};

// Insert a new audit log row.
export const writeAuditLog = (input: {
  actorLogin?: string;
  actorName?: string;
  action: string;
  serviceId?: string;
  result: string;
  durationMs?: number;
  ip?: string;
  metaJson?: string;
}) => {
  const database = getDb();
  database
    .prepare(
      'INSERT INTO audit_log (actor_login, actor_name, action, service_id, result, duration_ms, ip, meta_json, created_at) VALUES (@actorLogin, @actorName, @action, @serviceId, @result, @durationMs, @ip, @metaJson, @createdAt)'
    )
    .run({
      actorLogin: input.actorLogin ?? null,
      actorName: input.actorName ?? null,
      action: input.action,
      serviceId: input.serviceId ?? null,
      result: input.result,
      durationMs: input.durationMs ?? null,
      ip: input.ip ?? null,
      metaJson: input.metaJson ?? null,
      createdAt: Date.now(),
    });
};

// Lookup permissions granted to a role.
export const getPermissionsForRole = (role: RoleName): PermissionName[] => {
  const database = getDb();
  const rows = database
    .prepare(
      'SELECT permissions.name as name FROM permissions JOIN role_permissions ON permissions.id = role_permissions.permission_id JOIN roles ON roles.id = role_permissions.role_id WHERE roles.name = @role'
    )
    .all({ role }) as { name: PermissionName }[];

  return rows.map((row) => row.name);
};

// Check whether a login has a permission via its role.
export const hasPermission = (login: string, permission: PermissionName) => {
  const role = getRoleForLogin(login);
  const perms = getPermissionsForRole(role);
  return perms.includes('admin:all') || perms.includes(permission);
};
