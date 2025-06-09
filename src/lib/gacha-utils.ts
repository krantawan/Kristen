// gacha-utils.ts

export type Operator = {
  id: string;
  name: string;
  rarity: number;
  image: string;
  profession?: string;
  position?: string;
  subProfessionId?: string;
  tagList?: string[];
};

export type GachaBanner = {
  id: string;
  name: string;
  image?: string;
  featured6?: string[];
  featured5?: string[];
};

// Set ของ limited operators → Global
export const limitedOperatorIds = new Set([
  "char_113_cqbw",
  "char_391_rosmon",
  "char_1012_skadi2",
  "char_1014_nearl2",
  "char_1023_ghost2",
  "char_1028_texas2",
  "char_249_mlyss",
  "char_245_cello",
  "char_1035_wisdel",
  "char_1038_whitw2",
  "char_1041_angel2",
  "char_1013_chen2",
  "char_1026_gvial2",
  "char_1016_agoat2",
  "char_4058_pepe",
  "char_2014_nian",
  "char_2015_dusk",
  "char_2023_ling",
  "char_2024_chyue",
  "char_2025_shu",
  "char_2026_yu",
  "char_1029_yato2",
  "char_1030_noirc2",
  "char_4123_ela",
  "char_4124_iana",
  "char_458_rfrost",
  "char_456_ash",
  "char_457_blitz",
  "char_4125_rdoc",
  "char_4144_chilc",
  "char_4142_laios",
  "char_4141_marcil",
  "char_4126_fuze",
]);

// Manual roll → ถ้าอยากใช้เอง
export function rollRarity(rarityRates: Record<string, number>): number {
  const roll = Math.random() * 100;
  let acc = 0;

  for (const rarity of ["6", "5", "4", "3"]) {
    acc += rarityRates[rarity] ?? 0;
    if (roll <= acc) {
      return parseInt(rarity);
    }
  }

  return 3;
}

export function performGachaRoll(
  banner: GachaBanner,
  operators: Operator[],
  pityCounter: number,
  guaranteeCounter: number
) {
  // 1. Calculate current 6⭐ rate
  let sixStarRate = 2;
  if (pityCounter >= 50) {
    sixStarRate = Math.min(100, 2 + (pityCounter - 49) * 2);
  }

  // 2. Build roll table
  const rollTable = [
    { rarity: 6, rate: sixStarRate },
    { rarity: 5, rate: 8 },
    { rarity: 4, rate: 50 },
    { rarity: 3, rate: 40 },
  ];

  // 3. Guarantee 5★+ logic
  let force5Or6 = false;
  if (guaranteeCounter >= 9) {
    force5Or6 = true;
  }

  // 4. Roll rarity
  const totalRate = rollTable.reduce((sum, item) => sum + item.rate, 0);
  const roll = Math.random() * totalRate;

  let pickedRarity = 3;

  if (force5Or6) {
    pickedRarity = Math.random() < 0.5 ? 5 : 6;
  } else {
    let acc = 0;
    for (const entry of rollTable) {
      acc += entry.rate;
      if (roll < acc) {
        pickedRarity = entry.rarity;
        break;
      }
    }
  }

  // 5. Pick operator from corresponding pool
  const pool = operators.filter(
    (op) =>
      op.rarity === pickedRarity && // Limited จะไม่เข้า pool → ยกเว้น featured
      (!limitedOperatorIds.has(op.id) ||
        banner.featured6?.includes(op.id) ||
        banner.featured5?.includes(op.id))
  );

  let pickedOperator: Operator;
  let isRateUp = false;

  // === 6 Rate up ===
  if (pickedRarity === 6 && banner.featured6?.length) {
    isRateUp = Math.random() < 0.5;
    if (isRateUp) {
      const featuredOps = pool.filter((op) =>
        banner.featured6!.includes(op.id)
      );
      pickedOperator =
        featuredOps[Math.floor(Math.random() * featuredOps.length)];
    } else {
      const nonFeatured = pool.filter(
        (op) => !banner.featured6!.includes(op.id)
      );
      pickedOperator =
        nonFeatured[Math.floor(Math.random() * nonFeatured.length)];
    }
  }

  // === 5 Rate up ===
  else if (pickedRarity === 5 && banner.featured5?.length) {
    isRateUp = Math.random() < 0.5;
    if (isRateUp) {
      const featuredOps = pool.filter((op) =>
        banner.featured5!.includes(op.id)
      );
      pickedOperator =
        featuredOps[Math.floor(Math.random() * featuredOps.length)];
    } else {
      const nonFeatured = pool.filter(
        (op) => !banner.featured5!.includes(op.id)
      );
      pickedOperator =
        nonFeatured[Math.floor(Math.random() * nonFeatured.length)];
    }
  }

  // === No rate up ===
  else {
    pickedOperator = pool[Math.floor(Math.random() * pool.length)];
    isRateUp = false; // default
  }

  // 6. Update pity & guarantee
  const resetPity = pickedRarity === 6;
  const resetGuarantee = pickedRarity >= 5;

  return {
    result: {
      id: pickedOperator.id,
      name: pickedOperator.name,
      image: pickedOperator.image,
      rarity: pickedOperator.rarity,
      isRateUp: isRateUp,
    },
    updatedPity: resetPity ? 0 : pityCounter + 1,
    resetGuarantee,
  };
}
