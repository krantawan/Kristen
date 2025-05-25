"use client";

import Image from "next/image";

interface OperatorItemProps {
  name: string;
  image: string;
  stars: number;
}

export default function OperatorItem({ name, image, stars }: OperatorItemProps) {
  const borderColors: Record<number, string> = {
    6: "#FFD700",
    5: "#f59e0b",
    4: "#3b82f6",
    3: "#9ca3af",
    2: "#6b7280",
    1: "#374151",
  };

  const borderColor = borderColors[stars] || "#4b3d2e";

  return (
    <div
      className="flex flex-col items-center w-[110px] h-full group"
      title={`${name} (${stars}★)`}
    >
      <div className="transition-transform duration-300 group-hover:-translate-y-1 h-full flex flex-col">
        {/* รูปภาพ */}
        <Image
          src={image}
          alt={`${name} ${stars}★`}
          width={110}
          height={110}
          className="object-cover rounded-t-md"
        />

        {/* เส้นขอบสีตามดาว */}
        <div
          className="h-[4px] w-full transition-all duration-300"
          style={{ backgroundColor: borderColor }}
        />

        {/* กล่องชื่อ + ดาว */}
        <div className="w-full bg-[#4b3d2e] text-center rounded-b-md py-2 flex flex-col justify-center flex-grow">
          <span className="text-white font-bold text-sm group-hover:text-[#BEC93B]">
            {name}
          </span>
          <span className="text-yellow-400 text-xs font-semibold leading-tight">
            {"★".repeat(stars)}
          </span>
        </div>
      </div>
    </div>
  );
}
