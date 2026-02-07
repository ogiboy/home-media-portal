'use client';

import { useDeferredValue, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Play, Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { PortalStrings } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// Search result shape used when the backend is connected.
type SearchResult = {
  id: string;
  title: string;
  year?: number;
  status: 'downloaded' | 'new';
  source: 'Jellyfin' | 'Radarr' | 'Sonarr';
  kind: 'movie' | 'series';
};

type GlobalSearchPanelProps = Readonly<{
  strings: PortalStrings;
}>;

/**
 * Render a global search panel that unifies library and discovery results.
 */
export default function GlobalSearchPanel({ strings }: GlobalSearchPanelProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasQuery = query.trim().length > 0;
  const isLoading = hasQuery && deferredQuery.trim() !== query.trim();
  const results: SearchResult[] = [];

  const openJellyfin = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('app', 'jellyfin');
    const next = params.toString();
    router.push(next ? `${pathname}?${next}` : pathname);
  };

  const skeletonRows = Array.from({ length: 4 });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={strings.search.placeholder}
            className="h-12 pl-10"
          />
        </div>
        <Button size="sm" className="h-12" type="button">
          {strings.search.cta}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>{strings.search.resultsTitle}</span>
          <span>{strings.search.resultsHint}</span>
        </div>

        {!hasQuery && (
          <p className="text-sm text-muted-foreground">{strings.search.idle}</p>
        )}

        {hasQuery && isLoading && (
          <div className="space-y-3" aria-live="polite" aria-busy="true">
            {skeletonRows.map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="portal-card flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex-1 space-y-2">
                  <div className="portal-skeleton h-4 w-40 rounded-full" />
                  <div className="portal-skeleton h-3 w-28 rounded-full" />
                  <div className="flex flex-wrap gap-2">
                    <div className="portal-skeleton h-5 w-16 rounded-full" />
                    <div className="portal-skeleton h-5 w-20 rounded-full" />
                  </div>
                </div>
                <div className="portal-skeleton h-9 w-24 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {hasQuery && !isLoading && results.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {strings.search.empty}
          </p>
        )}

        {hasQuery && !isLoading && results.length > 0 && (
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.id}
                className="portal-card flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {result.title}
                      {result.year ? ` (${result.year})` : ''}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        'portal-chip px-2 py-0.5 text-[10px] uppercase',
                        result.status === 'downloaded'
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                          : 'border-primary/40 bg-primary/10 text-primary'
                      )}
                    >
                      {result.status === 'downloaded'
                        ? strings.search.badgeDownloaded
                        : strings.search.badgeNew}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="portal-chip px-2 py-0.5 text-[10px] uppercase"
                    >
                      {result.source}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {result.kind === 'movie'
                      ? strings.search.kindMovie
                      : strings.search.kindSeries}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {result.status === 'downloaded' ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={openJellyfin}
                    >
                      <Play className="h-4 w-4" />
                      {strings.search.playCta}
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                      {strings.search.addCta}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
