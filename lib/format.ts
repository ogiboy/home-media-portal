import type { PortalStrings } from "@/lib/i18n";

export const formatBytes = (bytes: number | null) => {
  if (bytes === null || bytes === undefined) {
    return null;
  }
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
};

export const formatUptime = (seconds: number, strings: PortalStrings["time"]) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) {
    return `${days}${strings.dayShort} ${hours}${strings.hourShort}`;
  }
  if (hours > 0) {
    return `${hours}${strings.hourShort} ${minutes}${strings.minuteShort}`;
  }
  return `${minutes}${strings.minuteShort}`;
};

export const formatRelativeTime = (
  iso: string,
  strings: PortalStrings["time"]
) => {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 1) {
    return strings.justNow;
  }
  if (diffMinutes < 60) {
    return strings.minutesAgo.replace("{count}", String(diffMinutes));
  }
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return strings.hoursAgo.replace("{count}", String(diffHours));
  }
  const diffDays = Math.round(diffHours / 24);
  return strings.daysAgo.replace("{count}", String(diffDays));
};
