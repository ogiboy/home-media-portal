// Mobile bottom navigation for quick section jumps.
import {
  Gamepad2,
  LayoutGrid,
  Search,
  Settings,
  Sparkles,
  Film,
} from 'lucide-react';

import type { PortalStrings } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type PortalNavLinks = {
  dashboard: string;
  search: string;
  library: string;
  games: string;
  shortcuts: string;
  settings: string;
};

type PortalNavKey = keyof PortalNavLinks;

type PortalMobileNavProps = Readonly<{
  strings: PortalStrings;
  links?: PortalNavLinks;
  active?: PortalNavKey;
}>;

const defaultLinks: PortalNavLinks = {
  dashboard: '/#search',
  search: '/search',
  library: '/library',
  games: '/games',
  shortcuts: '/shortcuts',
  settings: '/settings',
};

/**
 * Render a bottom-fixed mobile navigation bar.
 */
export default function PortalMobileNav({
  strings,
  links = defaultLinks,
  active = 'dashboard',
}: PortalMobileNavProps) {
  const items: Array<{
    id: PortalNavKey;
    href: string;
    icon: typeof LayoutGrid;
    label: string;
  }> = [
    {
      id: 'dashboard',
      href: links.dashboard,
      icon: LayoutGrid,
      label: strings.nav.dashboard,
    },
    {
      id: 'search',
      href: links.search,
      icon: Search,
      label: strings.nav.search,
    },
    {
      id: 'library',
      href: links.library,
      icon: Film,
      label: strings.nav.library,
    },
    {
      id: 'games',
      href: links.games,
      icon: Gamepad2,
      label: strings.nav.games,
    },
    {
      id: 'shortcuts',
      href: links.shortcuts,
      icon: Sparkles,
      label: strings.nav.shortcuts,
    },
    {
      id: 'settings',
      href: links.settings,
      icon: Settings,
      label: strings.nav.settings,
    },
  ];

  return (
    <nav
      className="portal-surface portal-mobile-nav fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-2 rounded-full px-4 py-3 backdrop-blur-md md:hidden"
      aria-label={strings.accessibility.mobileNav}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.id}
            href={item.href}
            aria-current={active === item.id ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors',
              active === item.id && 'text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
