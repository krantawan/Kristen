"use client";

import {
  parseISO,
  differenceInCalendarDays,
  differenceInHours,
  isAfter,
  isSameDay,
} from "date-fns";

type Event = {
  title: string;
  start: string;
  end: string;
  type: "main" | "side" | "cc";
  image?: string;
};

type Props = {
  event: Event;
  dateRange: Date[];
};

function getEventColor(type: string) {
  switch (type) {
    case "main":
      return "bg-[#802520] text-white";
    case "side":
      return "bg-[#d4a940] text-black";
    case "cc":
      return "bg-[#5C7F71] text-white";
    default:
      return "bg-gray-400 text-white";
  }
}

export default function EventBar({ event, dateRange }: Props) {
  const startDate = parseISO(event.start);
  const endDate = parseISO(event.end);
  const isEnded = isAfter(new Date(), endDate);

  const startIndex = dateRange.findIndex((d) => isSameDay(d, startDate));
  const endIndex = dateRange.findIndex((d) => isSameDay(d, endDate));

  if (startIndex === -1 || endIndex === -1) return null;

  const columnStart = startIndex + 1;
  const columnEnd = endIndex + 2;

  const now = new Date();
  const remainingDays = differenceInCalendarDays(endDate, now);
  const remainingHours = differenceInHours(endDate, now) % 24;
  const timeRemainingText = `${remainingDays}d ${remainingHours}h`;

  const barColor = isEnded
    ? "bg-gray-300 text-gray-600"
    : getEventColor(event.type);

  return (
    <div
      className="grid items-center relative"
      style={{
        gridTemplateColumns: `repeat(${dateRange.length}, 32px)`,
      }}
    >
      <div
        className={`relative h-10 rounded overflow-hidden text-xs font-medium shadow z-10 ${barColor}`}
        style={{
          gridColumnStart: columnStart,
          gridColumnEnd: columnEnd,
        }}
      >
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

        <div className="relative z-10 flex items-center justify-between h-full px-3">
          <span className="truncate">{event.title}</span>
        </div>

        {!isEnded && (
          <span className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-200 text-black text-[11px] font-semibold rounded-full px-2 py-0.5 shadow z-20">
            {timeRemainingText}
          </span>
        )}
      </div>
    </div>
  );
}
