"use client";

import operatorsData from "@/data/operators.json";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export default function OperatorsGrid() {
  const t = useTranslations("components.OperatorsPage");

  const operators = operatorsData as {
    id: string;
    name: string;
    rarity: number;
    image: string;
    profession: string;
    subProfessionId: string;
    position: string;
    tagList: string[];
    nationId: string;
    appellation: string;
  }[];

  const professionLabels: Record<string, string> = {
    MEDIC: "Medic",
    WARRIOR: "Guard",
    SPECIAL: "Specialist",
    SNIPER: "Sniper",
    SUPPORT: "Supporter",
    TANK: "Defender",
    PIONEER: "Vanguard",
    CASTER: "Caster",
  };

  const subProfessionLabels: Record<string, string> = {
    // Medic
    physician: "Medic",
    ringhealer: "Multi-target Medic",
    healer: "Therapist",
    wandermedic: "Wandering Medic",
    incantationmedic: "Incantation Medic",
    chainhealer: "Chain Medic",

    // Guard (WARRIOR → Guard)
    fearless: "Dreadnought",
    centurion: "Centurion",
    instructor: "Instructor",
    lord: "Lord",
    artsfghter: "Arts Fighter",
    sword: "Sword Master",
    musha: "Musha",
    crusher: "Crusher",
    reaper: "Reaper",
    fighter: "Fighter",
    librator: "Liberator",
    hammer: "Earthshaker",

    // Defender (TANK → Defender)
    protector: "Protector",
    guardian: "Guardian",
    unyield: "Juggernaut",
    artsprotector: "Arts Protector",
    shotprotector: "Sentry Protector",
    fortress: "Fortress",
    duelist: "Duelist",
    primprotector: "Primal Protector",

    // Vanguard (PIONEER → Vanguard)
    pioneer: "Pioneer",
    charger: "Charger",
    bearer: "Standard Bearer",
    tactician: "Tactician",
    agent: "Agent",

    // Sniper
    fastshot: "Marksman",
    aoesniper: "Artilleryman",
    fangs: "Heavyshooter",
    siegesniper: "Besieger",
    reaperrange: "Spreadshooter",
    closerange: "Heavyshooter",
    longrange: "Deadeye",
    hunter: "Hunter",
    bombarder: "Flinger",
    loopshooter: "Loopshooter",

    // Caster
    corecaster: "Core Caster",
    splashcaster: "Splash Caster",
    funnel: "Mech-accord Caster",
    mystic: "Mystic Caster",
    chain: "Chain Caster",
    phalanx: "Phalanx Caster",
    blastcaster: "Blast Caster",
    primcaster: "Primal Caster",

    // Specialist (SPECIAL → Specialist)
    fastredeploy: "Executor Specialist",
    hookmaster: "Hookmaster",
    pusher: "Push Stroker",
    executor: "Executor Specialist",
    geek: "Geek",
    dollkeeper: "Dollkeeper",
    merchant: "Merchant",
    artillerist: "Artillerist",
    summoner: "Summoner",
    traper: "Trapper",
    alchemist: "Alchemist",
    skywalker: "Skyranger",
    stalker: "Ambusher",

    // Supporter (SUPPORT → Supporter)
    buffer: "Buffer",
    ritualist: "Ritualist",
    slower: "Decel Binder",
    craftsman: "Artificer",
    underminer: "Hexer",
    bard: "Bard",
    summoner_supporter: "Summoner",
    blessing: "Abjurer",
  };

  const limitedOperatorIds = new Set([
    // Limited Operators
    "char_113_cqbw", // W
    "char_391_rosmon", // Rosmontis
    "char_1012_skadi2", // Skadi the Corrupting Heart
    "char_1014_nearl2", // Nearl the Radiant Knight
    "char_1023_ghost2", // Specter the Unchained
    "char_1028_texas2", // Texas the Omertosa
    "char_249_mlyss", // Muelsyse
    "char_245_cello", // Virtuosa
    "char_1035_wisdel", // Wiš'adel
    "char_1038_whitw2", // Lappland the Decadenza
    "char_003_kalts", // Kal'tsit
    //"char_xxx_", // Exusiai the New Covenant

    // Carnival
    "char_1013_chen2", // Ch'en the Holungday
    "char_1026_gvial2", // Gavial the Invincible
    "char_1016_agoat2", // Eyjafjalla the Hvít Aska
    "char_4058_pepe", // Pepe

    // Festival
    "char_2014_nian", // Nian
    "char_2015_dusk", // Dusk
    "char_2023_ling", // Ling
    "char_2024_chyue", // Chongyue
    "char_2025_shu", // Shu

    // Crossover
    "char_1029_yato2", // Kirin R Yato
    "char_1030_noirc2", // Rathalos S Noir Corne
    "char_4123_ela", // Ela
    "char_4124_iana", // Iana
    "char_458_rfrost", // Frost
    "char_456_ash", // Ash
    "char_457_blitz", // Blitz
    "char_4125_rdoc", // Doc
    "char_4144_chilc", // Chilchuck
    "char_4142_laios", // Laios
    "char_4141_marcil", // Marcille
    "char_4126_fuze", // Fuze
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [professionFilter, setProfessionFilter] = useState("all");
  const [subProfessionFilter, setSubProfessionFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [limitedFilter, setLimitedFilter] = useState("all");

  const [sortOption, setSortOption] = useState("rarity-desc"); // default → Rarity มาก → น้อย
  //const [itemsPerPage, setItemsPerPage] = useState(50);
  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSubProfessions = useMemo(() => {
    if (professionFilter === "all") {
      return [];
    }

    return Array.from(
      new Set(
        operators
          .filter((op) => op.profession === professionFilter)
          .map((op) => op.subProfessionId)
      )
    );
  }, [professionFilter, operators]);

  const filteredOperators = operators.filter((operator) => {
    const matchesSearch = operator.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesProfession =
      professionFilter === "all" || operator.profession === professionFilter;

    const matchesSubProfession =
      subProfessionFilter === "all" ||
      operator.subProfessionId === subProfessionFilter;

    const matchesPosition =
      positionFilter === "all" || operator.position === positionFilter;

    const matchesRarity =
      rarityFilter === "all" || operator.rarity.toString() === rarityFilter;

    const matchesLimited =
      limitedFilter === "all" ||
      (limitedFilter === "limited" && limitedOperatorIds.has(operator.id)) ||
      (limitedFilter === "non-limited" && !limitedOperatorIds.has(operator.id));

    return (
      matchesSearch &&
      matchesProfession &&
      matchesSubProfession &&
      matchesPosition &&
      matchesRarity &&
      matchesLimited
    );
  });

  // Sorting
  const sortedOperators = useMemo(() => {
    const sorted = [...filteredOperators];

    if (sortOption === "rarity-desc") {
      sorted.sort((a, b) => b.rarity - a.rarity);
    } else if (sortOption === "rarity-asc") {
      sorted.sort((a, b) => a.rarity - b.rarity);
    } else if (sortOption === "name-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
  }, [filteredOperators, sortOption]);

  // Pagination
  const totalPages = Math.ceil(sortedOperators.length / itemsPerPage);
  const paginatedOperators = sortedOperators.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique options
  const professions = Array.from(new Set(operators.map((op) => op.profession)));

  const positions = Array.from(new Set(operators.map((op) => op.position)));

  const rarities = Array.from(
    new Set(operators.map((op) => op.rarity.toString()))
  ).sort((a, b) => Number(a) - Number(b));

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader className="top-10 z-20 bg-white/80 dark:bg-[#181818]/80 backdrop-blur-sm transition-all md:sticky md:top-10">
        <div className="space-y-4 p-2">
          <div className="w-full">
            <Input
              placeholder={t("search")}
              className="w-full bg-white dark:bg-[#222] rounded-md shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2
"
          >
            {/* Class */}
            <div className="col-span-1">
              <Select
                value={professionFilter}
                onValueChange={(value) => {
                  setProfessionFilter(value);
                  setSubProfessionFilter("all");
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-white dark:bg-[#222] rounded-md shadow-sm text-sm">
                  <Filter className="w-4 h-4 mr-1 flex-shrink-0" />
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all_class")}</SelectItem>
                  {professions.map((profession) => (
                    <SelectItem key={profession} value={profession}>
                      {professionLabels[profession] ?? profession}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub-Class */}
            <div className="col-span-1">
              <Select
                value={subProfessionFilter}
                onValueChange={(value) => {
                  setSubProfessionFilter(value);
                  setCurrentPage(1);
                }}
                disabled={professionFilter === "all"}
              >
                <SelectTrigger
                  className={`w-full ${
                    professionFilter === "all" ? "opacity-50" : ""
                  } bg-white dark:bg-[#222] rounded-md shadow-sm text-sm`}
                >
                  <Filter className="w-4 h-4 mr-1 flex-shrink-0" />
                  <SelectValue placeholder="Sub-Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all_sub_class")}</SelectItem>
                  {filteredSubProfessions.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {subProfessionLabels[sub] ?? sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Position */}
            <div className="col-span-1">
              <Select
                value={positionFilter}
                onValueChange={(value) => {
                  setPositionFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-white dark:bg-[#222] rounded-md shadow-sm text-sm">
                  <Filter className="w-4 h-4 mr-1 flex-shrink-0" />
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all_position")}</SelectItem>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {t("positions." + pos)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rarity */}
            <div className="col-span-1">
              <Select
                value={rarityFilter}
                onValueChange={(value) => {
                  setRarityFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-white dark:bg-[#222] rounded-md shadow-sm text-sm">
                  <Filter className="w-4 h-4 mr-1 flex-shrink-0" />
                  <SelectValue placeholder="Rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all_rarity")}</SelectItem>
                  {rarities.map((rarity) => (
                    <SelectItem key={rarity} value={rarity}>
                      {rarity} ★
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="col-span-1">
              <Select
                value={sortOption}
                onValueChange={(value) => {
                  setSortOption(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-white dark:bg-[#222] rounded-md shadow-sm text-sm">
                  <Filter className="w-4 h-4 mr-1 flex-shrink-0" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="rarity-desc"
                    disabled={rarityFilter !== "all"}
                  >
                    {t("rarity_desc")} ↓
                  </SelectItem>
                  <SelectItem
                    value="rarity-asc"
                    disabled={rarityFilter !== "all"}
                  >
                    {t("rarity_asc")} ↑
                  </SelectItem>
                  <SelectItem value="name-asc">{t("name_asc")}</SelectItem>
                  <SelectItem value="name-desc">{t("name_desc")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Limited */}
            <div className="col-span-1">
              <Select
                value={limitedFilter}
                onValueChange={(value) => {
                  setLimitedFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-white dark:bg-[#222] rounded-md shadow-sm text-sm">
                  <Filter className="w-4 h-4 mr-1 flex-shrink-0" />
                  <SelectValue placeholder="Limited" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all_limited")}</SelectItem>
                  <SelectItem value="limited">{t("limited")}</SelectItem>
                  <SelectItem value="non-limited">
                    {t("non_limited")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items per page */}
            {/* <div className="col-span-1">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-white dark:bg-[#222] rounded-md shadow-sm text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {paginatedOperators.map((operator) => (
            <Link
              key={operator.id}
              href={`/operators/`}
              className="group block bg-[#1e1e1e] p-2 rounded-lg hover:scale-105 transition-transform"
            >
              <div className="relative w-full aspect-square mb-2">
                {limitedOperatorIds.has(operator.id) && (
                  <Badge className="absolute top-1 right-1 text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 rounded shadow z-10">
                    {t("limited")}
                  </Badge>
                )}
                <Image
                  src={operator.image}
                  alt={operator.name}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <div className="text-center text-white text-sm font-semibold">
                {operator.name}
              </div>
              <div className="text-center text-yellow-400 text-xs mb-1">
                {"★".repeat(operator.rarity)}
              </div>
              <div className="text-center text-gray-400 text-xs">
                {professionLabels[operator.profession]} /{" "}
                {subProfessionLabels[operator.subProfessionId]}
              </div>
              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {operator.tagList.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700 text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Showing X to Y of Z results */}
        <div className="text-sm text-center text-gray-400 mt-2">
          {t("showing_results", {
            start: (currentPage - 1) * itemsPerPage + 1,
            end: Math.min(currentPage * itemsPerPage, sortedOperators.length),
            total: sortedOperators.length,
          })}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            {t("pagination.previous")}
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            {t("pagination.next")}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
