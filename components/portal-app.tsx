// Server-rendered portal shell that keeps client widgets at the leaf nodes.
import { cookies, headers } from 'next/headers';

import FocusOverlay from '@/components/client/focus-overlay';
import ToastViewport from '@/components/client/toast-viewport';
import PortalSidebar from '@/components/portal/portal-sidebar';
import PortalHeader from '@/components/portal/portal-header';
import ServicesSection from '@/components/portal/services-section';
import SystemSection from '@/components/portal/system-section';
import BoardSection from '@/components/portal/board-section';
import PortalMobileNav from '@/components/portal/portal-mobile-nav';
import { getTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { isHomeDeployment } from '@/lib/env';

// Compose the full portal layout with server-rendered sections.
export default async function PortalApp() {
  const cookieStore = await cookies();
  const headerList = await headers();
  const localeCookie = cookieStore.get('portal_locale')?.value;
  const acceptLanguage = headerList.get('accept-language') ?? undefined;
  const { locale, strings } = getTranslations(localeCookie, acceptLanguage);
  const isHome = isHomeDeployment();
  const isPublic = !isHome;

  return (
    <div className="portal-shell relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 portal-grid opacity-40" />
      <div className="portal-orb portal-orb--a" />
      <div className="portal-orb portal-orb--b" />
      <div className="portal-orb portal-orb--c" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl gap-6 px-4 py-8">
        <PortalSidebar strings={strings} isHome={isHome} delay={40} />

        <main className="relative flex-1">
          <PortalHeader
            strings={strings}
            isHome={isHome}
            isPublic={isPublic}
            locale={locale}
            delay={80}
          />

          <div
            className={cn(
              'mt-8 flex flex-col gap-10',
              isPublic && 'pointer-events-none opacity-60'
            )}
          >
            <ServicesSection
              strings={strings}
              isHome={isHome}
              isPublic={isPublic}
              delay={140}
            />
            <SystemSection strings={strings} isHome={isHome} delay={220} />
            <BoardSection strings={strings} isHome={isHome} delay={260} />
          </div>
        </main>
      </div>

      <PortalMobileNav strings={strings} />
      <ToastViewport />
      <FocusOverlay isHome={isHome} strings={strings} />
    </div>
  );
}
