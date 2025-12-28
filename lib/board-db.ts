import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import type { BoardMessageInput } from "@/lib/board-schema";

type MessageRow = {
  id: number;
  author: string;
  body: string;
  created_at: number;
};

type Statements = {
  list: Database.Statement<{ limit: number }>;
  insert: Database.Statement<{ author: string; body: string; created_at: number }>;
};

let db: Database.Database | null = null;
let statements: Statements | null = null;

const getDbPath = () =>
  process.env.BOARD_DB_PATH ??
  path.join(process.cwd(), "data", "board.db");

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

const getStatements = () => {
  const database = ensureDb();
  if (!statements) {
    statements = {
      list: database.prepare(
        "SELECT id, author, body, created_at FROM messages ORDER BY created_at DESC LIMIT @limit"
      ),
      insert: database.prepare(
        "INSERT INTO messages (author, body, created_at) VALUES (@author, @body, @created_at)"
      ),
    };
  }
  return statements;
};

export const listMessages = (limit = 50): MessageRow[] => {
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));
  const stmt = getStatements().list;
  return stmt.all({ limit: safeLimit }) as MessageRow[];
};

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
