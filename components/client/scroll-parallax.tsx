'use client';

// Passive scroll listener for simple parallax on background layers.
import { useEffect } from 'react';

// Update a CSS variable based on scroll position.
export default function ScrollParallax() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      root.style.setProperty('--portal-scroll-y', `${globalThis.scrollY}px`);
    };

    const onScroll = () => {
      if (frame) {
        return;
      }
      frame = globalThis.requestAnimationFrame(update);
    };

    update();
    globalThis.addEventListener('scroll', onScroll, { passive: true });
    globalThis.addEventListener('resize', onScroll);

    return () => {
      globalThis.removeEventListener('scroll', onScroll);
      globalThis.removeEventListener('resize', onScroll);
      if (frame) {
        globalThis.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return null;
}
