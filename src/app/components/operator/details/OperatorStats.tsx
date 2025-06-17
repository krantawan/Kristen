"use client";

import React, { useMemo, useState } from "react";
import { Slider } from "@/components/ui/operator_detail/slider";
import AnimatedStat from "@/components/ui/operator_detail/AnimateStat";
import PromotionRequirements from "@/components/ui/operator_detail/PromotionRequirements";
import OperatorRange from "@/components/ui/operator_detail/OperatorRange";
import rangeTable from "@/data/operator_detail/range_table.json";
import {
  Heart,
  Shield,
  Swords,
  Zap,
  Timer,
  Blocks,
  Diamond,
  Wallet,
} from "lucide-react";
import type { OperatorDetail } from "@/types/operator";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const labelMap: Record<string, { label: string; icon: React.ReactNode }> = {
  maxHp: {
    label: "Health",
    icon: <Heart size={16} className="text-red-400" />,
  },
  atk: {
    label: "Attack",
    icon: <Swords size={16} className="text-orange-400" />,
  },
  def: {
    label: "Defense",
    icon: <Shield size={16} className="text-blue-400" />,
  },
  magicResistance: {
    label: "Magic Res",
    icon: <Diamond size={16} className="text-purple-400" />,
  },
  cost: {
    label: "DP Cost",
    icon: <Wallet size={16} className="text-yellow-400" />,
  },
  blockCnt: {
    label: "Block",
    icon: <Blocks size={16} className="text-green-400" />,
  },
  baseAttackTime: {
    label: "Atk Interval",
    icon: <Zap size={16} className="text-pink-400" />,
  },
  respawnTime: {
    label: "Redeploy",
    icon: <Timer size={16} className="text-gray-400" />,
  },
};

type Props = {
  opDetail: OperatorDetail;
  selectedPhaseIndex: number;
  setSelectedPhaseIndex: (idx: number) => void;
  selectedLevel: number;
  setSelectedLevel: (val: number) => void;
};

