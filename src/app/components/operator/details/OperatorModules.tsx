"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { OperatorModule } from "@/types/operator";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { labelMap } from "@/components/ui/operator_detail/stat-icon";
import PromotionRequirements from "@/components/ui/operator_detail/PromotionRequirements";

function parseRichText(
  text?: string | null,
  blackboard: Record<string, number> = {}
): React.ReactNode[] {
  if (!text) return [];

  const regex =
    /(<[@$]ba\.[\w.]+>)([+-]?)(\{([\w_]+)(?::(\d+))?%?\})?(.*?)<\/>|(\{([\w_]+)\})|([-+]?\d+(?:\.\d+)?(?:%|s)?)(?!\w)/g;

  const highlightNumbers = (chunk: string): React.ReactNode[] => {
    const split = chunk.split(
      /(?<![a-zA-Z])([-+]?\d+(?:\.\d+)?(?:%|s| SP| tiles)?)(?![a-zA-Z])/g
    );
    return React.Children.toArray(
      split.map((part) => {
        if (/^[-+]?\d+(?:\.\d+)?(?:%|s| SP| tiles)?$/.test(part)) {
          const color = part.includes("%")
            ? "text-yellow-400"
            : part.includes("s")
            ? "text-cyan-400"
            : "text-emerald-400";
          return <span className={color}>{part}</span>;
        }
        return part;
      })
    );
  };

  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(...highlightNumbers(text.slice(lastIndex, match.index)));
    }

    if (match[1]) {
      const tag = match[1];
      const key = match[4];
      const precisionStr = match[5];
      const fallbackText = match[6];

      const value: number | undefined = key ? blackboard[key] : undefined;

      let content = fallbackText;

      if (value !== undefined) {
        const isPercentage = Boolean(precisionStr);
        const precision = precisionStr ? parseInt(precisionStr) : 0;

        const raw = isPercentage ? value * 100 : value;
        const sign = raw > 0 ? "+" : raw < 0 ? "-" : "";
        const formatted = Math.abs(raw).toFixed(precision);

        content = `${sign}${formatted}${isPercentage ? "%" : ""}`;
      }

      const color = tag.includes("@ba.kw")
        ? "text-yellow-400"
        : tag.includes("$ba.stun")
        ? "text-blue-400"
        : tag.includes("@ba.talpu")
        ? "text-green-400"
        : tag.includes("@ba.vup")
        ? "text-red-400"
        : tag.includes("@ba.vdown")
        ? "text-cyan-400"
        : tag.includes("burning")
        ? "text-orange-400"
        : "text-white";

      result.push(
        <span key={`${tag}-${result.length}`} className={color}>
          {content}
        </span>
      );
    } else if (match[7]) {
      const key = match[8];
      const value = blackboard[key];
      const content = value !== undefined ? value : `{${key}}`;
      result.push(
        <span key={`bb-${key}-${result.length}`} className="text-red-400">
          {content}
        </span>
      );
    } else if (match[9]) {
      const val = match[9];
      const color = val.includes("%")
        ? "text-yellow-400"
        : val.includes("s")
        ? "text-cyan-400"
        : "text-emerald-400";
      result.push(
        <span key={`val-${val}-${result.length}`} className={color}>
          {val}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    result.push(...highlightNumbers(text.slice(lastIndex)));
  }

  return React.Children.toArray(result);
}

