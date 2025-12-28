import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEPLOY_TARGET, HOME_URL } from "@/lib/env";

const getHomeHost = () => {
  try {
    return new URL(HOME_URL).host;
  } catch {
    return "";
  }
};

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

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|ping.png).*)"],
};
