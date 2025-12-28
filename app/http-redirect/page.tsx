import { cookies, headers } from "next/headers";

import HttpRedirect from "@/components/client/http-redirect";
import { getTranslations } from "@/lib/i18n";
import { HOME_URL } from "@/lib/env";

// HTTP-only landing that nudges users to HTTPS.
export default async function HttpRedirectPage() {
  const cookieStore = await cookies();
  const headerList = await headers();
  const locale = cookieStore.get("portal_locale")?.value;
  const acceptLanguage = headerList.get("accept-language") ?? undefined;
  const { strings } = getTranslations(locale, acceptLanguage);

  return <HttpRedirect target={HOME_URL} strings={strings.http} />;
}
