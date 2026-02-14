'use client';

// Floating chat button that opens the chat popup.
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useSyncExternalStore } from 'react';

import { chatStore, toggleChat } from '@/lib/chat-store';
import type { PortalStrings } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type ChatFloatButtonProps = {
  strings: PortalStrings;
  className?: string;
};

export default function ChatFloatButton({
  strings,
  className,
}: Readonly<ChatFloatButtonProps>) {
  const { isOpen } = useSyncExternalStore(
    chatStore.subscribe,
    chatStore.getSnapshot,
    chatStore.getServerSnapshot,
  );

  const handleClick = () => {
    toggleChat(strings.chat.welcome);
  };

  return (
    <motion.div
      className={cn('fixed bottom-6 right-6 z-50', className)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.button
            key="close"
            type="button"
            onClick={handleClick}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-foreground shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            aria-label={strings.accessibility.dialogClose}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <X className="h-6 w-6" />
          </motion.button>
        ) : (
          <motion.button
            key="open"
            type="button"
            onClick={handleClick}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_32px_rgba(54,116,181,0.4)] transition-shadow hover:shadow-[0_12px_40px_rgba(54,116,181,0.5)]"
            aria-label={strings.chat.title}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
