"use client";

import Image from "next/image";

interface OperatorItemProps {
  name: string;
  image: string;
  stars: number;
}

export default function OperatorItem({ name, image, stars }: OperatorItemProps) {
  const borderColors: Record<number, string> = {
    6: "#f59e0b",
    5: "#FFE8CD",
    4: "#3b82f6",
    3: "#9ca3af",
    2: "#6b7280",
    1: "#374151",
  };

  const borderColor = borderColors[stars] || "#4b3d2e";

  return (
    <div
  className={`flex flex-col items-center w-[110px] h-full group backdrop-blur-sm rounded-lg transition-all duration-300 cursor-pointer group-hover:scale-105 border ${
    stars === 6
      ? "border-[#4b3d2e] hover:border-[#f59e0b] group-hover:shadow-[0_0_6px_2px_rgba(245,158,11,0.5)]"
      : stars === 5
      ? "border-[#4b3d2e] hover:border-[#FFE8CD] group-hover:shadow-[0_0_6px_2px_rgba(255,232,205,0.5)]"
      : "border-[#4b3d2e] hover:border-orange-400"
  }`}
  title={`${name} (${stars}★)`}
  style={{
    borderBottomWidth: "2px",
    borderBottomColor: borderColor,
  }}
>
      <div className="h-full flex flex-col">
        {/* กล่องรูปภาพ + ชื่อทับรูป */}
        <div className="relative w-[110px] h-[110px]">
          {/* รูปภาพ */}
          <Image
            src={image}
            alt={`${name} ${stars}★`}
            width={110}
            height={110}
            className="object-cover rounded-t-md"
          />

          {/* ชื่อทับรูป */}
          <div className="absolute bottom-0 w-full bg-black/40 text-white font-bold font-roboto text-sm text-center group-hover:text-[#BEC93B]">
            {name}
          </div>
        </div>

        {/* เส้นขอบล่าง */}
        <div
          className="h-[4px] w-[calc(100%-4px)] mx-auto rounded-b-md transition-all duration-300"
          style={{ backgroundColor: borderColor }}
        />
      </div>
    </div>
  );
}
