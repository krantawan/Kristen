// gacha-utils.ts

export type BannerRates = {
  base6StarRate: number;
  base5StarRate: number;
  base4StarRate: number;
  pityStart: number;
  pityIncrement: number;
  max6StarRate: number;
};

export type Banner = {
  id: string;
  name: string;
  image: string;
  featured6?: string[];
  featured5?: string[];
};

export type OperatorData = {
  id: string;
  name: string;
  image: string;
  rarity: number;
  isNotObtainable: boolean;
  itemObtainApproach: string;
};

const DEFAULT_BANNER_RATES: BannerRates = {
  base6StarRate: 2,
  base5StarRate: 8,
  base4StarRate: 50,
  pityStart: 50,
  pityIncrement: 2,
  max6StarRate: 50, // 50% (default 70%)
};

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

export function rollRarity(
  pityCounter: number,
  bannerRates: BannerRates
): number {
  const base6StarRate = bannerRates.base6StarRate;
  const base5StarRate = bannerRates.base5StarRate;
  const base4StarRate = bannerRates.base4StarRate;

  let effective6StarRate = base6StarRate;

  // Pity system for 6★
  if (pityCounter >= bannerRates.pityStart) {
    const extraRate =
      (pityCounter - bannerRates.pityStart + 1) * bannerRates.pityIncrement;

    effective6StarRate = Math.min(
      base6StarRate + extraRate,
      bannerRates.max6StarRate
    );
  }

  const roll = Math.random() * 100;

  if (roll < effective6StarRate) return 6;
  if (roll < effective6StarRate + base5StarRate) return 5;
  if (roll < effective6StarRate + base5StarRate + base4StarRate) return 4;
  return 3;
}

export function performGachaRoll(
  banner: Banner,
  operators: OperatorData[],
  pityCounter: number,
  guaranteeCounter: number,
  hasGuaranteed5Or6: boolean
): {
  result: {
    id: string;
    rarity: number;
    isRateUp: boolean;
  };
  updatedPity: number;
  resetGuarantee: boolean;
} {
  const bannerRates = DEFAULT_BANNER_RATES;

  // Guarantee logic: force 5★ on 10th roll if none appeared
  let forcedRarity: number | undefined = undefined;
  if (guaranteeCounter === 9 && !hasGuaranteed5Or6) {
    forcedRarity = 5;
  }

  const rolledRarity = forcedRarity ?? rollRarity(pityCounter, bannerRates);
  const rarity = rolledRarity;

  // Guarantee reset condition: if pulled 5★ or 6★
  const resetGuarantee = rarity >= 5;

  // Filter operator pool
  let availableOperators = operators.filter(
    (op) =>
      op.rarity === rarity &&
      (!limitedOperatorIds.has(op.id) ||
        banner.featured6?.includes(op.id) ||
        banner.featured5?.includes(op.id)) &&
      op.isNotObtainable === false &&
      op.itemObtainApproach === "Recruitment & Headhunting"
  );

  let isRateUp = false;

  if (rarity === 6 && banner.featured6 && banner.featured6.length > 0) {
    if (Math.random() < 0.5) {
      availableOperators = availableOperators.filter((op) =>
        banner.featured6!.includes(op.id)
      );
      isRateUp = true;
    } else {
      availableOperators = availableOperators.filter(
        (op) => !banner.featured6!.includes(op.id)
      );
    }
  } else if (rarity === 5 && banner.featured5 && banner.featured5.length > 0) {
    if (Math.random() < 0.5) {
      availableOperators = availableOperators.filter((op) =>
        banner.featured5!.includes(op.id)
      );
      isRateUp = true;
    } else {
      availableOperators = availableOperators.filter(
        (op) => !banner.featured5!.includes(op.id)
      );
    }
  }

  // fallback ป้องกันไม่มี operator ให้ roll
  if (availableOperators.length === 0) {
    availableOperators = operators.filter(
      (op) =>
        op.rarity === rarity &&
        op.isNotObtainable === false &&
        op.itemObtainApproach === "Recruitment & Headhunting"
    );
  }

  const selectedOperator =
    availableOperators[Math.floor(Math.random() * availableOperators.length)];

  const updatedPity = rarity === 6 ? 0 : pityCounter + 1;

  return {
    result: {
      id: selectedOperator.id,
      rarity,
      isRateUp,
    },
    updatedPity,
    resetGuarantee,
  };
}
