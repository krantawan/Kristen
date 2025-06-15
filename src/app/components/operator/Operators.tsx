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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  limitedOperatorIds,
  OperatorRarity,
} from "@/app/components/operator/details/config";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

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
      <CardHeader className="top-10 z-40 bg-white/80 dark:bg-[#181818]/80 backdrop-blur-sm transition-all md:sticky md:top-10">
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
                        <Image
                          src={`/operators/icon-class/${profession.toLowerCase()}.png`}
                          alt={profession}
                          width={20}
                          height={20}
                          className="filter drop-shadow-[0_0_2px_black]"
                        />
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
                        <Image
                          src={`/operators/icon-subclass/${professionFilter.toLowerCase()}/${sub.toLowerCase()}.png`}
                          alt={sub}
                          width={20}
                          height={20}
                          className="filter drop-shadow-[0_0_2px_black]"
                        />
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second row: CN Spoiler and Settings */}
            <div className="flex gap-2 items-center">
              <Label
                htmlFor="spoiler-toggle"
                className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950 cursor-pointer flex-1"
              >
                <Checkbox
                  id="spoiler-toggle"
                  checked={showCnOnlySpoiler}
                  onCheckedChange={(checked) => {
                    const newValue = !!checked;
                    setShowCnOnlySpoiler(newValue);
                    localStorage.setItem(
                      "showCnOnlySpoiler",
                      newValue.toString()
                    );
                  }}
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:[&>svg]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700 dark:data-[state=checked]:[&>svg]:text-white"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                  {t("filter.cn_spoiler")}
                </span>
              </Label>

              <Dialog
                open={isFilterModalOpenMobile}
                onOpenChange={setIsFilterModalOpenMobile}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`relative h-12 w-12 ${
                      hasActiveFilters
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : ""
                    }`}
                  >
                    <Settings className="h-6 w-6" />
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
                      {t("filter.clear_all")}
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
                  <SelectValue placeholder={t("filter.class.title")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("filter.class.all_class")}
                  </SelectItem>
                  {professions.map((profession) => (
                    <SelectItem key={profession} value={profession}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/operators/icon-class/${profession.toLowerCase()}.png`}
                          alt={profession}
                          width={20}
                          height={20}
                          className="filter drop-shadow-[0_0_2px_black]"
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
                  <SelectValue placeholder={t("filter.class.title")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("filter.class.all_sub_class")}
                  </SelectItem>
                  {filteredSubProfessions.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/operators/icon-subclass/${professionFilter.toLowerCase()}/${sub.toLowerCase()}.png`}
                          alt={sub}
                          width={20}
                          height={20}
                          className="filter drop-shadow-[0_0_2px_black]"
                        />
                        <span>{sub}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CN Spoiler Checkbox */}
            <div className="flex items-center gap-2">
              <Label
                htmlFor="spoiler-toggle-desktop"
                className="flex items-center gap-3 rounded-md border px-4 h-9 hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950 cursor-pointer whitespace-nowrap"
              >
                <Checkbox
                  id="spoiler-toggle-desktop"
                  checked={showCnOnlySpoiler}
                  onCheckedChange={(checked) => {
                    const newValue = !!checked;
                    setShowCnOnlySpoiler(newValue);
                    localStorage.setItem(
                      "showCnOnlySpoiler",
                      newValue.toString()
                    );
                  }}
                  className="flex items-center justify-center size-5 border border-input rounded data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:[&>svg]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700 dark:data-[state=checked]:[&>svg]:text-white"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                  {t("filter.cn_spoiler")}
                </span>
              </Label>
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
        <div className="px-4 pb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {paginatedOperators.map((character) => (
            <Link
              key={character.id}
              href={`/operators/${toSlug(character.name)}`}
              className={`relative group block hover:scale-105 transition-transform duration-300 ${
                character.source === "cn-only" && !showCnOnlySpoiler
                  ? "blur-xs"
                  : ""
              }`}
            >
              <div className="relative overflow-hidden aspect-[4/4] lg:aspect-[1/2] border border-gray-300 dark:border-gray-700 group">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,.5)] via-[rgba(0,0,0,.1)] to-[rgba(0,0,0,0)] dark:from-[rgba(0,0,0,.6)] dark:via-[rgba(0,0,0,.3)] dark:to-[rgba(0,0,0,0)] z-10" />

                {/* Character Image */}
                <Image
                  src={`/assets/portrait/${character.id}_1.png`}
                  alt={character.name}
                  fill
                  className="object-cover object-[50%_30%] transition-transform duration-300 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-1 right-1 flex flex-row flex-wrap gap-1 z-20">
                  {character.source === "cn-only" && (
                    <span className="text-xs bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-0.5 shadow">
                      CN
                    </span>
                  )}
                  {limitedOperatorIds.has(character.id) && (
                    <span className="text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 shadow">
                      {t("filter.availability.limited")}
                    </span>
                  )}
                </div>

                {/* Desktop layout */}
                <div className="hidden lg:flex absolute bottom-0 left-0 right-0 z-20 flex-col items-center p-3 space-y-1">
                  <Image
                    src={`/operators/icon-class/${character.profession.toLowerCase()}.png`}
                    alt={character.profession}
                    width={40}
                    height={40}
                    className="drop-shadow-lg"
                  />
                  <div className="text-white text-center text-sm leading-tight font-semibold">
                    {locale === "ja" ? character.name_jp : character.name}
                  </div>
                  <div className="text-white text-xs text-center bg-black/50 rounded p-1">
                    {character.subProfession}
                  </div>
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-1",
                      OperatorRarity[
                        character.rarity as keyof typeof OperatorRarity
                      ]
                    )}
                  />
                </div>

                {/* Mobile layout */}
                <div className="lg:hidden absolute top-1 left-1 z-20 bg-black/50 rounded">
                  <Image
                    src={`/operators/icon-class/${character.profession.toLowerCase()}.png`}
                    alt={character.profession}
                    width={40}
                    height={40}
                    className="drop-shadow-lg"
                  />
                </div>

                <div className="lg:hidden absolute bottom-1 left-1 right-1 z-20 px-2 space-y-1 text-center">
                  <div className="text-white font-bold text-sm leading-tight truncate">
                    {locale === "ja" ? character.name_jp : character.name}
                  </div>
                  <div className="text-white text-xs bg-black/50 rounded px-1 py-0.5">
                    {character.subProfession}
                  </div>
                </div>
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
