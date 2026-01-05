'use client';

// Client health indicators for service cards.
import useSWR from 'swr';

import { jsonFetcher } from '@/lib/fetcher';
import { getServiceHealth, type HealthResponse } from '@/lib/health';
import { HEALTH_POLL_INTERVAL_MS } from '@/lib/constants/polling';
import type { PortalStrings } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// Visual tone map for service states.
const statusTone = {
  online: 'bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.45)]',
  offline: 'bg-rose-400 shadow-[0_0_16px_rgba(248,113,113,0.4)]',
  checking: 'bg-amber-400 animate-pulse',
  locked: 'bg-muted-foreground',
};

type ServiceStatusProps = Readonly<{
  serviceId: string;
  isHome: boolean;
  strings: PortalStrings;
}>;

/**
 * Render a status indicator (colored dot and text label) for a service.
 *
 * Displays a locked label when not on the home view. When on the home view,
 * resolves the service's health and displays one of: checking, online, or offline.
 *
 * @param serviceId - Identifier of the service to display status for
 * @param isHome - Whether the component is rendered on the home view (enables health lookup)
 * @param strings - Localized strings used for status labels
 * @returns A JSX element containing a colored status dot and a status label reflecting the service health
 */
export function ServiceStatusBadge({
  serviceId,
  isHome,
  strings,
}: ServiceStatusProps) {
  const { data } = useSWR<HealthResponse>(
    isHome ? '/api/health' : null,
    jsonFetcher,
    { refreshInterval: HEALTH_POLL_INTERVAL_MS }
  );

  if (!isHome) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className={cn('h-2 w-2 rounded-full', statusTone.locked)} />
        <span>{strings.services.statusLocked}</span>
      </div>
    );
  }

  const status = getServiceHealth(data, serviceId);
  let label = strings.services.statusChecking;
  let tone = statusTone.checking;

  if (status) {
    if (status.ok) {
      label = strings.services.statusOnline;
      tone = statusTone.online;
    } else {
      label = strings.services.statusOffline;
      tone = statusTone.offline;
    }
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn('h-2 w-2 rounded-full', tone)} />
      <span>{label}</span>
    </div>
  );
}

/**
 * Render the latest latency text for a service, falling back to appropriate status labels when latency is unavailable.
 *
 * @param serviceId - Identifier of the service whose latency is displayed
 * @param isHome - If `false`, renders the locked label and skips health fetching
 * @param strings - Localized strings used for status and fallback labels
 * @returns A JSX element showing "`<latencyMs> ms`" when present, `strings.services.statusChecking` while loading, `strings.services.statusLocked` when not on the home view, or `strings.misc.na` when latency is unavailable
 */
export function ServiceLatency({
  serviceId,
  isHome,
  strings,
}: ServiceStatusProps) {
  const { data } = useSWR<HealthResponse>(
    isHome ? '/api/health' : null,
    jsonFetcher,
    { refreshInterval: HEALTH_POLL_INTERVAL_MS }
  );

  if (!isHome) {
    return <span>{strings.services.statusLocked}</span>;
  }

  const status = getServiceHealth(data, serviceId);
  if (!status) {
    return <span>{strings.services.statusChecking}</span>;
  }

  return <span>{status.latencyMs ? `${status.latencyMs} ms` : strings.misc.na}</span>;
}