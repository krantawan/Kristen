"use client";

import { format, parseISO } from "date-fns";
import { useLocale } from "next-intl";
import { enUS, th } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const eventsData = [] as {
  title: string;
  start: string;
  end: string;
  type: string;
  image?: string;
}[];

type SectionProps = {
  title: string;
  titleColor: string;
  borderColor: string;
  events: typeof eventsData;
  getStatusText: (event: (typeof eventsData)[0]) => string;
};

export function EventSection({
  title,
  titleColor,
  borderColor,
  events,
  getStatusText,
}: SectionProps) {
  const locale = useLocale();
  const dateLocale = locale === "th" ? th : enUS;
  const t = useTranslations("components.EventPage.event_summary");

  const formatDate = (dateStr: string) =>
    format(parseISO(dateStr), "d MMM yyyy", { locale: dateLocale });

  return (
    <div className="flex flex-col gap-3 px-1">
      <div className="bg-[#222] px-2 pt-3 pb-1 m-0 rounded-b">
        <div className="flex items-center mb-2">
          <div className="h-1 w-6 bg-[#BEC93B]" />
          <div className="h-1 w-6 bg-[#F6B347]" />
          <div className="h-1 w-6 bg-[#802520]" />
        </div>
        <h2
          className={`text-2xl font-black tracking-tight font-roboto uppercase ${titleColor}`}
        >
          {title}
        </h2>
      </div>

      <div className="p-0 flex flex-col gap-3">
        {events.length > 0 ? (
          events.map((e) => (
            <div
              key={e.title}
              className={`rounded relative p-3 shadow text-white overflow-hidden min-h-[72px] border-b-4 ${borderColor}`}
              style={{
                backgroundImage: e.image ? `url(${e.image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="backdrop-blur-sm bg-black/40 p-2 rounded">
                <span
                  className={cn(
                    "absolute top-1 right-1 text-[10px] px-2 py-[2px] rounded uppercase font-bold shadow",
                    {
                      "bg-red-700 text-white": e.type === "main",
                      "bg-lime-700 text-black": e.type === "cc",
                      "bg-yellow-600 text-black": e.type === "side",
                      "bg-blue-800 text-white": e.type === "kernel",
                      "bg-purple-700 text-white": e.type === "gacha",
                      "bg-neutral-600 text-white": ![
                        "main",
                        "cc",
                        "side",
                        "kernel",
                        "gacha",
                      ].includes(e.type),
                    }
                  )}
                >
                  {e.type}
                </span>
                <div className="font-semibold text-sm">{e.title}</div>
                <div className="text-xs text-gray-200">
                  {formatDate(e.start)} – {formatDate(e.end)}
                </div>
                <div className="text-xs mt-1 text-yellow-300">
                  {getStatusText(e)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm italic">{t("no_events")}.</p>
        )}
      </div>
    </div>
  );
}
