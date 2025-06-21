"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { OperatorSkill, SkillLevelStep } from "@/types/operator";
import parseRichText from "@/lib/parseRichTect";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/operator_detail/slider";
import PromotionRequirements from "@/components/ui/operator_detail/PromotionRequirements";
//import OperatorRange from "@/components/ui/operator_detail/OperatorRange";
import rangeTable from "@/data/operator_detail/range_table.json";

const SKILL_LEVELS = ["1", "2", "3", "4", "5", "6", "7", "M1", "M2", "M3"];

export default function OperatorSkill({
  skills,
  skillLevelUpgrade,
}: {
  skills: OperatorSkill[];
  skillLevelUpgrade: SkillLevelStep[];
}) {
  console.log(skills);

  const [selectedLevelIndexes, setSelectedLevelIndexes] = useState<number[]>(
    skills.map(() => 9)
  );

  const handleLevelChange = (skillIndex: number, newLevel: number) => {
    setSelectedLevelIndexes((prev) => {
      const updated = [...prev];
      updated[skillIndex] = newLevel;
      return updated;
    });
  };

  const [imageSources, setImageSources] = useState(() => {
    const sources: { [key: string]: string } = {};
    skills.forEach((skill) => {
      sources[skill.skillId] = `/assets/skill/skill_icon_${skill.skillId}.png`;
    });
    return sources;
  });

  const handleImageError = (skillId: string, iconId: string) => {
    setImageSources((prev) => ({
      ...prev,
      [skillId]: `/assets/skill/skill_icon_${iconId}.png`,
    }));
  };

  const range = skills.map((skill) =>
    skill.rangeId ? rangeTable[skill.rangeId as keyof typeof rangeTable] : null
  );

  const rangeGrid = range?.map((r) => r?.grids ?? []);

  console.log(rangeGrid);

  return (
    <div className="space-y-6 p-4">
      {skills.map((skill, index) => {
        return (
          <div key={skill.skillId} className="mb-6 last:mb-0">
            <div className="flex items-start gap-4 flex-col md:flex-row">
              {/* Skill Icon */}
              <div className="flex items-start gap-4 w-full border border-zinc-700 p-2 ">
                <div className="w-20 h-20 flex-shrink-0 mt-2">
                  <Image
                    src={imageSources[skill.skillId] || "/placeholder.svg"}
                    onError={() =>
                      handleImageError(skill.skillId, skill.iconId)
                    }
                    alt={skill.skillName}
                    width={80}
                    height={80}
                    draggable={false}
                    className="border border-zinc-700"
                  />
                </div>

                {/* Skill Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-bold text-yellow-400">
                        {skill.skillName || `Skill ${index + 1}`}
                      </h3>
                      <div className="flex gap-2">
                        {skill.skillType === "MANUAL" && (
                          <div className="pt-1">
                            <Badge
                              variant="outline"
                              className="text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                            >
                              Manual
                            </Badge>
                          </div>
                        )}
                        {skill.skillType === "AUTO" && (
                          <div className="pt-1">
                            <Badge
                              variant="outline"
                              className="text-rose-400 bg-rose-400/10 border-rose-400/20"
                            >
                              Auto
                            </Badge>
                          </div>
                        )}
                        {skill.duration === -1 && (
                          <div className="pt-1">
                            <Badge
                              variant="outline"
                              className="text-green-400 bg-green-400/10 border-green-400/20"
                            >
                              Infinite
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Stats Badges */}
                    <div className="flex flex-wrap gap-2">
                      {skill.spCost !== undefined && (
                        <Badge
                          variant="outline"
                          className="text-orange-400 bg-orange-400/10 border-orange-400/20"
                        >
                          SP Cost: {skill.spCost}
                        </Badge>
                      )}
                      {skill.initSp !== undefined && (
                        <Badge
                          variant="outline"
                          className="text-blue-400 bg-blue-400/10 border-blue-400/20"
                        >
                          Initial SP: {skill.initSp}
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="text-green-400 bg-green-400/10 border-green-400/20"
                      >
                        Duration:{" "}
                        {skill.duration === -1 ? "∞" : skill.duration + "s"}
                      </Badge>
                    </div>
                  </div>

                  {/* Level Slider */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Slider
                          min={0}
                          max={SKILL_LEVELS.length - 1}
                          step={1}
                          value={[selectedLevelIndexes[index] || 0]}
                          onValueChange={([val]) =>
                            handleLevelChange(index, val)
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground font-semibold">
                        Rank
                      </div>
                      <div className="border border-zinc-700 px-3 py-1 bg-zinc-800">
                        <span className="text-sm font-medium text-white">
                          {SKILL_LEVELS[selectedLevelIndexes[index] || 0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-3">
                    {parseRichText(
                      skill.desc,
                      Object.fromEntries(
                        skill.blackboard?.map((b) => [b.key, b.value]) || []
                      )
                    )}
                  </p>

                  {/* Range */}
                  {/* {rangeGrid?.[index] ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-2">
                        <OperatorRange grids={rangeGrid?.[index] ?? []} />
                      </div>
                    </div>
                  ) : null} */}

                  <div className="mt-4">
                    {(selectedLevelIndexes[index] >= 1 &&
                      selectedLevelIndexes[index] <= 6 &&
                      skillLevelUpgrade?.[selectedLevelIndexes[index] - 1]) ||
                    (selectedLevelIndexes[index] >= 7 &&
                      skill.upgradeCost?.[selectedLevelIndexes[index] - 7]) ? (
                      <PromotionRequirements
                        title="Upgrade Requirements"
                        items={
                          (selectedLevelIndexes[index] <= 6
                            ? skillLevelUpgrade?.[
                                selectedLevelIndexes[index] - 1
                              ]?.levelUpCost
                            : skill.upgradeCost?.[
                                selectedLevelIndexes[index] - 7
                              ]?.levelUpCost
                          )?.map((item) => ({
                            id: item.id,
                            name: item.name || item.id,
                            iconId: item.iconId || item.id,
                            count: item.count,
                          })) || []
                        }
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
