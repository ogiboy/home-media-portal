'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { locales, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// Display labels for locale tabs.
const labels: Record<Locale, string> = {
  tr: 'TR',
  en: 'EN',
  it: 'IT',
};

// Persist locale preference to cookies and the html lang attribute.
const applyLocale = (value: Locale) => {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `portal_locale=${value}; path=/; max-age=31536000; samesite=lax`;
  document.documentElement.setAttribute('lang', value);
};

type LanguageSwitchProps = Readonly<{
  locale: Locale;
  label: string;
}>;

// Locale switcher for UI strings.
export default function LanguageSwitch({ locale, label }: LanguageSwitchProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const onChange = (value: Locale) => {
    applyLocale(value);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <fieldset className="portal-chip flex items-center px-2 py-1 text-xs font-semibold">
      <legend className="sr-only">{label}</legend>
      {locales.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            'rounded-full px-2 py-1 transition-colors',
            value === locale
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          )}
          aria-pressed={value === locale}
        >
          {labels[value]}
        </button>
      ))}
    </fieldset>
  );
}
