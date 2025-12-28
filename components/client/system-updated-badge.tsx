"use client";

import useSWR from "swr";

import { Badge } from "@/components/ui/badge";
import { jsonFetcher } from "@/lib/fetcher";
import { formatRelativeTime } from "@/lib/format";
import type { PortalStrings } from "@/lib/i18n";
import type { SystemStats } from "@/types/system";

type SystemUpdatedBadgeProps = {
  isHome: boolean;
  strings: PortalStrings;
};

export default function SystemUpdatedBadge({ isHome, strings }: SystemUpdatedBadgeProps) {
  const { data } = useSWR<SystemStats>(
    isHome ? "/api/system" : null,
    jsonFetcher,
    { refreshInterval: 5000 }
  );

  const label = data
    ? `${strings.system.updatedLabel} ${formatRelativeTime(data.checkedAt, strings.time)}`
    : strings.system.updatedLabel;

  return (
    <Badge variant="outline" className="portal-chip px-3 py-1 text-xs">
      {label}
    </Badge>
  );
}
