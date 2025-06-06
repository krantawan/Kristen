import { format, parseISO } from "date-fns";
import { getDateLocale } from "@/lib/date/getDateLocale";

export function formatDateRange(
  localeCode: string,
  startISO: string,
  endISO?: string
): string {
  const start = parseISO(startISO);
  const dateLocale = getDateLocale(localeCode);

  const formatStr =
    localeCode === "ja"
      ? "M月d日"
      : localeCode === "th"
      ? "d MMM yyyy"
      : "d MMM yyyy";

  const separator = localeCode === "ja" ? " ～ " : " – ";

  // ถ้า endISO เป็น undefined หรือ empty string → ให้แสดง TBD
  if (!endISO || endISO.trim() === "") {
    return `${format(start, formatStr, { locale: dateLocale })}${separator}TBD`;
  }

  // ถ้า endISO valid → parse แล้ว format ปกติ
  let endDate: Date;
  try {
    endDate = parseISO(endISO);
  } catch {
    return `${format(start, formatStr, { locale: dateLocale })}${separator}TBD`;
  }

  return `${format(start, formatStr, {
    locale: dateLocale,
  })}${separator}${format(endDate, formatStr, { locale: dateLocale })}`;
}
