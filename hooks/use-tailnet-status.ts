"use client";

// Client hook for tailnet reachability checks via image ping.
import { useEffect, useMemo, useState } from "react";

import {
  TAILNET_PING_INTERVAL_MS,
  TAILNET_PING_TIMEOUT_MS,
} from "@/lib/constants/polling";

export type TailnetStatus = "connecting" | "online" | "offline";

type Options = {
  timeoutMs?: number;
  intervalMs?: number;
};

type TailnetState = {
  status: TailnetStatus;
  lastChecked: number | null;
};

type Config = {
  homeUrl: string;
  timeoutMs: number;
  intervalMs: number;
};

const listeners = new Set<(state: TailnetState) => void>();
let state: TailnetState = { status: "connecting", lastChecked: null };
let config: Config = {
  homeUrl: "",
  timeoutMs: TAILNET_PING_TIMEOUT_MS,
  intervalMs: TAILNET_PING_INTERVAL_MS,
};
let intervalId: ReturnType<typeof globalThis.setInterval> | null = null;
let inFlight = false;

// Notify all subscribers about the latest state.
const notify = () => {
  listeners.forEach((listener) => listener(state));
};

// Update shared state and trigger listeners.
const setState = (next: TailnetState) => {
  if (next.status === state.status && next.lastChecked === state.lastChecked) {
    return;
  }
  state = next;
  notify();
};

// Start polling if needed.
const startPolling = () => {
  if (intervalId !== null) {
    return;
  }
  probe();
  intervalId = globalThis.setInterval(probe, config.intervalMs);
};

// Stop polling when no listeners are active.
const stopPolling = () => {
  if (intervalId !== null && listeners.size === 0) {
    globalThis.clearInterval(intervalId);
    intervalId = null;
  }
};

// Refresh polling configuration.
const updateConfig = (next: Config) => {
  const changed =
    next.homeUrl !== config.homeUrl ||
    next.timeoutMs !== config.timeoutMs ||
    next.intervalMs !== config.intervalMs;

  config = next;

  if (changed && intervalId !== null) {
    globalThis.clearInterval(intervalId);
    intervalId = null;
  }

  if (listeners.size > 0) {
    startPolling();
  }
};

// Perform a single reachability probe.
const probe = () => {
  if (inFlight) {
    return;
  }
  const { homeUrl, timeoutMs } = config;
  if (!homeUrl) {
    setState({ status: "offline", lastChecked: Date.now() });
    return;
  }

  inFlight = true;

  if (state.status !== "online") {
    setState({ status: "connecting", lastChecked: state.lastChecked });
  }

  let done = false;
  const img = new Image();
  const timer = globalThis.setTimeout(() => {
    if (done) {
      return;
    }
    done = true;
    inFlight = false;
    setState({ status: "offline", lastChecked: Date.now() });
  }, timeoutMs);

  img.onload = () => {
    if (done) {
      return;
    }
    done = true;
    inFlight = false;
    globalThis.clearTimeout(timer);
    setState({ status: "online", lastChecked: Date.now() });
  };

  img.onerror = () => {
    if (done) {
      return;
    }
    done = true;
    inFlight = false;
    globalThis.clearTimeout(timer);
    setState({ status: "offline", lastChecked: Date.now() });
  };

  img.src = `${homeUrl.replace(/\/$/, "")}/ping.png?ts=${Date.now()}`;
};

// Hook for subscribing to tailnet reachability changes.
export function useTailnetStatus(homeUrl: string, options: Options = {}) {
  const stableConfig = useMemo(
    () => ({
      homeUrl,
      timeoutMs: options.timeoutMs ?? TAILNET_PING_TIMEOUT_MS,
      intervalMs: options.intervalMs ?? TAILNET_PING_INTERVAL_MS,
    }),
    [homeUrl, options.intervalMs, options.timeoutMs]
  );

  const [snapshot, setSnapshot] = useState<TailnetState>(() => state);

  useEffect(() => {
    const listener = (next: TailnetState) => {
      setSnapshot(next);
    };

    listeners.add(listener);
    updateConfig(stableConfig);
    startPolling();

    return () => {
      listeners.delete(listener);
      stopPolling();
    };
  }, [stableConfig]);

  return {
    status: snapshot.status,
    lastChecked: snapshot.lastChecked,
    retry: probe,
  };
}
