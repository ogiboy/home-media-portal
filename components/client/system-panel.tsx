'use client';

// Client widget for live system stats and quick service health.
import useSWR from 'swr';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { jsonFetcher } from '@/lib/fetcher';
import { formatBytes, formatUptime } from '@/lib/format';
import { getServiceHealth, type HealthResponse } from '@/lib/health';
import {
  HEALTH_POLL_INTERVAL_MS,
  SYSTEM_POLL_INTERVAL_MS,
} from '@/lib/constants/polling';
import { services } from '@/lib/services';
import type { PortalStrings } from '@/lib/i18n';
import type { SystemStats } from '@/types/system';

type SystemPanelProps = Readonly<{
  isHome: boolean;
  strings: PortalStrings;
  variant?: 'full' | 'compact';
}>;

const getStatusLabel = (
  status: ReturnType<typeof getServiceHealth>,
  strings: PortalStrings
) => {
  if (status === undefined) {
    return strings.services.statusChecking;
  }
  return status.ok
    ? strings.services.statusOnline
    : strings.services.statusOffline;
};

/**
 * Render the system vitals and quick health widgets as two responsive cards.
 *
 * Renders a "System vitals" card showing load averages, memory, disk, uptime and optional temperature, and a "Quick health" card listing service statuses; when `isHome` is false the data fetches are disabled and services are shown as locked.
 *
 * @param isHome - If true, enable polling for system and health data and show live values; if false, disable data fetching and show locked/placeholder content.
 * @param strings - Localized UI strings used for labels, titles, and descriptions.
 * @returns A JSX element containing the two cards with their respective content.
 */
export default function SystemPanel({
  isHome,
  strings,
  variant = 'full',
}: SystemPanelProps) {
  const { data: system } = useSWR<SystemStats>(
    isHome ? '/api/system' : null,
    jsonFetcher,
    { refreshInterval: SYSTEM_POLL_INTERVAL_MS }
  );
  const { data: health } = useSWR<HealthResponse>(
    isHome ? '/api/health' : null,
    jsonFetcher,
    { refreshInterval: HEALTH_POLL_INTERVAL_MS }
  );

  const systemContent =
    system === undefined ? (
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ) : (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {strings.system.loadAvg}
          </span>
          <span>{`${system.cpu.load1.toFixed(2)} / ${system.cpu.load5.toFixed(
            2
          )} / ${system.cpu.load15.toFixed(2)}`}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{strings.system.memory}</span>
          <span>
            {formatBytes(system.memory.usedBytes)} /{' '}
            {formatBytes(system.memory.totalBytes)}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
          <div
            className="h-full rounded-full bg-linear-to-r from-primary to-accent"
            style={{
              width: `${Math.min(
                100,
                (system.memory.usedBytes / system.memory.totalBytes) * 100
              )}%`,
            }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{strings.system.disk}</span>
          <span>
            {system.disk.usedBytes && system.disk.totalBytes
              ? `${formatBytes(system.disk.usedBytes)} / ${formatBytes(
                  system.disk.totalBytes
                )}`
              : strings.misc.na}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
          <div
            className="h-full rounded-full bg-linear-to-r from-accent to-primary"
            style={{ width: `${system.disk.usedPercent ?? 0}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{strings.system.uptime}</span>
          <span>{formatUptime(system.uptimeSec, strings.time)}</span>
        </div>
        {system.temperatureC !== null && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {strings.system.temperature}
            </span>
            <span>{system.temperatureC.toFixed(1)}C</span>
          </div>
        )}
      </div>
    );

  return (
    <div
      className={`mt-6 grid gap-6 ${
        variant === 'compact' ? '' : 'lg:grid-cols-[1.2fr_1fr]'
      }`}
    >
      <Card className="portal-surface">
        <CardHeader>
          <CardTitle>{strings.system.vitalsTitle}</CardTitle>
          <CardDescription>{strings.system.vitalsDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">{systemContent}</CardContent>
      </Card>

      <Card className="portal-surface">
        <CardHeader>
          <CardTitle>{strings.system.quickTitle}</CardTitle>
          <CardDescription>{strings.system.quickDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {servicesSummary(isHome, health, strings)}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Build a list of service status items for the quick-status panel.
 *
 * When `isHome` is false each service is shown with a locked status label; when true each
 * service is shown with a label derived from the provided `health` data and localized `strings`.
 *
 * @param isHome - If false, show locked status for all services; if true, compute live statuses.
 * @param health - Optional health response used to determine each service's current status.
 * @param strings - Localization strings used for status labels and fallbacks.
 * @returns An array of `<li>` elements, each containing a service name and its status label.
 */
function servicesSummary(
  isHome: boolean,
  health: HealthResponse | undefined,
  strings: PortalStrings
) {
  if (!isHome) {
    return services.map((service) => (
      <li
        key={service.id}
        className="flex items-center justify-between text-sm"
      >
        <span>{service.name}</span>
        <span className="text-muted-foreground">
          {strings.services.statusLocked}
        </span>
      </li>
    ));
  }

  return services.map((service) => {
    const status = getServiceHealth(health, service.id);
    const label = getStatusLabel(status, strings);
    return (
      <li
        key={service.id}
        className="flex items-center justify-between text-sm"
      >
        <span>{service.name}</span>
        <span className="text-muted-foreground">{label}</span>
      </li>
    );
  });
}
