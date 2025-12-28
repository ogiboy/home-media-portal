// Primary header for the portal shell.
import { MonitorPlay } from 'lucide-react';

import PortalControls from '@/components/client/portal-controls';
import ThemeToggle from '@/components/client/theme-toggle';
import LanguageSwitch from '@/components/client/language-switch';
import { Badge } from '@/components/ui/badge';
import type { Locale, PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';

type PortalHeaderProps = {
  strings: PortalStrings;
  isHome: boolean;
  isPublic: boolean;
  locale: Locale;
  delay?: number;
};

// Hero header for the portal dashboard.
export default function PortalHeader({
  strings,
  isHome,
  isPublic,
  locale,
  delay = 0,
}: PortalHeaderProps) {
  return (
    <header
      className="portal-hero portal-surface portal-entrance flex flex-col gap-4 rounded-(--radius) p-6"
      style={withDelay(delay)}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            {strings.header.kicker}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {strings.header.title}
            </span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {strings.header.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant={isHome ? 'accent' : 'outline'}
            className="portal-chip px-3 py-1 text-xs"
          >
            {isHome ? strings.badges.homePortal : strings.badges.publicPreview}
          </Badge>
          <PortalControls strings={strings} isPublic={isPublic} />
          <ThemeToggle label={strings.accessibility.themeToggle} />
          <LanguageSwitch
            locale={locale}
            label={strings.accessibility.languageToggle}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <MonitorPlay className="h-4 w-4" />
        <span>
          {isHome ? strings.header.liveNote : strings.header.previewNote}
        </span>
      </div>
    </header>
  );
}
