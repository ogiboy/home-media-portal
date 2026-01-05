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

// Render the status dot + label for a service.
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

// Render the latest latency value for a service.
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
