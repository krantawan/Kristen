"use client";

import { CollapsibleButton } from "@/components/ui/collapsible-button";
import OperatorItem from "./OperatorItem";
import operatorData from "@/data/operators.json";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useTranslations } from "next-intl";

type Operator = {
  name: string;
  tags: string[];
  image: string;
  stars: number;
};

type Props = {
  title: string;
  selectedTags: string[];
};

function getCombinations(tags: string[]): string[][] {
  const results: string[][] = [];
  const backtrack = (start: number, path: string[]) => {
    if (path.length > 0) results.push([...path]);
    for (let i = start; i < tags.length; i++) {
      path.push(tags[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  };
  backtrack(0, []);
  return results;
}

function getMatchingTagGroups(
  operators: Operator[],
  selectedTags: string[]
): Record<string, Operator[]> {
  const groups: Record<string, Operator[]> = {};

  const tagCombos = getCombinations(selectedTags);

  tagCombos.forEach((combo) => {
    const comboKey = combo.sort().join(" + ");
    const matched = operators.filter((op) =>
      combo.every((tag) => op.tags.includes(tag))
    );
    if (matched.length > 0) {
      groups[comboKey] = matched;
    }
  });

  return groups;
}

export default function OperatorList({ title, selectedTags }: Props) {
  const t = useTranslations("components.RecruitmentPage.operatorList");
  const preparedOperators = operatorData.map((op: Operator) => ({
    ...op,
    tags: [...op.tags, `${op.stars}★`],
  }));

  const grouped = getMatchingTagGroups(preparedOperators, selectedTags);

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
        <Alert>
          <Terminal className="h-5 w-5" />
          <AlertTitle>Alert !</AlertTitle>
          <AlertDescription>Please select some tags.</AlertDescription>
        </Alert>
      ) : Object.keys(grouped).length === 0 ? (
        <Alert>
          <Terminal className="h-5 w-5" />
          <AlertTitle>Alert !</AlertTitle>
          <AlertDescription>
            No operators match your selected tags.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-col gap-0">
          {Object.entries(grouped).map(([combo, ops], index) => (
            <CollapsibleButton
              key={combo}
              title={combo}
              defaultOpen={index === 0}
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
          ))}
        </div>
      )}
    </>
  );
}
