import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

import { getPortalDbPath } from '@/lib/db-path';

export type GameScoreRow = {
  userLogin: string;
  score: number;
};

export type GameStats = {
  gameId: string;
  totalPlays: number;
  topScores: GameScoreRow[];
};

// Prepared statements for game metrics.
type Statements = {
  insert: Database.Statement<{
    game_id: string;
    user_login: string;
    score: number | null;
    created_at: number;
  }>;
  count: Database.Statement<{ game_id: string }>;
  topScores: Database.Statement<{ game_id: string; limit: number }>;
};

let db: Database.Database | null = null;
let statements: Statements | null = null;

const getDbPath = () => getPortalDbPath();

const ensureDb = () => {
  if (db) {
    return db;
  }

  const dbPath = getDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(
    'CREATE TABLE IF NOT EXISTS game_events (id INTEGER PRIMARY KEY AUTOINCREMENT, game_id TEXT NOT NULL, user_login TEXT NOT NULL, score INTEGER, created_at INTEGER NOT NULL)'
  );
  db.exec(
    'CREATE INDEX IF NOT EXISTS idx_game_events_game_id ON game_events(game_id, created_at DESC)'
  );
  db.exec(
    'CREATE INDEX IF NOT EXISTS idx_game_events_user_score ON game_events(game_id, user_login, score DESC)'
  );
  return db;
};

const getStatements = () => {
  const database = ensureDb();
  statements ??= {
    insert: database.prepare(
      'INSERT INTO game_events (game_id, user_login, score, created_at) VALUES (@game_id, @user_login, @score, @created_at)'
    ),
    count: database.prepare(
      'SELECT COUNT(*) as total FROM game_events WHERE game_id = @game_id'
    ),
    topScores: database.prepare(
      'SELECT user_login as userLogin, MAX(score) as score FROM game_events WHERE game_id = @game_id AND score IS NOT NULL GROUP BY user_login ORDER BY score DESC LIMIT @limit'
    ),
  };
  return statements;
};

export const recordGameEvent = (input: {
  gameId: string;
  userLogin: string;
  score?: number | null;
}) => {
  const stmt = getStatements().insert;
  stmt.run({
    game_id: input.gameId,
    user_login: input.userLogin,
    score: input.score ?? null,
    created_at: Date.now(),
  });
};

export const getGameStats = (gameIds: string[], limit = 3) => {
  const stats: Record<string, GameStats> = {};
  const stmt = getStatements();

  gameIds.forEach((gameId) => {
    const totalRow = stmt.count.get({ game_id: gameId }) as { total?: number };
    const totalPlays = Number(totalRow?.total ?? 0);
    const topScores = stmt.topScores.all({ game_id: gameId, limit }) as GameScoreRow[];
    stats[gameId] = {
      gameId,
      totalPlays,
      topScores: topScores.filter((row) => typeof row.score === 'number'),
    };
  });

  return stats;
};
