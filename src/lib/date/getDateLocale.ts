import { enUS, th, ja, Locale } from "date-fns/locale";

const localeMap: Record<string, Locale> = {
  en: enUS,
  th: th,
  ja: ja,
};

export function getDateLocale(localeCode: string): Locale {
  return localeMap[localeCode] || enUS;
}
