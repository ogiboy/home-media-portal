// Games preview and detail section.
import Link from 'next/link';

import GamesPanel from '@/components/client/games/games-panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';

type GamesSectionProps = {
  strings: PortalStrings;
  variant?: 'preview' | 'full';
  delay?: number;
};

/**
 * Render the games section containing a title, description, an action (CTA or now-playing badge), and the GamesPanel.
 *
 * @param strings - Localized strings for the section (title, description, CTA text, and now-playing label).
 * @param variant - 'preview' to show a CTA linking to the games page, 'full' to show a now-playing badge.
 * @param delay - Milliseconds delay applied to the section's entrance style.
 * @returns The section element that wraps the games header, action control, and GamesPanel.
 */
export default function GamesSection({
  strings,
  variant = 'preview',
  delay = 0,
}: Readonly<GamesSectionProps>) {
  const isPreview = variant === 'preview';

  return (
    <section
      id="games"
      aria-labelledby="games-title"
      className="portal-entrance scroll-mt-32"
      style={withDelay(delay)}
    >
      <div className="portal-surface rounded-(--radius) p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="games-title" className="text-xl font-semibold">
              {strings.games.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {strings.games.description}
            </p>
          </div>
          {isPreview ? (
            <Button asChild size="sm" variant="outline">
              <Link href="/games">{strings.games.cta}</Link>
            </Button>
          ) : (
            <Badge variant="outline" className="portal-chip px-3 py-1 text-xs">
              {strings.games.nowPlaying}
            </Badge>
          )}
        </div>
        <GamesPanel strings={strings} variant={variant} />
      </div>
    </section>
  );
}
