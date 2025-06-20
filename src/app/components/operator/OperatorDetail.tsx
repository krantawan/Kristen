"use client";

import React from "react";
import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/operator_detail/button";
import { Card } from "@/components/ui/operator_detail/card";
import { Badge } from "@/components/ui/operator_detail/badge";
import { getOperatorAssetUrl } from "@/lib/getOperatorAssetUrl";
import {
  getOperatorDetail,
  mapLocaleToLang,
} from "@/lib/hooks/useOperatorDetail";
import type {
  OperatorDetail,
  OperatorSummary,
  OperatorSkin,
} from "@/types/operator";
import {
  limitedOperatorIds,
  OperatorRarityBorder,
  OperatorRarityText,
} from "@/app/components/operator/details/config";
import { useLocale, useTranslations } from "next-intl";

import { OperatorHeader } from "@/app/components/operator/details/OperatorHeader";
import OperatorStats from "@/app/components/operator/details/OperatorStats";
import OperatorTabs from "@/app/components/operator/OperatorTab";
import OperatorViewer from "@/app/components/operator/details/OperatorViewer";

// Memoized loading skeleton component
const LoadingSkeleton = React.memo(() => (
  <div className="container mx-auto py-6 px-4 max-w-7xl">
    <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded-md mb-2 animate-pulse"></div>
    <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded-md mb-6 animate-pulse"></div>

    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-[50%] xl:w-[45%]">
        <div className="aspect-[3/4] bg-gray-200 dark:bg-zinc-800 rounded-md animate-pulse"></div>
      </div>
      <div className="flex-1">
        <div className="h-full bg-gray-100 dark:bg-zinc-900 rounded-md p-6">
          <div className="h-10 w-full bg-gray-200 dark:bg-zinc-800 rounded-md mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-md animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

// Memoized skin selector component
const SkinSelector = React.memo(
  ({
    skins,
    selectedIndex,
    onSkinChange,
  }: {
    skins: OperatorSkin[];
    selectedIndex: number;
    onSkinChange: (index: number) => void;
  }) => (
    <div className="p-4 bg-gray-100 dark:bg-zinc-800 flex gap-2 overflow-x-auto">
      {skins.map((skin, index) => (
        <button
          key={skin.skinId}
          className={cn(
            "relative min-w-20 h-25 rounded-md overflow-hidden transition-all",
            index === selectedIndex
              ? "scale-105 border-2"
              : "opacity-70 hover:opacity-100"
          )}
          onClick={() => onSkinChange(index)}
        >
          <Image
            src={
              getOperatorAssetUrl("portrait", skin.portraitId) ||
              "/placeholder.svg"
            }
            alt={skin.displayName || skin.skinGroupName || "Portrait"}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover object-top"
            loading="lazy"
            draggable={false}
          />
        </button>
      ))}
    </div>
  )
);

SkinSelector.displayName = "SkinSelector";

export default function OperatorPageClient({
  operator,
}: {
  operator: OperatorSummary | undefined;
}) {
  const [opDetail, setOpDetail] = useState<OperatorDetail | undefined>(
    undefined
  );
  // Phase selector
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(1);

  // Skin selector
  const [selectedSkinIndex, setSelectedSkinIndex] = useState(0);
  const [fallback, setFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const t = useTranslations("components.OperatorsPage");
  const locale = useLocale();
  const lang = mapLocaleToLang(locale);
  // Optimized data fetching with error handling
  useEffect(() => {
    if (!operator) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchDetail = async () => {
      try {
        const detail = await getOperatorDetail(operator.id, lang, true);

        if (isMounted && detail) {
          setOpDetail(detail);
          setSelectedSkinIndex(0);
          setSelectedPhaseIndex(
            detail.phases?.length ? detail.phases.length - 1 : 0
          );
          setSelectedLevel(
            detail.phases?.[detail.phases.length - 1]?.maxLevel ?? 1
          );
        }
      } catch (error) {
        console.error("Failed to fetch operator detail:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [operator, lang]); // Include operator in dependencies since we use it directly

  // Memoized skin navigation handlers
  const handlePrevSkin = useCallback(() => {
    setSelectedSkinIndex((prev) =>
      prev === 0 ? (opDetail?.skins.length || 1) - 1 : prev - 1
    );
  }, [opDetail?.skins.length]);

  const handleNextSkin = useCallback(() => {
    setSelectedSkinIndex((prev) =>
      prev === (opDetail?.skins.length || 1) - 1 ? 0 : prev + 1
    );
  }, [opDetail?.skins.length]);

  // Memoized skill data
  // const skillData = useSkillData(opDetail?.skills || []);

  // Memoized computed values
  const selectedSkin = useMemo(
    () => opDetail?.skins[selectedSkinIndex],
    [opDetail?.skins, selectedSkinIndex]
  );

  useEffect(() => {
    setFallback(false);
  }, [selectedSkinIndex]);

  const getSkinFullArtFileName = useCallback(
    (illustId: string): string => illustId.replace("illust_", "") + "b",
    []
  );

  // Early returns for error and loading states
  if (!operator) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-7xl bg-[#1a1a1a]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Operator Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">
            The requested operator could not be found.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const imageOperatorSrc = fallback
    ? "/game-ui/char_any.png"
    : getOperatorAssetUrl(
        "skin",
        getSkinFullArtFileName(selectedSkin?.illustId ?? "")
      );

  if (isLoading || !opDetail || !selectedSkin) {
    return <LoadingSkeleton />;
  }
  return (
    <div className="min-h-screen bg-card text-gray-900 dark:text-white transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-[50%] xl:w-[45%]">
            <Card className="overflow-hidden bg-white dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black border-gray-200 dark:border-zinc-800">
              <div className="relative">
                <div className="relative overflow-hidden">
                  {/* Badge */}
                  <div className="absolute top-1 right-1 flex flex-row flex-wrap gap-1 z-20">
                    {limitedOperatorIds.has(opDetail.id) && (
                      <span className="text-lg font-semibold bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 shadow">
                        {t("filter.availability.limited")}
                      </span>
                    )}
                  </div>
                  {/* Navigation buttons */}
                  {opDetail.skins.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 text-gray-800 dark:text-white"
                        onClick={handlePrevSkin}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute z-10 right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 text-gray-800 dark:text-white"
                        onClick={handleNextSkin}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                  {/* Operator Image */}
                  <div className="relative w-full h-[60vh] bg-black flex items-center justify-center">
                    <Image
                      src={imageOperatorSrc}
                      alt={
                        selectedSkin.displayName ||
                        selectedSkin.skinGroupName ||
                        "Skin"
                      }
                      width={1024}
                      height={1024}
                      sizes="(max-width: 768px) 100vw, 80vw"
                      className="max-h-[60vh] object-contain"
                      priority
                      loading="eager"
                      draggable={false}
                      onError={() => setFallback(true)}
                    />
                    <OperatorViewer imageUrl={imageOperatorSrc} alt="Skin" />
                  </div>
                </div>
              </div>

              {/* Skin info */}
              <div
                className={cn(
                  "p-3 bg-gray-50 dark:bg-zinc-900 border-t-4",
                  OperatorRarityBorder[
                    opDetail.meta_info
                      .rarity as keyof typeof OperatorRarityBorder
                  ]
                )}
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 px-2.5 py-0.5">
                    Illustrator:{" "}
                    {selectedSkin.drawerList?.join(", ") || "Unknown"}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-2",
                      OperatorRarityBorder[
                        opDetail.meta_info
                          .rarity as keyof typeof OperatorRarityBorder
                      ],
                      OperatorRarityText[
                        opDetail.meta_info
                          .rarity as keyof typeof OperatorRarityText
                      ]
                    )}
                  >
                    {selectedSkin.skinGroupName}
                  </Badge>
                </div>
              </div>

              {/* Skin selector */}
              <SkinSelector
                skins={opDetail.skins}
                selectedIndex={selectedSkinIndex}
                onSkinChange={setSelectedSkinIndex}
              />
            </Card>
          </div>

          {/* Right panel - Character details */}
          <div className="flex-1">
            <Card className="h-full bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
              <OperatorHeader
                name={opDetail.meta_info.name ?? ""}
                rarity={opDetail.meta_info.rarity ?? 0}
                profession={opDetail.meta_info.profession ?? ""}
                subProfession={opDetail.meta_info.subProfessionId ?? ""}
                position={opDetail.meta_info.position ?? ""}
                classIconSrc={`/operators/icon-class/${(
                  opDetail.meta_info.profession ?? ""
                ).toLowerCase()}.png`}
              />
              {/* Stat Section */}
              <OperatorStats
                opDetail={opDetail}
                selectedPhaseIndex={selectedPhaseIndex}
                setSelectedPhaseIndex={setSelectedPhaseIndex}
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
              />

              <OperatorTabs opDetail={opDetail} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
