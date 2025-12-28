import { NextResponse } from "next/server";
import { performance } from "perf_hooks";

import { HOME_URL, isHomeDeployment } from "@/lib/env";
import { services } from "@/lib/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fetchWithTimeout = async (url: string, init: RequestInit, timeoutMs: number) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const checkService = async (service: (typeof services)[number]) => {
  const url = new URL(service.healthPath ?? service.path, HOME_URL).toString();
  const start = performance.now();

  try {
    let response = await fetchWithTimeout(
      url,
      { method: "HEAD", redirect: "manual" },
      2500
    );

    if (response.status === 405) {
      response = await fetchWithTimeout(
        url,
        { method: "GET", redirect: "manual" },
        3000
      );
    }

    const latencyMs = Math.round(performance.now() - start);
    return {
      id: service.id,
      ok: response.status < 500,
      status: response.status,
      latencyMs,
    };
  } catch {
    return {
      id: service.id,
      ok: false,
      status: null,
      latencyMs: null,
    };
  }
};

export async function GET() {
  if (!isHomeDeployment()) {
    return NextResponse.json(
      { error: "not_available", services: [] },
      { status: 403 }
    );
  }

  const results = await Promise.all(services.map((service) => checkService(service)));

  return NextResponse.json({
    services: results,
    checkedAt: new Date().toISOString(),
  });
}
