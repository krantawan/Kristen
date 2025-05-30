"use client";

import { EventSection } from "@/components/ui/EventSection";
import { useEffect, useMemo, useState } from "react";
import eventsDataRaw from "@/data/events.json";
import { differenceInDays, formatDistanceToNow } from "date-fns";

const eventsData = eventsDataRaw as {
  title: string;
  start: string;
  end: string;
  type: string;
  image?: string;
}[];

export default function EventSummarySection() {
  useEffect(() => {
    setNow(new Date());
  }, []);

  const [now, setNow] = useState(new Date());

  const currentEvents = useMemo(() => {
    if (!now) return [];
    return eventsData.filter(
      (e) => new Date(e.start) <= now && now <= new Date(e.end)
    );
  }, [now]);

  const upcomingEvents = useMemo(() => {
    if (!now) return [];
    return eventsData.filter((e) => new Date(e.start) > now);
  }, [now]);

  const nextEventIn = upcomingEvents.length
    ? formatDistanceToNow(new Date(upcomingEvents[0].start), {
        addSuffix: true,
      })
    : "no upcoming schedule";

  return (
    <div className="border-t-5 border-[#BEC93B] border-b-5 bg-[#1b1b1b]">
      <div className="grid grid-cols-1 md:grid-cols-3 px-1 pb-5">
        <EventSection
          title="Ongoing Missions"
          titleColor="text-[#e1fa52]"
          borderColor="border-[#e1fa52]"
          events={currentEvents}
          getStatusText={(e) => {
            const d = differenceInDays(new Date(e.end), now);
            return `${d} day${d !== 1 ? "s" : ""} remaining`;
          }}
        />

        <EventSection
          title="Incoming Operations"
          titleColor="text-[#fa9e52]"
          borderColor="border-[#fa9e52]"
          events={upcomingEvents}
          getStatusText={(e) => {
            const d = differenceInDays(new Date(e.start), now);
            return `Starts in ${d} day${d !== 1 ? "s" : ""}`;
          }}
        />

        <div className="flex flex-col gap-3 px-1">
          <div className="bg-[#222] px-2 pt-3 pb-1 m-0 rounded-b">
            <div className="flex items-center mb-2">
              <div className="h-1 w-6 bg-[#BEC93B]" />
              <div className="h-1 w-6 bg-[#F6B347]" />
              <div className="h-1 w-6 bg-[#802520]" />
            </div>
            <h2 className="text-2xl font-black tracking-tight font-roboto text-[#8a8a8a] uppercase">
              Command Log
            </h2>
          </div>
          <div className="p-0 rounded-b">
            <p className="text-gray-400 text-sm italic">~$ No command log</p>
          </div>
        </div>
      </div>

      {/* Terminal Summary Section */}
      <div className="px-3 pb-6">
        <pre className="bg-[#111] p-4 rounded font-mono text-green-400 text-sm shadow-inner">
          ~$ ark.events --summary → {currentEvents.length} mission
          {currentEvents.length !== 1 ? "s" : ""} in progress → Next operation
          begins {nextEventIn}
        </pre>
      </div>
    </div>
  );
}
