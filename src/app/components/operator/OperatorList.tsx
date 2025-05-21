"use client";

import OperatorItem from "./OperatorItem"; // สมมุติว่าคุณมี component นี้อยู่แล้ว

type Operator = {
  name: string;
  tags: string[];
  image: string;
  stars: number;
};

import operatorData from "@/data/operators.json";

type Props = {
  title: string;
  selectedTags: string[];
};

export default function OperatorList({ title, selectedTags }: Props) {

  const preparedOperators = operatorData.map((op: Operator) => ({
    ...op,
    tags: [...op.tags, `${op.stars}★`],
  }));

  const matchedOperators = preparedOperators.filter((op: Operator) =>
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
          {matchedOperators.map((op: Operator) => (
            <OperatorItem key={op.name} name={op.name} image={op.image} stars={op.stars} />
          ))}
        </div>
      )}
    </>
  );
}
