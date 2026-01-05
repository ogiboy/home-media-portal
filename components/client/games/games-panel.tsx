'use client';

// Client games panel with selection state.
import { useMemo, useState } from 'react';
import { Gamepad2, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { PortalStrings } from '@/lib/i18n';
import { games } from '@/lib/games';
import { cn } from '@/lib/utils';
import OrbChase from '@/components/client/games/orb-chase';

type GamesPanelProps = {
  strings: PortalStrings;
  variant?: 'preview' | 'full';
};

/**
 * Renders a two-pane games panel showing details for the active game and a selectable collection.
 *
 * @param strings - Localized UI text used throughout the panel.
 * @param variant - Layout variant; `'preview'` renders a more compact view, `'full'` renders an expanded layout. Defaults to `'preview'`.
 * @returns The React element containing the active game detail pane (title, status, description, tags, and play area or placeholder) and the horizontally scrollable game collection.
 */
export default function GamesPanel({
  strings,
  variant = 'preview',
}: Readonly<GamesPanelProps>) {
  const [activeId, setActiveId] = useState(games[0]?.id ?? '');
  const activeGame = useMemo(
    () => games.find((game) => game.id === activeId) ?? games[0],
    [activeId]
  );

  const isPreview = variant === 'preview';
  const isPlayable = activeGame?.status === 'live';
  const coverStyle = activeGame?.cover
    ? { backgroundImage: activeGame.cover }
    : undefined;

  return (
    <div
      className={cn(
        'mt-5 grid gap-4',
        isPreview ? 'lg:grid-cols-[1.5fr_1fr]' : 'lg:grid-cols-[1.7fr_1fr]'
      )}
    >
      <div className="portal-surface relative overflow-hidden rounded-(--radius) p-5">
        {coverStyle && (
          <div
            className="absolute inset-0 opacity-60"
            style={coverStyle}
            aria-hidden="true"
          />
        )}
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {strings.games.nowPlaying}
              </p>
              <h3 className="mt-1 text-lg font-semibold">
                {activeGame?.title}
              </h3>
            </div>
            <Badge variant="outline" className="portal-chip px-3 py-1 text-xs">
              {isPlayable ? strings.games.liveLabel : strings.games.comingSoon}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {activeGame?.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeGame?.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4">
            {isPlayable && activeGame?.runtime === 'inline' ? (
              <OrbChase strings={strings} compact={isPreview} />
            ) : (
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
                {strings.games.comingSoon}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="portal-surface rounded-(--radius) p-5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Gamepad2 className="h-4 w-4" />
          {strings.games.collectionTitle}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {strings.games.collectionDesc}
        </p>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {games.map((game) => {
            const selected = game.id === activeGame?.id;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => setActiveId(game.id)}
                className={cn(
                  'min-w-45 rounded-2xl border p-3 text-left transition',
                  selected
                    ? 'border-primary/60 bg-primary/5 text-foreground'
                    : 'border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground'
                )}
              >
                <div
                  className="h-20 w-full rounded-2xl border border-border/40"
                  style={{ backgroundImage: game.cover }}
                />
                <div className="mt-3">
                  <p className="text-sm font-semibold text-foreground">
                    {game.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {game.status === 'live'
                      ? strings.games.play
                      : strings.games.comingSoon}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{strings.games.cta}</span>
        </div>
      </div>
    </div>
  );
}