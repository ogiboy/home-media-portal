'use client';

// Client games panel with carousel selection state.
import { useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, Trophy } from 'lucide-react';
import useSWR from 'swr';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PortalStrings } from '@/lib/i18n';
import { games } from '@/lib/games';
import { cn } from '@/lib/utils';
import { jsonFetcher } from '@/lib/fetcher';

type GamesPanelProps = {
  strings: PortalStrings;
  variant?: 'preview' | 'full';
};

type GameStats = {
  gameId: string;
  totalPlays: number;
  topScores: Array<{ userLogin: string; score: number }>;
};

type GameStatsResponse = {
  stats: Record<string, GameStats>;
};

/**
 * Renders a games lounge with a hero panel and a hoverable carousel.
 */
export default function GamesPanel({
  strings,
  variant = 'preview',
}: Readonly<GamesPanelProps>) {
  const [activeId, setActiveId] = useState(games[0]?.id ?? '');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeGame = useMemo(
    () => games.find((game) => game.id === activeId) ?? games[0],
    [activeId]
  );

  const { data } = useSWR<GameStatsResponse>('/api/games/stats', jsonFetcher, {
    refreshInterval: 20000,
  });

  const stats = activeGame?.id ? data?.stats?.[activeGame.id] : undefined;
  const topScore = stats?.topScores?.[0];
  const isPlayable = activeGame?.status === 'live';
  const coverStyle = activeGame?.coverImage
    ? { backgroundImage: `url(${activeGame.coverImage})` }
    : undefined;

  const openFocus = (gameId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('game', gameId);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handlePlay = (gameId: string) => {
    openFocus(gameId);
  };

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    gameId: string
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveId(gameId);
    }
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
      <div className="portal-surface group relative overflow-hidden rounded-(--radius) p-6">
        {coverStyle && (
          <div
            className="absolute inset-0 opacity-60"
            style={coverStyle}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/50 to-background/95" />
        <div className="relative z-10 flex h-full flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
                {strings.games.nowPlaying}
              </p>
              <h3 className="mt-1 text-2xl font-semibold">
                {activeGame?.title}
              </h3>
            </div>
            <Badge variant="outline" className="portal-chip px-3 py-1 text-xs">
              {isPlayable ? strings.games.liveLabel : strings.games.comingSoon}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            {activeGame?.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {activeGame?.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div>
              {strings.games.playsLabel}: {stats?.totalPlays ?? 0}
            </div>
            {topScore && (
              <div className="flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5" />
                <span className="truncate">
                  {strings.games.topScoreLabel}: {topScore.score} ·{' '}
                  {topScore.userLogin}
                </span>
              </div>
            )}
          </div>

          {isPlayable && (
            <div className="pt-2">
              <Button
                size="sm"
                onClick={() => activeGame && handlePlay(activeGame.id)}
                className="shadow-[0_16px_40px_var(--portal-glow-strong)]"
              >
                <Play className="h-4 w-4" />
                {strings.games.play}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="portal-surface rounded-(--radius) p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold">
              {strings.games.collectionTitle}
            </h4>
            <p className="text-xs text-muted-foreground">
              {strings.games.collectionDesc}
            </p>
          </div>
          {variant === 'preview' && (
            <span className="text-xs text-muted-foreground">
              {strings.games.cta}
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-4 overflow-x-auto pb-4 pr-2">
          {games.map((game) => {
            const selected = game.id === activeGame?.id;
            const playable = game.status === 'live';
            const cardCover = game.coverImage
              ? { backgroundImage: `url(${game.coverImage})` }
              : undefined;

            return (
              <motion.div
                key={game.id}
                onClick={() => setActiveId(game.id)}
                onKeyDown={(event) => handleCardKeyDown(event, game.id)}
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.2 }}
                role="button"
                tabIndex={0}
                aria-label={game.title}
                aria-pressed={selected}
                className={cn(
                  'group relative min-w-56 overflow-hidden rounded-3xl border p-4 text-left transition shadow-[0_12px_30px_rgba(15,23,42,0.12)]',
                  selected
                    ? 'border-primary/60 bg-primary/10 text-foreground shadow-[0_18px_40px_rgba(15,23,42,0.18)]'
                    : 'border-border/40 bg-muted/30 text-muted-foreground'
                )}
              >
                <div
                  className="absolute inset-0 opacity-60"
                  style={cardCover}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/40 to-background/95" />
                <div className="relative z-10 flex h-44 flex-col justify-end gap-2">
                  <div className="text-sm font-semibold text-foreground">
                    {game.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {playable ? strings.games.play : strings.games.comingSoon}
                  </div>
                </div>
                {playable && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-105">
                    <Button
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        handlePlay(game.id);
                      }}
                      className="shadow-[0_16px_40px_var(--portal-glow-strong)]"
                    >
                      <Play className="h-4 w-4" />
                      {strings.games.play}
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
