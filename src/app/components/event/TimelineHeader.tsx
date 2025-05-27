"use client";

import { format } from "date-fns";

type Props = {
  timelineStart: Date;
  timelineEnd: Date;
};

export default function TimelineHeader({ timelineStart, timelineEnd }: Props) {
  return (
    <div className="flex justify-between text-xs text-gray-500 mb-2">
      <span>{format(timelineStart, "dd MMM yyyy")}</span>
      <span className="text-red-500 font-semibold">
        วันนี้: {format(new Date(), "dd MMM yyyy")}
      </span>
      <span>{format(timelineEnd, "dd MMM yyyy")}</span>
    </div>
  );
}
