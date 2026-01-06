// Server-rendered portal shell that keeps client widgets at the leaf nodes.
import { cookies, headers } from 'next/headers';

import FocusOverlay from '@/components/client/focus-overlay';
import GameFocusOverlay from '@/components/client/game-focus-overlay';
import ToastViewport from '@/components/client/toast-viewport';
import ScrollParallax from '@/components/client/scroll-parallax';
import ScrollRestoration from '@/components/client/scroll-restoration';
import ToTopButton from '@/components/client/to-top-button';
import PortalSidebar from '@/components/portal/portal-sidebar';
import PortalHeader from '@/components/portal/portal-header';
import ShortcutsSection from '@/components/portal/shortcuts-section';
import GamesSection from '@/components/portal/games-section';
import ServicesSection from '@/components/portal/services-section';
import SystemSection from '@/components/portal/system-section';
import BoardSection from '@/components/portal/board-section';
import PortalMobileNav from '@/components/portal/portal-mobile-nav';
import { getTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { isHomeDeployment } from '@/lib/env';

type PortalView = 'dashboard' | 'games';

type PortalAppProps = {
  view?: PortalView;
};

/**
 * Render the server-side portal shell composed of sidebar, header, and view-specific sections.
 *
 * Calculates locale and translation strings from cookies and request headers, then composes
 * the complete portal layout including navigation, sidebar, header, main sections, mobile nav,
 * toast viewport, and focus overlay.
 *
 * @param view - Which top-level view to render: `'dashboard'` renders the multi-section home
 *   layout (default), `'games'` renders the games-focused layout.
 * @returns The JSX element for the fully composed portal layout configured for the selected view
 *   with server-resolved locale and strings.
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
  const lockPortal = isPublic && !isGamesView;

  const navLinks = {
    dashboard: isGamesView ? '/#services' : '#services',
    games: isGamesView ? '#games' : '/games',
    system: isGamesView ? '/#system' : '#system',
    board: isGamesView ? '/#board' : '#board',
  };

  return (
    <div className="portal-shell relative min-h-screen overflow-x-hidden">
      <ScrollParallax />
      <ScrollRestoration />
      <div className="pointer-events-none absolute inset-0 portal-grid opacity-40" />
      <div className="portal-orb portal-orb--a" />
      <div className="portal-orb portal-orb--b" />
      <div className="portal-orb portal-orb--c" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[300px_1fr]">
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <PortalSidebar
            strings={strings}
            isHome={isHome}
            links={navLinks}
            active={isGamesView ? 'games' : 'dashboard'}
            delay={40}
          />
          <BoardSection
            strings={strings}
            isHome={isHome}
            variant="compact"
            delay={120}
          />
        </div>

        <main className="order-1 relative flex flex-col gap-6 lg:order-2">
          <PortalHeader
            strings={strings}
            isHome={isHome}
            isPublic={isPublic}
            locale={locale}
            title={isGamesView ? strings.games.title : strings.header.title}
            subtitle={
              isGamesView ? strings.games.description : strings.header.subtitle
            }
            allowGateInteraction={isGamesView}
            delay={80}
          />

          {isGamesView ? (
            <GamesSection strings={strings} variant="full" delay={140} />
          ) : (
            <div
              className={cn(
                'flex flex-col gap-10',
                lockPortal && 'pointer-events-none opacity-60'
              )}
            >
              <ShortcutsSection strings={strings} delay={140} />
              <GamesSection strings={strings} variant="preview" delay={200} />
              <ServicesSection
                strings={strings}
                isHome={isHome}
                isPublic={isPublic}
                delay={240}
              />
              <SystemSection strings={strings} isHome={isHome} delay={320} />
            </div>
          )}
        </main>
      </div>

      <PortalMobileNav
        strings={strings}
        links={navLinks}
        active={isGamesView ? 'games' : 'dashboard'}
      />
      <ToTopButton label={strings.accessibility.backToTop} />
      <ToastViewport strings={strings} />
      <FocusOverlay isHome={isHome} strings={strings} />
      <GameFocusOverlay strings={strings} />
    </div>
  );
}