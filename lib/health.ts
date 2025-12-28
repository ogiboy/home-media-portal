// Shared types for health polling and helpers.
export type HealthStatus = {
  id: string;
  ok: boolean;
  status: number | null;
  latencyMs: number | null;
};

export type HealthResponse = {
  services: HealthStatus[];
  checkedAt: string;
};

// Look up a service health entry by ID.
export const getServiceHealth = (
  data: HealthResponse | undefined,
  id: string
) => data?.services.find((service) => service.id === id);
