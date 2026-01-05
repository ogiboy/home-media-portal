'use server';

// Server actions for the family message board.
import { headers } from 'next/headers';

import { boardMessageSchema } from '@/lib/board-schema';
import { BOARD_RATE_LIMIT, BOARD_RATE_WINDOW_MS } from '@/lib/constants/board';
import { insertMessage } from '@/lib/board-db';
import { isHomeDeployment } from '@/lib/env';
import { checkRateLimit } from '@/lib/rate-limit';

// Action state returned to the client form.
export type BoardActionState = {
  status: 'idle' | 'success' | 'error';
  error?: 'invalid' | 'rate' | 'not_available' | 'unknown';
  resetKey?: number;
};

// Extract a client IP from request headers when available.
const getClientIp = (requestHeaders: Headers) => {
  const forwarded = requestHeaders.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }
  return requestHeaders.get('x-real-ip') ?? 'unknown';
};

// Post a new message via server action to enable form state feedback.
export async function postBoardMessage(
  prevState: BoardActionState,
  formData: FormData
): Promise<BoardActionState> {
  if (!isHomeDeployment()) {
    return {
      status: 'error',
      error: 'not_available',
      resetKey: prevState.resetKey,
    };
  }

  const authorValue = formData.get('author');
  const bodyValue = formData.get('body');
  const author = typeof authorValue === 'string' ? authorValue.trim() : '';
  const body = typeof bodyValue === 'string' ? bodyValue.trim() : '';

  const parsed = boardMessageSchema.safeParse({ author, body });
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'invalid',
      resetKey: prevState.resetKey,
    };
  }

  const requestHeaders = await headers();
  const clientIp = getClientIp(requestHeaders);
  const rate = checkRateLimit(clientIp, {
    limit: BOARD_RATE_LIMIT,
    windowMs: BOARD_RATE_WINDOW_MS,
  });
  if (!rate.allowed) {
    return {
      status: 'error',
      error: 'rate',
      resetKey: prevState.resetKey,
    };
  }

  try {
    insertMessage(parsed.data);
    return { status: 'success', resetKey: Date.now() };
  } catch {
    return {
      status: 'error',
      error: 'unknown',
      resetKey: prevState.resetKey,
    };
  }
}
