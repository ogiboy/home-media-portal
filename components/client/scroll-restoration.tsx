'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const positions = new Map<string, number>();

const buildKey = (pathname: string, searchParams: URLSearchParams) => {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
};

/**
 * Restores scroll position per route and keeps the position updated as the user scrolls.
 */
export default function ScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = useMemo(
    () => buildKey(pathname, new URLSearchParams(searchParams.toString())),
    [pathname, searchParams]
  );

  useEffect(() => {
    const stored = positions.get(key);
    if (stored !== undefined) {
      globalThis.scrollTo({ top: stored, behavior: 'auto' });
    }

    const onScroll = () => {
      positions.set(key, globalThis.scrollY);
    };

    globalThis.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      globalThis.removeEventListener('scroll', onScroll);
    };
  }, [key]);

  return null;
}
