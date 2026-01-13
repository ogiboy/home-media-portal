// Compact strip of shortcut actions.
import { Film, Radar, Tv, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { PortalStrings } from '@/lib/i18n';

export type ShortcutStripProps = Readonly<{
  strings: PortalStrings;
}>;

/**
 * Render a horizontal strip of shortcut buttons for common actions.
 */
export default function ShortcutStrip({ strings }: ShortcutStripProps) {
  const items = [
    { id: 'search-movies', label: strings.shortcuts.searchMovies, icon: Film },
    { id: 'search-series', label: strings.shortcuts.searchSeries, icon: Tv },
    { id: 'sync', label: strings.shortcuts.actionSync, icon: Radar },
    { id: 'rescan', label: strings.shortcuts.actionRescan, icon: Zap },
  ];

  return (
    <div className="portal-surface rounded-(--radius) p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{strings.shortcuts.actionsTitle}</p>
          <p className="text-xs text-muted-foreground">
            {strings.shortcuts.actionsDesc}
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {strings.shortcuts.comingSoon}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Button key={item.id} size="sm" variant="outline" disabled>
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
