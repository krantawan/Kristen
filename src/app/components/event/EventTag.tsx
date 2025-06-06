"use client";

import { getEventColor } from "@/lib/event-utils";

const legends = [
  { label: "Main Story", type: "main" },
  { label: "Side Story", type: "side" },
  { label: "Contingency Contract", type: "cc" },
  { label: "Gacha", type: "gacha" },
  { label: "Kernel", type: "kernel" },
];

export default function EventTag() {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-2 text-sm px-2 border-b border-gray-300 dark:border-gray-700">
      {legends.map((legend) => (
        <div key={legend.label} className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded ${getEventColor(
              legend.type
            )} transition-transform transform hover:scale-110`}
            style={{ cursor: "pointer" }}
          />
          <span className="text-gray-900 dark:text-gray-200">
            {legend.label}
          </span>
        </div>
      ))}
    </div>
  );
}
