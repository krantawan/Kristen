"use client";

type Props = {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
};

const allTags = [
  "Defender", "Vanguard", "Guard", "Sniper", "Caster", "Medic",
  "Supporter", "Specialist", "Healing", "DPS", "Survival", "AoE",
  "Top Operator", "Senior Operator"
];

export default function SelectTag({ selectedTags, setSelectedTags }: Props) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {allTags.map(tag => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`px-3 py-1 rounded-full border ${
            selectedTags.includes(tag) ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
