import os from "node:os";
import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";

import type { SystemStats } from "@/types/system";
import { SYSTEM_CACHE_TTL_MS } from "@/lib/constants/system";

const exec = promisify(execCallback);

// Simple in-memory cache to avoid hammering system calls.
let cache: { data: SystemStats; ts: number } | null = null;

// Read disk usage via df for the root partition.
const getDiskUsage = async () => {
  try {
    const { stdout } = await exec("df -k /", { timeout: 1200 });
    const lines = stdout.trim().split("\n");
    if (lines.length < 2) {
      return null;
    }
    const lastLine = lines.at(-1);
    if (!lastLine) {
      return null;
    }
    const parts = lastLine.trim().split(/\s+/);
    if (parts.length < 5) {
      return null;
    }
    const totalKb = Number(parts[1]);
    const usedKb = Number(parts[2]);
    const usedPercent = Number(parts[4].replace("%", ""));
    if (Number.isNaN(totalKb) || Number.isNaN(usedKb)) {
      return null;
    }
    return {
      totalBytes: totalKb * 1024,
      usedBytes: usedKb * 1024,
      usedPercent: Number.isNaN(usedPercent) ? null : usedPercent,
    };
  } catch {
    return null;
  }
};

// Read CPU temperature from thermal zone when available.
const getCpuTemp = async () => {
  try {
    const raw = await fs.readFile(
      "/sys/class/thermal/thermal_zone0/temp",
      "utf8"
    );
    const parsed = Number(raw.trim());
    if (Number.isNaN(parsed)) {
      return null;
    }
    return parsed > 1000 ? parsed / 1000 : parsed;
  } catch {
    return null;
  }
};

// Compute a system stats snapshot with a short cache window.
export const getSystemStats = async (): Promise<SystemStats> => {
  const now = Date.now();
  if (cache && now - cache.ts < SYSTEM_CACHE_TTL_MS) {
    return cache.data;
  }

  const [load1, load5, load15] = os.loadavg();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const disk = await getDiskUsage();
  const temperatureC = await getCpuTemp();

  const data: SystemStats = {
    cpu: {
      load1,
      load5,
      load15,
    },
    memory: {
      totalBytes: totalMem,
      usedBytes: totalMem - freeMem,
    },
    disk: {
      totalBytes: disk?.totalBytes ?? null,
      usedBytes: disk?.usedBytes ?? null,
      usedPercent: disk?.usedPercent ?? null,
    },
    uptimeSec: os.uptime(),
    temperatureC,
    checkedAt: new Date().toISOString(),
  };

  cache = { data, ts: now };
  return data;
};
