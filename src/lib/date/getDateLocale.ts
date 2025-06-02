import { enUS, th, Locale } from "date-fns/locale";

const localeMap: Record<string, Locale> = {
  en: enUS,
  th: th,
};

export function getDateLocale(localeCode: string): Locale {
  return localeMap[localeCode] || enUS;
}
