// Shortcuts panel for quick actions and searches.
import { Button } from '@/components/ui/button';
import { Radar, Sparkles, Zap } from 'lucide-react';

import type { PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';
import ShortcutsSearchPanel from '@/components/client/shortcuts-search-panel';

type ShortcutsSectionProps = {
  strings: PortalStrings;
  delay?: number;
};

// Render shortcut cards for search and actions.
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

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <ShortcutsSearchPanel strings={strings} />
        <div className="portal-surface rounded-(--radius) p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            {strings.shortcuts.actionsTitle}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {strings.shortcuts.actionsDesc}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" disabled>
              <Radar className="h-4 w-4" />
              {strings.shortcuts.actionSync}
            </Button>
            <Button size="sm" variant="outline" disabled>
              <Zap className="h-4 w-4" />
              {strings.shortcuts.actionRescan}
            </Button>
            <Button size="sm" variant="outline" disabled>
              <Zap className="h-4 w-4" />
              {strings.shortcuts.actionTest}
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {strings.shortcuts.comingSoon}
          </p>
        </div>
      </div>
    </section>
  );
}
