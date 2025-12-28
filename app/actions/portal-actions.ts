'use server';

// Server actions placeholder for future admin workflows.
import { isHomeDeployment } from '@/lib/env';

// Supported admin intents (stubbed for now).
type ServiceAction = 'restart' | 'reset-password';

// Normalized result for UI feedback.
export type ActionResult =
  | { ok: true }
  | { ok: false; error: 'not_available' | 'not_implemented' | 'invalid' };

// Validate and queue a future admin action.
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

  return { ok: false, error: 'not_implemented' };
}
