"use client";

import eventsDataRaw from "@/data/events.json";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import {
  differenceInDays,
  differenceInCalendarDays,
  isBefore,
  isAfter,
  isWithinInterval,
  parseISO,
} from "date-fns";

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

  const ongoingEvents = eventsData.filter((e) =>
    isWithinInterval(now, { start: parseISO(e.start), end: parseISO(e.end) })
  );

  const pastEvents = eventsData
    .filter((e) => isBefore(parseISO(e.end), now))
    .sort((a, b) => parseISO(b.end).getTime() - parseISO(a.end).getTime());

  const upcomingEvents = eventsData
    .filter((e) => isAfter(parseISO(e.start), now))
    .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());

  const displayedEvent = ongoingEvents[0] || pastEvents[0];
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
              {displayedEvent.start} – {displayedEvent.end}
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
                : "→ " + t("event.ended")}
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
            {upcomingEvents.map((event) => {
              const daysLeft = differenceInCalendarDays(
                parseISO(event.start),
                new Date()
              );
              return (
                <div
                  key={event.title + event.start}
                  className="overflow-hidden shadow-md border border-white/10 bg-[#1a1a1a]"
                >
                  <Image
                    src={event.image || "/fallback.jpg"}
                    alt={event.title}
                    width={220}
                    height={110}
                    className="w-full object-cover"
                  />
                  <div className="text-white text-sm px-3 py-2">
                    <div
                      className={
                        locale === "en" ? "font-semibold truncate" : "truncate"
                      }
                    >
                      {event.title}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {daysLeft === 0
                        ? t("event_summary.today")
                        : daysLeft === 1
                        ? t("event_summary.starts_tomorrow")
                        : t("event_summary.starts_in_format", {
                            days: daysLeft,
                          })}
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
