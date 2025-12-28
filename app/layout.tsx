import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Roboto } from "next/font/google";

import { resolveLocale } from "@/lib/i18n";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

// Pre-hydration theme init to avoid flashing the wrong theme.
const themeScript = `(() => {
  try {
    const stored = localStorage.getItem('portal-theme');
    const hasMatchMedia = typeof window.matchMedia === 'function';
    const prefersDark = hasMatchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersLight = hasMatchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme = stored || (prefersDark ? 'dark' : prefersLight ? 'light' : 'dark');
    document.documentElement.dataset.theme = theme;
  } catch {}
})();`;

// Global metadata and favicon configuration.
export const metadata: Metadata = {
  title: "Home Media Portal",
  description: "A unified, in-universe dashboard for your home media services.",
  icons: {
    icon: "/icon.svg",
  },
};

// Root layout that applies locale and theme defaults for SSR.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language") ?? undefined;
  const locale = resolveLocale(
    cookieStore.get("portal_locale")?.value,
    acceptLanguage
  );

  return (
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${roboto.variable} bg-background font-sans text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
