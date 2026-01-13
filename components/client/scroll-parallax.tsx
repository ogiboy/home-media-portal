'use client';

// Framer Motion powered scroll listener for parallax effects.
import { useEffect, useRef } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';

/**
 * Keeps the CSS variable `--portal-scroll-y` on the document root in sync with the page vertical scroll position.
 */
export default function ScrollParallax() {
  const { scrollY } = useScroll();
  const frameRef = useRef<number | null>(null);
  const applyValue = (value: number) => {
    const next = `${value}px`;
    document.documentElement.style.setProperty('--portal-scroll-y', next);
    document.body?.style.setProperty('--portal-scroll-y', next);
  };

  useMotionValueEvent(scrollY, 'change', (value) => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = requestAnimationFrame(() => {
      applyValue(value);
    });
  });

  useEffect(() => {
    const initial = scrollY.get();
    applyValue(initial);
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [scrollY]);

  return null;
}
