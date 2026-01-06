// Lightweight toast store for client-side notifications.
import { TOAST_DURATION_MS, TOAST_MAX } from "@/lib/constants/toast";

export type ToastTone = "info" | "success" | "warning" | "error";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
  durationMs: number;
  createdAt: number;
};

export type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  durationMs?: number;
};

const listeners = new Set<(toasts: Toast[]) => void>();
let toasts: Toast[] = [];

const notify = () => {
  listeners.forEach((listener) => listener(toasts));
};

const createId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(8);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  return `${Date.now()}-${globalThis.performance?.now() ?? 0}`;
};

const serverSnapshot: Toast[] = [];

// Subscribe to toast updates for the viewport.
export const toastStore = {
  subscribe: (listener: (toasts: Toast[]) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => toasts,
  getServerSnapshot: () => serverSnapshot,
};

// Remove a toast by ID.
export const dismissToast = (id: string) => {
  toasts = toasts.filter((toast) => toast.id !== id);
  notify();
};

// Push a new toast to the queue and auto-dismiss after a delay.
export const pushToast = (input: ToastInput) => {
  if (!("window" in globalThis)) {
    return undefined;
  }

  const toast: Toast = {
    id: createId(),
    title: input.title,
    description: input.description,
    tone: input.tone ?? "info",
    durationMs: input.durationMs ?? TOAST_DURATION_MS,
    createdAt: Date.now(),
  };

  toasts = [toast, ...toasts].slice(0, TOAST_MAX);
  notify();

  globalThis.setTimeout(() => dismissToast(toast.id), toast.durationMs);
  return toast.id;
};
