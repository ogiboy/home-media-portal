'use client';

// Toast viewport rendered at the edge of the portal shell.
import { useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { toastStore, type Toast } from '@/lib/toast-store';

const toneStyles: Record<Toast['tone'], string> = {
  info: 'border-primary/40 bg-primary/10',
  success: 'border-emerald-500/40 bg-emerald-500/10',
  warning: 'border-amber-500/40 bg-amber-500/10',
  error: 'border-rose-500/40 bg-rose-500/10',
};

// Animated toast stack for transient notifications.
export default function ToastViewport() {
  const toasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot
  );

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-80 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3 sm:bottom-6 sm:right-6"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
            className={cn(
              'portal-surface rounded-(--radius) border px-4 py-3 text-sm shadow-[0_16px_40px_rgba(15,23,42,0.18)]',
              toneStyles[toast.tone]
            )}
            role="status"
          >
            <p className="font-semibold text-foreground">{toast.title}</p>
            {toast.description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {toast.description}
              </p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
