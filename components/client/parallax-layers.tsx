'use client';

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

const springConfig = { mass: 0.2, stiffness: 120, damping: 20 };

/**
 * Render fixed parallax layers driven by the page scroll position.
 */
export default function ParallaxLayers() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const ySlow = useSpring(useTransform(scrollY, [0, 1200], [0, 24]), springConfig);
  const yMid = useSpring(useTransform(scrollY, [0, 1200], [0, 42]), springConfig);
  const yFast = useSpring(useTransform(scrollY, [0, 1200], [0, 64]), springConfig);

  const xLeft = useSpring(useTransform(scrollY, [0, 1200], [0, -32]), springConfig);
  const xRight = useSpring(useTransform(scrollY, [0, 1200], [0, 28]), springConfig);
  const xTiny = useSpring(useTransform(scrollY, [0, 1200], [0, 16]), springConfig);

  const reduce = shouldReduceMotion;

  return (
    <>
      <div className="portal-backdrop" aria-hidden="true">
        <motion.div
          className="portal-backdrop-layer portal-backdrop-stars"
          style={{ y: reduce ? 0 : ySlow, x: reduce ? 0 : xLeft }}
        />
        <motion.div
          className="portal-backdrop-layer portal-backdrop-aurora"
          style={{ y: reduce ? 0 : yMid, x: reduce ? 0 : xRight }}
        />
        <motion.div
          className="portal-backdrop-layer portal-backdrop-glow"
          style={{ y: reduce ? 0 : yFast, x: reduce ? 0 : xTiny }}
        />
      </div>

      <motion.div
        className="pointer-events-none fixed inset-0 portal-grid opacity-60"
        aria-hidden="true"
        style={{ y: reduce ? 0 : ySlow, x: reduce ? 0 : xTiny }}
      />

      <motion.div
        className="portal-orb portal-orb--a"
        style={{ y: reduce ? 0 : yMid, x: reduce ? 0 : xLeft }}
      />
      <motion.div
        className="portal-orb portal-orb--b"
        style={{ y: reduce ? 0 : yFast, x: reduce ? 0 : xRight }}
      />
      <motion.div
        className="portal-orb portal-orb--c"
        style={{ y: reduce ? 0 : yMid, x: reduce ? 0 : xTiny }}
      />

      <div className="portal-cosmic" aria-hidden="true">
        <motion.span
          className="portal-cosmic-item portal-cosmic-item--slow"
          style={{ top: '14%', left: '12%', y: reduce ? 0 : ySlow, x: reduce ? 0 : xLeft }}
        >
          ✦
        </motion.span>
        <motion.span
          className="portal-cosmic-item"
          style={{ top: '28%', right: '16%', y: reduce ? 0 : yMid, x: reduce ? 0 : xRight }}
        >
          ✶
        </motion.span>
        <motion.span
          className="portal-cosmic-item portal-cosmic-item--fast"
          style={{ top: '62%', left: '8%', y: reduce ? 0 : yFast, x: reduce ? 0 : xLeft }}
        >
          ✷
        </motion.span>
        <motion.span
          className="portal-cosmic-item"
          style={{ top: '72%', right: '18%', y: reduce ? 0 : yMid, x: reduce ? 0 : xRight }}
        >
          ✹
        </motion.span>
        <motion.span
          className="portal-cosmic-item portal-cosmic-item--slow"
          style={{ top: '82%', left: '45%', y: reduce ? 0 : ySlow, x: reduce ? 0 : xTiny }}
        >
          ✺
        </motion.span>
      </div>
    </>
  );
}
