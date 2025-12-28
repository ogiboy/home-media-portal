import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEPLOY_TARGET, HOME_URL } from "@/lib/env";

// Resolve the expected host from HOME_URL.
const getHomeHost = () => {
  try {
    return new URL(HOME_URL).host;
  } catch {
    return "";
  }
};

// Redirect plain HTTP to an internal HTTPS prompt page (home-only).
export function proxy(request: NextRequest) {
  if (DEPLOY_TARGET !== "home") {
    return NextResponse.next();
  }

  const host = request.headers.get("host") ?? "";
  const homeHost = getHomeHost();
  if (!homeHost || host !== homeHost) {
    return NextResponse.next();
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProto ?? request.nextUrl.protocol.replace(":", "");
  if (protocol === "http" && request.nextUrl.pathname !== "/http-redirect") {
    const url = request.nextUrl.clone();
    url.pathname = "/http-redirect";
    url.search = "";
    return NextResponse.redirect(url, 302);
  }

  return NextResponse.next();
}

// Apply to all routes except static assets and ping.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|ping.png).*)"],
};
