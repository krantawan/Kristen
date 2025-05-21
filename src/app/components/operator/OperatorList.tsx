"use client";

import OperatorItem from "./OperatorItem"; // สมมุติว่าคุณมี component นี้อยู่แล้ว

type Operator = {
  name: string;
  tags: string[];
  image: string;
};

const allOperators: Operator[] = [
  {
    name: "SilverAsh",
    tags: ["Top Operator","Guard", "DPS", "Support"],
    image: "/operators/silverash.png"
  },
  {
    name: "Saria",
    tags: ["Top Operator","Defender", "Healing", "Support"],
    image: "/operators/saria.png"
  },
  {
    name: "Exusiai",
    tags: ["Top Operator","Sniper", "DPS"],
    image: "/operators/exusiai.png"
  },
  {
    name: "Nightmare",
    tags: ["Senior Operator","Caster", "Healing"],
    image: "/operators/nightmare.png"
  }
];

type Props = {
  title: string;
  selectedTags: string[];
};

export default function OperatorList({ title, selectedTags }: Props) {

  const matchedOperators = allOperators.filter(op =>
    selectedTags.every(tag => op.tags.includes(tag))
  );

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center">
          <div className="h-1 w-6 bg-[#BEC93B]" />
          <div className="h-1 w-6 bg-[#F6B347]" />
          <div className="h-1 w-6 bg-[#802520]" />
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-4 font-roboto">
          {title}
        </h2>
      </div>

      {selectedTags.length === 0 ? (
        <p className="text-gray-500">Please select some tags.</p>
      ) : matchedOperators.length === 0 ? (
        <p className="text-gray-500">No operators match your selected tags.</p>
      ) : (
        <div className="flex flex-wrap justify-start gap-1">
          {matchedOperators.map(op => (
            <OperatorItem key={op.name} name={op.name} image={op.image} />
          ))}
        </div>
      )}
    </>
  );
}
