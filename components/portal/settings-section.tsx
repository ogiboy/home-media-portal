// Settings placeholder section.
import Link from 'next/link';

import type { PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type SettingsSectionProps = Readonly<{
  strings: PortalStrings;
  delay?: number;
}>;

/**
 * Render a settings overview section with quick links and notes.
 */
export default function SettingsSection({
  strings,
  delay = 0,
}: SettingsSectionProps) {
  return (
    <section
      id="settings"
      aria-labelledby="settings-title"
      className="portal-entrance scroll-mt-32"
      style={withDelay(delay)}
    >
      <div className="portal-surface rounded-(--radius) p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="settings-title" className="text-xl font-semibold">
              {strings.settings.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {strings.settings.description}
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/">{strings.forbidden.action}</Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="portal-surface rounded-(--radius) border border-border/60 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{strings.services.title}</h3>
              <Badge variant="outline" className="portal-chip px-2 py-0 text-[11px]">
                {strings.board.tailnetOnly}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {strings.services.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {strings.system.quickDesc}
            </p>
          </div>

          <div className="portal-surface rounded-(--radius) border border-border/60 p-4">
            <h3 className="text-sm font-semibold">{strings.games.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {strings.games.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {strings.games.collectionDesc}
            </p>
          </div>

          <div className="portal-surface rounded-(--radius) border border-border/60 p-4">
            <h3 className="text-sm font-semibold">{strings.system.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {strings.system.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {strings.system.vitalsDesc}
            </p>
          </div>

          <div className="portal-surface rounded-(--radius) border border-border/60 p-4">
            <h3 className="text-sm font-semibold">{strings.board.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {strings.board.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {strings.board.postDesc}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-(--radius) border border-dashed border-border/70 bg-background/40 px-4 py-3 text-xs text-muted-foreground">
          {strings.settings.comingSoon}
        </div>
      </div>
    </section>
  );
}
