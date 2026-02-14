'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

type SidebarFloatProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Applies a subtle delayed scroll follow to the sidebar container.
 */
export default function SidebarFloat({ children, className }: SidebarFloatProps) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const yRaw = useTransform(scrollY, [0, 1200], [0, 22]);
  const y = useSpring(yRaw, { mass: 0.25, stiffness: 120, damping: 20 });

  return (
    <motion.div className={className} style={{ y: shouldReduceMotion ? 0 : y }}>
      {children}
    </motion.div>
  );
}
