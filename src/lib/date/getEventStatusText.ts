import { formatDistanceToNow, differenceInDays, parseISO } from "date-fns";
import { getDateLocale } from "@/lib/date/getDateLocale";

export function getEventStatusText(
  start: string,
  now: Date,
  localeCode: string,
  t: (key: string, params?: Record<string, string | number | Date>) => string
): string {
  const startDate = parseISO(start);
  const dayDiff = differenceInDays(startDate, now);
  const dateLocale = getDateLocale(localeCode);

  if (dayDiff === 1) {
    return t("event_summary.starts_tomorrow");
  }

  const rawDuration = formatDistanceToNow(startDate, {
    addSuffix: false,
    includeSeconds: false,
    locale: dateLocale,
  })
    .replace(/^about\s*/, "")
    .replace(/^\u0e1b\u0e23\u0e30\u0e21\u0e32\u0e13\s*/, "");

  return t("event_summary.starts_in_duration", { duration: rawDuration });
}
