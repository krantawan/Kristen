"use client";

import {
  parseISO,
  differenceInCalendarDays,
  differenceInHours,
  isAfter,
} from "date-fns";
import { useTranslations } from "next-intl";
import { getEventBadge, getEventColor } from "@/lib/event-utils";

type Event = {
  title: string;
  start: string;
  end: string;
  type: "main" | "side" | "cc" | "gacha" | "kernel" | "other" | "login";
  image?: string;
  status?: string;
};

type Props = {
  event: Event;
  dateRange: Date[];
};

export default function EventBar({ event, dateRange }: Props) {
  const t = useTranslations("components.EventPage");
  const startDate = parseISO(event.start);
  const endDate = parseISO(event.end);
  const isEnded = isAfter(new Date(), endDate);

  const localStartDay = startDate.toLocaleDateString("en-CA");
  const localEndDay = endDate.toLocaleDateString("en-CA");

  const startIndex = dateRange.findIndex(
    (d) => d.toLocaleDateString("en-CA") === localStartDay
  );
  const endIndex = dateRange.findIndex(
    (d) => d.toLocaleDateString("en-CA") === localEndDay
  );

  if (startIndex === -1 || endIndex === -1) return null;

  const columnStart = startIndex + 1;
  const columnEnd = endIndex + 2;

  const now = new Date();

  let timeRemainingText = "";
  if (now >= startDate && now <= endDate) {
    const days = differenceInCalendarDays(endDate, now);
    const hours = differenceInHours(endDate, now) % 24;
    timeRemainingText = `${days}d ${hours}h`;
  } else if (now > endDate) {
    timeRemainingText = t("event.ended");
  }

  const barColor = isEnded
    ? "bg-gray-300 text-gray-600"
    : getEventColor(event.type);

  return (
    <div
      className="grid items-center relative"
      style={{
        gridTemplateColumns: `repeat(${dateRange.length}, minmax(32px, 1fr))`,
      }}
    >
      {/* Event bar */}
      <div
        className={`relative h-8 rounded overflow-hidden text-xs font-medium shadow z-10 ${barColor}`}
        style={{
          gridColumnStart: columnStart,
          gridColumnEnd: columnEnd,
        }}
      >
        {/* Background image overlay */}
        {event.image && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${event.image})`,
              backgroundPosition: "50% 20%",
              backgroundSize: "200%",
              backgroundRepeat: "no-repeat",
              opacity: 0.25,
            }}
          />
        )}

        {/* Text Content */}
        <div className="relative z-10 flex items-center h-full px-3 space-x-2">
          {/* Event Badge */}
          <div className="flex items-center justify-center min-w-[50px] px-2 py-0.5 bg-black/30 rounded text-white text-[10px] font-bold uppercase">
            {getEventBadge(event)}
          </div>

          {/* Event Title */}
          <span className="truncate">{event.title}</span>
        </div>

        {/* Remaining time bubble */}
        {timeRemainingText && (
          <span className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-200 text-black text-[11px] rounded-full px-2 py-0.5 shadow z-20">
            {timeRemainingText}
          </span>
        )}
      </div>
    </div>
  );
}
