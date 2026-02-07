// Server-rendered portal shell that keeps client widgets at the leaf nodes.
import { cookies, headers } from 'next/headers';

import FocusOverlay from '@/components/client/focus-overlay';
import GameFocusOverlay from '@/components/client/game-focus-overlay';
import ToastViewport from '@/components/client/toast-viewport';
import ScrollParallax from '@/components/client/scroll-parallax';
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
import SystemSection from '@/components/portal/system-section';
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
  | 'system'
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
    games: isDashboardView ? '#games' : '/games',
    shortcuts: isDashboardView ? '#shortcuts' : '/shortcuts',
    services: isDashboardView ? '#services' : '/services',
    system: isDashboardView ? '#system' : '/#system',
    board: isDashboardView ? '#board' : '/#board',
    settings: '/settings',
  };

  const activeNav = isDashboardView ? 'dashboard' : view;
  const mobileActive =
    activeNav === 'services' || activeNav === 'system' || activeNav === 'board'
      ? 'dashboard'
      : activeNav;
  const viewTitleMap = {
    dashboard: strings.header.title,
    games: strings.games.title,
    search: strings.search.title,
    library: strings.library.title,
    shortcuts: strings.shortcuts.title,
    services: strings.services.title,
    system: strings.system.title,
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
    system: strings.system.description,
    board: strings.board.description,
    settings: strings.settings.description,
  } as const;

  return (
    <div className="portal-shell relative min-h-screen overflow-x-hidden">
      <ScrollParallax />

      <div className="portal-backdrop" aria-hidden="true">
        <div className="portal-backdrop-layer portal-backdrop-stars" />
        <div className="portal-backdrop-layer portal-backdrop-aurora" />
        <div className="portal-backdrop-layer portal-backdrop-glow" />
      </div>
      <div className="portal-cosmic" aria-hidden="true">
        <span
          className="portal-cosmic-item portal-cosmic-item--slow"
          style={{ top: '14%', left: '12%' }}
        >
          ✦
        </span>
        <span
          className="portal-cosmic-item"
          style={{ top: '28%', right: '16%' }}
        >
          ✶
        </span>
        <span
          className="portal-cosmic-item portal-cosmic-item--fast"
          style={{ top: '62%', left: '8%' }}
        >
          ✷
        </span>
        <span
          className="portal-cosmic-item"
          style={{ top: '72%', right: '18%' }}
        >
          ✹
        </span>
        <span
          className="portal-cosmic-item portal-cosmic-item--slow"
          style={{ top: '82%', left: '45%' }}
        >
          ✺
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 portal-grid opacity-50" />
      <div className="portal-orb portal-orb--a" />
      <div className="portal-orb portal-orb--b" />
      <div className="portal-orb portal-orb--c" />

      <div className="portal-content portal-frame grid w-full gap-10 py-10 lg:grid-cols-[200px_1fr]">
        <div className="order-2 flex flex-col gap-6 lg:order-1 lg:sticky lg:top-8 lg:self-start">
          <PortalSidebar
            strings={strings}
            isHome={isHome}
            links={navLinks}
            active={activeNav}
            delay={40}
          />
        </div>

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

          {view === 'games' && (
            <GamesSection strings={strings} variant="full" delay={140} />
          )}
          {view === 'search' && <SearchSection strings={strings} delay={140} />}
          {view === 'library' && (
            <LibrarySection strings={strings} delay={140} />
          )}
          {view === 'shortcuts' && (
            <ShortcutsSection strings={strings} delay={140} />
          )}
          {view === 'services' && (
            <ServicesSection
              strings={strings}
              isHome={isHome}
              isPublic={isPublic}
              delay={140}
            />
          )}
          {view === 'settings' && (
            <SettingsSection strings={strings} delay={140} />
          )}
          {view === 'dashboard' && (
            <div
              className={cn(
                'flex flex-col gap-10',
                lockPortal && 'pointer-events-none opacity-60'
              )}
            >
              <DashboardSections
                strings={strings}
                isHome={isHome}
                isPublic={isPublic}
              />
            </div>
          )}

          {view === 'services' && (
            <SystemSection strings={strings} isHome={isHome} delay={200} />
          )}
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
