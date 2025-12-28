'use client';

import { Button } from '@/components/ui/button';
import { getTranslations } from '@/lib/i18n';

const getLocaleFromCookie = () => {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const match = document.cookie.match(/(?:^|; )portal_locale=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = getLocaleFromCookie();
  const { strings } = getTranslations(locale);

  return (
    <main className="portal-shell flex min-h-screen items-center justify-center px-6">
      <section className="portal-surface max-w-md rounded-(--radius) p-6 text-center">
        <h1 className="text-xl font-semibold">{strings.errors.title}</h1>
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
