'use server';

// Server actions for service API triggers with RBAC and rate limiting.
import { headers } from 'next/headers';

import {
  ACTION_RATE_LIMIT,
  ACTION_RATE_WINDOW_MS,
} from '@/lib/constants/actions';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, getPortalIdentity } from '@/lib/portal-auth';
import { hasPermission, writeAuditLog } from '@/lib/access-db';
import { isHomeDeployment } from '@/lib/env';
import {
  runServiceAction,
  type ServiceActionId,
  type ServiceActionResult,
} from '@/lib/service-actions';

export type ServiceActionResponse = ServiceActionResult;

/**
 * Validate request context, enforce rate limits and RBAC, and invoke the specified service action.
 *
 * @param input.serviceId - Identifier of the target service
 * @param input.action - The action to perform on the service
 * @returns A ServiceActionResponse describing the outcome. On failure the `error` field may be `'not_available'`, `'rate_limited'`, or `'forbidden'`; on success it contains the action result and timing fields. 
 */
export async function triggerServiceAction(input: {
  serviceId: string;
  action: ServiceActionId;
}): Promise<ServiceActionResponse> {
  if (!isHomeDeployment()) {
    return { ok: false, status: null, durationMs: 0, error: 'not_available' };
  }

  const requestHeaders = await headers();
  const identity = getPortalIdentity(requestHeaders);
  const ip = getClientIp(requestHeaders);

  if (!identity) {
    return { ok: false, status: null, durationMs: 0, error: 'not_available' };
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
    return { ok: false, status: null, durationMs: 0, error: 'rate_limited' };
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
    return { ok: false, status: null, durationMs: 0, error: 'forbidden' };
  }

  return runServiceAction({
    serviceId: input.serviceId,
    action: input.action,
    actorLogin: identity.login,
    actorName: identity.name,
    ip,
  });
}