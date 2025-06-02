import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
  const cookieHeader = (await headers()).get("cookie");

  const requestedLocale = cookieHeader
    ?.split(";")
    .find((part) => part.trim().startsWith("NEXT_LOCALE="))
    ?.split("=")[1];

  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
