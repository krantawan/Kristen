"use client";

import { useEffect, useState } from "react";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import EventBar from "@/app/components/event/EventBar";
import eventsDataRaw from "@/data/events.json";
import TimeIndicator from "./TimeIndicator";

type Event = {
  title: string;
  start: string;
  end: string;
  type: "main" | "side" | "cc";
  image?: string;
};

const eventsData = eventsDataRaw as Event[];

export default function EventTimeline() {
  const [events, setEvents] = useState<Event[]>([]);
  const [dateRange, setDateRange] = useState<Date[]>([]);

  useEffect(() => {
    setEvents(eventsData);

    const startDates = eventsData.map((e) => parseISO(e.start));
    const endDates = eventsData.map((e) => parseISO(e.end));

    const minDate = new Date(Math.min(...startDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...endDates.map((d) => d.getTime())));

    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 7);

    const days = eachDayOfInterval({ start: minDate, end: maxDate });
    setDateRange(days);
  }, []);

  if (events.length === 0 || dateRange.length === 0)
    return <div>Loading timeline...</div>;

  return (
    <div className="overflow-x-auto border border-gray-300 rounded bg-white dark:bg-zinc-900 px-2 sm:px-4 min-w-[350px]">
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
                <span className="text-[10px] text-gray-400 font-normal">
                  {format(date, "EEEEEE")}
                </span>
              ) : null}

              {isFirstOfMonth ? (
                <span className="text-[11px] text-green-600 font-semibold">
                  {format(date, "MMM")}
                </span>
              ) : null}

              <span
                className={`text-[13px] leading-none ${
                  isToday
                    ? "bg-red-100 text-red-600 font-bold px-1 rounded"
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
              className="justify-self-center w-px h-full border-r border-dashed border-gray-300 dark:border-zinc-700"
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
  );
}
