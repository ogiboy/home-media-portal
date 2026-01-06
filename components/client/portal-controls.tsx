'use client';

// Client-only header controls (command palette + tailnet gate).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpRight, Search } from 'lucide-react';

import TailnetGate from '@/components/client/tailnet-gate';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useTailnetStatus } from '@/hooks/use-tailnet-status';
import { HOME_URL } from '@/lib/env';
import type { PortalStrings } from '@/lib/i18n';
import { getServiceHref, services } from '@/lib/services';
import { cn } from '@/lib/utils';
import { pushToast } from '@/lib/toast-store';

// Status dot palette for the tailnet pill.
const statusTone = {
  online: 'bg-emerald-500',
  offline: 'bg-rose-500',
  connecting: 'bg-amber-400',
};

type PortalControlsProps = Readonly<{
  strings: PortalStrings;
  isPublic: boolean;
  allowGateInteraction?: boolean;
}>;

/**
 * Renders header controls for portal search, tailnet status, and quick actions.
 *
 * Displays a status chip, a searchable command palette for services, optional retry and gate buttons,
 * and the TailnetGate component. Interaction and visibility adapt to `isPublic`, current tailnet `status`,
 * and `allowGateInteraction`.
 *
 * @param strings - Localization strings used for labels, placeholders, and toasts
 * @param isPublic - When true, the component renders the public portal shell behaviour (affects available actions)
 * @param allowGateInteraction - When true, enables interaction controls on the TailnetGate
 * @returns The header controls UI (status chip, command dialog, action buttons, and TailnetGate)
 */
export default function PortalControls({
  strings,
  isPublic,
  allowGateInteraction,
}: PortalControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, retry } = useTailnetStatus(HOME_URL);
  const [open, setOpen] = useState(false);
  const lastStatus = useRef<typeof status | null>(null);

  useEffect(() => {
    if (lastStatus.current === status) {
      return;
    }

    const shouldAnnounceInitial =
      lastStatus.current === null && status !== 'connecting';

    if (lastStatus.current !== null || shouldAnnounceInitial) {
      if (status === 'online') {
        pushToast({
          title: strings.toasts.tailnetOnline.title,
          description: strings.toasts.tailnetOnline.description,
          tone: 'success',
        });
      } else if (status === 'offline') {
        pushToast({
          title: strings.toasts.tailnetOffline.title,
          description: strings.toasts.tailnetOffline.description,
          tone: 'warning',
        });
      } else if (status === 'connecting') {
        pushToast({
          title: strings.toasts.tailnetConnecting.title,
          description: strings.toasts.tailnetConnecting.description,
          tone: 'info',
        });
      }
    }

    lastStatus.current = status;
  }, [status, strings]);

  const statusLabels = {
    online: strings.tailnet.reachable,
    offline: strings.tailnet.offline,
    connecting: strings.tailnet.connecting,
  };
  const statusLabel = statusLabels[status];

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

  const handleSelect = useCallback(
    (serviceId: string) => {
      const service = services.find((item) => item.id === serviceId);
      if (!service || isPublic) {
        return;
      }
      if (service.openMode === 'newtab') {
        globalThis.open(getServiceHref(service), '_blank', 'noopener,noreferrer');
        return;
      }
      setActiveApp(service.id);
    },
    [isPublic, setActiveApp]
  );

  // Public shell always shows the gate; home shows it when not online.
  const showGate = isPublic || status !== 'online';
  const showRetry = status !== 'online';

  const enterHome = useCallback(() => {
    globalThis.location.href = HOME_URL;
  }, []);

  const commands = useMemo(
    () => services.map((service) => ({ id: service.id, name: service.name })),
    []
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="portal-chip flex min-w-40 items-center justify-between gap-2 px-3 py-1 text-xs text-muted-foreground">
          <span className={cn('h-2 w-2 rounded-full', statusTone[status])} />
          <span className="whitespace-nowrap">{statusLabel}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="min-w-32 justify-center shadow-sm"
        >
          <Search className="h-4 w-4" />
          {strings.header.search}
          <span className="ml-1 hidden whitespace-nowrap text-xs text-muted-foreground sm:inline">
            {strings.header.searchHint}
          </span>
        </Button>
        {showRetry && (
          <Button variant="ghost" size="sm" onClick={retry}>
            {strings.tailnet.retry}
          </Button>
        )}
        {isPublic && status === 'online' && (
          <Button
            size="sm"
            onClick={enterHome}
            className="shadow-[0_12px_30px_var(--portal-glow)]"
          >
            {strings.gate.enter}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        closeLabel={strings.accessibility.dialogClose}
      >
        <CommandInput placeholder={strings.command.placeholder} />
        <CommandList>
          <CommandEmpty>{strings.command.empty}</CommandEmpty>
          <CommandGroup heading={strings.command.groupServices}>
            {commands.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => {
                  handleSelect(command.id);
                  setOpen(false);
                }}
                disabled={isPublic}
              >
                {command.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <TailnetGate
        visible={showGate}
        status={status}
        isPublic={isPublic}
        allowInteraction={Boolean(allowGateInteraction)}
        strings={strings}
        onEnter={enterHome}
      />
    </>
  );
}