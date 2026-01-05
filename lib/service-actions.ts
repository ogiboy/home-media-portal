import { HOME_URL } from '@/lib/env';
import {
  services,
  type ServiceDefinition,
  type ServiceId,
} from '@/lib/services';
import { ACTION_RETRY_LIMIT, ACTION_TIMEOUT_MS } from '@/lib/constants/actions';
import { writeAuditLog } from '@/lib/access-db';

export type ServiceActionId =
  | 'healthcheck'
  | 'sync'
  | 'rescan'
  | 'search'
  | 'test';

export type ServiceActionResult = {
  ok: boolean;
  status: number | null;
  durationMs: number;
  error?: string;
};

type ServiceActionDefinition = {
  method: 'GET' | 'POST';
  endpoint?: string | null;
  requiresKey?: boolean;
  description: string;
};

const trimLeadingSlashes = (value: string) => {
  let index = 0;
  while (index < value.length && value[index] === '/') {
    index += 1;
  }
  return value.slice(index);
};

const trimTrailingSlashes = (value: string) => {
  let end = value.length;
  while (end > 0 && value[end - 1] === '/') {
    end -= 1;
  }
  return value.slice(0, end);
};

const normalizeSegment = (value: string) =>
  trimTrailingSlashes(trimLeadingSlashes(value));

const buildServiceUrl = (
  origin: string,
  servicePath: string,
  endpoint: string
) => {
  const base = trimTrailingSlashes(origin);
  const pathSegment = normalizeSegment(servicePath);
  const endpointSegment = normalizeSegment(endpoint);
  if (!pathSegment) {
    return base;
  }
  if (!endpointSegment) {
    return `${base}/${pathSegment}`;
  }
  return `${base}/${pathSegment}/${endpointSegment}`;
};

const resolveService = (serviceId: string): ServiceDefinition | undefined =>
  services.find((service) => service.id === serviceId);

const getServiceApiKey = (serviceId: ServiceId) => {
  switch (serviceId) {
    case 'radarr':
      return process.env.RADARR_API_KEY;
    case 'sonarr':
      return process.env.SONARR_API_KEY;
    case 'prowlarr':
      return process.env.PROWLARR_API_KEY;
    case 'bazarr':
      return process.env.BAZARR_API_KEY;
    case 'jellyfin':
      return process.env.JELLYFIN_API_KEY;
    default:
      return undefined;
  }
};

const ACTIONS: Record<
  ServiceId,
  Partial<Record<ServiceActionId, ServiceActionDefinition>>
> = {
  jellyfin: {
    healthcheck: {
      method: 'GET',
      endpoint: '/System/Info/Public',
      description: 'Jellyfin public system info',
    },
    // Pending verification: Jellyfin API endpoints for library refresh.
    sync: {
      method: 'POST',
      endpoint: null,
      requiresKey: true,
      description: 'Pending verification: Jellyfin library refresh endpoint',
    },
  },
  radarr: {
    healthcheck: {
      method: 'GET',
      endpoint: '/api/v3/system/status',
      requiresKey: true,
      description: 'Radarr system status (OpenAPI v3)',
    },
    test: {
      method: 'GET',
      endpoint: '/api/v3/health',
      requiresKey: true,
      description: 'Radarr health check (OpenAPI v3)',
    },
    // Pending verification: Radarr rescan endpoints from official docs.
    rescan: {
      method: 'POST',
      endpoint: null,
      requiresKey: true,
      description: 'Pending verification: Radarr rescan endpoint',
    },
  },
  sonarr: {
    healthcheck: {
      method: 'GET',
      endpoint: '/api/v3/system/status',
      requiresKey: true,
      description: 'Sonarr system status (OpenAPI v3)',
    },
    test: {
      method: 'GET',
      endpoint: '/api/v3/health',
      requiresKey: true,
      description: 'Sonarr health check (OpenAPI v3)',
    },
    // Pending verification: Sonarr rescan endpoints from official docs.
    rescan: {
      method: 'POST',
      endpoint: null,
      requiresKey: true,
      description: 'Pending verification: Sonarr rescan endpoint',
    },
  },
  prowlarr: {
    healthcheck: {
      method: 'GET',
      endpoint: '/api/v1/system/status',
      requiresKey: true,
      description: 'Prowlarr system status (OpenAPI v1)',
    },
    test: {
      method: 'GET',
      endpoint: '/api/v1/health',
      requiresKey: true,
      description: 'Prowlarr health check (OpenAPI v1)',
    },
    // Pending verification: Prowlarr sync endpoints from official docs.
    sync: {
      method: 'POST',
      endpoint: null,
      requiresKey: true,
      description: 'Pending verification: Prowlarr sync endpoint',
    },
  },
  bazarr: {
    // Pending verification: Bazarr refresh endpoints from official docs.
    sync: {
      method: 'POST',
      endpoint: null,
      requiresKey: true,
      description: 'Pending verification: Bazarr sync endpoint',
    },
  },
  qbittorrent: {},
};

