const limitedOperatorIds = new Set([
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

const OperatorRarity = {
  6: "bg-amber-500",
  5: "bg-yellow-200",
  4: "bg-purple-300",
  3: "bg-blue-500",
  2: "bg-lime-300",
  1: "bg-white",
};

const OperatorRarityBorder = {
  6: "border-amber-500",
  5: "border-yellow-200",
  4: "border-purple-300",
  3: "border-blue-500",
  2: "border-lime-300",
  1: "border-white",
};

const OperatorRarityText = {
  6: "text-amber-500",
  5: "text-yellow-200",
  4: "text-purple-300",
  3: "text-blue-500",
  2: "text-lime-300",
  1: "text-white",
};

const OperatorFactionImage = {
  "Lungmen Guard Department":
    "bg-[url('/assets/faction/Lungmen Guard Department.webp')]",
  Blacksteel: "bg-[url('/assets/faction/blacksteel.png')]",
};
export {
  limitedOperatorIds,
  OperatorRarity,
  OperatorRarityBorder,
  OperatorRarityText,
  OperatorFactionImage,
};
