// Server-rendered portal shell - refactored for lower complexity.
import { cookies, headers } from 'next/headers';

import FocusOverlay from '@/components/client/focus-overlay';
import GameFocusOverlay from '@/components/client/game-focus-overlay';
import ToastViewport from '@/components/client/toast-viewport';
import ParallaxBackground from '@/components/client/parallax-background';
import SidebarFloat from '@/components/client/sidebar-float';
import ToTopButton from '@/components/client/to-top-button';
import { ChatFloatButton, ChatPopup } from '@/components/client/chatbot';
import PortalSidebar from '@/components/portal/portal-sidebar';
import PortalHeader from '@/components/portal/portal-header';
import PortalFooter from '@/components/portal/portal-footer';
import ViewRenderer from '@/components/portal/view-renderer';
import PortalMobileNav from '@/components/portal/portal-mobile-nav';
import { getTranslations } from '@/lib/i18n';
import { isHomeDeployment } from '@/lib/env';
import { createNavLinks, getActiveNav, getMobileActive } from '@/lib/nav-links';
import type { PortalView } from '@/lib/store/slices/portalSlice';

type PortalAppProps = {
  view?: PortalView;
};

const getViewTitle = (strings: ReturnType<typeof getTranslations>['strings'], view: PortalView) => {
  const titles: Record<PortalView, string> = {
    dashboard: strings.header.title,
    games: strings.games.title,
    search: strings.search.title,
    library: strings.library.title,
    shortcuts: strings.shortcuts.title,
    services: strings.services.title,
    board: strings.board.title,
    chat: strings.chat.title,
    settings: strings.settings.title,
  };
  return titles[view];
};

const getViewSubtitle = (strings: ReturnType<typeof getTranslations>['strings'], view: PortalView) => {
  const subtitles: Record<PortalView, string> = {
    dashboard: strings.header.subtitle,
    games: strings.games.description,
    search: strings.search.description,
    library: strings.library.description,
    shortcuts: strings.shortcuts.description,
    services: strings.services.description,
    board: strings.board.description,
    chat: strings.chat.description,
    settings: strings.settings.description,
  };
  return subtitles[view];
};

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

  const navLinks = createNavLinks(isDashboardView);
  const activeNav = getActiveNav(view, isDashboardView);
  const mobileActive = getMobileActive(activeNav);

  return (
    <div className="portal-shell relative min-h-dvh overflow-x-hidden">
      <ParallaxBackground />

      <div className="portal-content portal-frame relative z-10 grid w-full gap-10 py-10 lg:grid-cols-[minmax(72px,200px)_1fr]">
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
            title={getViewTitle(strings, view)}
            subtitle={getViewSubtitle(strings, view)}
            allowGateInteraction={isGamesView}
            delay={80}
          />

          <ViewRenderer
            view={view}
            strings={strings}
            isHome={isHome}
            isPublic={isPublic}
            lockPortal={lockPortal}
          />
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
      <ChatFloatButton strings={strings} />
      <ChatPopup strings={strings} />
      <FocusOverlay isHome={isHome} strings={strings} />
      <GameFocusOverlay strings={strings} />
    </div>
  );
}