const fetchWithTimeout = async (url: string, init: RequestInit) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ACTION_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      redirect: 'manual',
    });
  } finally {
    clearTimeout(timer);
  }
};

const attemptAction = async (url: string, init: RequestInit) => {
  const start = Date.now();
  try {
    const response = await fetchWithTimeout(url, init);
    const durationMs = Date.now() - start;
    if (response.status >= 300 && response.status < 400) {
      return {
        ok: false,
        status: response.status,
        durationMs,
        error: `redirect:${response.headers.get('location') ?? ''}`,
      } as ServiceActionResult;
    }

    return {
      ok: response.ok,
      status: response.status,
      durationMs,
    } as ServiceActionResult;
  } catch (error) {
    return {
      ok: false,
      status: null,
      durationMs: Date.now() - start,
      error: error instanceof Error ? error.message : 'unknown_error',
    } as ServiceActionResult;
  }
};

export const runServiceAction = async (input: {
  serviceId: string;
  action: ServiceActionId;
  actorLogin?: string;
  actorName?: string;
  ip?: string;
}) => {
  const service = resolveService(input.serviceId);
  if (!service) {
    return {
      ok: false,
      status: null,
      durationMs: 0,
      error: 'unknown_service',
    } as ServiceActionResult;
  }

  const definition = ACTIONS[service.id]?.[input.action];
  if (!definition?.endpoint) {
    writeAuditLog({
      actorLogin: input.actorLogin,
      actorName: input.actorName,
      action: input.action,
      serviceId: service.id,
      result: 'not_implemented',
      durationMs: 0,
      ip: input.ip,
      metaJson: JSON.stringify({ note: 'Pending verification: endpoint' }),
    });
    return {
      ok: false,
      status: null,
      durationMs: 0,
      error: 'not_implemented',
    } as ServiceActionResult;
  }

  const url = buildServiceUrl(HOME_URL, service.path, definition.endpoint);
  const headers: Record<string, string> = {};
  if (definition.requiresKey) {
    const apiKey = getServiceApiKey(service.id);
    if (!apiKey) {
      writeAuditLog({
        actorLogin: input.actorLogin,
        actorName: input.actorName,
        action: input.action,
        serviceId: service.id,
        result: 'missing_api_key',
        durationMs: 0,
        ip: input.ip,
      });
      return {
        ok: false,
        status: null,
        durationMs: 0,
        error: 'missing_api_key',
      } as ServiceActionResult;
    }

    headers['X-Api-Key'] = apiKey;
  }

  const init: RequestInit = {
    method: definition.method,
    headers,
  };

  let result: ServiceActionResult = { ok: false, status: null, durationMs: 0 };
  for (let attempt = 0; attempt <= ACTION_RETRY_LIMIT; attempt += 1) {
    result = await attemptAction(url, init);
    if (result.ok) {
      break;
    }
  }

  writeAuditLog({
    actorLogin: input.actorLogin,
    actorName: input.actorName,
    action: input.action,
    serviceId: service.id,
    result: result.ok ? 'ok' : result.error ?? 'error',
    durationMs: result.durationMs,
    ip: input.ip,
    metaJson: JSON.stringify({ status: result.status, url }),
  });

  return result;
};
