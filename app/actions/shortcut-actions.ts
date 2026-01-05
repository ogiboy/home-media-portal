'use server';

// Server actions for shortcuts search/add flow.
import { headers } from 'next/headers';

import { ACTION_RATE_LIMIT, ACTION_RATE_WINDOW_MS } from '@/lib/constants/actions';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, getPortalIdentity } from '@/lib/portal-auth';
import { hasPermission, writeAuditLog } from '@/lib/access-db';
import { isHomeDeployment } from '@/lib/env';
import { buildServiceApiUrl } from '@/lib/service-api';

export type ShortcutService = 'radarr' | 'sonarr';

export type ShortcutResult = {
  id: number;
  title: string;
  year?: number;
  overview?: string;
  poster?: string;
  service: ShortcutService;
};

export type ShortcutSearchState = {
  status: 'idle' | 'success' | 'error';
  error?: 'invalid' | 'not_available' | 'forbidden' | 'missing_api_key' | 'missing_config' | 'unknown';
  results: ShortcutResult[];
  query?: string;
  service?: ShortcutService;
};

export type ShortcutAddResult = {
  ok: boolean;
  error?: 'not_available' | 'forbidden' | 'missing_api_key' | 'missing_config' | 'lookup_failed' | 'request_failed' | 'unknown';
};

const SHORTCUT_TIMEOUT_MS = 6_000;

const fetchWithTimeout = async (url: string, init: RequestInit) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SHORTCUT_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: 'no-store' });
  } finally {
    clearTimeout(timer);
  }
};

const getApiKey = (service: ShortcutService) =>
  service === 'radarr' ? process.env.RADARR_API_KEY : process.env.SONARR_API_KEY;

const getConfig = (service: ShortcutService) => {
  if (service === 'radarr') {
    return {
      rootFolderPath: process.env.RADARR_ROOT_FOLDER ?? '',
      qualityProfileId: Number(process.env.RADARR_QUALITY_PROFILE_ID ?? ''),
      monitor: 'movieOnly',
      searchFor: true,
    };
  }
  return {
    rootFolderPath: process.env.SONARR_ROOT_FOLDER ?? '',
    qualityProfileId: Number(process.env.SONARR_QUALITY_PROFILE_ID ?? ''),
    seasonFolder: process.env.SONARR_SEASON_FOLDER !== 'false',
    monitor: 'all',
    searchFor: true,
  };
};

const resolvePoster = (images: Array<{ coverType?: string; remoteUrl?: string; url?: string }>) =>
  images.find((image) => image.coverType === 'poster')?.remoteUrl ??
  images.find((image) => image.coverType === 'poster')?.url ??
  undefined;

const rateLimitOrReject = (headersList: Headers, identityLogin?: string) => {
  const ip = getClientIp(headersList);
  const key = identityLogin ?? ip ?? 'unknown';
  return {
    ip,
    rate: checkRateLimit(key, { limit: ACTION_RATE_LIMIT, windowMs: ACTION_RATE_WINDOW_MS }),
  };
};

const coerceFormString = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value.trim() : '';

const resolveShortcutService = (value: string): ShortcutService =>
  value === 'sonarr' ? 'sonarr' : 'radarr';


type ShortcutConfig = ReturnType<typeof getConfig>;

type ShortcutAddContext = {
  identity: NonNullable<ReturnType<typeof getPortalIdentity>>;
  ip?: string;
  apiKey: string;
  config: ShortcutConfig;
};

type ShortcutAddContextResult =
  | { ok: true; context: ShortcutAddContext }
  | { ok: false; error: ShortcutAddResult['error'] };

const getShortcutAddContext = async (
  service: ShortcutService
): Promise<ShortcutAddContextResult> => {
  if (!isHomeDeployment()) {
    return { ok: false, error: 'not_available' };
  }

  const requestHeaders = await headers();
  const identity = getPortalIdentity(requestHeaders);
  if (!identity) {
    return { ok: false, error: 'not_available' };
  }

  const { ip, rate } = rateLimitOrReject(requestHeaders, identity.login);
  if (!rate.allowed) {
    writeAuditLog({
      actorLogin: identity.login,
      actorName: identity.name,
      action: 'shortcut_add',
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
      action: 'shortcut_add',
      result: 'forbidden',
      durationMs: 0,
      ip,
    });
    return { ok: false, error: 'forbidden' };
  }

  const apiKey = getApiKey(service);
  if (!apiKey) {
    return { ok: false, error: 'missing_api_key' };
  }

  const config = getConfig(service);
  if (!config.rootFolderPath || Number.isNaN(config.qualityProfileId)) {
    return { ok: false, error: 'missing_config' };
  }

  return {
    ok: true,
    context: {
      identity,
      ip,
      apiKey,
      config,
    },
  };
};

