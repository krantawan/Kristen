"use client";

import gachaBanners from "@/data/gacha-simulator/gacha-banners.json";
import operators from "@/data/operators.json";
import { performGachaRoll } from "@/lib/gacha-utils";
import { useEffect, useState } from "react";
import {
  InfoIcon,
  RotateCcw,
  Settings as GearIcon,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";

type OperatorData = {
  id: string;
  name: string;
  image: string;
  rarity: number;
};

type OperatorResult = {
  id: string;
  rarity: number;
  isRateUp?: boolean;
};

export default function GachaSimulator() {
  const t = useTranslations("components.gacha");
  const [selectedBannerId, setSelectedBannerId] = useState<string>(
    gachaBanners[0]?.id ?? ""
  );
  const [totalPulls, setTotalPulls] = useState(0);
  const [results, setResults] = useState<OperatorResult[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [pityCounter, setPityCounter] = useState<number>(0);
  const [guaranteeCounters, setGuaranteeCounters] = useState<
    Record<string, number>
  >({});
  const [hasGuaranteed5Or6, setHasGuaranteed5Or6] = useState(false);
  const [showAdvancedReset, setShowAdvancedReset] = useState(false);

  const currentGuaranteeCount = guaranteeCounters[selectedBannerId] || 0;

  const sixStarRate =
    pityCounter >= 50 ? Math.min(70, 2 + (pityCounter - 49) * 2) : 2;

  useEffect(() => {
    const history = localStorage.getItem("gachaHistory");
    if (history) {
      setResults(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gachaHistory", JSON.stringify(results));
  }, [results]);

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.id]) {
      acc[result.id] = { ...result, count: 1 };
    } else {
      acc[result.id].count += 1;
    }
    return acc;
  }, {} as Record<string, OperatorResult & { count: number }>);

  const getOperatorData = (id: string): OperatorData | undefined => {
    return operators.find((op) => op.id === id);
  };

  const handleSingleRoll = () => {
    setIsRolling(true);
    const banner = gachaBanners.find((b) => b.id === selectedBannerId)!;
    const { result, updatedPity, resetGuarantee } = performGachaRoll(
      banner,
      operators,
      pityCounter,
      currentGuaranteeCount,
      hasGuaranteed5Or6
    );

    setResults((prev) => [{ id: result.id, rarity: result.rarity }, ...prev]);

    setPityCounter(updatedPity);
    setGuaranteeCounters((prev) => ({
      ...prev,
      [selectedBannerId]: resetGuarantee
        ? 0
        : (prev[selectedBannerId] || 0) + 1,
    }));

    if (result.rarity >= 5 && !hasGuaranteed5Or6) {
      setHasGuaranteed5Or6(true);
    }

    setTotalPulls((prev) => prev + 1);
    setIsRolling(false);
  };

  const handleMultiRoll = () => {
    setIsRolling(true);
    const banner = gachaBanners.find((b) => b.id === selectedBannerId)!;
    let localPity = pityCounter;
    let localGuarantee = currentGuaranteeCount;
    let localHasGuaranteed5Or6 = hasGuaranteed5Or6;

    const newResults: OperatorResult[] = [];

    for (let i = 0; i < 10; i++) {
      const { result, updatedPity, resetGuarantee } = performGachaRoll(
        banner,
        operators,
        localPity,
        localGuarantee,
        localHasGuaranteed5Or6
      );

      newResults.push({
        id: result.id,
        rarity: result.rarity,
        isRateUp: result.isRateUp,
      });

      localPity = updatedPity;
      localGuarantee = resetGuarantee ? 0 : localGuarantee + 1;

      if (result.rarity >= 5 && !localHasGuaranteed5Or6) {
        localHasGuaranteed5Or6 = true;
      }
    }

    setHasGuaranteed5Or6(localHasGuaranteed5Or6);
    setTotalPulls((prev) => prev + 10);
    setResults((prev) => [...newResults, ...prev]);
    setPityCounter(localPity);
    setGuaranteeCounters((prev) => ({
      ...prev,
      [selectedBannerId]: localGuarantee,
    }));
    setHasGuaranteed5Or6(localHasGuaranteed5Or6);
    setIsRolling(false);
  };

  const handleClear = () => {
    localStorage.removeItem("gachaHistory");
    setResults([]);
    setHasGuaranteed5Or6(false);
  };

  const getBanner = () => {
    return gachaBanners.find((b) => b.id === selectedBannerId)!;
  };

  const handleResetCounters = () => {
    setPityCounter(0);
    setTotalPulls(0);
    setGuaranteeCounters((prev) => ({
      ...prev,
      [selectedBannerId]: 0,
    }));
    setHasGuaranteed5Or6(false);
  };

  const handleClearAll = () => {
    localStorage.removeItem("gachaHistory");
    setResults([]);
    setPityCounter(0);
    setTotalPulls(0);
    setGuaranteeCounters((prev) => ({
      ...prev,
      [selectedBannerId]: 0,
    }));
    setHasGuaranteed5Or6(false);
  };

  return (
    <div className="bg-white dark:bg-[#252525] shadow-lg overflow-hidden border border-gray-300 dark:border-gray-800">
      {/* Banner Selection */}
      <div className="p-4 bg-gray-100 dark:bg-[#1d1d1d] border-b border-gray-300 dark:border-gray-800">
        <div className="mt-2">
          <Image
            src={getBanner().image}
            alt={getBanner().name}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* Pity / Guarantee Info */}
        <div className="mt-4 text-md text-gray-700 dark:text-gray-400 space-y-2">
          {/* Banner Name */}
          <p>
            {t("banner")}:{" "}
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {getBanner().name}
            </span>
          </p>

          {/* Pity Progress */}
          <div className="mt-3 p-3 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-[#1f1f1f] space-y-1 text-sm">
            <div className="font-semibold text-gray-800 dark:text-gray-200">
              ~$ {t("pityProgressTitle")}
            </div>
            {/* Guarantee Counter */}
            {!hasGuaranteed5Or6 && (
              <div className="flex items-center">
                {t("guarantee")}:{" "}
                <span
                  className={`ml-1 font-medium ${
                    currentGuaranteeCount >= 10
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {Math.min(currentGuaranteeCount, 10)} / 10
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1.5 text-gray-500 hover:text-gray-400">
                        <InfoIcon size={14} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-700">
                      <p>{t("guarantee_desc")}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {t("garantee_desc2")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            <div className="flex items-center">
              {t("pity_rate")}{" "}
              <span className="ml-1 font-medium text-yellow-600 dark:text-yellow-400">
                {sixStarRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center">
              {t("pity_expected")}
              <span className="ml-1 font-medium text-gray-900 dark:text-gray-100 pr-1">
                {Math.round(100 / sixStarRate)}
              </span>
              {t("pity_expected_suffix")}
            </div>
            <div className="text-xs text-gray-400">{t("pity_desc")}</div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full md:w-full lg:w-64">
            <Select
              value={selectedBannerId}
              onValueChange={setSelectedBannerId}
            >
              <SelectTrigger className="bg-white dark:bg-[#2a2a2a] border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Select Banner" />
              </SelectTrigger>
              <SelectContent>
                {gachaBanners.map((banner) => (
                  <SelectItem key={banner.id} value={banner.id}>
                    {banner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            className={cn(
              "grid grid-cols-2 sm:grid-cols-2 md:flex md:flex-wrap md:gap-2 md:max-w-[700px] gap-2",
              showAdvancedReset ? "md:grid-cols-5" : ""
            )}
          >
            <Button
              onClick={handleSingleRoll}
              disabled={isRolling}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              {t("singlePull")}
            </Button>
            <Button
              onClick={handleMultiRoll}
              disabled={isRolling}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              {t("multiPull")}
            </Button>
            {!showAdvancedReset && (
              <Button
                onClick={handleClearAll}
                className="bg-red-800 hover:bg-red-900 text-white"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {t("clearAll")}
              </Button>
            )}
            {!showAdvancedReset ? (
              <Button
                onClick={() => setShowAdvancedReset(true)}
                variant="outline"
                className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                <GearIcon className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> {t("clear")}
                </Button>
                <Button
                  onClick={handleResetCounters}
                  className="border-gray-300 dark:border-gray-700 text-white dark:text-white bg-red-800 hover:bg-red-900"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  {t("reset")}
                </Button>
                <Button
                  onClick={() => setShowAdvancedReset(false)}
                  variant="ghost"
                  className="text-gray-500 col-span-1 md:col-span-1"
                >
                  ← {t("back")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 pb-2 border-b border-gray-300 dark:border-gray-700">
        {/* Summary */}
        <div className="flex flex-wrap gap-4 mt-2 text-sm w-full justify-center">
          {/* Total Pulls */}
          <div>
            {t("totalPulls")}:{" "}
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {totalPulls}
            </span>
          </div>

          {/* Pity Counter */}
          <div className="flex items-center">
            {t("pityCounter")}:{" "}
            <span
              className={`ml-1 font-medium ${
                pityCounter >= 50
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {pityCounter}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1.5 text-gray-500 hover:text-gray-400">
                    <InfoIcon size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-700">
                  <p>{t("pity_desc")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Count Orundum + Originite Prime*/}
          <div className="flex items-center">
            <Image
              src={"/game-ui/18px-Orundum_icon.png"}
              alt="Orundum"
              width={20}
              height={20}
              className="w-5 h-5 mr-1"
            />
            {t("orundum")}:{" "}
            <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
              {(totalPulls * 600).toLocaleString()}
            </span>
          </div>

          {/* Count Orundum + Originite Prime*/}
          <div className="flex items-center">
            <Image
              src={"/game-ui/18px-Originite_Prime_icon.png"}
              alt="Originite Prime"
              width={20}
              height={20}
              className="w-5 h-5 mr-1"
            />
            {t("originite_prime")}:{" "}
            <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
              {((totalPulls * 600) / 180).toFixed(0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      {/* Roll Results */}
      <div className="p-4 min-h-[1000px] transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
          {t("rollResults")}
        </h2>
        {results.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t("noResults")}
          </div>
        ) : (
          <>
            {/* Group logic */}
            {(() => {
              const featured6Ids = getBanner().featured6 || [];
              const featured5Ids = getBanner().featured5 || [];

              const featuredResults = Object.values(groupedResults)
                .filter(
                  (r) =>
                    (r.rarity === 6 && featured6Ids.includes(r.id)) ||
                    (r.rarity === 5 && featured5Ids.includes(r.id))
                )
                .sort((a, b) => b.rarity - a.rarity); // 6 ก่อน

              const offRateResults = Object.values(groupedResults)
                .filter(
                  (r) =>
                    (r.rarity === 6 && !featured6Ids.includes(r.id)) ||
                    (r.rarity === 5 && !featured5Ids.includes(r.id))
                )
                .sort((a, b) => b.rarity - a.rarity); // 6 ก่อน

              const otherResults = Object.values(groupedResults)
                .filter((r) => r.rarity <= 4)
                .sort((a, b) => b.rarity - a.rarity); // 4 ก่อน

              // Render Grid function
              const renderGrid = (groupResults: OperatorResult[]) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                  {groupResults.map((result, index) => {
                    const op = getOperatorData(result.id);
                    if (!op) return null;
                    const count = results.filter(
                      (r) => r.id === result.id
                    ).length;

                    return (
                      <div
                        key={`${result.id}-${index}`}
                        className={cn(
                          "relative rounded-md overflow-hidden border p-2 animate-fadeIn",
                          "bg-white dark:bg-[#1d1d1d]",
                          "border-gray-300 dark:border-gray-700",
                          result.rarity === 6
                            ? "ring-2 ring-[#ff5e00] bg-[#ff5e00]/20 dark:bg-[#ff5e00]/20"
                            : result.rarity === 5
                            ? "ring-2 ring-[#ffb800] bg-[#ffb800]/10 dark:bg-[#ffb800]/10"
                            : result.rarity === 4
                            ? "ring-2 ring-[#bb8bff] bg-[#bb8bff]/10 dark:bg-[#bb8bff]/10"
                            : "ring-1 ring-gray-400 bg-gray-100 dark:bg-gray-800 dark:ring-gray-600"
                        )}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-[#333] rounded-full mb-2 flex items-center justify-center overflow-hidden">
                            <Image
                              src={op.image || "/placeholder.svg"}
                              alt={op.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-sm truncate max-w-full text-gray-900 dark:text-gray-200">
                              {op.name}
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                result.rarity === 6
                                  ? "text-[#ff8a00]"
                                  : result.rarity === 5
                                  ? "text-[#ffb800]"
                                  : result.rarity === 4
                                  ? "text-[#bb8bff]"
                                  : "text-[#6d7c89]"
                              )}
                            >
                              {Array(result.rarity).fill("★").join("")}
                            </p>
                          </div>
                        </div>
                        {count > 1 && (
                          <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {count}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );

              return (
                <>
                  {/* Featured */}
                  {featuredResults.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mb-2 text-[#ff8a00]">
                        {t("featured")}
                      </h3>
                      {renderGrid(featuredResults)}
                    </>
                  )}

                  {/* Off-rate */}
                  {offRateResults.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mb-2 text-[#ffb800]">
                        {t("offRate")}
                      </h3>
                      {renderGrid(offRateResults)}
                    </>
                  )}

                  {/* Other */}
                  {otherResults.length > 0 && (
                    <>
                      <hr className="my-4 border-gray-300 dark:border-gray-600" />
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-200">
                        {t("other")}
                      </h3>
                      {renderGrid(otherResults)}
                    </>
                  )}
                </>
              );
            })()}
          </>
        )}
      </div>

      {/* FadeIn CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
}
