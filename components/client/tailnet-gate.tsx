'use client';

// Fullscreen tailnet gate rendered via portal to avoid transformed ancestors.
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Loader2 } from 'lucide-react';

import BrandMark from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import type { PortalStrings } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import styles from './tailnet-gate.module.css';

type TailnetGateProps = {
  visible: boolean;
  status: 'connecting' | 'online' | 'offline';
  isPublic: boolean;
  strings: PortalStrings;
  onEnter: () => void;
};

// Track hydration without setState to avoid mismatched portals.
const useHydrated = () =>
  useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

// Fullscreen tailnet gate overlay mounted via portal.
export default function TailnetGate({
  visible,
  status,
  isPublic,
  strings,
  onEnter,
}: TailnetGateProps) {
  const blocking = isPublic;
  const hydrated = useHydrated();

  const statusLabel =
    status === 'offline'
      ? strings.gate.waitingLabel
      : status === 'connecting'
      ? strings.gate.connectingLabel
      : strings.gate.connected;

  const overlayTone = useMemo(
    () => (blocking ? 'bg-black/60' : 'bg-black/35'),
    [blocking]
  );

  useEffect(() => {
    if (!visible || !blocking) {
      return undefined;
    }
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [visible, blocking]);

  if (!visible || !hydrated) {
    return null;
  }

  const portalTarget = typeof document === 'undefined' ? null : document.body;
  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        'portal-gate',
        styles.overlay,
        overlayTone,
        !blocking && styles.nonBlocking
      )}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn('portal-surface portal-entrance', styles.panel)}
      >
        <div
          className={cn(
            styles.brand,
            'border border-primary/30 bg-primary/10 shadow-[0_0_40px_var(--portal-glow-strong)]'
          )}
        >
          <BrandMark className="h-9 w-9" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {strings.gate.title}
          </p>
          <h2 className="text-2xl font-semibold">
            {status === 'online'
              ? strings.gate.connected
              : status === 'offline'
              ? strings.gate.waiting
              : strings.gate.connecting}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isPublic
              ? strings.gate.publicDescription
              : strings.gate.homeDescription}
          </p>
        </div>
        {status !== 'online' && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{statusLabel}</span>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {isPublic && status === 'online' && (
            <Button
              onClick={onEnter}
              className="shadow-[0_12px_30px_var(--portal-glow)]"
            >
              {strings.gate.enter}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>,
    portalTarget
  );
}
