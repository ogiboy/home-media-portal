import Database from "better-sqlite3";
import fs from "node:fs";

import path from "node:path";

import { getPortalDbPath } from "@/lib/db-path";
import type { BoardMessageInput } from "@/lib/board-schema";
import { BOARD_LIST_LIMIT } from "@/lib/constants/board";

// Row shape for board messages.
type MessageRow = {
  id: number;
  author: string;
  body: string;
  created_at: number;
};

// Prepared statements for message queries.
type Statements = {
  list: Database.Statement<{ limit: number }>;
  insert: Database.Statement<{ author: string; body: string; created_at: number }>;
};

let db: Database.Database | null = null;
let statements: Statements | null = null;

// Resolve the SQLite database path.
const getDbPath = () => getPortalDbPath();

// Initialize the database and schema if needed.
const ensureDb = () => {
  if (db) {
    return db;
  }

  const dbPath = getDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(
    "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT NOT NULL, body TEXT NOT NULL, created_at INTEGER NOT NULL)"
  );
  db.exec(
    "CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC)"
  );
  return db;
};

// Lazily prepare statements for reuse.
const getStatements = () => {
  const database = ensureDb();
  statements ??= {
    list: database.prepare(
      "SELECT id, author, body, created_at FROM messages ORDER BY created_at DESC LIMIT @limit"
    ),
    insert: database.prepare(
      "INSERT INTO messages (author, body, created_at) VALUES (@author, @body, @created_at)"
    ),
  };
  return statements;
};

// List recent messages with a safe limit cap.
export const listMessages = (limit = BOARD_LIST_LIMIT): MessageRow[] => {
  const safeLimit = Math.max(1, Math.min(BOARD_LIST_LIMIT, Math.floor(limit)));
  const stmt = getStatements().list;
  return stmt.all({ limit: safeLimit }) as MessageRow[];
};

// Insert a new message and return the stored row.
export const insertMessage = (input: BoardMessageInput): MessageRow => {
  const createdAt = Date.now();
  const stmt = getStatements().insert;
  const info = stmt.run({
    author: input.author,
    body: input.body,
    created_at: createdAt,
  });

  return {
    id: Number(info.lastInsertRowid),
    author: input.author,
    body: input.body,
    created_at: createdAt,
  };
};
