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

type TailnetGateProps = Readonly<{
  visible: boolean;
  status: 'connecting' | 'online' | 'offline';
  isPublic: boolean;
  allowInteraction?: boolean;
  strings: PortalStrings;
  onEnter: () => void;
}>;

// Track hydration without setState to avoid mismatched portals.
const useHydrated = () =>
  useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

/**
 * Render a fullscreen Tailnet gate overlay into document.body using a portal.
 *
 * The overlay blocks interaction and disables page scrolling when `isPublic` is true and
 * `allowInteraction` is false. Displays connection status, a contextual description,
 * and an "Enter" control when the gate is public and the status is `online`.
 *
 * @param visible - Whether the gate should be shown.
 * @param status - Current connection status (`'connecting' | 'online' | 'offline'`).
 * @param isPublic - Whether the gate represents a public tailnet (affects description and controls).
 * @param allowInteraction - When true, the overlay is rendered non-blocking and does not disable page scroll.
 * @param strings - Localized UI strings for the gate.
 * @param onEnter - Callback invoked when the user activates the Enter control.
 * @returns The portal-rendered gate element, or `null` when not visible or when rendering is not possible.
 */
export default function TailnetGate({
  visible,
  status,
  isPublic,
  allowInteraction = false,
  strings,
  onEnter,
}: TailnetGateProps) {
  const blocking = isPublic && !allowInteraction;
  const hydrated = useHydrated();

  const statusLabels = {
    online: strings.gate.connected,
    offline: strings.gate.waitingLabel,
    connecting: strings.gate.connectingLabel,
  };

  const statusHeadings = {
    online: strings.gate.connected,
    offline: strings.gate.waiting,
    connecting: strings.gate.connecting,
  };

  const statusLabel = statusLabels[status];
  const statusHeading = statusHeadings[status];
  const description = isPublic
    ? strings.gate.publicDescription
    : strings.gate.homeDescription;

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
    <>
      <div
        className={cn(
          'portal-gate',
          styles.overlay,
          overlayTone,
          !blocking && styles.overlayPassive
        )}
      />
      <div className={cn('portal-gate', styles.panelWrap)}>
        <dialog
          open
          aria-modal={blocking}
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
            <h2 className="text-2xl font-semibold">{statusHeading}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
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
        </dialog>
      </div>
    </>,
    portalTarget
  );
}