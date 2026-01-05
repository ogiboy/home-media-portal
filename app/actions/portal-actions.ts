'use server';

// Server actions placeholder for future admin workflows.
import { headers } from 'next/headers';

import {
  ACTION_RATE_LIMIT,
  ACTION_RATE_WINDOW_MS,
} from '@/lib/constants/actions';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, getPortalIdentity } from '@/lib/portal-auth';
import { hasPermission, writeAuditLog } from '@/lib/access-db';
import { isHomeDeployment } from '@/lib/env';

// Supported admin intents (stubbed for now).
type ServiceAction = 'restart' | 'reset-password';

// Normalized result for UI feedback.
export type ActionResult =
  | { ok: true }
  | { ok: false; error: 'not_available' | 'not_implemented' | 'invalid' };

/**
 * Validate, authorize, and audit a requested administrative action against a service, enforcing rate limits and returning the action's availability or implementation status.
 *
 * @param input - Object describing the requested action
 * @param input.serviceId - Identifier of the target service
 * @param input.action - Administrative action to perform (`ServiceAction`)
 * @returns `{ ok: true }` on success; otherwise `{ ok: false, error: 'not_available' | 'not_implemented' | 'invalid' }`
 */
export async function requestServiceAction(input: {
  serviceId: string;
  action: ServiceAction;
}): Promise<ActionResult> {
  if (!isHomeDeployment()) {
    return { ok: false, error: 'not_available' };
  }

  if (!input.serviceId || !input.action) {
    return { ok: false, error: 'invalid' };
  }

  const requestHeaders = await headers();
  const identity = getPortalIdentity(requestHeaders);
  const ip = getClientIp(requestHeaders);

  if (!identity) {
    return { ok: false, error: 'not_available' };
  }

  const rateKey = identity.login ?? ip ?? 'unknown';
  const rate = checkRateLimit(rateKey, {
    limit: ACTION_RATE_LIMIT,
    windowMs: ACTION_RATE_WINDOW_MS,
  });
  if (!rate.allowed) {
    writeAuditLog({
      actorLogin: identity.login,
      actorName: identity.name,
      action: input.action,
      serviceId: input.serviceId,
      result: 'rate_limited',
      durationMs: 0,
      ip,
    });
    return { ok: false, error: 'not_available' };
  }

  if (!hasPermission(identity.login, 'actions:run')) {
    writeAuditLog({
      actorLogin: identity.login,
      actorName: identity.name,
      action: input.action,
      serviceId: input.serviceId,
      result: 'forbidden',
      durationMs: 0,
      ip,
    });
    return { ok: false, error: 'not_available' };
  }

  writeAuditLog({
    actorLogin: identity.login,
    actorName: identity.name,
    action: input.action,
    serviceId: input.serviceId,
    result: 'not_implemented',
    durationMs: 0,
    ip,
  });

  return { ok: false, error: 'not_implemented' };
}