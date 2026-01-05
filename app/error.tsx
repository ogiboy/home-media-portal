'use client';

import BrandMark from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import { getTranslations } from '@/lib/i18n';

// Read locale preference from cookies on the client.
const getLocaleFromCookie = () => {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const match = /(?:^|; )portal_locale=([^;]+)/.exec(document.cookie);
  return match ? decodeURIComponent(match[1]) : undefined;
};

// Capture the browser language as a fallback when no cookie is set.
const getBrowserLanguage = () =>
  typeof navigator === 'undefined' ? undefined : navigator.language;

// Global error boundary themed to match the portal shell.
type GlobalErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  const locale = getLocaleFromCookie();
  const acceptLanguage = getBrowserLanguage();
  const { strings } = getTranslations(locale, acceptLanguage);

  return (
    <main className="portal-shell flex min-h-screen items-center justify-center px-6">
      <section className="portal-surface portal-entrance max-w-md rounded-(--radius) p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_24px_var(--portal-glow)]">
          <BrandMark className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-semibold">{strings.errors.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {strings.errors.description}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          {error.digest ?? ''}
        </p>
        <div className="mt-5 flex justify-center">
          <Button onClick={reset}>{strings.errors.retry}</Button>
        </div>
      </section>
    </main>
  );
}
