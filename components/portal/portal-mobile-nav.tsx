// Mobile bottom navigation for quick section jumps.
import { Gamepad2, Gauge, LayoutGrid, MessageSquare } from 'lucide-react';

import type { PortalStrings } from '@/lib/i18n';

type PortalNavLinks = {
  dashboard: string;
  games: string;
  system: string;
  board: string;
};

type PortalMobileNavProps = Readonly<{
  strings: PortalStrings;
  links?: PortalNavLinks;
  active?: 'dashboard' | 'games';
}>;

const defaultLinks: PortalNavLinks = {
  dashboard: '#services',
  games: '/games',
  system: '#system',
  board: '#board',
};

/**
 * Render a bottom-fixed mobile navigation bar with links for dashboard, games, system, and board.
 *
 * The component uses `strings.accessibility.mobileNav` for the `aria-label` and sets `aria-current="page"`
 * on the dashboard or games item when `active` matches that section.
 *
 * @param strings - Localized strings used for link labels and the navigation accessibility label
 * @param links - Optional URLs for each navigation item; defaults to `defaultLinks`
 * @param active - Optional active section selector; when `'dashboard'` or `'games'` it marks that item as current
 * @returns A React element containing the mobile navigation bar
 */
export default function PortalMobileNav({
  strings,
  links = defaultLinks,
  active = 'dashboard',
}: PortalMobileNavProps) {
  return (
    <nav
      className="portal-surface portal-mobile-nav fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-2 rounded-full px-4 py-3 md:hidden"
      aria-label={strings.accessibility.mobileNav}
    >
      <a
        href={links.dashboard}
        aria-current={active === 'dashboard' ? 'page' : undefined}
        className="flex items-center gap-2 text-xs font-semibold"
      >
        <LayoutGrid className="h-4 w-4" />
        {strings.nav.dashboard}
      </a>
      <a
        href={links.games}
        aria-current={active === 'games' ? 'page' : undefined}
        className="flex items-center gap-2 text-xs font-semibold"
      >
        <Gamepad2 className="h-4 w-4" />
        {strings.nav.games}
      </a>
      <a href={links.system} className="flex items-center gap-2 text-xs font-semibold">
        <Gauge className="h-4 w-4" />
        {strings.nav.system}
      </a>
      <a href={links.board} className="flex items-center gap-2 text-xs font-semibold">
        <MessageSquare className="h-4 w-4" />
        {strings.nav.board}
      </a>
    </nav>
  );
}