"use client";

import { useEffect, useMemo, useState } from "react";

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
let config: Config = { homeUrl: "", timeoutMs: 2500, intervalMs: 15000 };
let intervalId: number | null = null;
let inFlight = false;

const notify = () => {
  listeners.forEach((listener) => listener(state));
};

const setState = (next: TailnetState) => {
  if (
    next.status === state.status &&
    next.lastChecked === state.lastChecked
  ) {
    return;
  }
  state = next;
  notify();
};

const startPolling = () => {
  if (intervalId !== null) {
    return;
  }
  probe();
  intervalId = window.setInterval(probe, config.intervalMs);
};

const stopPolling = () => {
  if (intervalId !== null && listeners.size === 0) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
};

const updateConfig = (next: Config) => {
  const changed =
    next.homeUrl !== config.homeUrl ||
    next.timeoutMs !== config.timeoutMs ||
    next.intervalMs !== config.intervalMs;

  config = next;

  if (changed && intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }

  if (listeners.size > 0) {
    startPolling();
  }
};

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
  const timer = window.setTimeout(() => {
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
    window.clearTimeout(timer);
    setState({ status: "online", lastChecked: Date.now() });
  };

  img.onerror = () => {
    if (done) {
      return;
    }
    done = true;
    inFlight = false;
    window.clearTimeout(timer);
    setState({ status: "offline", lastChecked: Date.now() });
  };

  img.src = `${homeUrl.replace(/\/$/, "")}/ping.png?ts=${Date.now()}`;
};

export function useTailnetStatus(homeUrl: string, options: Options = {}) {
  const stableConfig = useMemo(
    () => ({
      homeUrl,
      timeoutMs: options.timeoutMs ?? 2500,
      intervalMs: options.intervalMs ?? 15000,
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

  return { status: snapshot.status, lastChecked: snapshot.lastChecked, retry: probe };
}
