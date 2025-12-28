"use client";

import { useEffect } from "react";

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

export default function HttpRedirect({ target, strings }: HttpRedirectProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.href = target;
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [target]);

  return (
    <main className="portal-shell flex min-h-screen items-center justify-center px-6">
      <section className="portal-surface max-w-md rounded-(--radius) p-6 text-center">
        <h1 className="text-xl font-semibold">{strings.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{strings.description}</p>
        <div className="mt-5 flex justify-center">
          <Button asChild className="shadow-[0_12px_30px_var(--portal-glow)]">
            <a href={target}>{strings.action}</a>
          </Button>
        </div>
      </section>
    </main>
  );
}
