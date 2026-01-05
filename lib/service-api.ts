// Shared helpers for service API URL building.
import { HOME_URL } from '@/lib/env';
import { services, type ServiceId } from '@/lib/services';

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

const resolveService = (serviceId: ServiceId) =>
  services.find((service) => service.id === serviceId);

// Build a full URL for a proxied service API call.
export const buildServiceApiUrl = (
  serviceId: ServiceId,
  endpoint: string,
  params?: Record<string, string>
) => {
  const service = resolveService(serviceId);
  if (!service) {
    return null;
  }

  const base = trimTrailingSlashes(HOME_URL);
  const pathSegment = normalizeSegment(service.path);
  const endpointSegment = normalizeSegment(endpoint);
  const url = new URL(`${base}/${pathSegment}/${endpointSegment}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
};
