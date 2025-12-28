import { cookies } from 'next/headers';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getTranslations } from '@/lib/i18n';

export default async function NotFoundPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('portal_locale')?.value;
  const { strings } = getTranslations(locale);

  return (
    <main className="portal-shell flex min-h-screen items-center justify-center px-6">
      <section className="portal-surface max-w-md rounded-(--radius) p-6 text-center">
        <h1 className="text-xl font-semibold">{strings.notFound.title}</h1>
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