const getLookupRequest = (service: ShortcutService, id: number) => {
  const endpoint =
    service === 'radarr' ? '/api/v3/movie/lookup/tmdb' : '/api/v3/series/lookup';
  const params: Record<string, string> =
    service === 'radarr' ? { tmdbId: String(id) } : { term: `tvdb:${id}` };
  return { endpoint, params };
};

const getAddEndpoint = (service: ShortcutService) =>
  service === 'radarr' ? '/api/v3/movie' : '/api/v3/series';

const parseLookupItem = (data: unknown) => {
  if (Array.isArray(data)) {
    return data[0] as Record<string, unknown> | undefined;
  }
  if (data && typeof data === 'object') {
    return data as Record<string, unknown>;
  }
  return undefined;
};

type LookupResult =
  | { ok: true; item: Record<string, unknown> }
  | { ok: false; status: number | null };

const fetchLookupItem = async (
  url: string,
  apiKey: string
): Promise<LookupResult> => {
  const lookupResponse = await fetchWithTimeout(url, {
    method: 'GET',
    headers: { 'X-Api-Key': apiKey },
  });

  if (!lookupResponse.ok) {
    return { ok: false, status: lookupResponse.status };
  }

  const lookupData = await lookupResponse.json();
  const item = parseLookupItem(lookupData);
  if (!item) {
    return { ok: false, status: null };
  }

  return { ok: true, item };
};

const buildAddPayload = (
  service: ShortcutService,
  item: Record<string, unknown>,
  config: ShortcutConfig
) =>
  service === 'radarr'
    ? {
        title: item.title,
        qualityProfileId: config.qualityProfileId,
        tmdbId: item.tmdbId,
        titleSlug: item.titleSlug,
        images: item.images ?? [],
        year: item.year,
        monitored: true,
        rootFolderPath: config.rootFolderPath,
        addOptions: {
          monitor: config.monitor,
          searchForMovie: config.searchFor,
        },
      }
    : {
        title: item.title,
        qualityProfileId: config.qualityProfileId,
        tvdbId: item.tvdbId,
        titleSlug: item.titleSlug,
        images: item.images ?? [],
        seasons: item.seasons ?? [],
        seasonFolder: config.seasonFolder,
        monitored: true,
        rootFolderPath: config.rootFolderPath,
        addOptions: {
          monitor: config.monitor,
          searchForMissingEpisodes: config.searchFor,
        },
      };

const logShortcutAdd = (params: {
  identity: ShortcutAddContext['identity'];
  ip?: string;
  result: string;
  durationMs: number;
  metaJson?: string;
}) => {
  writeAuditLog({
    actorLogin: params.identity.login,
    actorName: params.identity.name,
    action: 'shortcut_add',
    result: params.result,
    durationMs: params.durationMs,
    ip: params.ip,
    metaJson: params.metaJson,
  });
};

