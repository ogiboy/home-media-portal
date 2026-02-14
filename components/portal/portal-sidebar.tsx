// Sidebar shell for the portal layout.
import {
  Gamepad2,
  LayoutGrid,
  MessageSquare,
  MessageCircle,
  Search,
  Server,
  Settings,
  Sparkles,
  Film,
} from 'lucide-react';

import BrandMark from '@/components/brand-mark';
import type { PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';
import { cn } from '@/lib/utils';

type PortalNavLinks = {
  dashboard: string;
  search: string;
  library: string;
  games: string;
  shortcuts: string;
  services: string;
  system: string;
  board: string;
  chat: string;
  settings: string;
};

type PortalNavKey = keyof PortalNavLinks;

type PortalSidebarProps = Readonly<{
  strings: PortalStrings;
  isHome: boolean;
  delay?: number;
  links?: PortalNavLinks;
  active?: PortalNavKey;
}>;

const defaultLinks: PortalNavLinks = {
  dashboard: '/#search',
  search: '/search',
  library: '/library',
  games: '/games',
  shortcuts: '/shortcuts',
  services: '/services',
  system: '/system',
  board: '/#board',
  chat: '/chat',
  settings: '/settings',
};

/**
 * Render the desktop portal sidebar with brand, primary navigation, and status badge.
 */
export default function PortalSidebar({
  strings,
  isHome,
  delay = 0,
  links = defaultLinks,
  active = 'dashboard',
}: PortalSidebarProps) {
  const navItems: Array<{
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
      id: 'services',
      href: links.services,
      icon: Server,
      label: strings.nav.services,
    },
    {
      id: 'board',
      href: links.board,
      icon: MessageSquare,
      label: strings.nav.board,
    },
    {
      id: 'chat',
      href: links.chat,
      icon: MessageCircle,
      label: strings.nav.chat,
    },
    {
      id: 'settings',
      href: links.settings,
      icon: Settings,
      label: strings.nav.settings,
    },
  ];

  return (
    <aside
      className="portal-surface portal-sidebar portal-entrance hidden shrink-0 flex-col gap-4 rounded-(--radius) p-4 md:flex"
      style={withDelay(delay)}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_24px_var(--portal-glow)]">
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
        className="flex flex-1 flex-col gap-2"
        aria-label={strings.accessibility.primaryNav}
      >
        <ul className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  aria-current={active === item.id ? 'page' : undefined}
                  className={cn(
                    'portal-nav-item flex items-center gap-3 rounded-2xl px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors',
                    active === item.id
                      ? 'bg-muted text-foreground shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
                      : 'hover:bg-muted/70 hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="portal-label">{item.label}</span>
                </a>
              </li>
            );
          })}
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
