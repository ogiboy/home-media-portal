// Shared animation helpers for the portal shell.
import type { CSSProperties } from 'react';

// Create a CSS custom-property delay for staggered entrances.
export const withDelay = (delay: number): CSSProperties =>
  ({ '--delay': `${delay}ms` } as CSSProperties);
