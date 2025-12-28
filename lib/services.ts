import { HOME_URL } from "@/lib/env";

export const serviceIds = [
  "jellyfin",
  "radarr",
  "sonarr",
  "prowlarr",
  "bazarr",
  "qbittorrent",
] as const;

export type ServiceId = (typeof serviceIds)[number];

export type ServiceOpenMode = "overlay" | "newtab";

export type ServiceDefinition = {
  id: ServiceId;
  name: string;
  path: string;
  openMode: ServiceOpenMode;
  healthPath?: string;
  icon: string;
  accent: string;
};

export const services: ServiceDefinition[] = [
  {
    id: "jellyfin",
    name: "Jellyfin",
    path: "/jelly",
    openMode: "overlay",
    healthPath: "/jelly",
    icon: "tv",
    accent: "#3b82f6",
  },
  {
    id: "radarr",
    name: "Radarr",
    path: "/radarr",
    openMode: "overlay",
    healthPath: "/radarr",
    icon: "clapperboard",
    accent: "#f97316",
  },
  {
    id: "sonarr",
    name: "Sonarr",
    path: "/sonarr",
    openMode: "overlay",
    healthPath: "/sonarr",
    icon: "film",
    accent: "#22c55e",
  },
  {
    id: "prowlarr",
    name: "Prowlarr",
    path: "/prowlarr",
    openMode: "overlay",
    healthPath: "/prowlarr",
    icon: "radar",
    accent: "#06b6d4",
  },
  {
    id: "bazarr",
    name: "Bazarr",
    path: "/bazarr",
    openMode: "overlay",
    healthPath: "/bazarr",
    icon: "captions",
    accent: "#f43f5e",
  },
  {
    id: "qbittorrent",
    name: "qBittorrent",
    path: "/qb",
    openMode: "newtab",
    healthPath: "/qb",
    icon: "download",
    accent: "#64748b",
  },
];

export const getServiceById = (id: string | null) =>
  services.find((service) => service.id === id);

export const getServiceHref = (service: ServiceDefinition) => {
  const base = HOME_URL.replace(/\/$/, "");
  return `${base}${service.path}`;
};
