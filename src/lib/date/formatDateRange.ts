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

  return `${format(start, "d MMM yyyy", { locale: dateLocale })} – ${format(
    end,
    "d MMM yyyy",
    { locale: dateLocale }
  )}`;
}
