// Sidebar shell for the portal layout.
import { Gamepad2, Gauge, LayoutGrid, MessageSquare, Server } from 'lucide-react';

import BrandMark from '@/components/brand-mark';
import type { PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';

type PortalNavLinks = {
  dashboard: string;
  games: string;
  system: string;
  board: string;
};

type PortalSidebarProps = Readonly<{
  strings: PortalStrings;
  isHome: boolean;
  delay?: number;
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
 * Render the desktop portal sidebar with brand, primary navigation, and status badge.
 *
 * @param strings - Localization strings used for the header, navigation labels, accessibility attributes, badges, and tailnet notes.
 * @param isHome - Whether the current portal is the user's home portal; toggles badge and tailnet note content.
 * @param delay - Optional entrance animation delay in milliseconds.
 * @param links - Optional navigation targets for `dashboard`, `games`, `system`, and `board`; defaults to `defaultLinks`.
 * @param active - Which navigation item is currently active; when `'dashboard'` or `'games'` sets `aria-current="page"` on that link.
 * @returns The sidebar JSX element containing brand, navigation, and footer status badge.
 */
export default function PortalSidebar({
  strings,
  isHome,
  delay = 0,
  links = defaultLinks,
  active = 'dashboard',
}: PortalSidebarProps) {
  return (
    <aside
      className="portal-surface portal-sidebar portal-entrance hidden shrink-0 flex-col gap-6 rounded-(--radius) p-5 md:flex"
      style={withDelay(delay)}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_24px_var(--portal-glow)]">
          <BrandMark className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="portal-label">
          <p className="text-sm font-semibold tracking-wide">
            {strings.header.kicker}
          </p>
          <p className="text-xs text-muted-foreground">
            {strings.header.asideNote}
          </p>
        </div>
      </div>

      <nav
        className="flex flex-1 flex-col gap-3"
        aria-label={strings.accessibility.primaryNav}
      >
        <ul className="flex flex-1 flex-col gap-3">
          <li>
            <a
              href={links.dashboard}
              aria-current={active === 'dashboard' ? 'page' : undefined}
              className="portal-nav-item flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LayoutGrid className="h-5 w-5" />
              <span className="portal-label">{strings.nav.dashboard}</span>
            </a>
          </li>
          <li>
            <a
              href={links.games}
              aria-current={active === 'games' ? 'page' : undefined}
              className="portal-nav-item flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Gamepad2 className="h-5 w-5" />
              <span className="portal-label">{strings.nav.games}</span>
            </a>
          </li>
          <li>
            <a
              href={links.system}
              className="portal-nav-item flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Gauge className="h-5 w-5" />
              <span className="portal-label">{strings.nav.system}</span>
            </a>
          </li>
          <li>
            <a
              href={links.board}
              className="portal-nav-item flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="portal-label">{strings.nav.board}</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="mt-auto rounded-2xl border border-border/60 bg-muted/60 p-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4" />
          <span>
            {isHome ? strings.badges.homePortal : strings.badges.publicPreview}
          </span>
        </div>
        <p className="portal-label mt-2 leading-relaxed">
          {isHome ? strings.tailnet.connectedNote : strings.tailnet.lockedNote}
        </p>
      </div>
    </aside>
  );
}