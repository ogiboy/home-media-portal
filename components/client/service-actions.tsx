'use client';

// Client-only service actions (open, copy, restart stub).
import { useCallback, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpRight, Copy, RotateCw } from 'lucide-react';

import { requestServiceAction } from '@/app/actions/portal-actions';
import { Button } from '@/components/ui/button';
import type { PortalStrings } from '@/lib/i18n';
import { getServiceHref, type ServiceDefinition } from '@/lib/services';
import { pushToast } from '@/lib/toast-store';

// Warm up an iframe endpoint with a HEAD request.
const prefetchService = (path: string) => {
  fetch(path, { method: 'HEAD', cache: 'no-store' }).catch(() => undefined);
};

type ServiceActionsProps = Readonly<{
  service: ServiceDefinition;
  isPublic: boolean;
  strings: PortalStrings;
}>;

type RestartState = 'idle' | 'pending' | 'queued' | 'unavailable';

const getRestartLabel = (
  state: RestartState,
  pending: boolean,
  strings: PortalStrings
) => {
  if (state === 'pending' || pending) {
    return strings.services.restartPending;
  }
  if (state === 'queued') {
    return strings.services.restartQueued;
  }
  if (state === 'unavailable') {
    return strings.services.restartUnavailable;
  }
  return strings.services.restart;
};

/**
 * Render action buttons for a service card and handle open, copy-link, and restart interactions.
 *
 * @param service - Service definition used to derive URLs, labels, and behavior for the actions
 * @param isPublic - When true, interactive actions are disabled for public view
 * @param strings - Localized UI text used by the buttons and toasts
 * @returns A JSX element containing the action buttons for the service
 */
export default function ServiceActions({
  service,
  isPublic,
  strings,
}: ServiceActionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [restartState, setRestartState] = useState<RestartState>('idle');
  const [isPending, startTransition] = useTransition();
  const serviceHref = getServiceHref(service);

  const setActiveApp = useCallback(
    (id?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set('app', id);
      } else {
        params.delete('app');
      }
      const query = params.toString();
      router.push(query ? `/?${query}` : '/');
    },
    [router, searchParams]
  );

  const handleOpenNewTab = useCallback(() => {
    globalThis.open(serviceHref, '_blank', 'noopener,noreferrer');
  }, [serviceHref]);

  const handleOpen = useCallback(() => {
    if (isPublic) {
      return;
    }

    if (service.openMode === 'newtab') {
      handleOpenNewTab();
      return;
    }

    setActiveApp(service.id);
  }, [handleOpenNewTab, isPublic, service.id, service.openMode, setActiveApp]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(serviceHref);
    } catch {
      globalThis.prompt(strings.services.copyLink + ':', serviceHref);
    }
  }, [serviceHref, strings]);

  const handleRestart = useCallback(() => {
    if (isPublic) {
      return;
    }

    setRestartState('pending');
    startTransition(async () => {
      const result = await requestServiceAction({
        serviceId: service.id,
        action: 'restart',
      });
      setRestartState(result.ok ? 'queued' : 'unavailable');

      if (result.ok) {
        pushToast({
          title: strings.toasts.restartQueued.title,
          description: strings.toasts.restartQueued.description,
          tone: 'success',
        });
      } else {
        pushToast({
          title: strings.toasts.restartUnavailable.title,
          description: strings.toasts.restartUnavailable.description,
          tone: 'warning',
        });
      }

      globalThis.setTimeout(() => setRestartState('idle'), 2200);
    });
  }, [isPublic, service.id, startTransition, strings]);

  const restartLabel = getRestartLabel(restartState, isPending, strings);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        onClick={handleOpen}
        onMouseEnter={() => {
          if (!isPublic && service.openMode === 'overlay') {
            prefetchService(service.path);
          }
        }}
        disabled={isPublic}
        style={{ background: service.accent }}
        className="text-white shadow-[0_12px_30px_var(--portal-glow)] hover:brightness-110"
      >
        {strings.services.open}
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleOpenNewTab}
        disabled={isPublic}
        className="shadow-sm"
      >
        {strings.services.newTab}
        <ArrowUpRight className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopy}
        disabled={isPublic}
      >
        <Copy className="h-4 w-4" />
        {strings.services.copyLink}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleRestart}
        disabled={isPublic || isPending || restartState === 'pending'}
      >
        <RotateCw className="h-4 w-4" />
        {restartLabel}
      </Button>
    </div>
  );
}