"use client";

import eventsDataRaw from "@/data/events.json";
import { differenceInDays } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

const eventsData = eventsDataRaw as {
  title: string;
  start: string;
  end: string;
  type: string;
  image?: string;
}[];

export default function EventCurrentBanner() {
  const t = useTranslations("components.EventPage");
  const locale = useLocale();

  const now = new Date();
  const currentEvent = eventsData.find(
    (e) => new Date(e.start) <= now && now <= new Date(e.end)
  );

  if (!currentEvent) return null;

  const remainingDays = differenceInDays(new Date(currentEvent.end), now);
  return (
    <div
      className="relative w-full h-[200px] md:h-[300px] bg-cover bg-center shadow-inner"
      style={{ backgroundImage: `url(${currentEvent.image})` }}
    >
      <div className="absolute inset-0 flex items-end p-6">
        <div className="backdrop-blur-sm bg-black/40 p-2 rounded">
          <div
            className={`text-yellow-300 text-xs uppercase tracking-wider ${
              locale === "en" ? "font-mono" : ""
            }`}
          >
            ~$ prts.scan Ongoing Operation :{" "}
            {t("event.type", {
              type: currentEvent.type,
            })}
          </div>
          <div className="text-white text-2xl md:text-3xl font-black leading-tight">
            {currentEvent.title}
          </div>
          <div className="text-gray-300 text-sm">
            {currentEvent.start} – {currentEvent.end}
          </div>

          <div className="text-green-300 text-sm mt-1">
            {locale === "en"
              ? "→ " +
                t("event.remaining_format", {
                  days: remainingDays,
                  s: remainingDays === 1 ? "" : "s",
                })
              : "→ " + t("event.remaining_format", { days: remainingDays })}
          </div>
        </div>
      </div>
    </div>
  );
}
