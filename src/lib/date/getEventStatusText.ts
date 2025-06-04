import {
  formatDistanceToNow,
  differenceInDays,
  isBefore,
  parseISO,
} from "date-fns";
import { getDateLocale } from "@/lib/date/getDateLocale";

export function getEventStatusText(
  start: string,
  now: Date,
  localeCode: string,
  t: (key: string, params?: Record<string, string | number | Date>) => string,
  isOngoing?: boolean,
  end?: string
): string {
  const startDate = parseISO(start);
  const dateLocale = getDateLocale(localeCode);

  if (isOngoing && end) {
    const endDate = parseISO(end);
    const rawDuration = formatDistanceToNow(endDate, {
      addSuffix: false,
      includeSeconds: false,
      locale: dateLocale,
    })
      .replace(/^about\s*/, "")
      .replace(/^ประมาณ\s*/, "");

    return t("event_summary.ends_in_duration", { duration: rawDuration });
  }

  if (isBefore(startDate, now)) {
    return t("event_summary.ended");
  }

  const dayDiff = differenceInDays(startDate, now);

  if (dayDiff === 1) {
    return t("event_summary.starts_tomorrow");
  }

  const rawDuration = formatDistanceToNow(startDate, {
    addSuffix: false,
    includeSeconds: false,
    locale: dateLocale,
  })
    .replace(/^about\s*/, "")
    .replace(/^ประมาณ\s*/, "");

  return t("event_summary.starts_in_duration", { duration: rawDuration });
}
