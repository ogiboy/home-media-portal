import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Roboto } from "next/font/google";

import { resolveLocale } from "@/lib/i18n";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

const themeScript = `(() => {\n  try {\n    const stored = localStorage.getItem('portal-theme');\n    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;\n    const theme = stored || (prefersDark ? 'dark' : 'light');\n    document.documentElement.dataset.theme = theme;\n  } catch {}\n})();`;

export const metadata: Metadata = {
  title: "Home Media Portal",
  description: "A unified, in-universe dashboard for your home media services.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("portal_locale")?.value);

  return (
    <html lang={locale} data-theme="light" suppressHydrationWarning>
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
