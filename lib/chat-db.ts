import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

import { getPortalDbPath } from '@/lib/db-path';

export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  created_at: number;
  updated_at: number;
  message_count: number;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  created_at: number;
}

export interface ChatUserSettings {
  user_id: number;
  max_history_days: number;
  preferred_model: string;
  updated_at: number;
}

let db: Database.Database | null = null;

const getDb = () => {
  if (db) return db;

  const dbPath = getPortalDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  ensureSchema(db);
  return db;
};

const ensureSchema = (database: Database.Database) => {
  // Conversations table
  database.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      title TEXT NOT NULL DEFAULT 'New Chat',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      message_count INTEGER NOT NULL DEFAULT 0
    )
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id)
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC)
  `);

  // Chat messages table
  database.exec(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      model TEXT,
      created_at INTEGER NOT NULL
    )
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id)
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at)
  `);

  // User chat settings table
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_chat_settings (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      max_history_days INTEGER NOT NULL DEFAULT 30,
      preferred_model TEXT NOT NULL DEFAULT 'qwen2.5:3b-instruct-q4_K_M',
      updated_at INTEGER NOT NULL
    )
  `);
};

export const createConversation = (userId: number, title: string): Conversation => {
  const database = getDb();
  const now = Date.now();
  
  const stmt = database.prepare(`
    INSERT INTO conversations (user_id, title, created_at, updated_at, message_count)
    VALUES (@userId, @title, @createdAt, @updatedAt, 0)
  `);
  
  const result = stmt.run({
    userId,
    title,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id: Number(result.lastInsertRowid),
    user_id: userId,
    title,
    created_at: now,
    updated_at: now,
    message_count: 0,
  };
};

export const getConversations = (userId: number, limit = 50): Conversation[] => {
  const database = getDb();
  
  const stmt = database.prepare(`
    SELECT id, user_id, title, created_at, updated_at, message_count
    FROM conversations
    WHERE user_id = @userId
    ORDER BY updated_at DESC
    LIMIT @limit
  `);

  return stmt.all({ userId, limit }) as Conversation[];
};

export const getConversation = (conversationId: number, userId: number): Conversation | null => {
  const database = getDb();
  
  const stmt = database.prepare(`
    SELECT id, user_id, title, created_at, updated_at, message_count
    FROM conversations
    WHERE id = @conversationId AND user_id = @userId
  `);

  return stmt.get({ conversationId, userId }) as Conversation | null;
};

export const updateConversationTitle = (conversationId: number, userId: number, title: string): void => {
  const database = getDb();
  const now = Date.now();
  
  const stmt = database.prepare(`
    UPDATE conversations
    SET title = @title, updated_at = @updatedAt
    WHERE id = @conversationId AND user_id = @userId
  `);
  
  stmt.run({ conversationId, userId, title, updatedAt: now });
};

export const deleteConversation = (conversationId: number, userId: number): void => {
  const database = getDb();
  
  const stmt = database.prepare(`
    DELETE FROM conversations
    WHERE id = @conversationId AND user_id = @userId
  `);
  
  stmt.run({ conversationId, userId });
};

export const addMessage = (
  conversationId: number,
  role: 'user' | 'assistant' | 'system',
  content: string,
  model?: string
): ChatMessage => {
  const database = getDb();
  const now = Date.now();
  
  const insertStmt = database.prepare(`
    INSERT INTO chat_messages (conversation_id, role, content, model, created_at)
    VALUES (@conversationId, @role, @content, @model, @createdAt)
  `);
  
  const result = insertStmt.run({
    conversationId,
    role,
    content,
    model: model ?? null,
    createdAt: now,
  });

  // Update conversation message count and timestamp
  const updateStmt = database.prepare(`
    UPDATE conversations
    SET message_count = message_count + 1, updated_at = @updatedAt
    WHERE id = @conversationId
  `);
  
  updateStmt.run({ conversationId, updatedAt: now });

  return {
    id: Number(result.lastInsertRowid),
    conversation_id: conversationId,
    role,
    content,
    model,
    created_at: now,
  };
};

export const getMessages = (conversationId: number, userId: number): ChatMessage[] => {
  const database = getDb();
  
  // First verify the conversation belongs to the user
  const conversation = getConversation(conversationId, userId);
  if (!conversation) {
    return [];
  }
  
  const stmt = database.prepare(`
    SELECT id, conversation_id, role, content, model, created_at
    FROM chat_messages
    WHERE conversation_id = @conversationId
    ORDER BY created_at ASC
  `);

  return stmt.all({ conversationId }) as ChatMessage[];
};

export const getUserChatSettings = (userId: number): ChatUserSettings | null => {
  const database = getDb();
  
  const stmt = database.prepare(`
    SELECT user_id, max_history_days, preferred_model, updated_at
    FROM user_chat_settings
    WHERE user_id = @userId
  `);

  return stmt.get({ userId }) as ChatUserSettings | null;
};

export const upsertUserChatSettings = (
  userId: number,
  settings: Partial<Omit<ChatUserSettings, 'user_id' | 'updated_at'>>
): void => {
  const database = getDb();
  const now = Date.now();
  
  const existing = getUserChatSettings(userId);
  
  if (existing) {
    const stmt = database.prepare(`
      UPDATE user_chat_settings
      SET max_history_days = COALESCE(@maxHistoryDays, max_history_days),
          preferred_model = COALESCE(@preferredModel, preferred_model),
          updated_at = @updatedAt
      WHERE user_id = @userId
    `);
    
    stmt.run({
      userId,
      maxHistoryDays: settings.max_history_days ?? null,
      preferredModel: settings.preferred_model ?? null,
      updatedAt: now,
    });
  } else {
    const stmt = database.prepare(`
      INSERT INTO user_chat_settings (user_id, max_history_days, preferred_model, updated_at)
      VALUES (@userId, @maxHistoryDays, @preferredModel, @updatedAt)
    `);
    
    stmt.run({
      userId,
      maxHistoryDays: settings.max_history_days ?? 30,
      preferredModel: settings.preferred_model ?? 'qwen2.5:3b-instruct-q4_K_M',
      updatedAt: now,
    });
  }
};

export const cleanupOldConversations = (userId: number, days: number): number => {
  const database = getDb();
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  
  const stmt = database.prepare(`
    DELETE FROM conversations
    WHERE user_id = @userId AND updated_at < @cutoff
  `);
  
  const result = stmt.run({ userId, cutoff });
  return result.changes;
};
