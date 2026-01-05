'use client';

// Client badge that shows the latest system poll timestamp.
import useSWR from 'swr';

import { Badge } from '@/components/ui/badge';
import { jsonFetcher } from '@/lib/fetcher';
import { formatRelativeTime } from '@/lib/format';
import type { PortalStrings } from '@/lib/i18n';
import type { SystemStats } from '@/types/system';
import { SYSTEM_POLL_INTERVAL_MS } from '@/lib/constants/polling';

type SystemUpdatedBadgeProps = Readonly<{
  isHome: boolean;
  strings: PortalStrings;
}>;

/**
 * Render a badge that shows when the system was last polled.
 *
 * @param isHome - If true, the component fetches system stats and updates the badge; if false, it displays only the label.
 * @param strings - Localization strings used for the label and relative time formatting.
 * @returns A Badge element containing the updated label (and relative timestamp when available).
 */
export default function SystemUpdatedBadge({
  isHome,
  strings,
}: SystemUpdatedBadgeProps) {
  const { data } = useSWR<SystemStats>(
    isHome ? '/api/system' : null,
    jsonFetcher,
    { refreshInterval: SYSTEM_POLL_INTERVAL_MS }
  );

  const label = data
    ? `${strings.system.updatedLabel} ${formatRelativeTime(
        data.checkedAt,
        strings.time
      )}`
    : strings.system.updatedLabel;

  return (
    <Badge variant="outline" className="portal-chip px-3 py-1 text-xs">
      {label}
    </Badge>
  );
}