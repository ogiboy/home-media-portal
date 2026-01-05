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

// Section that renders the games preview and carousel.
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
    </section>
  );
}
