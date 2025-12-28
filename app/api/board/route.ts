import { NextResponse } from "next/server";

import { boardMessageSchema } from "@/lib/board-schema";
import {
  BOARD_LIST_LIMIT,
  BOARD_RATE_LIMIT,
  BOARD_RATE_WINDOW_MS,
} from "@/lib/constants/board";
import { insertMessage, listMessages } from "@/lib/board-db";
import { isHomeDeployment } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";

// Force Node runtime for SQLite access.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Determine client IP from proxy headers.
const getClientIp = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
};

// List recent board messages (home-only).
export async function GET() {
  if (!isHomeDeployment()) {
    return NextResponse.json({ error: "not_available" }, { status: 403 });
  }

  const rows = listMessages(BOARD_LIST_LIMIT);
  const messages = rows.map((row) => ({
    id: row.id,
    author: row.author,
    body: row.body,
    createdAt: new Date(row.created_at).toISOString(),
  }));

  return NextResponse.json({ messages });
}

// Post a new message to the board (home-only).
export async function POST(request: Request) {
  if (!isHomeDeployment()) {
    return NextResponse.json({ error: "not_available" }, { status: 403 });
  }

  const clientIp = getClientIp(request);
  const rate = checkRateLimit(clientIp, {
    limit: BOARD_RATE_LIMIT,
    windowMs: BOARD_RATE_WINDOW_MS,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = boardMessageSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const message = insertMessage(parsed.data);
  return NextResponse.json(
    {
      message: {
        id: message.id,
        author: message.author,
        body: message.body,
        createdAt: new Date(message.created_at).toISOString(),
      },
    },
    { status: 201 }
  );
}
