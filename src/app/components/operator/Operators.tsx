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
import { Filter } from "lucide-react";

export default function OperatorsGrid() {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [professionFilter, setProfessionFilter] = useState("all");
  const [subProfessionFilter, setSubProfessionFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [rarityFilter, setRarityFilter] = useState("all");

  const [sortOption, setSortOption] = useState("rarity-desc"); // default → Rarity มาก → น้อย
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  // SubProfessions ที่สัมพันธ์กับ professionFilter ที่เลือก
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

    return (
      matchesSearch &&
      matchesProfession &&
      matchesSubProfession &&
      matchesPosition &&
      matchesRarity
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
      <CardHeader
        className="
    sticky top-10 z-20
    bg-white/80 dark:bg-[#181818]/80
    backdrop-blur-sm
    transition-all
  "
      >
        <div className="flex flex-wrap items-center gap-2 w-full px-2 py-2 rounded-md">
          {/* Search */}
          <div className="flex-[2] sm:flex-[3] min-w-[200px]">
            <Input
              placeholder="Search operator"
              className="bg-white dark:bg-[#222] rounded-md shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page เมื่อ search
              }}
            />
          </div>

          {/* Filter + Sort + Items per page */}
          <div className="flex flex-row flex-wrap sm:flex-nowrap justify-start gap-2 w-full">
            {/* Profession */}
            <Select
              value={professionFilter}
              onValueChange={(value) => {
                setProfessionFilter(value);
                setSubProfessionFilter("all");
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[73%] sm:w-48 bg-white dark:bg-[#222] rounded-md shadow-sm">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Professions</SelectItem>
                {professions.map((profession) => (
                  <SelectItem key={profession} value={profession}>
                    {professionLabels[profession] ?? profession}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sub-Profession */}
            <Select
              value={subProfessionFilter}
              onValueChange={(value) => {
                setSubProfessionFilter(value);
                setCurrentPage(1);
              }}
              disabled={professionFilter === "all"}
            >
              <SelectTrigger
                className={`w-[73%] sm:w-48 ${
                  professionFilter === "all" ? "opacity-50" : ""
                } bg-white dark:bg-[#222] rounded-md shadow-sm`}
              >
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sub-Profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sub-Professions</SelectItem>
                {filteredSubProfessions.map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {subProfessionLabels[sub] ?? sub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Position */}
            <Select
              value={positionFilter}
              onValueChange={(value) => {
                setPositionFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[73%] sm:w-48 bg-white dark:bg-[#222] rounded-md shadow-sm">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Rarity */}
            <Select
              value={rarityFilter}
              onValueChange={(value) => {
                setRarityFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[73%] sm:w-48 bg-white dark:bg-[#222] rounded-md shadow-sm">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                {rarities.map((rarity) => (
                  <SelectItem key={rarity} value={rarity}>
                    {rarity} ★
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={sortOption}
              onValueChange={(value) => {
                setSortOption(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[73%] sm:w-48 bg-white dark:bg-[#222] rounded-md shadow-sm">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="rarity-desc"
                  disabled={rarityFilter !== "all"}
                >
                  Rarity ↓
                </SelectItem>
                <SelectItem
                  value="rarity-asc"
                  disabled={rarityFilter !== "all"}
                >
                  Rarity ↑
                </SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
              </SelectContent>
            </Select>

            {/* Items per page */}
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[73%] sm:w-24 bg-white dark:bg-[#222] rounded-md shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {paginatedOperators.map((operator) => (
            <Link
              key={operator.id}
              href={`/operator/${operator.id}`}
              className="group block bg-[#1e1e1e] p-2 rounded-lg hover:scale-105 transition-transform"
            >
              <div className="relative w-full aspect-square mb-2">
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
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, sortedOperators.length)} of{" "}
          {sortedOperators.length} results
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
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
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
