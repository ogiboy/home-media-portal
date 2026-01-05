'use client';

// Simple click-based mini game for the games section.
import { useEffect, useState } from 'react';
import { Play, RotateCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { PortalStrings } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const GAME_DURATION = 18;

const getRandomUnit = () => {
  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    globalThis.crypto.getRandomValues(values);
    return values[0] / 2 ** 32;
  }
  return (Date.now() % 1000) / 1000;
};

const randomPosition = () => ({
  x: 12 + getRandomUnit() * 76,
  y: 12 + getRandomUnit() * 76,
});

type OrbChaseProps = {
  strings: PortalStrings;
  compact?: boolean;
};

// Arcade-style orb clicking mini game.
export default function OrbChase({
  strings,
  compact = false,
}: Readonly<OrbChaseProps>) {
  const [status, setStatus] = useState<'idle' | 'running' | 'ended'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [target, setTarget] = useState(randomPosition());

  useEffect(() => {
    if (status !== 'running') {
      return undefined;
    }

    const timer = globalThis.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => globalThis.clearInterval(timer);
  }, [status]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setTarget(randomPosition());
    setStatus('running');
  };

  const handleHit = () => {
    if (status !== 'running') {
      return;
    }
    setScore((prev) => prev + 1);
    setTarget(randomPosition());
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-border/60 bg-background/70 p-4',
        compact ? 'min-h-50' : 'min-h-60'
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">
          {strings.games.orbChaseTitle}
        </span>
        <span>
          {strings.games.timeLeft}: {timeLeft}s
        </span>
        <span>
          {strings.games.score}: {score}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {strings.games.orbChaseHint}
      </p>

      <div
        className={cn(
          'relative mt-4 h-32 overflow-hidden rounded-2xl border border-border/70 bg-muted/40',
          compact ? 'h-32' : 'h-40'
        )}
      >
        {status === 'running' && (
          <button
            type="button"
            aria-label={strings.games.play}
            className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_var(--portal-glow)]"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={handleHit}
          />
        )}
        {status !== 'running' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button size="sm" onClick={startGame}>
              {status === 'ended' ? (
                <RotateCw className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {status === 'ended'
                ? strings.games.playAgain
                : strings.games.play}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
