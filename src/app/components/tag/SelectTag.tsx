"use client";

import { useState, useEffect } from "react";
import { CollapsibleButton } from "@/components/ui/collapsible-button";
import { tagGroups } from "@/data/tagGroups";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

type Props = {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function SelectTag({ selectedTags, setSelectedTags }: Props) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const allGroupLabels = tagGroups.map((g) => g.label);
  const [visibleGroups, setVisibleGroups] = useState<string[]>([
    "Class",
    "Trait Tags",
    "Tag Tier",
  ]);

  const toggleGroup = (label: string) => {
    setVisibleGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  useEffect(() => {
    setSelectedTags((prev: string[]) =>
      prev.includes("Top Operator") ? prev : [...prev, "Top Operator"]
    );
  }, [setSelectedTags]);

  const t = useTranslations("components.RecruitmentPage");

  const locale = useLocale();
  const fontClass = locale === "th" ? "" : "font-semibold";

  return (
    <CollapsibleButton title={t("tag.select_tag")} defaultOpen={true}>
      <div className="p-4">
        <div
          className={`flex flex-wrap gap-3 mb-4 items-center justify-between w-full ${fontClass}`}
        >
          <div className="flex flex-wrap gap-3">
            {allGroupLabels.map((label) => (
              <label
                key={label}
                className="flex items-center gap-1 text-sm text-[#f3f3f3]"
              >
                <input
                  type="checkbox"
                  checked={visibleGroups.includes(label)}
                  onChange={() => toggleGroup(label)}
                  className="accent-[#BEC93B]"
                />
                {t(`tag.labelGroup.${label}`)}
              </label>
            ))}
          </div>

          <button
            onClick={() => setSelectedTags([])}
            className={`px-4 py-1 rounded text-sm transition-all duration-100
            ${
              selectedTags.length > 0
                ? "bg-[#802520] hover:bg-[#802520c7] text-white opacity-100"
                : "opacity-0 pointer-events-none"
            }
            `}
          >
            {t("tag.clear")}
          </button>
        </div>
        {visibleGroups.length > 0 && (
          <div className="flex flex-col gap-4 my-2">
            {tagGroups
              .filter((group) => visibleGroups.includes(group.label))
              .map((group) => (
                <div key={group.label}>
                  <p className={`text-sm text-[#BEC93B] mb-1 ${fontClass}`}>
                    {t(`tag.labelGroup.${group.label}`)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 ${fontClass} text-sm rounded ${
                          selectedTags.includes(tag)
                            ? tag === "Top Operator"
                              ? "bg-[#FFD802] text-black"
                              : "bg-[#BEC93B] text-black"
                            : "bg-[#333] text-[#f3f3f3] hover:bg-[#444]"
                        }`}
                      >
                        {t(`taglist.${tag}`)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </CollapsibleButton>
  );
}
