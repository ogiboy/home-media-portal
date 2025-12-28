"use client";

import useSWR from "swr";

import { jsonFetcher } from "@/lib/fetcher";
import { getServiceHealth, type HealthResponse } from "@/lib/health";
import type { PortalStrings } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const statusTone = {
  online: "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.45)]",
  offline: "bg-rose-400 shadow-[0_0_16px_rgba(248,113,113,0.4)]",
  checking: "bg-amber-400 animate-pulse",
  locked: "bg-muted-foreground",
};

type ServiceStatusProps = {
  serviceId: string;
  isHome: boolean;
  strings: PortalStrings;
};

export function ServiceStatusBadge({ serviceId, isHome, strings }: ServiceStatusProps) {
  const { data } = useSWR<HealthResponse>(
    isHome ? "/api/health" : null,
    jsonFetcher,
    { refreshInterval: 12000 }
  );

  if (!isHome) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className={cn("h-2 w-2 rounded-full", statusTone.locked)} />
        <span>{strings.services.statusLocked}</span>
      </div>
    );
  }

  const status = getServiceHealth(data, serviceId);
  const label = status
    ? status.ok
      ? strings.services.statusOnline
      : strings.services.statusOffline
    : strings.services.statusChecking;
  const tone = status
    ? status.ok
      ? statusTone.online
      : statusTone.offline
    : statusTone.checking;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn("h-2 w-2 rounded-full", tone)} />
      <span>{label}</span>
    </div>
  );
}

export function ServiceLatency({ serviceId, isHome, strings }: ServiceStatusProps) {
  const { data } = useSWR<HealthResponse>(
    isHome ? "/api/health" : null,
    jsonFetcher,
    { refreshInterval: 12000 }
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
