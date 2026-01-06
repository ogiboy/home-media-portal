'use client';

import { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SHOW_AFTER_PX = 320;

type ToTopButtonProps = Readonly<{
  label: string;
}>;

/**
 * Floating scroll-to-top button that appears after the user scrolls down.
 */
export default function ToTopButton({ label }: ToTopButtonProps) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, 'change', (value) => {
    setVisible(value > SHOW_AFTER_PX);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'fixed bottom-6 right-5 z-60 sm:bottom-8 sm:right-8'
          )}
        >
          <Button
            type="button"
            size="icon"
            aria-label={label}
            onClick={() =>
              globalThis.scrollTo({ top: 0, behavior: 'smooth' })
            }
            className="rounded-full shadow-[0_16px_40px_rgba(15,23,42,0.2)]"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
