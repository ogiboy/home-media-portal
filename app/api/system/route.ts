import { NextResponse } from "next/server";

import { isHomeDeployment } from "@/lib/env";
import { getSystemStats } from "@/lib/system";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isHomeDeployment()) {
    return NextResponse.json({ error: "not_available" }, { status: 403 });
  }

  const stats = await getSystemStats();
  return NextResponse.json(stats);
}
