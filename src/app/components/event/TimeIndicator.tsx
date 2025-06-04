"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";

type Props = {
  dateRange: Date[];
};

export default function TimeIndicator({ dateRange }: Props) {
  const today = new Date();
  const index = dateRange.findIndex(
    (d) => format(d, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
  );

  const [timeString, setTimeString] = useState("");
  const [offsetPx, setOffsetPx] = useState(0);
  const [colorClass, setColorClass] = useState("bg-yellow-500");
  const [labelClass, setLabelClass] = useState("bg-yellow-100 text-yellow-700");
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const secondsSinceMidnight =
        now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const percent = secondsSinceMidnight / 86400;

      setTimeString(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );

      if (cellRef.current) {
        const cellWidth = cellRef.current.offsetWidth;
        const offset = percent * cellWidth;
        setOffsetPx(offset);
      }

      const hour = now.getHours();

      let color = "bg-yellow-500";
      let label = "bg-yellow-100 text-yellow-700";

      if (hour < 6) {
        color = "bg-blue-600";
        label = "bg-blue-100 text-blue-800";
      } else if (hour < 12) {
        color = "bg-yellow-500";
        label = "bg-yellow-100 text-yellow-700";
      } else if (hour < 18) {
        color = "bg-orange-500";
        label = "bg-orange-100 text-orange-800";
      } else {
        color = "bg-purple-600";
        label = "bg-purple-100 text-purple-700";
      }

      setColorClass(color);
      setLabelClass(label);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (index === -1) return null;

  const column = index + 1;

  return (
    <div
      className="relative h-full"
      style={{
        gridColumnStart: column,
        gridColumnEnd: column + 1,
      }}
    >
      {/* helper cell for measuring width */}
      <div ref={cellRef} className="absolute inset-0 pointer-events-none" />

      {/* time line */}
      <div
        className={`absolute top-0 bottom-0 w-[2px] z-50 transition-all duration-200 ${colorClass}`}
        style={{
          left: 0,
          transform: `translateX(calc(-100% + ${offsetPx}px))`,
        }}
      />

      {/* label */}
      <div
        className={`absolute -top-1 z-50 text-[11px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap transition-all duration-200 ${labelClass}`}
        style={{
          left: 0,
          transform: `translateX(calc(-50% + ${offsetPx}px))`,
        }}
      >
        {timeString}
      </div>
    </div>
  );
}
