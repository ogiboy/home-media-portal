"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PortalStrings } from "@/lib/i18n";
import { getServiceHref, type ServiceDefinition } from "@/lib/services";

const prefetchService = (path: string) => {
  fetch(path, { method: "HEAD", cache: "no-store" }).catch(() => undefined);
};

type ServiceActionsProps = {
  service: ServiceDefinition;
  isPublic: boolean;
  strings: PortalStrings;
};

export default function ServiceActions({
  service,
  isPublic,
  strings,
}: ServiceActionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    </div>
  );
}
