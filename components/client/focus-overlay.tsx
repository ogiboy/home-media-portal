'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Loader2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { PortalStrings } from '@/lib/i18n';
import { renderServiceIcon } from '@/lib/service-icons';
import { getServiceById, getServiceHref } from '@/lib/services';

const overlayTransition = {
  duration: 0.28,
  ease: [0.22, 0.61, 0.36, 1],
};
const contentTransition = {
  duration: 0.32,
  ease: [0.22, 0.61, 0.36, 1],
};

type FocusOverlayProps = {
  isHome: boolean;
  strings: PortalStrings;
};

export default function FocusOverlay({ isHome, strings }: FocusOverlayProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadedId, setLoadedId] = useState<string | null>(null);

  const service = useMemo(() => {
    const activeAppId = searchParams.get('app');
    return getServiceById(activeAppId);
  }, [searchParams]);

  const isActive = Boolean(service && service.openMode === 'overlay' && isHome);
  const isLoaded = service ? loadedId === service.id : false;
  const close = useCallback(() => {
    setLoadedId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('app');
    const query = params.toString();
    router.push(query ? `/?${query}` : '/');
  }, [router, searchParams]);

  useEffect(() => {
    if (isActive) {
      document.documentElement.dataset.focus = 'true';
    } else {
      document.documentElement.dataset.focus = 'false';
    }
    return () => {
      document.documentElement.dataset.focus = 'false';
    };
  }, [isActive]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isActive) {
        close();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isActive, close]);

  return (
    <AnimatePresence>
      {isActive && service && (
        <motion.section
          className="portal-surface absolute inset-0 z-30 flex flex-col gap-4 rounded-(--radius) p-5"
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={overlayTransition}
          aria-label={strings.focus.label}
        >
          <div className="pointer-events-none absolute inset-0 rounded-(--radius) border border-white/10" />
          <motion.header
            className="flex flex-wrap items-center justify-between gap-3"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...contentTransition, delay: 0.05 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg"
                style={{ background: service.accent }}
              >
                {renderServiceIcon(service.icon, {
                  className: 'h-5 w-5',
                  'aria-hidden': true,
                })}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {strings.focus.label}
                </p>
                <h3 className="text-lg font-semibold">{service.name}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  window.open(
                    getServiceHref(service),
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
              >
                {strings.focus.openInTab}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={close}>
                <X className="h-4 w-4" />
                {strings.focus.close}
              </Button>
            </div>
          </motion.header>

          <motion.div
            className="relative flex-1 overflow-hidden rounded-3xl border border-border/70 bg-background/70"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...contentTransition, delay: 0.1 }}
          >
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            <iframe
              title={`${service.name} ${strings.focus.frameTitleSuffix}`}
              src={service.path}
              className="h-full w-full"
              onLoad={() => setLoadedId(service.id)}
            />
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
