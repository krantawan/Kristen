"use client";

import { useState } from "react";
import gachaBanners from "@/data/gacha-simulator/gacha-banners.json";
import operators from "@/data/operators.json";
import BannerSelector from "@/app/components/banner/BannerSelector";
import Image from "next/image";

import useGachaSimulator from "@/lib/hooks/useGachaSimulator";

export default function GachaSimulatorPage() {
  const [selectedBannerId, setSelectedBannerId] = useState<string>(
    gachaBanners[0].id
  );
  const [results, setResults] = useState<string[]>([]);

  const { pityCounter, roll } = useGachaSimulator(selectedBannerId);

  const handleSinglePull = () => {
    const result = roll(1);
    setResults([...result, ...results]);
  };

  const handleMultiPull = () => {
    const result = roll(10);
    setResults([...result, ...results]);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">Gacha Simulator</h1>

      <BannerSelector
        selectedBannerId={selectedBannerId}
        setSelectedBannerId={setSelectedBannerId}
      />

      {/* Pull Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleSinglePull}
          className="px-6 py-3 bg-yellow-500 text-white font-bold text-lg rounded hover:bg-yellow-600 transition"
        >
          Single Pull
        </button>
        <button
          onClick={handleMultiPull}
          className="px-6 py-3 bg-blue-600 text-white font-bold text-lg rounded hover:bg-blue-700 transition"
        >
          10 Pull
        </button>
        <button
          onClick={() => setResults([])}
          className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-100"
        >
          Clear
        </button>
      </div>

      {/* Pity Counter */}
      <p className="text-sm text-gray-500 mb-6">Pity Counter: {pityCounter}</p>

      {/* Result Box */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {results.map((opId, index) => {
          const op = operators.find((o) => o.id === opId);
          if (!op) return null;

          return (
            <div
              key={`${opId}-${index}`}
              className={`border-4 p-2 rounded text-center relative transition-transform hover:scale-105 ${
                op.rarity === 6
                  ? "border-yellow-400"
                  : op.rarity === 5
                  ? "border-purple-500"
                  : op.rarity === 4
                  ? "border-blue-400"
                  : "border-gray-300"
              }`}
            >
              <Image
                src={op.image}
                alt={op.name}
                width={200}
                height={200}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <p className="font-bold text-sm">{op.name}</p>
              <p className="text-sm">{op.rarity}⭐</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
