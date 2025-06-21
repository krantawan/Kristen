import React from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type MaterialItem = {
  id: string;
  name?: string;
  iconId?: string;
  count: number;
};

interface PromotionRequirementProps {
  items: MaterialItem[];
  title?: string;
  rarity?: number;
  phase?: number;
}

const formatCount = (count: number) => {
  if (count >= 1000) return `${Math.round(count / 1000)}K`;
  return `${count}`;
};

const getLmdCost = (rarity: number = 0, phase: number = 0): number => {
  if (phase === 0) return 0;

  const costMap: Record<number, [number, number]> = {
    6: [30000, 180000],
    5: [20000, 120000],
    4: [15000, 60000],
    3: [10000, 0],
    2: [0, 0],
    1: [0, 0],
  };

  const costPair = costMap[rarity] ?? [0, 0];
  return costPair[phase - 1] ?? 0;
};

const itemMap: Record<string, { name: string; iconId: string }> = {
  "4001": { name: "LMD", iconId: "GOLD" },
  mod_unlock_token: { name: "Module Data Block", iconId: "mod_unlock_token" },
  mod_update_token_1: {
    name: "Update Device (T1)",
    iconId: "mod_update_token_1",
  },
  mod_update_token_2: {
    name: "Update Device (T2)",
    iconId: "mod_update_token_2",
  },
  "30135": { name: "D32 Steel", iconId: "MTL_SL_DS" },
  "30145": { name: "Polyester Pack", iconId: "MTL_SL_RUSH3" },
  "30115": { name: "Polymerization Preparation", iconId: "MTL_SL_PP" },
  "30125": { name: "Bipolar Nanoflake", iconId: "MTL_SL_BN" },
  "30155": { name: "Nucleic Crystal Sinter", iconId: "MTL_SL_SHJ" },
  "30165": { name: "-", iconId: "MTL_SL_DYT" },
};

const PromotionRequirements: React.FC<PromotionRequirementProps> = ({
  items,
  title = "Promotion Requirements",
  rarity,
  phase,
}) => {
  const lmd = getLmdCost(rarity, phase);
  const baseItems = lmd ? [{ id: "4001", count: lmd }, ...items] : items;

  const fullItems = baseItems.map((item) => {
    const mapped = itemMap[item.id];
    return {
      ...item,
      name: mapped?.name ?? item.name ?? item.id,
      iconId: mapped?.iconId ?? item.iconId ?? item.id,
    };
  });

  return (
    <TooltipProvider>
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-zinc-300 mb-1">{title}</h3>
        {fullItems.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {fullItems.map((mat, idx) => (
              <Tooltip key={mat.id + "-" + idx}>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center relative text-center">
                    <Image
                      src={`/assets/item/${mat.iconId}.png`}
                      alt={mat.name}
                      width={64}
                      height={64}
                      draggable={false}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="absolute bottom-0 right-0 bg-black/80 px-1 text-[14px] font-semibold text-white leading-none">
                      {formatCount(mat.count)}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{mat.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ) : (
          <span className="text-xs text-yellow-400 font-semibold opacity-50">
            No promotion requirements
          </span>
        )}
      </div>
    </TooltipProvider>
  );
};

export default PromotionRequirements;
