"use client";

import { useState } from "react";
import gachaBanners from "@/data/gacha-simulator/gacha-banners.json";

export default function useGachaSimulator(selectedBannerId: string) {
  const [pityCounter, setPityCounter] = useState<number>(0);

  const roll = (count: number): string[] => {
    const banner = gachaBanners.find((b) => b.id === selectedBannerId);
    if (!banner) {
      console.error(`Banner not found: ${selectedBannerId}`);
      return [];
    }

    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      const rolledRarity = getRolledRarity(banner, pityCounter);

      // pity logic → ถ้า roll ได้ 6⭐ → reset pity → ถ้าไม่ได้ → pity++
      if (rolledRarity === 6) {
        setPityCounter(0);
      } else {
        setPityCounter((prev) => prev + 1);
      }

      // roll operator
      const operatorId = rollOperatorFromPool(banner, rolledRarity);
      if (operatorId) {
        results.push(operatorId);
      }
    }

    return results;
  };

  return {
    pityCounter,
    roll,
  };
}

// Function roll rarity → ใช้ pity + rarityRates ของ banner
function getRolledRarity(
  banner: (typeof gachaBanners)[number],
  pityCounter: number
): number {
  // Basic pity logic → เพิ่มโอกาส 6⭐ หลัง 50 pull (ตัวอย่างง่ายๆ)
  let pityBonus = 0;
  if (pityCounter >= 50) {
    pityBonus = (pityCounter - 49) * 2; // +2% ต่อ pull หลัง 50
  }

  // สร้าง cumulative rarity pool
  const pool: { rarity: number; weight: number }[] = [];
  let totalWeight = 0;
  for (const rarityStr of Object.keys(banner.rarityRates)) {
    const rarity = parseInt(rarityStr, 10);
    let weight =
      banner.rarityRates[rarityStr as keyof typeof banner.rarityRates];

    if (rarity === 6) {
      weight += pityBonus;
    }

    pool.push({ rarity, weight });
    totalWeight += weight;
  }

  // Roll
  const rand = Math.random() * totalWeight;
  let cumulative = 0;
  for (const entry of pool) {
    cumulative += entry.weight;
    if (rand < cumulative) {
      return entry.rarity;
    }
  }

  return 3; // fallback ปลอดภัย
}

// Function roll operator id จาก pool + rateUp
function rollOperatorFromPool(
  banner: (typeof gachaBanners)[number],
  rarity: number
): string | null {
  const rarityStr = rarity.toString();
  const poolIds = banner.pool[rarityStr as keyof typeof banner.pool] || [];
  if (!poolIds || poolIds.length === 0) return null;

  const rateUpIds =
    banner.rateUp?.[rarityStr as keyof typeof banner.rateUp] ?? [];

  // ตัวอย่าง: 50% roll rate up → 50% roll global pool
  const isRateUp = rateUpIds.length > 0 && Math.random() < 0.5;

  if (isRateUp && rateUpIds.length > 0) {
    return randomPick(rateUpIds);
  } else {
    return randomPick(poolIds);
  }
}

function randomPick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
