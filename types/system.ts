export type SystemStats = {
  cpu: {
    load1: number;
    load5: number;
    load15: number;
  };
  memory: {
    totalBytes: number;
    usedBytes: number;
  };
  disk: {
    totalBytes: number | null;
    usedBytes: number | null;
    usedPercent: number | null;
  };
  uptimeSec: number;
  temperatureC: number | null;
  checkedAt: string;
};
