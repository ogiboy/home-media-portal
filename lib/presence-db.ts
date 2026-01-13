import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

import { getPortalDbPath } from '@/lib/db-path';

const ONLINE_WINDOW_MS = 2 * 60 * 1000;

export type PresenceStats = {
  onlineNow: number;
  peakOnline: number;
};

type Statements = {
  upsert: Database.Statement<{
    session_id: string;
    user_login: string | null;
    last_seen_at: number;
  }>;
  countActive: Database.Statement<{ since: number }>;
  getPeak: Database.Statement<object>;
  updatePeak: Database.Statement<{ peak_online: number }>;
};

let db: Database.Database | null = null;
let statements: Statements | null = null;

const getDbPath = () => getPortalDbPath();

// Initialize the presence database and schema.
const ensureDb = () => {
  if (db) {
    return db;
  }

  const dbPath = getDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(
    'CREATE TABLE IF NOT EXISTS presence (session_id TEXT PRIMARY KEY, user_login TEXT, last_seen_at INTEGER NOT NULL)'
  );
  db.exec(
    'CREATE TABLE IF NOT EXISTS presence_stats (id INTEGER PRIMARY KEY CHECK(id = 1), peak_online INTEGER NOT NULL)'
  );
  db.exec(
    'INSERT OR IGNORE INTO presence_stats (id, peak_online) VALUES (1, 0)'
  );
  return db;
};

// Prepare and cache presence queries.
const getStatements = () => {
  const database = ensureDb();
  statements ??= {
    upsert: database.prepare(
      'INSERT INTO presence (session_id, user_login, last_seen_at) VALUES (@session_id, @user_login, @last_seen_at) ON CONFLICT(session_id) DO UPDATE SET user_login = excluded.user_login, last_seen_at = excluded.last_seen_at'
    ),
    countActive: database.prepare(
      'SELECT COUNT(*) as total FROM presence WHERE last_seen_at >= @since'
    ),
    getPeak: database.prepare(
      'SELECT peak_online as peakOnline FROM presence_stats WHERE id = 1'
    ),
    updatePeak: database.prepare(
      'UPDATE presence_stats SET peak_online = @peak_online WHERE id = 1'
    ),
  };
  return statements;
};

// Resolve presence stats and update the peak count if needed.
const resolveStats = (activeCount: number) => {
  const stmt = getStatements();
  const peakRow = stmt.getPeak.get({}) as { peakOnline?: number } | undefined;
  const peakOnline = Math.max(activeCount, Number(peakRow?.peakOnline ?? 0));
  if (peakOnline > Number(peakRow?.peakOnline ?? 0)) {
    stmt.updatePeak.run({ peak_online: peakOnline });
  }
  return { onlineNow: activeCount, peakOnline } satisfies PresenceStats;
};

// Update presence for a session and return latest stats.
export const touchPresence = (sessionId: string, userLogin?: string | null) => {
  const now = Date.now();
  const stmt = getStatements();
  stmt.upsert.run({
    session_id: sessionId,
    user_login: userLogin ?? null,
    last_seen_at: now,
  });

  const activeRow = stmt.countActive.get({
    since: now - ONLINE_WINDOW_MS,
  }) as { total?: number } | undefined;
  const activeCount = Number(activeRow?.total ?? 0);
  return resolveStats(activeCount);
};

// Read presence stats without updating any session.
export const getPresenceStats = () => {
  const now = Date.now();
  const stmt = getStatements();
  const activeRow = stmt.countActive.get({
    since: now - ONLINE_WINDOW_MS,
  }) as { total?: number } | undefined;
  const activeCount = Number(activeRow?.total ?? 0);
  return resolveStats(activeCount);
};