export default function OperatorStats({
  opDetail,
  selectedPhaseIndex,
  setSelectedPhaseIndex,
  selectedLevel,
  setSelectedLevel,
}: Props) {
  const currentPhase = opDetail?.phases?.[selectedPhaseIndex];
  const evolveCost = currentPhase?.evolveCost ?? [];

  const levelData = useMemo(() => {
    if (!currentPhase || !selectedLevel) return {};

    const keyframes = currentPhase.attributesKeyFrames ?? [];
    const sorted = [...keyframes].sort((a, b) => a.level - b.level);
    const lower = sorted.findLast((f) => f.level <= selectedLevel);
    const upper = sorted.find((f) => f.level >= selectedLevel);

    if (!lower || !upper) return {};

    const percent =
      lower.level === upper.level
        ? 0
        : (selectedLevel - lower.level) / (upper.level - lower.level);

    const keys = Object.keys(lower.data);
    const result: Record<string, number> = {};

    keys.forEach((key) => {
      const a = lower.data[key];
      const b = upper.data[key];
      if (typeof a === "number" && typeof b === "number") {
        result[key] = parseFloat((a + (b - a) * percent).toFixed(2));
      } else {
        result[key] = a;
      }
    });

    return result;
  }, [currentPhase, selectedLevel]);

  const rangeId = currentPhase?.rangeId;
  const range = rangeId ? rangeTable[rangeId as keyof typeof rangeTable] : null;
  const rangeGrid = range?.grids ?? [];

  const validModules = useMemo(
    () =>
      opDetail.modules.filter((m) =>
        ["X", "Y", "Z"].includes(m.typeName2 ?? "")
      ),
    [opDetail.modules]
  );

  const [selectedModuleType, setSelectedModuleType] = useState<
    "X" | "Y" | "Z" | null
  >(validModules[0]?.typeName2 as "X" | "Y" | "Z" | null);
  const [selectedModuleLevel, setSelectedModuleLevel] = useState<number>(1);

  const selectedModule = useMemo(
    () => validModules.find((m) => m.typeName2 === selectedModuleType),
    [validModules, selectedModuleType]
  );

  const moduleBonus = useMemo(() => {
    const upgrades = selectedModule?.module_upgrades ?? [];
    const upgrade = upgrades.find((u) => u.equipLevel === selectedModuleLevel);
    const bonus: Record<string, number> = {};

    if (!upgrade) return bonus;

    upgrade.attributeBlackboard.forEach((entry) => {
      const key = entry.key;
      const val = entry.value;
      if (typeof key === "string" && typeof val === "number") {
        // แปลงชื่อ key ให้ match กับ key ใน labelMap
        if (key === "max_hp") bonus["maxHp"] = (bonus["maxHp"] ?? 0) + val;
        else if (key === "atk") bonus["atk"] = (bonus["atk"] ?? 0) + val;
        else if (key === "def") bonus["def"] = (bonus["def"] ?? 0) + val;
        else if (key === "respawn_time")
          bonus["respawnTime"] = (bonus["respawnTime"] ?? 0) + val;
        else if (key === "cost") bonus["cost"] = (bonus["cost"] ?? 0) + val;
        else bonus[key] = (bonus[key] ?? 0) + val;
      }
    });

    return bonus;
  }, [selectedModule, selectedModuleLevel]);

  const [trust, setTrust] = useState<number>(100);
  const [potentialRank, setPotentialRank] = useState<number>(1);

  const potentialBonuses = useMemo(() => {
    const ranks = opDetail.potentialRanks ?? [];
    if (potentialRank <= 1 || ranks.length === 0) return {};
    const unlocked = ranks.slice(0, potentialRank - 1);
    const result: Record<string, number> = {};
    unlocked.forEach((rank) => {
      const modifiers = rank.buff?.attributes?.attributeModifiers ?? [];
      modifiers.forEach((mod) => {
        const key = mod.attributeType?.toLowerCase();
        const value = mod.value;
        if (typeof key === "string" && typeof value === "number") {
          result[key] = (result[key] ?? 0) + value;
        }
      });
    });
    return result;
  }, [opDetail.potentialRanks, potentialRank]);

  const trustBonus = useMemo(() => {
    const keyframes = opDetail.favorKeyFrames ?? [];
    if (trust <= 0 || keyframes.length === 0) return {};
    const sorted = [...keyframes].sort((a, b) => a.level - b.level);

    const lower = sorted.findLast((f) => f.level <= trust);
    const upper = sorted.find((f) => f.level >= trust) ?? lower;

    if (!lower || !upper) return {};

    const percent =
      lower.level === upper.level
        ? 0
        : (trust - lower.level) / (upper.level - lower.level);

    const keys = Object.keys(lower.data);
    const result: Record<string, number> = {};

    keys.forEach((key) => {
      const a = lower.data[key];
      const b = upper.data[key];
      if (typeof a === "number" && typeof b === "number") {
        result[key] = Math.floor(a + (b - a) * percent);
      }
    });

    return result;
  }, [opDetail.favorKeyFrames, trust]);

  //console.log("Trust Bonus Raw:", opDetail.favorKeyFrames);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        {opDetail.phases?.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedPhaseIndex(idx);
              const maxLv = opDetail?.phases?.[idx]?.maxLevel ?? 1;
              setSelectedLevel(maxLv);
            }}
            className={cn(
              "px-3 py-1.5 text-sm border",
              idx === selectedPhaseIndex
                ? "bg-yellow-400 text-black font-semibold"
                : "bg-zinc-800 text-white"
            )}
          >
            E{idx}
          </button>
        ))}

        <div className="flex items-center gap-2 justify-end w-full">
          <label className="text-sm font-semibold text-white">Potential</label>
          <Select
            value={String(potentialRank)}
            onValueChange={(val) => setPotentialRank(parseInt(val))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Select Potential" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((rank) => (
                <SelectItem key={rank} value={String(rank)}>
                  {rank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Lv</span>
        <Slider
          min={1}
          max={currentPhase?.maxLevel ?? 1}
          value={[selectedLevel]}
          onValueChange={([val]) => setSelectedLevel(val)}
          className="flex-1"
        />
        <span className="text-sm font-bold">
          {selectedLevel} / {currentPhase?.maxLevel ?? "?"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 items-center border border-zinc-700 p-3 justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-white">Module</label>
          {validModules.map((mod) => (
            <button
              key={mod.typeName2}
              onClick={() =>
                setSelectedModuleType(mod.typeName2 as "X" | "Y" | "Z")
              }
              className={cn(
                "px-3 py-1.5 text-sm border",
                selectedModuleType === mod.typeName2
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-700 text-white hover:bg-zinc-600"
              )}
            >
              {mod.typeName2}
            </button>
          ))}
          <span className="text-sm font-semibold text-white">:</span>
          {[1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedModuleLevel(lvl)}
              className={cn(
                "px-3 py-1.5 text-sm border",
                selectedModuleLevel === lvl
                  ? "bg-yellow-400 text-black"
                  : "bg-zinc-700 text-white hover:bg-zinc-600"
              )}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-white">Trust</label>
          <Input
            type="number"
            min={0}
            max={100}
            value={trust}
            onChange={(e) => {
              const val = Math.max(0, Math.min(100, Number(e.target.value)));
              setTrust(val);
            }}
            className="w-20 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        {Object.entries(labelMap).map(([key, { label, icon }]) => {
          const base = levelData?.[key] ?? 0;
          const fromTrust = trustBonus?.[key] ?? 0;
          const fromModule = moduleBonus?.[key] ?? 0;
          const fromPotential = potentialBonuses?.[key] ?? 0;

          const total = base + fromTrust + fromModule + fromPotential;

          if (!total) return null;

          return (
            <div
              key={key}
              className="flex flex-col bg-zinc-900 p-2 border border-zinc-700"
            >
              <div className="flex items-center gap-1 text-zinc-400">
                {icon}
                <span>{label}</span>
              </div>

              <span className="font-semibold text-white flex items-center gap-1">
                <AnimatedStat
                  value={total}
                  fractionDigits={
                    ["baseAttackTime", "respawnTime"].includes(key) ? 1 : 0
                  }
                />
                {["baseAttackTime", "respawnTime"].includes(key) ? "s" : ""}

                <span className="flex gap-1 text-xs">
                  {fromPotential !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-emerald-400 cursor-help">
                          ({fromPotential > 0 ? "+" : ""}
                          {fromPotential})
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {fromPotential > 0 ? "+" : ""}
                        {fromPotential} {label} from Potential
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {fromTrust !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-yellow-400 cursor-help">
                          (+{fromTrust})
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        +{fromTrust} {label} from Trust
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {fromModule !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-cyan-400 cursor-help">
                          (+{fromModule})
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        +{fromModule} {label} from Module
                      </TooltipContent>
                    </Tooltip>
                  )}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="shrink-0 pr-2">
          <OperatorRange grids={rangeGrid} />
        </div>

        <PromotionRequirements
          items={evolveCost}
          rarity={opDetail.meta_info.rarity}
          phase={selectedPhaseIndex}
        />
      </div>
    </div>
  );
}
