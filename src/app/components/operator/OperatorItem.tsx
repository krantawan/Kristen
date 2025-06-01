"use client";

import Image from "next/image";

interface OperatorItemProps {
  name: string;
  image: string;
  stars: number;
}

export default function OperatorItem({
  name,
  image,
  stars,
}: OperatorItemProps) {
  const borderColors: Record<number, string> = {
    6: "#f59e0b",
    5: "#FFE8CD",
    4: "#7ea2db",
    3: "#9ca3af",
    2: "#6b7280",
    1: "#374151",
  };

  const hoverTextColor: Record<number, string> = {
    6: "group-hover:text-[#f59e0b]",
    5: "group-hover:text-[#FFE8CD]",
    4: "group-hover:text-[#7ea2db]",
    3: "group-hover:text-[#9ca3af]",
    2: "group-hover:text-[#6b7280]",
    1: "group-hover:text-[#374151]",
  };

  const borderColor = borderColors[stars] || "#4b3d2e";

  return (
    <div
      className={`flex flex-col items-center w-[110px] h-full group backdrop-blur-sm rounded-lg transition-all duration-300 cursor-pointer group-hover:scale-105 border ${
        stars === 6
          ? "border-[#4b3d2e] hover:border-[#f59e0b] group-hover:shadow-[0_0_6px_2px_rgba(245,158,11,0.5)]"
          : stars === 5
          ? "border-[#4b3d2e] hover:border-[#FFE8CD] group-hover:shadow-[0_0_6px_2px_rgba(255,232,205,0.5)]"
          : stars === 4
          ? "border-[#4b3d2e] hover:border-[#7ea2db] group-hover:shadow-[0_0_6px_2px_rgba(126,162,219,0.5)]"
          : stars === 3
          ? "border-[#4b3d2e] hover:border-[#9ca3af] group-hover:shadow-[0_0_6px_2px_rgba(156,163,175,0.5)]"
          : stars === 2
          ? "border-[#4b3d2e] hover:border-[#6b7280] group-hover:shadow-[0_0_6px_2px_rgba(107,114,128,0.5)]"
          : stars === 1
          ? "border-[#4b3d2e] hover:border-[#374151] group-hover:shadow-[0_0_6px_2px_rgba(55,65,81,0.5)]"
          : "border-[#4b3d2e] hover:border-orange-400"
      }`}
      title={`${name} (${stars}★)`}
      style={{
        borderBottomWidth: "2px",
        borderBottomColor: borderColor,
      }}
    >
      <div className="h-full flex flex-col">
        <div className="relative w-[110px] h-[110px]">
          {stars > 0 && (
            <div className="absolute top-0 left-0 right-0 flex justify-center mt-[-16px] z-10 pointer-events-none">
              {Array.from({ length: stars }).map((_, i) => (
                <span
                  key={i}
                  className="text-white text-[20px] drop-shadow-[0_0_2px_#000]"
                  style={{ color: borderColors[stars] }}
                >
                  ★
                </span>
              ))}
            </div>
          )}

          <Image
            src={image}
            alt={`${name} ${stars}★`}
            width={110}
            height={110}
            draggable={false}
            className="object-cover rounded-t-md"
          />

          <div
            className={`absolute bottom-0 w-full bg-black/40 text-white font-bold font-roboto text-sm text-center ${hoverTextColor[stars]} transition-all duration-300`}
          >
            {name}
          </div>
        </div>
        <div
          className="h-[3px] w-[calc(100%-4px)] mx-auto rounded-b-md transition-all duration-300"
          style={{ backgroundColor: borderColor }}
        />
      </div>
    </div>
  );
}
