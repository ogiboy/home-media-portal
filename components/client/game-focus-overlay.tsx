'use client';

import { useCallback, useEffect, useMemo, useRef, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Loader2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { PortalStrings } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { getGameById, getGameLaunchUrl } from '@/lib/games';
import OrbChase from '@/components/client/games/orb-chase';
import { recordGamePlay } from '@/app/actions/game-actions';
import styles from './game-focus-overlay.module.css';

const overlayTransition = {
  duration: 0.28,
  ease: [0.22, 0.61, 0.36, 1],
};

const contentTransition = {
  duration: 0.32,
  ease: [0.22, 0.61, 0.36, 1],
};

type GameFocusOverlayProps = Readonly<{
  strings: PortalStrings;
}>;

/**
 * Renders a fullscreen overlay for the active game (query param `game`).
 */
export default function GameFocusOverlay({ strings }: GameFocusOverlayProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const lastRecorded = useRef<string | null>(null);

  const game = useMemo(() => {
    const activeId = searchParams.get('game');
    return getGameById(activeId);
  }, [searchParams]);

  const launchUrl = useMemo(
    () => (game ? getGameLaunchUrl(game) : undefined),
    [game]
  );

  const isActive = Boolean(game);
  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('game');
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  useEffect(() => {
    document.documentElement.dataset.focus = isActive ? 'true' : 'false';
    return () => {
      document.documentElement.dataset.focus = 'false';
    };
  }, [isActive]);

  useEffect(() => {
    if (!game || game.runtime === 'inline' || game.status !== 'live') {
      return;
    }

    if (lastRecorded.current === game.id) {
      return;
    }

    lastRecorded.current = game.id;
    startTransition(() => {
      recordGamePlay(game.id);
    });
  }, [game, startTransition]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isActive) {
        close();
      }
    };
    globalThis.addEventListener('keydown', onKeyDown);
    return () => globalThis.removeEventListener('keydown', onKeyDown);
  }, [isActive, close]);

  if (!game) {
    return null;
  }

  return (
    <AnimatePresence>
      {isActive && (
        <motion.section
          className={cn('portal-surface', styles.overlay)}
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={overlayTransition}
          aria-label={strings.games.play}
        >
          <div className="pointer-events-none absolute inset-0 rounded-(--radius) border border-white/10" />
          <motion.header
            className="flex flex-wrap items-center justify-between gap-3"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...contentTransition, delay: 0.05 }}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {strings.games.title}
              </p>
              <h3 className="text-lg font-semibold">{game.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              {launchUrl && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    globalThis.open(launchUrl, '_blank', 'noopener,noreferrer')
                  }
                >
                  {strings.focus.openInTab}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={close}>
                <X className="h-4 w-4" />
                {strings.focus.close}
              </Button>
            </div>
          </motion.header>

          <motion.div
            className={cn('border border-border/70 bg-background/70', styles.frame)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...contentTransition, delay: 0.1 }}
          >
            {game.runtime === 'inline' ? (
              <OrbChase strings={strings} gameId={game.id} />
            ) : (
              <div className="absolute inset-0">
                {isPending && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                <iframe
                  title={game.title}
                  src={launchUrl}
                  className="h-full w-full"
                />
              </div>
            )}
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
