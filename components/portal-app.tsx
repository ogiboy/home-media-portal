import type { CSSProperties } from 'react';
import { cookies } from 'next/headers';
import {
  Gauge,
  LayoutGrid,
  MessageSquare,
  MonitorPlay,
  Server,
} from 'lucide-react';

import BrandMark from '@/components/brand-mark';
import { Badge } from '@/components/ui/badge';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PortalControls from '@/components/client/portal-controls';
import SystemUpdatedBadge from '@/components/client/system-updated-badge';
import ServiceActions from '@/components/client/service-actions';
import {
  ServiceLatency,
  ServiceStatusBadge,
} from '@/components/client/service-status';
import SystemPanel from '@/components/client/system-panel';
import MessageBoardPanel from '@/components/client/message-board-panel';
import FocusOverlay from '@/components/client/focus-overlay';
import ThemeToggle from '@/components/client/theme-toggle';
import LanguageSwitch from '@/components/client/language-switch';
import { getTranslations } from '@/lib/i18n';
import { renderServiceIcon } from '@/lib/service-icons';
import { services } from '@/lib/services';
import { cn } from '@/lib/utils';
import { isHomeDeployment } from '@/lib/env';

const withDelay = (delay: number): CSSProperties =>
  ({ '--delay': `${delay}ms` } as CSSProperties);

export default async function PortalApp() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('portal_locale')?.value;
  const { locale, strings } = getTranslations(localeCookie);
  const isHome = isHomeDeployment();
  const isPublic = !isHome;

  return (
    <div className="portal-shell relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 portal-grid opacity-40" />
      <div className="portal-orb portal-orb--a" />
      <div className="portal-orb portal-orb--b" />
      <div className="portal-orb portal-orb--c" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl gap-6 px-4 py-8">
        <aside
          className="portal-surface portal-sidebar portal-entrance hidden shrink-0 flex-col gap-6 rounded-(--radius) p-5 md:flex"
          style={withDelay(40)}
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
            <ul className="flex flex-1 flex-col gap-3" role="list">
              <li>
                <a
                  href="#services"
                  className="portal-nav-item flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LayoutGrid className="h-5 w-5" />
                  <span className="portal-label">{strings.nav.dashboard}</span>
                </a>
              </li>
              <li>
                <a
                  href="#system"
                  className="portal-nav-item flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Gauge className="h-5 w-5" />
                  <span className="portal-label">{strings.nav.system}</span>
                </a>
              </li>
              <li>
                <a
                  href="#board"
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
                {isHome
                  ? strings.badges.homePortal
                  : strings.badges.publicPreview}
              </span>
            </div>
            <p className="portal-label mt-2 leading-relaxed">
              {isHome
                ? strings.tailnet.connectedNote
                : strings.tailnet.lockedNote}
            </p>
          </div>
        </aside>

        <main className="relative flex-1">
          <header
            className="portal-hero portal-surface portal-entrance flex flex-col gap-4 rounded-(--radius) p-6"
            style={withDelay(80)}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                  {strings.header.kicker}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                    {strings.header.title}
                  </span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {strings.header.subtitle}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant={isHome ? 'accent' : 'outline'}
                  className="portal-chip px-3 py-1 text-xs"
                >
                  {isHome
                    ? strings.badges.homePortal
                    : strings.badges.publicPreview}
                </Badge>
                <PortalControls strings={strings} isPublic={isPublic} />
                <ThemeToggle label={strings.accessibility.themeToggle} />
                <LanguageSwitch
                  locale={locale}
                  label={strings.accessibility.languageToggle}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <MonitorPlay className="h-4 w-4" />
              <span>
                {isHome ? strings.header.liveNote : strings.header.previewNote}
              </span>
            </div>
          </header>

          <div
            className={cn(
              'mt-8 flex flex-col gap-10',
              isPublic && 'pointer-events-none opacity-60'
            )}
          >
            <section
              id="services"
              aria-labelledby="services-title"
              className="portal-entrance scroll-mt-32"
              style={withDelay(140)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="services-title" className="text-xl font-semibold">
                    {strings.services.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {strings.services.description}
                  </p>
                </div>
                <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                  <MonitorPlay className="h-4 w-4" />
                  <span>{strings.services.focusHint}</span>
                </div>
              </div>

              <ul
                className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                role="list"
              >
                {services.map((service, index) => (
                  <li
                    key={service.id}
                    className="portal-entrance"
                    style={withDelay(180 + index * 70)}
                  >
                    <article className="portal-card group rounded-(--radius)">
                      <div
                        className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-35"
                        style={{ background: service.accent }}
                      />
                      <CardHeader className="gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg"
                              style={{ background: service.accent }}
                            >
                              {renderServiceIcon(service.icon, {
                                className: 'h-5 w-5',
                                'aria-hidden': true,
                              })}
                            </div>
                            <div>
                              <CardTitle>{service.name}</CardTitle>
                              <CardDescription>
                                {strings.services.items[service.id]}
                              </CardDescription>
                            </div>
                          </div>
                          <ServiceStatusBadge
                            serviceId={service.id}
                            isHome={isHome}
                            strings={strings}
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{strings.services.latency}</span>
                          <ServiceLatency
                            serviceId={service.id}
                            isHome={isHome}
                            strings={strings}
                          />
                        </div>
                        <Separator />
                        <ServiceActions
                          service={service}
                          isPublic={isPublic}
                          strings={strings}
                        />
                      </CardContent>
                      <CardFooter className="text-xs text-muted-foreground">
                        {service.openMode === 'overlay'
                          ? strings.services.overlayHint
                          : strings.services.newTabHint}
                      </CardFooter>
                    </article>
                  </li>
                ))}
              </ul>
            </section>

            <section
              id="system"
              aria-labelledby="system-title"
              className="portal-entrance scroll-mt-32"
              style={withDelay(220)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="system-title" className="text-xl font-semibold">
                    {strings.system.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {strings.system.description}
                  </p>
                </div>
                <SystemUpdatedBadge isHome={isHome} strings={strings} />
              </div>
              <SystemPanel isHome={isHome} strings={strings} />
            </section>

            <section
              id="board"
              aria-labelledby="board-title"
              className="portal-entrance scroll-mt-32"
              style={withDelay(260)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="board-title" className="text-xl font-semibold">
                    {strings.board.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {strings.board.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="portal-chip px-3 py-1 text-xs"
                >
                  {strings.board.tailnetOnly}
                </Badge>
              </div>
              <MessageBoardPanel isHome={isHome} strings={strings} />
            </section>
          </div>
        </main>
      </div>

      <nav
        className="portal-surface portal-mobile-nav fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-full px-4 py-3 md:hidden"
        aria-label={strings.accessibility.mobileNav}
      >
        <a
          href="#services"
          className="flex items-center gap-2 text-xs font-semibold"
        >
          <LayoutGrid className="h-4 w-4" />
          {strings.nav.dashboard}
        </a>
        <a
          href="#system"
          className="flex items-center gap-2 text-xs font-semibold"
        >
          <Gauge className="h-4 w-4" />
          {strings.nav.system}
        </a>
        <a
          href="#board"
          className="flex items-center gap-2 text-xs font-semibold"
        >
          <MessageSquare className="h-4 w-4" />
          {strings.nav.board}
        </a>
      </nav>

      <FocusOverlay isHome={isHome} strings={strings} />
    </div>
  );
}
