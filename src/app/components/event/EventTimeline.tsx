"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import EventBar from "@/app/components/event/EventBar";
import eventsDataRaw from "@/data/events.json";
import TimeIndicator from "./TimeIndicator";
import { useTranslations } from "next-intl";
import { useHorizontalDragScroll } from "@/lib/hooks/useHorizontalDragScroll";

type Event = {
  title: string;
  start: string;
  end: string;
  type: "main" | "side" | "cc";
  image?: string;
};

const eventsData = eventsDataRaw as Event[];

function getUtcDay(date: string | Date): Date {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
}

function addUtcDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + amount);
  return result;
}

function eachUtcDayOfInterval(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  for (let d = start.getTime(); d <= end.getTime(); d += 86_400_000) {
    days.push(new Date(d));
  }
  return days;
}

export default function EventTimeline() {
  const [events, setEvents] = useState<Event[]>([]);
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const t = useTranslations("components.EventPage");

  const scrollRef = useHorizontalDragScroll<HTMLDivElement>();

  useEffect(() => {
    const startDates = eventsData.map((e) => getUtcDay(e.start));
    const endDates = eventsData.map((e) => getUtcDay(e.end));

    let min = new Date(Math.min(...startDates.map((d) => d.getTime())));
    let max = new Date(Math.max(...endDates.map((d) => d.getTime())));

    min = addUtcDays(min, -7);
    max = addUtcDays(max, 7);

    setDateRange(eachUtcDayOfInterval(min, max));
    setEvents(eventsData);
  }, []);

  if (events.length === 0 || dateRange.length === 0) return null;

  return (
    <>
      <div className="bg-[#222] px-2 pt-3 pb-1">
        <div className="flex items-center">
          <div className="h-1 w-6 bg-[#BEC93B]" />
          <div className="h-1 w-6 bg-[#F6B347]" />
          <div className="h-1 w-6 bg-[#802520]" />
        </div>
        <h2 className="text-3xl font-black tracking-tight mb-2 font-roboto text-white">
          {t("event_title")}
        </h2>
      </div>

      <div
        ref={scrollRef.containerRef}
        onMouseDown={scrollRef.onMouseDown}
        onMouseMove={scrollRef.onMouseMove}
        onMouseUp={scrollRef.onMouseUp}
        onMouseLeave={scrollRef.onMouseLeave}
        onTouchStart={scrollRef.onTouchStart}
        onTouchMove={scrollRef.onTouchMove}
        onTouchEnd={scrollRef.onTouchEnd}
        className="overflow-x-auto bg-white dark:bg-zinc-900 px-2 sm:px-4 min-w-[350px] cursor-grab active:cursor-grabbing"
      >
        {/* Header - Dates */}
        <div
          className="grid text-xs text-gray-600 mb-2"
          style={{
            gridTemplateColumns: `repeat(${dateRange.length}, minmax(32px, 1fr))`,
          }}
        >
          {dateRange.map((date) => {
            const isFirstOfMonth = format(date, "d") === "1";
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={date.toISOString()}
                className="flex flex-col items-center gap-[2px] pt-[6px]"
              >
                {!isFirstOfMonth && (
                  <span
                    className={`text-[10px] font-normal ${
                      isToday ? "text-red-600" : "text-gray-400"
                    }`}
                  >
                    {format(date, "EEE")}
                  </span>
                )}
                {isFirstOfMonth && (
                  <span className="text-[11px] text-green-600 font-semibold">
                    {format(date, "MMM")}
                  </span>
                )}
                <span
                  className={`text-[13px] ${
                    isToday
                      ? "text-red-600 font-bold"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {format(date, "d")}
                </span>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="space-y-2 relative pb-4">
          {/* Dashed Lines */}
          <div
            className="absolute inset-0 grid pointer-events-none z-0"
            style={{
              gridTemplateColumns: `repeat(${dateRange.length}, minmax(32px, 1fr))`,
            }}
          >
            {dateRange.map((_, idx) => (
              <div
                key={idx}
                className="justify-self-end w-px h-full border-r border-dashed border-gray-300 dark:border-zinc-700"
              />
            ))}
          </div>

          {/* Time Indicator */}
          <div
            className="absolute inset-0 grid z-[9999] pointer-events-none"
            style={{
              gridTemplateColumns: `repeat(${dateRange.length}, minmax(32px, 1fr))`,
            }}
          >
            <TimeIndicator dateRange={dateRange} />
          </div>

          {/* Events */}
          {events.map((event, idx) => (
            <EventBar key={idx} event={event} dateRange={dateRange} />
          ))}
        </div>
      </div>
    </>
  );
}
