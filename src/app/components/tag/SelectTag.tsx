"use client";

import { useState, useEffect } from "react";
import { CollapsibleButton } from "@/components/ui/collapsible-button";
import { tagGroups } from "@/data/tagGroups";

type Props = {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
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
    if (!selectedTags.includes("Top Operator")) {
      setSelectedTags([...selectedTags, "Top Operator"]);
    }
  }, [selectedTags, setSelectedTags]);

  return (
    <CollapsibleButton title="SELECT TAG" defaultOpen={true}>
      <div className="p-4">
        <div className="flex flex-wrap gap-3 mb-4 items-center justify-between w-full">
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
                {label}
              </label>
            ))}
          </div>

          <button
            onClick={() => setSelectedTags([])}
            className={`px-4 py-1 rounded text-sm font-semibold transition-all duration-100
            ${
              selectedTags.length > 0
                ? "bg-[#802520] hover:bg-[#802520c7] text-white opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            Clear
          </button>
        </div>
        {visibleGroups.length > 0 && (
          <div className="flex flex-col gap-4 my-2">
            {tagGroups
              .filter((group) => visibleGroups.includes(group.label))
              .map((group) => (
                <div key={group.label}>
                  <p className="text-sm font-bold text-[#BEC93B] mb-1">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 font-bold text-sm rounded ${
                          selectedTags.includes(tag)
                            ? tag === "Top Operator"
                              ? "bg-[#FFD802] text-black"
                              : "bg-[#BEC93B] text-black"
                            : "bg-[#333] text-[#f3f3f3] hover:bg-[#444]"
                        }`}
                      >
                        {tag}
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
