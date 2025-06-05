import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "th", "jp"],
  defaultLocale: "en",
  localePrefix: "never",
});
