'use server';

import { headers } from 'next/headers';

import { getGameById } from '@/lib/games';
import { recordGameEvent } from '@/lib/games-db';
import { getPortalIdentity } from '@/lib/portal-auth';

const resolveActor = async () => {
  const requestHeaders = await headers();
  const identity = getPortalIdentity(requestHeaders);
  return identity?.login ?? 'public';
};

export const recordGamePlay = async (gameId: string) => {
  const game = getGameById(gameId);
  if (!game) {
    return { ok: false };
  }

  const actorLogin = await resolveActor();
  recordGameEvent({ gameId, userLogin: actorLogin });
  return { ok: true };
};

export const recordGameScore = async (gameId: string, score: number) => {
  const game = getGameById(gameId);
  if (!game) {
    return { ok: false };
  }

  const safeScore = Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0;
  const actorLogin = await resolveActor();
  recordGameEvent({ gameId, userLogin: actorLogin, score: safeScore });
  return { ok: true };
};
