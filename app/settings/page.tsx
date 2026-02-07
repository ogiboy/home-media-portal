import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';

import PortalApp from '@/components/portal-app';
import { isHomeDeployment } from '@/lib/env';
import { getPortalIdentity } from '@/lib/portal-auth';

export default async function SettingsPage() {
  if (!isHomeDeployment()) {
    forbidden();
  }

  // In local development, allow navigating to settings without tailnet identity.
  // The actual RBAC/identity path is exercised in home deployment behind Caddy.
  if (process.env.NODE_ENV === 'development') {
    return <PortalApp view="settings" />;
  }

  const requestHeaders = await headers();
  const identity = getPortalIdentity(requestHeaders);
  if (!identity) {
    forbidden();
  }

  return <PortalApp view="settings" />;
}
