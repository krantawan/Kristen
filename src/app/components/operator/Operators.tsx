"use client";

import operatorsData from "@/data/operators.json";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
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
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function OperatorsGridRedesigned() {
  const t = useTranslations("components.OperatorsPage");
  const locale = useLocale();

  useEffect(() => {
    const savedSpoilerSetting = localStorage.getItem("showCnOnlySpoiler");
    if (savedSpoilerSetting !== null) {
      setShowCnOnlySpoiler(savedSpoilerSetting === "true");
    }
  }, []);

  const operators = operatorsData as {
    id: string;
    name: string;
    name_cn: string;
    name_jp: string;
    rarity: number;
    image: string;
    position: string;
    profession: string;
    subProfession: string;
    tagList: string[];
    nationId: string;
    obtainable: boolean;
    source: string;
  }[];

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

  // Main filters (visible in header)
  const [searchTerm, setSearchTerm] = useState("");
  const [professionFilter, setProfessionFilter] = useState("all");
  const [subProfessionFilter, setSubProfessionFilter] = useState("all");
  const [showCnOnlySpoiler, setShowCnOnlySpoiler] = useState(false);

  // Advanced filters (in modal)
  const [positionFilter, setPositionFilter] = useState("all");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [limitedFilter, setLimitedFilter] = useState("all");
  const [sortOption, setSortOption] = useState("rarity-desc");

  // Mobile and desktop filter modal
  const [isFilterModalOpenMobile, setIsFilterModalOpenMobile] = useState(false);
  const [isFilterModalOpenDesktop, setIsFilterModalOpenDesktop] =
    useState(false);

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
          .map((op) => op.subProfession)
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
      operator.subProfession === subProfessionFilter;

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

  const totalPages = Math.ceil(sortedOperators.length / itemsPerPage);
  const paginatedOperators = sortedOperators.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const professions = Array.from(new Set(operators.map((op) => op.profession)));
  const positions = Array.from(new Set(operators.map((op) => op.position)));
  const rarities = Array.from(
    new Set(operators.map((op) => op.rarity.toString()))
  ).sort((a, b) => Number(a) - Number(b));

  const clearAllFilters = () => {
    setSearchTerm("");
    setProfessionFilter("all");
    setSubProfessionFilter("all");
    setPositionFilter("all");
    setRarityFilter("all");
    setLimitedFilter("all");
    setSortOption("rarity-desc");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    professionFilter !== "all" ||
    subProfessionFilter !== "all" ||
    positionFilter !== "all" ||
    rarityFilter !== "all" ||
    limitedFilter !== "all" ||
    sortOption !== "rarity-desc";

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader className="top-10 z-20 bg-white/80 dark:bg-[#181818]/80 backdrop-blur-sm transition-all md:sticky md:top-10">
        <div className="space-y-4 p-2">
          {/* Mobile Layout (sm and below) */}
          <div className="block sm:hidden space-y-3">
            {/* Search Input - Full width on mobile */}
            <div className="w-full">
              <Input
                placeholder={t("search")}
                className="w-full bg-white dark:bg-[#222] rounded-md shadow-sm h-11"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* First row: Main Class and Sub Class */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  value={professionFilter}
                  onValueChange={(value) => {
                    setProfessionFilter(value);
                    setSubProfessionFilter("all");
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-[#222] rounded-md shadow-sm h-11">
                    <SelectValue placeholder={t("filter.class.title")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("filter.class.all_class")}
                    </SelectItem>
                    {professions.map((profession) => (
                      <SelectItem key={profession} value={profession}>
                        {profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
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
                    } bg-white dark:bg-[#222] rounded-md shadow-sm h-11`}
                  >
                    <SelectValue placeholder={t("filter.class.title")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("filter.class.all_sub_class")}
                    </SelectItem>
                    {filteredSubProfessions.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second row: CN Spoiler and Settings */}
            <div className="flex gap-2 items-center">
              <div className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-[#222] rounded-md shadow-sm border border-input flex-1">
                <input
                  type="checkbox"
                  id="spoiler-toggle-mobile"
                  checked={showCnOnlySpoiler}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setShowCnOnlySpoiler(newValue);
                    localStorage.setItem(
                      "showCnOnlySpoiler",
                      newValue.toString()
                    );
                  }}
                />
                <label
                  htmlFor="spoiler-toggle-mobile"
                  className="text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer select-none"
                >
                  CN Spoiler
                </label>
              </div>

              <Dialog
                open={isFilterModalOpenMobile}
                onOpenChange={setIsFilterModalOpenMobile}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`relative h-11 w-11 ${
                      hasActiveFilters
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : ""
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    {hasActiveFilters && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      {t("filter.title")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Position Filter */}
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Select
                        value={positionFilter}
                        onValueChange={(value) => {
                          setPositionFilter(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("filter.positions.title")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {t("filter.positions.all_position")}
                          </SelectItem>
                          {positions.map((pos) => (
                            <SelectItem key={pos} value={pos}>
                              {t("filter.positions." + pos)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rarity Filter */}
                    <div className="space-y-2">
                      <Label>Rarity</Label>
                      <Select
                        value={rarityFilter}
                        onValueChange={(value) => {
                          setRarityFilter(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("filter.rarity.title")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {t("filter.rarity.all_rarity")}
                          </SelectItem>
                          {rarities.map((rarity) => (
                            <SelectItem key={rarity} value={rarity}>
                              {rarity} ★
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Limited Filter */}
                    <div className="space-y-2">
                      <Label>Availability</Label>
                      <Select
                        value={limitedFilter}
                        onValueChange={(value) => {
                          setLimitedFilter(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("filter.availability.title")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {t("filter.availability.all_limited")}
                          </SelectItem>
                          <SelectItem value="limited">
                            {t("filter.availability.limited")}
                          </SelectItem>
                          <SelectItem value="non-limited">
                            {t("filter.availability.non_limited")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort Option */}
                    <div className="space-y-2">
                      <Label>Sort By</Label>
                      <Select
                        value={sortOption}
                        onValueChange={(value) => {
                          setSortOption(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("filter.sort_by.title")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="rarity-desc"
                            disabled={rarityFilter !== "all"}
                          >
                            {t("filter.sort_by.rarity_desc")} ↓
                          </SelectItem>
                          <SelectItem
                            value="rarity-asc"
                            disabled={rarityFilter !== "all"}
                          >
                            {t("filter.sort_by.rarity_asc")} ↑
                          </SelectItem>
                          <SelectItem value="name-asc">
                            {t("filter.sort_by.name_asc")}
                          </SelectItem>
                          <SelectItem value="name-desc">
                            {t("filter.sort_by.name_desc")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Clear All
                    </Button>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Desktop Layout (sm and above) */}
          <div className="hidden sm:flex gap-3 items-center">
            {/* Search Input */}
            <div className="flex-1">
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

            {/* Main Class */}
            <div className="w-32 sm:w-36 lg:w-40">
              <Select
                value={professionFilter}
                onValueChange={(value) => {
                  setProfessionFilter(value);
                  setSubProfessionFilter("all");
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-white dark:bg-[#222] rounded-md shadow-sm">
                  <SelectValue placeholder={t("filter.positions.title")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("filter.positions.all_position")}
                  </SelectItem>
                  {professions.map((profession) => (
                    <SelectItem key={profession} value={profession}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/operators/icon-class/${profession.toLowerCase()}.png`}
                          alt={profession}
                          width={20}
                          height={20}
                        />
                        <span>{profession}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub Class */}
            <div className="w-32 sm:w-36 lg:w-40">
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
                  } bg-white dark:bg-[#222] rounded-md shadow-sm`}
                >
                  <SelectValue placeholder={t("filter.positions.title")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("filter.positions.all_position")}
                  </SelectItem>
                  {filteredSubProfessions.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/operators/icon-subclass/${professionFilter.toLowerCase()}/${sub.toLowerCase()}.png`}
                          alt={sub}
                          width={20}
                          height={20}
                        />
                        <span>{sub}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CN Spoiler Checkbox */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-[#222] rounded-md shadow-sm border border-input whitespace-nowrap">
              <input
                type="checkbox"
                id="spoiler-toggle-desktop"
                checked={showCnOnlySpoiler}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  setShowCnOnlySpoiler(newValue);
                  localStorage.setItem(
                    "showCnOnlySpoiler",
                    newValue.toString()
                  );
                }}
              />
              <label
                htmlFor="spoiler-toggle-desktop"
                className="text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer select-none"
              >
                {t("filter.cn_spoiler")}
              </label>
            </div>

            {/* Advanced Filters Modal Trigger */}
            <Dialog
              open={isFilterModalOpenDesktop}
              onOpenChange={setIsFilterModalOpenDesktop}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`relative ${
                    hasActiveFilters
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : ""
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  {hasActiveFilters && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    {t("filter.title")}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Position Filter */}
                  <div className="space-y-2">
                    <Label>{t("filter.positions.title")}</Label>
                    <Select
                      value={positionFilter}
                      onValueChange={(value) => {
                        setPositionFilter(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("filter.positions.title")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t("filter.positions.all_position")}
                        </SelectItem>
                        {positions.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {t("filter.positions." + pos)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rarity Filter */}
                  <div className="space-y-2">
                    <Label>{t("filter.rarity.title")}</Label>
                    <Select
                      value={rarityFilter}
                      onValueChange={(value) => {
                        setRarityFilter(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("filter.rarity.title")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t("filter.rarity.all_rarity")}
                        </SelectItem>
                        {rarities.map((rarity) => (
                          <SelectItem key={rarity} value={rarity}>
                            {rarity} ★
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Limited Filter */}
                  <div className="space-y-2">
                    <Label>{t("filter.availability.title")}</Label>
                    <Select
                      value={limitedFilter}
                      onValueChange={(value) => {
                        setLimitedFilter(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("filter.availability.title")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t("filter.availability.all_limited")}
                        </SelectItem>
                        <SelectItem value="limited">
                          {t("filter.availability.limited")}
                        </SelectItem>
                        <SelectItem value="non-limited">
                          {t("filter.availability.non_limited")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Option */}
                  <div className="space-y-2">
                    <Label>{t("filter.sort_by.title")}</Label>
                    <Select
                      value={sortOption}
                      onValueChange={(value) => {
                        setSortOption(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="rarity-desc"
                          disabled={rarityFilter !== "all"}
                        >
                          {t("filter.sort_by.rarity_desc")} ↓
                        </SelectItem>
                        <SelectItem
                          value="rarity-asc"
                          disabled={rarityFilter !== "all"}
                        >
                          {t("filter.sort_by.rarity_asc")} ↑
                        </SelectItem>
                        <SelectItem value="name-asc">
                          {t("filter.sort_by.name_asc")}
                        </SelectItem>
                        <SelectItem value="name-desc">
                          {t("filter.sort_by.name_desc")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t("filter.clear_all")}
                  </Button>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {paginatedOperators.map((operator) => (
            <Link
              key={operator.id}
              href={`/operators/`}
              className={`group block bg-[#1e1e1e] p-2 rounded-lg hover:scale-105 transition-transform ${
                operator.source === "cn-only" && !showCnOnlySpoiler
                  ? "blur-xs"
                  : ""
              }`}
            >
              <div className="relative w-full aspect-square mb-2">
                <div className="absolute top-1 right-1 flex flex-row flex-wrap gap-1 z-10">
                  {operator.source === "cn-only" && (
                    <Badge className="text-xs bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-0.5 rounded shadow">
                      CN
                    </Badge>
                  )}

                  {limitedOperatorIds.has(operator.id) && (
                    <Badge className="text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 rounded shadow">
                      {t("filter.availability.limited")}
                    </Badge>
                  )}
                </div>
                <Image
                  src={operator.image || "/placeholder.svg"}
                  alt={operator.name}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <div className="text-center text-white text-sm font-semibold">
                {locale === "ja" ? operator.name_jp : operator.name}
              </div>
              <div className="text-center text-yellow-400 text-xs mb-1">
                {"★".repeat(operator.rarity)}
              </div>
              <div className="text-center text-gray-400 text-xs">
                {[operator.profession]} / {[operator.subProfession]}
              </div>
              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {operator.tagList && operator.tagList.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {operator.tagList.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700 text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Results Info */}
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
            <ChevronLeft className="w-4 h-4" />
            {t("pagination.previous")}
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
