"use client";

import { CollapsibleButton } from "@/components/ui/collapsible-button";
import OperatorItem from "./OperatorItem";
import operatorData from "@/data/operators.json";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import type { Operator } from "@/lib/operator-utils";
import { getMatchingTagGroups } from "@/lib/operator-utils";

type Props = {
  title: string;
  selectedTags: string[];
};


export default function OperatorList({ title, selectedTags }: Props) {
  const t = useTranslations("components.RecruitmentPage.operatorList");
  const locale = useLocale();

  const preparedOperators = operatorData.map((op: Operator) => ({
    ...op,
    tags: [...op.tags, `${op.stars}★`],
  }));

  const grouped = getMatchingTagGroups(preparedOperators, selectedTags);

  const groupedEntries = Object.entries(grouped);

  // แยก tag เดี่ยวและ tag ผสม
  const combinedTags = groupedEntries.filter(([key]) => key.includes(" + "));
  const singleTags = groupedEntries.filter(([key]) => !key.includes(" + "));

  // เอามาต่อรวมกันโดยให้ tag ผสมขึ้นก่อน
  const sortedGroups = [...combinedTags, ...singleTags];

  return (
    <>
      <div className="max-w-7xl mx-auto px-2 mb-5">
        <div className="flex items-center">
          <div className="h-1 w-6 bg-[#BEC93B]" />
          <div className="h-1 w-6 bg-[#F6B347]" />
          <div className="h-1 w-6 bg-[#802520]" />
        </div>
        <h2 className="text-2xl font-black tracking-tight font-roboto">
          {t(title)}
        </h2>
      </div>

      {selectedTags.length === 0 ? (
        <div className="w-full flex justify-center mt-6">
          <div className="bg-yellow-50 text-yellow-800 dark:bg-[#1e1e1e] dark:text-red-300 dark:border-red-500 text-sm px-4 py-3 rounded-md border border-yellow-300 shadow-sm font-medium max-w-md w-full text-center">
            {t("warning_message")}
          </div>
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="w-full flex justify-center mt-6">
          <div className="bg-yellow-50 text-yellow-800 dark:bg-[#1e1e1e] dark:text-red-300 dark:border-red-500 text-sm px-4 py-3 rounded-md border border-yellow-300 shadow-sm font-medium max-w-md w-full text-center">
            {t("warning_message_no_match")}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {sortedGroups.map(([combo, ops], index) => (
            <div key={combo + "_" + index} className="mb-2">
              <CollapsibleButton
                title={combo}
                defaultOpen={true}
                description={
                  <span
                    className={cn(
                      "ml-auto text-xs font-semibold text-[#FACC15] uppercase tracking-wide",
                      locale === "th" ? "" : "font-mono"
                    )}
                  >
                    {t("operator_count", { count: ops.length })}
                  </span>
                }
              >
                <div
                  className={cn(
                    "grid gap-3",
                    "px-4 sm:px-10 py-4",
                    "grid-cols-[repeat(auto-fill,minmax(110px,1fr))]",
                    "justify-start"
                  )}
                >
                  {ops.map((op) => (
                    <OperatorItem
                      key={`${combo}-${op.name}`}
                      name={op.name}
                      image={op.image}
                      stars={op.stars}
                    />
                  ))}
                </div>
              </CollapsibleButton>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
