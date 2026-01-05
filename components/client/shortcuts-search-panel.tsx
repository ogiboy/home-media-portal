'use client';

// Client search panel for Radarr/Sonarr shortcuts.
import { useMemo, useState, useTransition, type FormEvent } from 'react';
import { Check, Film, Loader2, Plus, Tv } from 'lucide-react';

import {
  searchShortcuts,
  addShortcutItem,
  type ShortcutSearchState,
} from '@/app/actions/shortcut-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PortalStrings } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { pushToast } from '@/lib/toast-store';

type ShortcutsSearchPanelProps = {
  strings: PortalStrings;
};

const initialState: ShortcutSearchState = {
  status: 'idle',
  results: [],
  query: '',
  service: 'radarr',
};

// Search panel for lookup + add actions.
export default function ShortcutsSearchPanel({
  strings,
}: Readonly<ShortcutsSearchPanelProps>) {
  const [service, setService] = useState<'radarr' | 'sonarr'>('radarr');
  const [query, setQuery] = useState('');
  const [state, setState] = useState(initialState);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [isSearching, startSearch] = useTransition();

  const errorMessage = useMemo(() => {
    if (state.status !== 'error') {
      return null;
    }
    switch (state.error) {
      case 'invalid':
        return strings.shortcuts.errorInvalid;
      case 'not_available':
        return strings.shortcuts.errorUnavailable;
      case 'forbidden':
        return strings.shortcuts.errorForbidden;
      case 'missing_api_key':
        return strings.shortcuts.errorMissingKey;
      case 'missing_config':
        return strings.shortcuts.errorMissingConfig;
      default:
        return strings.shortcuts.errorUnknown;
    }
  }, [state, strings]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startSearch(async () => {
      const nextState = await searchShortcuts(state, formData);
      setState(nextState);
    });
  };

  const handleAdd = (resultId: number, target: 'radarr' | 'sonarr') => {
    setPendingId(resultId);
    startSearch(async () => {
      const result = await addShortcutItem({ service: target, id: resultId });
      if (result.ok) {
        pushToast({
          title: strings.toasts.shortcutAdded.title,
          description: strings.toasts.shortcutAdded.description,
          tone: 'success',
        });
      } else if (result.error === 'missing_config') {
        pushToast({
          title: strings.toasts.shortcutMissingConfig.title,
          description: strings.toasts.shortcutMissingConfig.description,
          tone: 'warning',
        });
      } else if (result.error === 'missing_api_key') {
        pushToast({
          title: strings.toasts.shortcutMissingKey.title,
          description: strings.toasts.shortcutMissingKey.description,
          tone: 'warning',
        });
      } else if (
        result.error === 'forbidden' ||
        result.error === 'not_available'
      ) {
        pushToast({
          title: strings.toasts.shortcutUnavailable.title,
          description: strings.toasts.shortcutUnavailable.description,
          tone: 'warning',
        });
      } else {
        pushToast({
          title: strings.toasts.shortcutFailed.title,
          description: strings.toasts.shortcutFailed.description,
          tone: 'error',
        });
      }
      setPendingId(null);
    });
  };

  return (
    <div className="portal-surface rounded-(--radius) p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Film className="h-4 w-4" />
            {strings.shortcuts.searchTitle}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {strings.shortcuts.searchDesc}
          </p>
        </div>
        <Badge variant="outline" className="portal-chip px-3 py-1 text-xs">
          {service === 'radarr'
            ? strings.shortcuts.searchMovies
            : strings.shortcuts.searchSeries}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={service === 'radarr' ? 'default' : 'outline'}
          onClick={() => setService('radarr')}
        >
          <Film className="h-4 w-4" />
          {strings.shortcuts.searchMovies}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={service === 'sonarr' ? 'default' : 'outline'}
          onClick={() => setService('sonarr')}
        >
          <Tv className="h-4 w-4" />
          {strings.shortcuts.searchSeries}
        </Button>
      </div>

      <form className="mt-4 flex flex-col gap-3" onSubmit={handleSearch}>
        <input type="hidden" name="service" value={service} />
        <Input
          name="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={strings.shortcuts.searchPlaceholder}
        />
        <Button type="submit" size="sm" disabled={isSearching}>
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {strings.shortcuts.searchButton}
        </Button>
      </form>

      {errorMessage && (
        <p className="mt-3 text-xs text-rose-600">{errorMessage}</p>
      )}

      {state.status === 'success' && (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {strings.shortcuts.resultsTitle}
          </p>
          {state.results.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {strings.shortcuts.resultsEmpty}
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {state.results.map((result) => (
                <div
                  key={`${result.service}-${result.id}`}
                  className="portal-card flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-14 w-12 rounded-xl border border-border/60 bg-muted/50',
                        result.poster && 'bg-cover bg-center'
                      )}
                      style={
                        result.poster
                          ? { backgroundImage: `url(${result.poster})` }
                          : undefined
                      }
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        {result.title}
                        {result.year ? ` (${result.year})` : ''}
                      </p>
                      {result.overview && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {result.overview}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAdd(result.id, result.service)}
                      disabled={pendingId === result.id || isSearching}
                    >
                      {pendingId === result.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      {strings.shortcuts.addButton}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
