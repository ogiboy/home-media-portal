// Shared SQLite database path for portal data.
import path from 'node:path';

// Resolve the portal SQLite path from env or the default data directory.
export const getPortalDbPath = () =>
  process.env.BOARD_DB_PATH ?? path.join(process.cwd(), 'data', 'board.db');
