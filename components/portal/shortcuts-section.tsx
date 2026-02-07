// Shortcuts panel for quick actions and searches.
import { Sparkles } from 'lucide-react';

import type { PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';
import ShortcutStrip from '@/components/portal/shortcut-strip';

type ShortcutsSectionProps = {
  strings: PortalStrings;
  delay?: number;
};

/**
 * Render the Shortcuts section with the quick-action strip and status note.
 *
 * @param strings - Localized texts for titles, descriptions, and action labels
 * @param delay - Optional entrance animation delay applied to the section's style
 * @returns A section element containing the shortcuts strip and a supporting info panel
 */
export default function ShortcutsSection({
  strings,
  delay = 0,
}: Readonly<ShortcutsSectionProps>) {
  return (
    <section
      id="shortcuts"
      aria-labelledby="shortcuts-title"
      className="portal-entrance scroll-mt-32"
      style={withDelay(delay)}
    >
      <div className="portal-surface rounded-(--radius) p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="shortcuts-title" className="text-xl font-semibold">
              {strings.shortcuts.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {strings.shortcuts.description}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <ShortcutStrip strings={strings} />
          <div className="rounded-(--radius) border border-border/50 bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              {strings.shortcuts.title}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {strings.shortcuts.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {strings.shortcuts.comingSoon}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
