'use server';

import { isHomeDeployment } from '@/lib/env';

type ServiceAction = 'restart' | 'reset-password';

export type ActionResult =
  | { ok: true }
  | { ok: false; error: 'not_available' | 'not_implemented' | 'invalid' };

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
