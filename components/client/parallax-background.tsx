'use client';

import { useEffect, useState } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';

/**
 * React-Spring based parallax background layers.
 * Properly configured to work with page scroll.
 */
export default function ParallaxBackground() {
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const updatePages = () => {
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = globalThis.window.innerHeight;
      const calculatedPages = Math.max(1, docHeight / viewportHeight);
      setPages(calculatedPages);
    };

    updatePages();
    globalThis.window.addEventListener('resize', updatePages);

    const timer = setTimeout(updatePages, 100);

    return () => {
      globalThis.window.removeEventListener('resize', updatePages);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <Parallax
        pages={pages}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <ParallaxLayer offset={0} speed={0.2} style={{ pointerEvents: 'none' }}>
          <div className="absolute inset-0">
            <div className="portal-backdrop-layer portal-backdrop-stars" />
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.5} style={{ pointerEvents: 'none' }}>
          <div className="absolute inset-0">
            <div className="portal-backdrop-layer portal-backdrop-aurora" />
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.8} style={{ pointerEvents: 'none' }}>
          <div className="absolute inset-0">
            <div className="portal-backdrop-layer portal-backdrop-glow" />
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.3} style={{ pointerEvents: 'none' }}>
          <div className="absolute inset-0 portal-grid opacity-60" />
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.6} style={{ pointerEvents: 'none' }}>
          <div className="portal-orb portal-orb--a" />
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.9} style={{ pointerEvents: 'none' }}>
          <div className="portal-orb portal-orb--b" />
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.7} style={{ pointerEvents: 'none' }}>
          <div className="portal-orb portal-orb--c" />
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.4} style={{ pointerEvents: 'none' }}>
          <div className="portal-cosmic">
            <span className="portal-cosmic-item" style={{ top: '14%', left: '12%' }}>
              ✦
            </span>
            <span className="portal-cosmic-item" style={{ top: '82%', left: '45%' }}>
              ✺
            </span>
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.7} style={{ pointerEvents: 'none' }}>
          <div className="portal-cosmic">
            <span className="portal-cosmic-item" style={{ top: '28%', right: '16%' }}>
              ✶
            </span>
            <span className="portal-cosmic-item" style={{ top: '72%', right: '18%' }}>
              ✹
            </span>
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={1} style={{ pointerEvents: 'none' }}>
          <div className="portal-cosmic">
            <span className="portal-cosmic-item" style={{ top: '62%', left: '8%' }}>
              ✷
            </span>
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}
