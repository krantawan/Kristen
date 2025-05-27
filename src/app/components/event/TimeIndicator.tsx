"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  dateRange: Date[];
};

export default function TimeIndicator({ dateRange }: Props) {
  const today = new Date();
  const index = dateRange.findIndex(
    (d) => d.toDateString() === today.toDateString()
  );

  const [timeString, setTimeString] = useState("");
  const [offsetPx, setOffsetPx] = useState(0);
  const [timeColor, setTimeColor] = useState("bg-yellow-400");
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
      if (hour >= 6 && hour < 18) {
        setTimeColor("bg-yellow-400"); // daytime
      } else {
        setTimeColor("bg-[#52357B]"); // nighttime
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (index === -1) return null;

  const column = index + 1;

  const labelBgColor =
    timeColor === "bg-yellow-400"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-[#52357B] text-white";

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

      {/* red time line with transition and dynamic color */}
      <div
        className={`absolute top-0 bottom-0 w-[2px] z-50 transition-all duration-300 ${timeColor}`}
        style={{
          left: "50%",
          transform: `translateX(calc(-50% + ${offsetPx}px))`,
        }}
      />

      {/* label */}
      <div
        className={`absolute -top-1 z-50 text-[10px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap transition-all duration-300 ${labelBgColor}`}
        style={{
          left: "50%",
          transform: `translateX(calc(-50% + ${offsetPx}px))`,
        }}
      >
        {timeString}
      </div>
    </div>
  );
}
