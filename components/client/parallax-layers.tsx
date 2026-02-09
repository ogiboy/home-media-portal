'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const scaleY = (value: number, factor: number) => value * factor;

/**
 * Render fixed parallax layers driven by the page scroll position.
 */
export default function ParallaxLayers() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const starsY = useTransform(scrollY, (value) => scaleY(value, 0.16));
  const auroraY = useTransform(scrollY, (value) => scaleY(value, 0.34));
  const glowY = useTransform(scrollY, (value) => scaleY(value, 0.34));
  const gridY = useTransform(scrollY, (value) => scaleY(value, 0.18));
  const orbY = useTransform(scrollY, (value) => scaleY(value, 0.2));
  const cosmicY = useTransform(scrollY, (value) => scaleY(value, 0.18));
  const cosmicSlowY = useTransform(scrollY, (value) => scaleY(value, 0.1));
  const cosmicFastY = useTransform(scrollY, (value) => scaleY(value, 0.34));

  const reduce = shouldReduceMotion ? 0 : undefined;

  return (
    <>
      <div className="portal-backdrop" aria-hidden="true">
        <motion.div
          className="portal-backdrop-layer portal-backdrop-stars"
          style={{ y: reduce ?? starsY }}
        />
        <motion.div
          className="portal-backdrop-layer portal-backdrop-aurora"
          style={{ y: reduce ?? auroraY }}
        />
        <motion.div
          className="portal-backdrop-layer portal-backdrop-glow"
          style={{ y: reduce ?? glowY }}
        />
      </div>

      <motion.div
        className="pointer-events-none fixed inset-0 portal-grid opacity-50"
        aria-hidden="true"
        style={{ y: reduce ?? gridY }}
      />

      <motion.div className="portal-orb portal-orb--a" style={{ y: reduce ?? orbY }} />
      <motion.div className="portal-orb portal-orb--b" style={{ y: reduce ?? orbY }} />
      <motion.div className="portal-orb portal-orb--c" style={{ y: reduce ?? orbY }} />

      <div className="portal-cosmic" aria-hidden="true">
        <motion.span
          className="portal-cosmic-item portal-cosmic-item--slow"
          style={{ top: '14%', left: '12%', y: reduce ?? cosmicSlowY }}
        >
          ✦
        </motion.span>
        <motion.span
          className="portal-cosmic-item"
          style={{ top: '28%', right: '16%', y: reduce ?? cosmicY }}
        >
          ✶
        </motion.span>
        <motion.span
          className="portal-cosmic-item portal-cosmic-item--fast"
          style={{ top: '62%', left: '8%', y: reduce ?? cosmicFastY }}
        >
          ✷
        </motion.span>
        <motion.span
          className="portal-cosmic-item"
          style={{ top: '72%', right: '18%', y: reduce ?? cosmicY }}
        >
          ✹
        </motion.span>
        <motion.span
          className="portal-cosmic-item portal-cosmic-item--slow"
          style={{ top: '82%', left: '45%', y: reduce ?? cosmicSlowY }}
        >
          ✺
        </motion.span>
      </div>
    </>
  );
}
