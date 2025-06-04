"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import EventBar from "@/app/components/event/EventBar";
import eventsDataRaw from "@/data/events.json";
import TimeIndicator from "./TimeIndicator";
import { useTranslations } from "next-intl";

type Event = {
  title: string;
  start: string;
  end: string;
  type: "main" | "side" | "cc";
  image?: string;
};

const eventsData = eventsDataRaw as Event[];

function getUtcDay(dateString: string | Date): Date {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
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

  useEffect(() => {
    const startDates = eventsData.map((e) => getUtcDay(e.start));
    const endDates = eventsData.map((e) => getUtcDay(e.end));

    let minDate = new Date(Math.min(...startDates.map((d) => d.getTime())));
    let maxDate = new Date(Math.max(...endDates.map((d) => d.getTime())));

    minDate = addUtcDays(minDate, -7);
    maxDate = addUtcDays(maxDate, 7);

    const days = eachUtcDayOfInterval(minDate, maxDate);

    setDateRange(days);
    setEvents(eventsData);
  }, []);

  if (events.length === 0 || dateRange.length === 0) return null;

  return (
    <>
      <div className="bg-[#222] px-2 pt-3 pb-1">
        {/* Header Bar */}
        <div className="flex items-center">
          <div className="h-1 w-6 bg-[#BEC93B]" />
          <div className="h-1 w-6 bg-[#F6B347]" />
          <div className="h-1 w-6 bg-[#802520]" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black tracking-tight mb-2 font-roboto text-white">
          {t("event_title")}
        </h2>
      </div>
      <div className="overflow-x-auto bg-white dark:bg-zinc-900 px-2 sm:px-4 min-w-[350px]">
        {/* Header แสดงวันที่ */}
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
                {!isFirstOfMonth ? (
                  isToday ? (
                    <span className="text-[10px] text-red-600 font-normal">
                      {format(date, "EEEEEE")}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-normal">
                      {format(date, "EEEEEE")}
                    </span>
                  )
                ) : null}

                {isFirstOfMonth ? (
                  <span className="text-[11px] text-green-600 font-semibold">
                    {format(date, "MMM")}
                  </span>
                ) : null}

                <span
                  className={`text-[13px] leading-none ${
                    isToday
                      ? "text-red-600 font-bold rounded"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {format(date, "d")}
                </span>
              </div>
            );
          })}
        </div>

        {/* แถวหลักของ Timeline */}
        <div className="space-y-2 relative pb-4">
          {/* เส้นคั่นวันแบบเส้นประตรงกลาง */}
          <div
            className="absolute inset-0 grid pointer-events-none z-0"
            style={{
              gridTemplateColumns: `repeat(${dateRange.length}, minmax(32px, 1fr))`,
            }}
          >
            {dateRange.map((_, idx) => (
              <div
                key={idx}
                className="justify-self-end  w-px h-full border-r border-dashed border-gray-300 dark:border-zinc-700"
              />
            ))}
          </div>

          <div
            className="absolute inset-0 grid z-[9999] pointer-events-none"
            style={{
              gridTemplateColumns: `repeat(${dateRange.length}, minmax(32px, 1fr))`,
            }}
          >
            <TimeIndicator dateRange={dateRange} />
          </div>

          {/* Event แสดงต่อบรรทัด */}
          {events.map((event, idx) => (
            <EventBar key={idx} event={event} dateRange={dateRange} />
          ))}
        </div>
      </div>
    </>
  );
}
