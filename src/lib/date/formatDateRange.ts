import { format, parseISO } from "date-fns";
import { getDateLocale } from "@/lib/date/getDateLocale";

export function formatDateRange(
  startISO: string,
  endISO: string,
  localeCode: string
): string {
  const start = parseISO(startISO);
  const end = parseISO(endISO);
  const dateLocale = getDateLocale(localeCode);

  const formatStr =
    localeCode === "ja"
      ? "M月d日"
      : localeCode === "th"
      ? "d MMM yyyy"
      : "d MMM yyyy";

  const separator = localeCode === "ja" ? " ～ " : " – ";

  return `${format(start, formatStr, {
    locale: dateLocale,
  })}${separator}${format(end, formatStr, { locale: dateLocale })}`;
}