export default function OperatorModules({
  modules,
}: {
  modules: OperatorModule[];
}) {
  const validModules = useMemo(() => {
    return modules.filter((m) => m.typeName2);
  }, [modules]);

  const moduleTypes = useMemo(() => {
    return Array.from(new Set(validModules.map((m) => m.typeName2))).filter(
      Boolean
    ) as ("X" | "Y" | "Z" | "A")[];
  }, [validModules]);

  const [selectedModuleType, setSelectedModuleType] = useState<
    "X" | "Y" | "Z" | "A"
  >(() => {
    return (moduleTypes[0] as "X" | "Y" | "Z" | "A") ?? "X";
  });
  const [selectedModuleLevel, setSelectedModuleLevel] = useState<number>(1);
  const [potentialRank, setPotentialRank] = useState<number>(0);

  useEffect(() => {
    if (!moduleTypes.includes(selectedModuleType)) {
      setSelectedModuleType(moduleTypes[0] ?? "X");
    }
  }, [moduleTypes, selectedModuleType]);

  const selectedModule = validModules.find(
    (m) => m.typeName2 === selectedModuleType
  );

  const upgrade = useMemo(() => {
    return selectedModule?.module_upgrades?.find(
      (u) => u.equipLevel === selectedModuleLevel
    );
  }, [selectedModule, selectedModuleLevel]);

  const parts = useMemo(() => upgrade?.parts ?? [], [upgrade]);

  const potentialRanks = useMemo(() => {
    const values = Array.from(
      new Set(
        parts.flatMap((part) =>
          (part.talents ?? [])
            .filter((t) => t.requiredPotentialRank !== undefined)
            .map((t) => t.requiredPotentialRank!)
        )
      )
    );
    return values.length > 0 && !values.includes(0) ? [0, ...values] : values;
  }, [parts]);

  useEffect(() => {
    if (!potentialRanks.includes(potentialRank)) {
      setPotentialRank(potentialRanks[0] ?? 0);
    }
  }, [potentialRanks, potentialRank]);

  const statBonus = useMemo(() => {
    const bonus: Record<string, number> = {};
    upgrade?.attributeBlackboard.forEach((attr) => {
      const key = attr.key;
      const val = attr.value;
      if (typeof key === "string" && typeof val === "number") {
        if (key === "max_hp") bonus["HP"] = (bonus["HP"] ?? 0) + val;
        else if (key === "atk") bonus["ATK"] = (bonus["ATK"] ?? 0) + val;
        else if (key === "def") bonus["DEF"] = (bonus["DEF"] ?? 0) + val;
        else if (key === "attack_speed")
          bonus["ASPD"] = (bonus["ASPD"] ?? 0) + val;
        else bonus[key] = (bonus[key] ?? 0) + val;
      }
    });
    return bonus;
  }, [upgrade]);

  if (!selectedModule) {
    return (
      <div className="p-4 text-zinc-400">
        This operator has no modules available.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center flex-wrap gap-2 mb-4 justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-white">Module</label>
          {validModules.map((mod) => (
            <button
              key={mod.typeName2}
              onClick={() =>
                setSelectedModuleType(mod.typeName2 as "X" | "Y" | "Z" | "A")
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
        {potentialRanks.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-white">
              Potential
            </label>
            <Select
              value={String(potentialRank)}
              onValueChange={(val) => setPotentialRank(parseInt(val))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue>{potentialRank}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {potentialRanks.map((rank) => (
                  <SelectItem key={rank} value={String(rank)}>
                    {rank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-700 text-sm whitespace-pre-wrap p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* ซ้าย: Module Title */}
          <div className="w-full md:w-1/2">
            <div className="flex flex-col gap-1">
              <span>{selectedModule.moduleName || "Unknown Module"}</span>
              {selectedModule.typeName1 && (
                <span className="text-sm font-normal text-zinc-400">
                  {selectedModule.typeName1}-{selectedModule.typeName2}
                </span>
              )}
            </div>
          </div>

          {/* ขวา: Stat Bonus */}
          <div className="w-full md:w-1/2">
            <div className="flex flex-wrap">
              {Object.entries(statBonus).map(([key, value]) => {
                if (!value) return null;

                const normalizedKey = key.toLowerCase();
                const labelInfo = labelMap[normalizedKey] || {
                  label: key,
                  icon: null,
                };

                return (
                  <div key={key} className="w-1/2 p-2">
                    <div className="flex flex-col justify-start bg-zinc-900 p-2 border border-zinc-700 min-h-[64px] text-center h-full">
                      <div className="flex items-center gap-1 text-zinc-400 justify-center">
                        {labelInfo.icon}
                        <span>{labelInfo.label}</span>
                      </div>
                      <span className="font-semibold text-white flex items-center gap-1 justify-center">
                        +{value}
                        {(key === "baseAttackTime" || key === "respawnTime") &&
                          "s"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4 text-sm text-zinc-300 mt-4">
          {(() => {
            const shownTalents = new Set();

            return parts.map((part, idx) => (
              <div key={idx} className="text-sm text-zinc-300 space-y-1">
                {/* Trait Section */}
                {part.trait
                  ?.filter(
                    (t) => (t.requiredPotentialRank ?? 0) <= potentialRank
                  )
                  .map((t, i) => {
                    const bbMap = Object.fromEntries(
                      (t.blackboard ?? []).map((b) => [b.key, b.value])
                    );
                    const desc =
                      t.overrideDescription || t.additionalDescription;
                    if (!desc) return null;

                    return (
                      <div key={`trait-${idx}-${i}`}>
                        <span className="font-semibold text-zinc-100">
                          Trait (Module)
                        </span>
                        : {parseRichText(desc, bbMap)}
                      </div>
                    );
                  })}

                {/* Talent Section */}
                {part.talents?.map((t, i) => {
                  const id = `${t.talentIndex}-${t.upgradeDescription ?? ""}`;
                  if (
                    t.requiredPotentialRank !== potentialRank ||
                    !(t.upgradeDescription || t.name) ||
                    shownTalents.has(id)
                  )
                    return null;

                  shownTalents.add(id);

                  const bbMap = Object.fromEntries(
                    Array.isArray(t.blackboard)
                      ? t.blackboard.map((b) => [b.key, b.value])
                      : []
                  );
                  const line = t.upgradeDescription || t.name;

                  return (
                    <div key={`talent-${idx}-${i}`}>
                      <span className="font-semibold text-zinc-100">
                        Talent {t.talentIndex + 1} (Enhanced)
                      </span>
                      : {parseRichText(line, bbMap)}
                    </div>
                  );
                })}
              </div>
            ));
          })()}

          {selectedModule?.itemCost?.[selectedModuleLevel]?.length && (
            <PromotionRequirements
              title="Upgrade Requirements"
              items={selectedModule.itemCost[selectedModuleLevel].map(
                (item) => ({
                  id: item.id,
                  name: item.id,
                  iconId: item.id,
                  count: item.count,
                })
              )}
            />
          )}
        </div>
      </div>
      <div className="bg-zinc-900 border text-sm whitespace-pre-wrap">
        <h3 className="text-base font-semibold text-white border-b 0 p-4">
          <div className="flex items-center gap-2">
            <span>Module Description</span>
            <Badge
              variant="outline"
              className="text-yellow-400 bg-yellow-950/50"
            >
              Spoiler Warning
            </Badge>
          </div>
        </h3>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="desc">
            <AccordionTrigger className="px-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Folder size={16} />
                  <span>View Description</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="whitespace-pre-line text-zinc-400 px-4">
              {selectedModule.desc}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
