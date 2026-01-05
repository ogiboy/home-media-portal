// Environment helpers for deployment mode and home URL.
export const HOME_URL =
  process.env.NEXT_PUBLIC_HOME_URL ?? "https://home.tailnet.ts.net";

export const DEPLOY_TARGET =
  process.env.NEXT_PUBLIC_DEPLOY_TARGET?.toLowerCase() ?? "public";

// Shared secret for trusting canonical tailnet headers (home only).
export const PORTAL_INTERNAL_SECRET =
  process.env.PORTAL_INTERNAL_SECRET ?? "";

// Comma-separated trusted proxy IPs for header trust checks.
export const PORTAL_TRUSTED_PROXIES =
  process.env.PORTAL_TRUSTED_PROXIES ?? "127.0.0.1,::1";

// Determine if the current build targets the home portal.
export const isHomeDeployment = () => DEPLOY_TARGET === "home";
