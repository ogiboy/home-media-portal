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

/**
 * Post a message to the board, validating input, enforcing availability and rate limits, and returning an updated action state.
 *
 * @param prevState - The previous board action state; `resetKey` from this state is preserved on error responses
 * @param formData - Form data expected to contain `author` and `body` fields
 * @returns On success, an object with `status: 'success'` and `resetKey` set to the current timestamp. On error, an object with `status: 'error'`, `error` set to one of `'invalid' | 'rate' | 'not_available' | 'unknown'`, and `resetKey` preserved from `prevState`.
 */
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