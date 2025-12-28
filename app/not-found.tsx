import { cookies, headers } from 'next/headers';
import Link from 'next/link';

import BrandMark from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import { getTranslations } from '@/lib/i18n';

// Not-found screen themed to match the portal shell.
export default async function NotFoundPage() {
  const cookieStore = await cookies();
  const headerList = await headers();
  const locale = cookieStore.get('portal_locale')?.value;
  const acceptLanguage = headerList.get('accept-language') ?? undefined;
  const { strings } = getTranslations(locale, acceptLanguage);

  return (
    <main className="portal-shell flex min-h-screen items-center justify-center px-6">
      <section className="portal-surface portal-entrance max-w-md rounded-(--radius) p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_24px_var(--portal-glow)]">
          <BrandMark className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-semibold">{strings.notFound.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {strings.notFound.description}
        </p>
        <div className="mt-5 flex justify-center">
          <Button asChild className="shadow-[0_12px_30px_var(--portal-glow)]">
            <Link href="/">{strings.notFound.action}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
