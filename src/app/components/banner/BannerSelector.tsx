"use client";

import Image from "next/image";
import gachaBanners from "@/data/gacha-simulator/gacha-banners.json";

type Props = {
  selectedBannerId: string;
  setSelectedBannerId: (id: string) => void;
};

export default function BannerSelector({
  selectedBannerId,
  setSelectedBannerId,
}: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">Select Banner</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {gachaBanners.map((banner) => {
          const isSelected = selectedBannerId === banner.id;

          return (
            <button
              key={banner.id}
              onClick={() => setSelectedBannerId(banner.id)}
              className={`relative border rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 ${
                isSelected
                  ? "border-yellow-400 ring-2 ring-yellow-300"
                  : "border-gray-300"
              }`}
            >
              <Image
                src={banner.image}
                alt={banner.name}
                width={200}
                height={200}
                className="w-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-black/40 flex items-center justify-center text-white text-center px-2 text-sm font-semibold ${
                  isSelected ? "bg-yellow-500/40" : ""
                }`}
              >
                {banner.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
