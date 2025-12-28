"use client";

import { useEffect } from "react";

import BrandMark from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

export type HttpRedirectStrings = {
  title: string;
  description: string;
  action: string;
};

type HttpRedirectProps = {
  target: string;
  strings: HttpRedirectStrings;
};

// Client redirect panel for HTTP -> HTTPS.
export default function HttpRedirect({ target, strings }: HttpRedirectProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.href = target;
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [target]);

  return (
    <main className="portal-shell flex min-h-screen items-center justify-center px-6">
      <section className="portal-surface portal-entrance max-w-md rounded-(--radius) p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_24px_var(--portal-glow)]">
          <BrandMark className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-semibold">{strings.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {strings.description}
        </p>
        <div className="mt-5 flex justify-center">
          <Button asChild className="shadow-[0_12px_30px_var(--portal-glow)]">
            <a href={target}>{strings.action}</a>
          </Button>
        </div>
      </section>
    </main>
  );
}
