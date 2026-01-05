import {
  DEPLOY_TARGET,
  PORTAL_INTERNAL_SECRET,
  PORTAL_TRUSTED_PROXIES,
} from '@/lib/env';
import { getRoleForLogin, upsertUser } from '@/lib/access-db';

export type PortalIdentity = {
  login: string;
  name?: string;
  tailnet?: string;
  role: 'public' | 'admin';
};

const normalizeHeader = (value?: string | null) =>
  value?.trim() ? value.trim() : undefined;

const parseForwardedFor = (header?: string | null) =>
  header
    ? header
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
    : [];

const trustedProxySet = new Set(
  PORTAL_TRUSTED_PROXIES.split(',').map((item) => item.trim())
);

// Resolve the client IP for audit or rate limiting (not identity).
export const getClientIp = (headers: Headers) => {
  const forwarded = parseForwardedFor(headers.get('x-forwarded-for'));
  if (forwarded.length > 0) {
    return forwarded[0];
  }
  return normalizeHeader(headers.get('x-real-ip')) ?? undefined;
};

// Determine whether the request can trust portal identity headers.
export const isTrustedPortalRequest = (headers: Headers) => {
  if (DEPLOY_TARGET !== 'home') {
    return false;
  }

  const secret = normalizeHeader(headers.get('x-portal-internal-secret'));
  if (!secret || secret !== PORTAL_INTERNAL_SECRET) {
    return false;
  }

  const forwarded = parseForwardedFor(headers.get('x-forwarded-for'));
  const proxyIp = forwarded.length > 1 ? forwarded.at(-1) : undefined;
  const proxyTrusted = proxyIp ? trustedProxySet.has(proxyIp) : false;

  const trustedHeader =
    normalizeHeader(headers.get('x-portal-trusted')) === '1';
  return proxyTrusted || trustedHeader;
};

// Resolve a portal identity using canonical headers when trusted.
export const getPortalIdentity = (headers: Headers): PortalIdentity | null => {
  if (!isTrustedPortalRequest(headers)) {
    return null;
  }

  const login = normalizeHeader(headers.get('x-portal-user'));
  if (!login) {
    return null;
  }

  const name = normalizeHeader(headers.get('x-portal-username'));
  const tailnet = normalizeHeader(headers.get('x-portal-tailnet'));
  const role = getRoleForLogin(login);

  upsertUser({ login, displayName: name, tailnetId: tailnet });

  return {
    login,
    name,
    tailnet,
    role,
  };
};
