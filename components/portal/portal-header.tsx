// Primary header for the portal shell.
import { MonitorPlay } from 'lucide-react';

import PortalControls from '@/components/client/portal-controls';
import ThemeToggle from '@/components/client/theme-toggle';
import LanguageSwitch from '@/components/client/language-switch';
import { Badge } from '@/components/ui/badge';
import type { Locale, PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';

type PortalHeaderProps = Readonly<{
  strings: PortalStrings;
  isHome: boolean;
  isPublic: boolean;
  locale: Locale;
  title?: string;
  subtitle?: string;
  allowGateInteraction?: boolean;
  delay?: number;
}>;

/**
 * Render the portal's hero header with title, subtitle, controls, and live/preview status.
 *
 * @param strings - Localized UI strings used for labels, title, subtitle, badges, and accessibility text
 * @param isHome - Whether the current view is the home portal (controls badge style and live note)
 * @param isPublic - Whether the portal is in a public preview state (affects control behavior)
 * @param locale - Current locale for the language switch component
 * @param title - Optional override for the header title (falls back to `strings.header.title`)
 * @param subtitle - Optional override for the header subtitle (falls back to `strings.header.subtitle`)
 * @param allowGateInteraction - When provided, enables gate interaction within PortalControls
 * @param delay - Optional entrance animation delay in milliseconds
 * @returns The header JSX element for the portal hero area
 */
export default function PortalHeader({
  strings,
  isHome,
  isPublic,
  locale,
  title,
  subtitle,
  allowGateInteraction,
  delay = 0,
}: PortalHeaderProps) {
  const headerTitle = title ?? strings.header.title;
  const headerSubtitle = subtitle ?? strings.header.subtitle;

  return (
    <header
      className="portal-hero portal-surface portal-entrance flex min-h-41 flex-col gap-4 rounded-(--radius) p-6"
      style={withDelay(delay)}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            {strings.header.kicker}
          </p>
          <h1 className="mt-2 min-h-12 text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {headerTitle}
            </span>
          </h1>
          <p className="mt-2 min-h-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {headerSubtitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <Badge
            variant={isHome ? 'accent' : 'outline'}
            className="portal-chip px-3 py-1 text-xs"
          >
            {isHome ? strings.badges.homePortal : strings.badges.publicPreview}
          </Badge>
          <PortalControls
            strings={strings}
            isPublic={isPublic}
            allowGateInteraction={allowGateInteraction}
          />
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