"use client";

// Client-only service actions (open, copy, restart stub).
import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Copy, RotateCw } from "lucide-react";

import { requestServiceAction } from "@/app/actions/portal-actions";
import { Button } from "@/components/ui/button";
import type { PortalStrings } from "@/lib/i18n";
import { getServiceHref, type ServiceDefinition } from "@/lib/services";
import { pushToast } from "@/lib/toast-store";

// Warm up an iframe endpoint with a HEAD request.
const prefetchService = (path: string) => {
  fetch(path, { method: "HEAD", cache: "no-store" }).catch(() => undefined);
};

type ServiceActionsProps = {
  service: ServiceDefinition;
  isPublic: boolean;
  strings: PortalStrings;
};

type RestartState = "idle" | "pending" | "queued" | "unavailable";

// Action buttons for each service card.
export default function ServiceActions({
  service,
  isPublic,
  strings,
}: ServiceActionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [restartState, setRestartState] = useState<RestartState>("idle");
  const [isPending, startTransition] = useTransition();

  const setActiveApp = useCallback(
    (id?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set("app", id);
      } else {
        params.delete("app");
      }
      const query = params.toString();
      router.push(query ? `/?${query}` : "/");
    },
    [router, searchParams]
  );

  const handleOpen = useCallback(() => {
    if (isPublic) {
      return;
    }

    if (service.openMode === "newtab") {
      window.open(getServiceHref(service), "_blank", "noopener,noreferrer");
      return;
    }

    setActiveApp(service.id);
  }, [isPublic, service, setActiveApp]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getServiceHref(service));
    } catch {
      window.prompt(strings.services.copyLink + ":", getServiceHref(service));
    }
  }, [service, strings]);

  const handleRestart = useCallback(() => {
    if (isPublic) {
      return;
    }

    setRestartState("pending");
    startTransition(async () => {
      const result = await requestServiceAction({
        serviceId: service.id,
        action: "restart",
      });
      setRestartState(result.ok ? "queued" : "unavailable");

      if (result.ok) {
        pushToast({
          title: strings.toasts.restartQueued.title,
          description: strings.toasts.restartQueued.description,
          tone: "success",
        });
      } else {
        pushToast({
          title: strings.toasts.restartUnavailable.title,
          description: strings.toasts.restartUnavailable.description,
          tone: "warning",
        });
      }

      window.setTimeout(() => setRestartState("idle"), 2200);
    });
  }, [isPublic, service.id, startTransition, strings]);

  const restartLabel =
    restartState === "pending" || isPending
      ? strings.services.restartPending
      : restartState === "queued"
      ? strings.services.restartQueued
      : restartState === "unavailable"
      ? strings.services.restartUnavailable
      : strings.services.restart;

  return (
    <div
      className="flex flex-wrap gap-2"
      onMouseEnter={() => {
        if (!isPublic && service.openMode === "overlay") {
          prefetchService(service.path);
        }
      }}
    >
      <Button
        size="sm"
        onClick={handleOpen}
        disabled={isPublic}
        style={{ background: service.accent }}
        className="text-white shadow-[0_12px_30px_var(--portal-glow)] hover:brightness-110"
      >
        {strings.services.open}
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          window.open(getServiceHref(service), "_blank", "noopener,noreferrer")
        }
        disabled={isPublic}
        className="shadow-sm"
      >
        {strings.services.newTab}
        <ArrowUpRight className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="ghost" onClick={handleCopy} disabled={isPublic}>
        <Copy className="h-4 w-4" />
        {strings.services.copyLink}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleRestart}
        disabled={isPublic || isPending || restartState === "pending"}
      >
        <RotateCw className="h-4 w-4" />
        {restartLabel}
      </Button>
    </div>
  );
}
