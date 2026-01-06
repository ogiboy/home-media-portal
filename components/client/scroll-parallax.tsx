'use client';

// Framer Motion powered scroll listener for parallax effects.
import { useEffect } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';

/**
 * Keeps the CSS variable `--portal-scroll-y` on the document root in sync with the page vertical scroll position.
 */
export default function ScrollParallax() {
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (value) => {
    document.documentElement.style.setProperty('--portal-scroll-y', `${value}px`);
  });

  useEffect(() => {
    const initial = scrollY.get();
    document.documentElement.style.setProperty('--portal-scroll-y', `${initial}px`);
  }, [scrollY]);

  return null;
}
