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

export const getServiceHealth = (
  data: HealthResponse | undefined,
  id: string
) => data?.services.find((service) => service.id === id);
