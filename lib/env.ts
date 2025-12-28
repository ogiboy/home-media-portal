// Environment helpers for deployment mode and home URL.
export const HOME_URL =
  process.env.NEXT_PUBLIC_HOME_URL ?? "https://home.tailnet.ts.net";

export const DEPLOY_TARGET =
  process.env.NEXT_PUBLIC_DEPLOY_TARGET?.toLowerCase() ?? "public";

// Determine if the current build targets the home portal.
export const isHomeDeployment = () => DEPLOY_TARGET === "home";
