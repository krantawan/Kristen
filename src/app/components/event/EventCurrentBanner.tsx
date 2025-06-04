"use client";

import eventsDataRaw from "@/data/events.json";
import { useLocale, useTranslations } from "next-intl";
import {
  differenceInDays,
  isBefore,
  isAfter,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { useRef } from "react";
import EventCardCompact from "@/components/ui/EventCardCompact";
import { getEventStatusText } from "@/lib/date/getEventStatusText";
import { formatDateRange } from "@/lib/date/formatDateRange";

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
  const bannerRef = useRef<HTMLDivElement>(null);

  const mainTypesOnly = ["side", "cc", "main"];

  const ongoingEvents = eventsData.filter(
    (e) =>
      mainTypesOnly.includes(e.type) &&
      isWithinInterval(now, { start: parseISO(e.start), end: parseISO(e.end) })
  );

  const pastEvents = eventsData
    .filter(
      (e) => mainTypesOnly.includes(e.type) && isBefore(parseISO(e.end), now)
    )
    .sort((a, b) => parseISO(b.end).getTime() - parseISO(a.end).getTime());

  const upcomingEventsForMain = eventsData
    .filter(
      (e) => mainTypesOnly.includes(e.type) && isAfter(parseISO(e.start), now)
    )
    .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());

  const upcomingEvents = eventsData
    .filter((e) => {
      const startDate = parseISO(e.start);
      const isUpcoming = isAfter(startDate, now);
      const dayDiff = differenceInDays(startDate, now);
      // ถ้าเป็น gacha หรืออื่นๆ => แสดงได้เลย
      // ถ้าเป็น main/side/cc => แสดงเฉพาะ dayDiff > 1
      if (!isUpcoming) return false;
      if (mainTypesOnly.includes(e.type)) {
        return dayDiff > 1;
      }
      return true;
    })
    .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());

  const startDate = parseISO(upcomingEventsForMain[0]?.start ?? "");
  const dayDiff = differenceInDays(startDate, now);

  let displayedEvent;
  if (dayDiff === 1) {
    displayedEvent = upcomingEventsForMain[0];
  } else {
    displayedEvent = ongoingEvents[0] || pastEvents[0];
  }

  const isOngoing = Boolean(ongoingEvents.length);

  if (!displayedEvent) return null;

  const remainingDays = isOngoing
    ? differenceInDays(parseISO(displayedEvent.end), now)
    : 0;

  return (
    <div
      className="w-full grid grid-cols-1 md:grid-cols-[3fr_1fr] border-b-2 border-[#BEC93B]"
      style={{
        backgroundImage: `url(${displayedEvent.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      ref={bannerRef}
    >
      {/* Left: Current / Last Event */}
      <div className="relative h-[300px]">
        <div className="absolute inset-0 flex items-end p-6 z-10">
          <div className="backdrop-blur-sm bg-black/40 p-4 rounded max-w-xl">
            <div
              className={`text-yellow-300 text-xs uppercase tracking-wider ${
                locale === "en" ? "font-mono" : ""
              }`}
            >
              ~$ prts.scan {isOngoing ? "Ongoing Operation" : "Last Operation"}{" "}
              : {t("event.type", { type: displayedEvent.type })}
            </div>
            <div className="text-white text-2xl md:text-3xl font-black leading-tight">
              {displayedEvent.title}
            </div>
            <div className="text-gray-300 text-sm">
              {formatDateRange(
                displayedEvent.start,
                displayedEvent.end,
                locale
              )}
            </div>
            <div
              className={`mt-1 text-sm ${
                isOngoing ? "text-green-300" : "text-red-300"
              }`}
            >
              {isOngoing
                ? "→ " +
                  t("event.remaining_format", {
                    days: remainingDays,
                    s: remainingDays === 1 ? "" : "s",
                  })
                : "→ " +
                  (dayDiff === 1
                    ? t("event_summary.starts_tomorrow")
                    : t("event.ended"))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div
          className="overflow-y-auto px-2 py-1"
          style={{ maxHeight: "300px" }}
        >
          <div
            className={`text-yellow-300 text-xs uppercase tracking-wider text-center bg-[#1a1a1a] ${
              locale === "th" ? "" : "font-mono"
            }`}
          >
            {t("event_summary.event_summary_incoming")}
          </div>
          <div className="flex flex-col gap-1">
            {upcomingEvents.map((event, index) => {
              const statusText = getEventStatusText(
                event.start,
                now,
                locale,
                t
              );

              const isCompact = upcomingEvents.length > 1 && index > 0;

              return isCompact ? (
                <EventCardCompact event={event} statusText={statusText} />
              ) : (
                <div
                  key={event.title + event.start}
                  className="relative rounded-md overflow-hidden shadow hover:shadow-lg transition-shadow border border-white/10 bg-black"
                  style={{
                    backgroundImage: `url(${event.image || "/fallback.jpg"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "160px",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

                  <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {event.type}
                  </div>

                  <div className="absolute bottom-0 w-full px-3 py-2 text-white text-sm z-10">
                    <div className="font-semibold leading-tight">
                      {event.title}
                    </div>
                    <div className="text-yellow-400 text-xs font-medium mt-0.5">
                      {statusText}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
