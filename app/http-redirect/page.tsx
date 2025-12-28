import { cookies } from "next/headers";

import HttpRedirect from "@/components/client/http-redirect";
import { HOME_URL } from "@/lib/env";
import { getTranslations } from "@/lib/i18n";

export default async function HttpRedirectPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("portal_locale")?.value;
  const { strings } = getTranslations(locale);

  return <HttpRedirect target={HOME_URL} strings={strings.http} />;
}
