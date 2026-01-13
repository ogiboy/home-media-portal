import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { touchPresence, getPresenceStats } from '@/lib/presence-db';
import { getPortalIdentity } from '@/lib/portal-auth';

export const runtime = 'nodejs';

// Extract the session id from the request body.
const readSessionId = async (request: Request) => {
  try {
    const body = (await request.json()) as { sessionId?: unknown };
    if (typeof body?.sessionId === 'string') {
      return body.sessionId.trim();
    }
  } catch {
    return '';
  }
  return '';
};

// Update presence for the current session and return stats.
export const POST = async (request: Request) => {
  const sessionId = await readSessionId(request);
  if (!sessionId) {
    return NextResponse.json({ error: 'invalid_session' }, { status: 400 });
  }

  const requestHeaders = await headers();
  const identity = getPortalIdentity(requestHeaders);
  const stats = touchPresence(sessionId, identity?.login ?? null);
  return NextResponse.json(stats);
};

// Return current presence stats without updating any session.
export const GET = async () => {
  const stats = getPresenceStats();
  return NextResponse.json(stats);
};
