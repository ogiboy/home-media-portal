'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpRight, Loader2, Search } from 'lucide-react';

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

const statusTone = {
  online: 'bg-emerald-500',
  offline: 'bg-rose-500',
  connecting: 'bg-amber-400',
};

type PortalControlsProps = {
  strings: PortalStrings;
  isPublic: boolean;
};

export default function PortalControls({
  strings,
  isPublic,
}: PortalControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, retry } = useTailnetStatus(HOME_URL);
  const [open, setOpen] = useState(false);

  const statusLabel =
    status === 'online'
      ? strings.tailnet.reachable
      : status === 'offline'
      ? strings.tailnet.offline
      : strings.tailnet.connecting;

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
        window.open(getServiceHref(service), '_blank', 'noopener,noreferrer');
        return;
      }
      setActiveApp(service.id);
    },
    [isPublic, setActiveApp]
  );

  const showGate = isPublic || status !== 'online';
  const showRetry = isPublic && status !== 'online';

  const enterHome = useCallback(() => {
    window.location.href = HOME_URL;
  }, []);

  const commands = useMemo(
    () => services.map((service) => ({ id: service.id, name: service.name })),
    []
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="portal-chip flex items-center gap-2 px-3 py-1 text-xs text-muted-foreground">
          <span className={cn('h-2 w-2 rounded-full', statusTone[status])} />
          <span>{statusLabel}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="shadow-sm"
        >
          <Search className="h-4 w-4" />
          {strings.header.search}
          <span className="ml-1 hidden text-xs text-muted-foreground sm:inline">
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
        strings={strings}
        onEnter={enterHome}
      />
    </>
  );
}

type GateProps = {
  visible: boolean;
  status: 'connecting' | 'online' | 'offline';
  isPublic: boolean;
  strings: PortalStrings;
  onEnter: () => void;
};

function TailnetGate({
  visible,
  status,
  isPublic,
  strings,
  onEnter,
}: GateProps) {
  if (!visible) {
    return null;
  }

  const blocking = isPublic;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm',
        !blocking && 'pointer-events-none'
      )}
    >
      <div className="portal-surface mx-4 flex max-w-xl flex-col gap-4 rounded-[var(--radius)] p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--portal-glow)]">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {strings.gate.title}
          </p>
          <h2 className="text-2xl font-semibold">
            {status === 'online'
              ? strings.gate.connected
              : status === 'offline'
              ? strings.gate.waiting
              : strings.gate.connecting}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isPublic
              ? strings.gate.publicDescription
              : strings.gate.homeDescription}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {isPublic && status === 'online' ? (
            <Button
              onClick={onEnter}
              className="shadow-[0_12px_30px_var(--portal-glow)]"
            >
              {strings.gate.enter}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="secondary" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
              {status === 'offline'
                ? strings.gate.waitingLabel
                : strings.gate.connectingLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
