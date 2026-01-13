'use client';

import { useEffect, useState } from 'react';
import { Activity, Users } from 'lucide-react';

import type { PortalStrings } from '@/lib/i18n';

const STORAGE_KEY = (() => {
  const base = 'portal_presence_id';
  if (globalThis.window === undefined) return base;
  const origin =
    globalThis.location?.origin ?? globalThis.location?.hostname ?? 'unknown';
  return `${base}:${origin}`;
})();
const POLL_INTERVAL_MS = 30000;

type PresenceStats = {
  onlineNow: number;
  peakOnline: number;
};

// Create a stable client session id for presence tracking.
const createSessionId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(8);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }
  return `${Date.now()}`;
};

// Load or generate a session id from localStorage.
const getSessionId = () => {
  if (globalThis.window === undefined) {
    return null;
  }
  const stored = globalThis.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return stored;
  }
  const next = createSessionId();
  globalThis.localStorage.setItem(STORAGE_KEY, next);
  return next;
};

// Post a presence ping and return the latest stats.
const fetchPresence = async (sessionId: string) => {
  const response = await fetch('/api/presence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as PresenceStats;
};

type PresenceFooterProps = Readonly<{
  strings: PortalStrings;
  isHome: boolean;
}>;

/**
 * Render a compact footer showing online and peak presence counts.
 */
export default function PresenceFooter({
  strings,
  isHome,
}: PresenceFooterProps) {
  const [stats, setStats] = useState<PresenceStats | null>(null);

  useEffect(() => {
    if (!isHome) {
      return undefined;
    }
    const sessionId = getSessionId();
    if (!sessionId) {
      return undefined;
    }

    let active = true;

    const poll = async () => {
      const next = await fetchPresence(sessionId);
      if (active && next) {
        setStats(next);
      }
    };

    poll();
    const timer = globalThis.setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      active = false;
      globalThis.clearInterval(timer);
    };
  }, [isHome]);

  if (!isHome) {
    return (
      <div className="portal-surface rounded-(--radius) border border-border/60 px-4 py-3 text-xs text-muted-foreground">
        {strings.misc.tailnetOnly}
      </div>
    );
  }

  return (
    <div className="portal-surface rounded-(--radius) border border-border/60 px-4 py-3 text-xs text-muted-foreground">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>
            {strings.footer.onlineNow}:{' '}
            <strong className="text-foreground">{stats?.onlineNow ?? 0}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <span>
            {strings.footer.peakOnline}:{' '}
            <strong className="text-foreground">
              {stats?.peakOnline ?? 0}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
