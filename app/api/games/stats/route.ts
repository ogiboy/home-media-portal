import { NextResponse } from 'next/server';

import { games } from '@/lib/games';
import { getGameStats } from '@/lib/games-db';

export const runtime = 'nodejs';

export const GET = async () => {
  const stats = getGameStats(games.map((game) => game.id));
  return NextResponse.json({ stats });
};
