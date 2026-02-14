// Server-rendered portal shell that keeps client widgets at the leaf nodes.
import { cookies, headers } from 'next/headers';

import FocusOverlay from '@/components/client/focus-overlay';
import GameFocusOverlay from '@/components/client/game-focus-overlay';
import ToastViewport from '@/components/client/toast-viewport';
import ParallaxLayers from '@/components/client/parallax-layers';
import SidebarFloat from '@/components/client/sidebar-float';
import ToTopButton from '@/components/client/to-top-button';
import PortalSidebar from '@/components/portal/portal-sidebar';
import PortalHeader from '@/components/portal/portal-header';
import PortalFooter from '@/components/portal/portal-footer';
import DashboardSections from '@/components/portal/dashboard-sections';
import GamesSection from '@/components/portal/games-section';
import LibrarySection from '@/components/portal/library-section';
import SearchSection from '@/components/portal/search-section';
import ServicesSection from '@/components/portal/services-section';
import SettingsSection from '@/components/portal/settings-section';
import ShortcutsSection from '@/components/portal/shortcuts-section';
import PortalMobileNav from '@/components/portal/portal-mobile-nav';
import { getTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { isHomeDeployment } from '@/lib/env';

type PortalView =
  | 'dashboard'
  | 'games'
  | 'search'
  | 'library'
  | 'shortcuts'
  | 'services'
  | 'board'
  | 'settings';

type PortalAppProps = {
  view?: PortalView;
};

/**
 * Render the server-side portal shell composed of sidebar, header, and view-specific sections.
 */
export default async function PortalApp({
  view = 'dashboard',
}: Readonly<PortalAppProps>) {
  const cookieStore = await cookies();
  const headerList = await headers();
  const localeCookie = cookieStore.get('portal_locale')?.value;
  const acceptLanguage = headerList.get('accept-language') ?? undefined;
  const { locale, strings } = getTranslations(localeCookie, acceptLanguage);
  const isHome = isHomeDeployment();
  const isPublic = !isHome;
  const isGamesView = view === 'games';
  const isDashboardView = view === 'dashboard';
  const lockPortal = isPublic && !isGamesView;

  const navLinks = {
    dashboard: isDashboardView ? '#search' : '/',
    search: isDashboardView ? '#search' : '/search',
    library: isDashboardView ? '#library' : '/library',
    games: '/games',
    shortcuts: isDashboardView ? '#shortcuts' : '/shortcuts',
    services: isDashboardView ? '#services' : '/services',
    board: isDashboardView ? '#board' : '/#board',
    settings: '/settings',
  };

  const activeNav = isDashboardView ? 'dashboard' : view;
  const mobileActive =
    activeNav === 'services' || activeNav === 'board' ? 'dashboard' : activeNav;
  const viewTitleMap = {
    dashboard: strings.header.title,
    games: strings.games.title,
    search: strings.search.title,
    library: strings.library.title,
    shortcuts: strings.shortcuts.title,
    services: strings.services.title,
    board: strings.board.title,
    settings: strings.settings.title,
  } as const;

  const viewSubtitleMap = {
    dashboard: strings.header.subtitle,
    games: strings.games.description,
    search: strings.search.description,
    library: strings.library.description,
    shortcuts: strings.shortcuts.description,
    services: strings.services.description,
    board: strings.board.description,
    settings: strings.settings.description,
  } as const;

  return (
    <div className="portal-shell relative min-h-dvh overflow-x-hidden">
      <ParallaxLayers />

      <div className="portal-content portal-frame grid w-full gap-10 py-10 lg:grid-cols-[minmax(72px,200px)_1fr]">
        <SidebarFloat className="order-2 flex flex-col gap-6 lg:order-1 lg:sticky lg:top-8 lg:self-start">
          <PortalSidebar
            strings={strings}
            isHome={isHome}
            links={navLinks}
            active={activeNav}
            delay={40}
          />
        </SidebarFloat>

        <main className="order-1 relative flex flex-col gap-6 lg:order-2">
          <PortalHeader
            strings={strings}
            isHome={isHome}
            isPublic={isPublic}
            locale={locale}
            title={viewTitleMap[view]}
            subtitle={viewSubtitleMap[view]}
            allowGateInteraction={isGamesView}
            delay={80}
          />

          <div className={cn(view !== 'games' && 'hidden')}>
            <GamesSection strings={strings} variant="full" delay={140} />
          </div>
          <div className={cn(view !== 'search' && 'hidden')}>
            <SearchSection strings={strings} delay={140} />
          </div>
          <div className={cn(view !== 'library' && 'hidden')}>
            <LibrarySection strings={strings} delay={140} />
          </div>
          <div className={cn(view !== 'shortcuts' && 'hidden')}>
            <ShortcutsSection strings={strings} delay={140} />
          </div>
          <div className={cn(view !== 'services' && 'hidden')}>
            <ServicesSection
              strings={strings}
              isHome={isHome}
              isPublic={isPublic}
              delay={140}
            />
          </div>
          <div className={cn(view !== 'settings' && 'hidden')}>
            <SettingsSection strings={strings} isHome={isHome} delay={140} />
          </div>
          <div
            className={cn(
              'flex flex-col gap-10',
              lockPortal && 'pointer-events-none opacity-60',
              view !== 'dashboard' && 'hidden',
            )}
          >
            <DashboardSections
              strings={strings}
              isHome={isHome}
              isPublic={isPublic}
            />
          </div>
        </main>
      </div>

      <PortalFooter strings={strings} isHome={isHome} />

      <PortalMobileNav
        strings={strings}
        links={navLinks}
        active={mobileActive}
      />
      <ToTopButton label={strings.accessibility.backToTop} />
      <ToastViewport strings={strings} />
      <FocusOverlay isHome={isHome} strings={strings} />
      <GameFocusOverlay strings={strings} />
    </div>
  );
}
