"use client";

import { EventSection } from "@/components/ui/EventSection";
import { useEffect, useMemo, useState } from "react";
import eventsDataRaw from "@/data/events.json";
import { formatDistanceToNow } from "date-fns";
import { useTranslations, useLocale } from "next-intl";
import { getDateLocale } from "@/lib/date/getDateLocale";

const eventsData = eventsDataRaw as {
  title: string;
  start: string;
  end: string;
  type: string;
  image?: string;
}[];

export default function EventSummarySection() {
  const t = useTranslations("components.EventPage.event_summary");
  const locale = useLocale();
  const dateLocale = getDateLocale(locale);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setNow(new Date());
  }, []);

  const currentEvents = useMemo(() => {
    return eventsData.filter(
      (e) => new Date(e.start) <= now && now <= new Date(e.end)
    );
  }, [now]);

  const upcomingEvents = useMemo(() => {
    return eventsData
      .filter((e) => new Date(e.start) > now)
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      );
  }, [now]);

  const nextEventIn = upcomingEvents.length
    ? formatDistanceToNow(new Date(upcomingEvents[0].start), {
        addSuffix: false,
        includeSeconds: false,
        locale: dateLocale,
      })
        .replace(/^about\s*/, "")
        .replace(/^ประมาณ\s*/, "")
    : "no upcoming schedule";

  return (
    <div className="border-t-5 border-[#BEC93B] border-b-5 bg-[#1b1b1b]">
      <div className="grid grid-cols-1 md:grid-cols-3 px-1 pb-5">
        {/* Ongoing */}
        <EventSection
          title={t("event_summary_ongoing")}
          titleColor="text-[#e1fa52]"
          borderColor="border-[#e1fa52]"
          events={currentEvents}
          getStatusText={(e) => {
            const end = new Date(e.end);
            const rawDuration = formatDistanceToNow(end, {
              addSuffix: false,
              includeSeconds: false,
              locale: dateLocale,
            })
              .replace(/^about\s*/, "")
              .replace(/^ประมาณ\s*/, "");

            return t("ends_in_duration", { duration: rawDuration });
          }}
        />

        {/* Incoming */}
        <EventSection
          title={t("event_summary_incoming")}
          titleColor="text-[#fa9e52]"
          borderColor="border-[#fa9e52]"
          events={upcomingEvents}
          getStatusText={(e) => {
            const start = new Date(e.start);
            const rawDuration = formatDistanceToNow(start, {
              addSuffix: false,
              includeSeconds: false,
              locale: dateLocale,
            })
              .replace(/^about\s*/, "")
              .replace(/^ประมาณ\s*/, "");

            return t("starts_in_duration", { duration: rawDuration });
          }}
        />

        {/* Command Log */}
        <div className="flex flex-col gap-3 px-1">
          <div className="bg-[#222] px-2 pt-3 pb-1 m-0 rounded-b">
            <div className="flex items-center mb-2">
              <div className="h-1 w-6 bg-[#BEC93B]" />
              <div className="h-1 w-6 bg-[#F6B347]" />
              <div className="h-1 w-6 bg-[#802520]" />
            </div>
            <h2 className="text-2xl font-black tracking-tight font-roboto text-[#8a8a8a] uppercase">
              {t("event_summary_command_log")}
            </h2>
          </div>
          <div className="p-0 rounded-b">
            <p className="text-gray-400 text-sm italic">
              ~$ {t("event_summary_command_log_desc")}
            </p>
          </div>
        </div>
      </div>

      {/* Terminal */}
      <div className="px-3 pb-6">
        <pre className="bg-[#111] p-4 rounded font-mono text-green-400 text-sm shadow-inner">
          ~$ ark.events --summary → {currentEvents.length} mission
          {currentEvents.length !== 1 ? "s" : ""} in progress → Next operation
          begins in {nextEventIn}
        </pre>
      </div>
    </div>
  );
}
