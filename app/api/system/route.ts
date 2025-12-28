import { NextResponse } from "next/server";

import { isHomeDeployment } from "@/lib/env";
import { getSystemStats } from "@/lib/system";

// Node runtime required for OS reads.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// System stats snapshot for the dashboard (home-only).
export async function GET() {
  if (!isHomeDeployment()) {
    return NextResponse.json({ error: "not_available" }, { status: 403 });
  }

  const stats = await getSystemStats();
  return NextResponse.json(stats);
}