// Lookup Radarr/Sonarr titles using the service API.
export async function searchShortcuts(
  prevState: ShortcutSearchState,
  formData: FormData
): Promise<ShortcutSearchState> {
  if (!isHomeDeployment()) {
    return { ...prevState, status: 'error', error: 'not_available', results: [] };
  }

  const requestHeaders = await headers();
  const identity = getPortalIdentity(requestHeaders);
  if (!identity) {
    return { ...prevState, status: 'error', error: 'not_available', results: [] };
  }

  const { ip, rate } = rateLimitOrReject(requestHeaders, identity.login);
  if (!rate.allowed) {
    writeAuditLog({
      actorLogin: identity.login,
      actorName: identity.name,
      action: 'shortcut_search',
      result: 'rate_limited',
      durationMs: 0,
      ip,
    });
    return { ...prevState, status: 'error', error: 'not_available', results: [] };
  }

  if (!hasPermission(identity.login, 'services:read')) {
    writeAuditLog({
      actorLogin: identity.login,
      actorName: identity.name,
      action: 'shortcut_search',
      result: 'forbidden',
      durationMs: 0,
      ip,
    });
    return { ...prevState, status: 'error', error: 'forbidden', results: [] };
  }

  const query = coerceFormString(formData.get('query'));
  const service = resolveShortcutService(coerceFormString(formData.get('service')));
  if (!query) {
    return { ...prevState, status: 'error', error: 'invalid', results: [] };
  }

  const apiKey = getApiKey(service);
  if (!apiKey) {
    return { ...prevState, status: 'error', error: 'missing_api_key', results: [] };
  }

  const endpoint =
    service === 'radarr'
      ? '/api/v3/movie/lookup'
      : '/api/v3/series/lookup';
  const url = buildServiceApiUrl(service, endpoint, { term: query });
  if (!url) {
    return { ...prevState, status: 'error', error: 'unknown', results: [] };
  }

  const start = Date.now();
  try {
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: { 'X-Api-Key': apiKey },
    });
    const duration = Date.now() - start;

    if (!response.ok) {
      writeAuditLog({
        actorLogin: identity.login,
        actorName: identity.name,
        action: 'shortcut_search',
        result: `http_${response.status}`,
        durationMs: duration,
        ip,
      });
      return { ...prevState, status: 'error', error: 'unknown', results: [] };
    }

    const data = (await response.json()) as Array<Record<string, unknown>>;
    const results: ShortcutResult[] = data
      .map((item) => {
        if (service === 'radarr') {
          const tmdbId = Number(item.tmdbId ?? 0);
          return {
            id: tmdbId,
            title: String(item.title ?? ''),
            year: item.year ? Number(item.year) : undefined,
            overview: item.overview ? String(item.overview) : undefined,
            poster: resolvePoster((item.images ?? []) as Array<{ coverType?: string; remoteUrl?: string; url?: string }>),
            service,
          };
        }
        const tvdbId = Number(item.tvdbId ?? 0);
        return {
          id: tvdbId,
          title: String(item.title ?? ''),
          year: item.year ? Number(item.year) : undefined,
          overview: item.overview ? String(item.overview) : undefined,
          poster: resolvePoster((item.images ?? []) as Array<{ coverType?: string; remoteUrl?: string; url?: string }>),
          service,
        };
      })
      .filter((item) => item.id && item.title);

    writeAuditLog({
      actorLogin: identity.login,
      actorName: identity.name,
      action: 'shortcut_search',
      result: 'ok',
      durationMs: duration,
      ip,
      metaJson: JSON.stringify({ service, query, results: results.length }),
    });

    return { status: 'success', results, query, service };
  } catch (error) {
    writeAuditLog({
      actorLogin: identity.login,
      actorName: identity.name,
      action: 'shortcut_search',
      result: 'error',
      durationMs: Date.now() - start,
      ip,
      metaJson: JSON.stringify({ message: error instanceof Error ? error.message : 'unknown' }),
    });
    return { ...prevState, status: 'error', error: 'unknown', results: [] };
  }
}

// Add a selected item to Radarr/Sonarr using API lookup then POST.
export async function addShortcutItem(input: {
  service: ShortcutService;
  id: number;
}): Promise<ShortcutAddResult> {
  const contextResult = await getShortcutAddContext(input.service);
  if (!contextResult.ok) {
    return { ok: false, error: contextResult.error };
  }

  const { identity, ip, apiKey, config } = contextResult.context;
  const lookupRequest = getLookupRequest(input.service, input.id);
  const lookupUrl = buildServiceApiUrl(
    input.service,
    lookupRequest.endpoint,
    lookupRequest.params
  );
  if (!lookupUrl) {
    return { ok: false, error: 'unknown' };
  }

  const start = Date.now();
  try {
    const lookupResult = await fetchLookupItem(lookupUrl, apiKey);
    if (!lookupResult.ok) {
      if (lookupResult.status !== null) {
        logShortcutAdd({
          identity,
          ip,
          result: `lookup_${lookupResult.status}`,
          durationMs: Date.now() - start,
        });
      }
      return { ok: false, error: 'lookup_failed' };
    }

    const addEndpoint = getAddEndpoint(input.service);
    const addUrl = buildServiceApiUrl(input.service, addEndpoint);
    if (!addUrl) {
      return { ok: false, error: 'unknown' };
    }

    const payload = buildAddPayload(input.service, lookupResult.item, config);

    const addResponse = await fetchWithTimeout(addUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    logShortcutAdd({
      identity,
      ip,
      result: addResponse.ok ? 'ok' : `http_${addResponse.status}`,
      durationMs: Date.now() - start,
      metaJson: JSON.stringify({ service: input.service, id: input.id }),
    });

    if (!addResponse.ok) {
      return { ok: false, error: 'request_failed' };
    }

    return { ok: true };
  } catch (error) {
    logShortcutAdd({
      identity,
      ip,
      result: 'error',
      durationMs: Date.now() - start,
      metaJson: JSON.stringify({
        message: error instanceof Error ? error.message : 'unknown',
      }),
    });
    return { ok: false, error: 'unknown' };
  }
}
