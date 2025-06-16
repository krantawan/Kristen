// components/operator_detail/OperatorHeader.tsx
import Image from "next/image";
import { cn } from "@/lib/utils";
import { OperatorRarityText } from "@/app/components/operator/details/config";

export function OperatorHeader({
  name,
  rarity,
  profession,
  subProfession,
  position,
  classIconSrc,
}: {
  name: string;
  rarity: number;
  profession: string;
  subProfession: string;
  position: string;
  classIconSrc: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2 border-b dark:border-zinc-800">
      <div className="flex items-center gap-4">
        {/* Profession Icon */}
        <div className="w-12 h-12 relative">
          <Image
            src={classIconSrc}
            alt={profession}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-contain"
            draggable={false}
          />
        </div>

        {/* Name and Class Info */}
        <div>
          <h1
            className={cn(
              "text-2xl font-bold",
              OperatorRarityText[rarity as keyof typeof OperatorRarityText]
            )}
          >
            {name}
          </h1>
          <p className="text-sm text-gray-400">
            {profession} / {subProfession} • {position}
          </p>
        </div>
      </div>

      {/* Rarity Stars */}
      <div className="relative flex items-center gap-0">
        {Array.from({ length: rarity }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "relative z-[1]",
              "w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10",
              i === 0 ? "ml-0" : "ml-[-15px] sm:-ml-[6px] md:-ml-5"
            )}
          >
            <Image
              src="/game-ui/star.png"
              alt="star"
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              draggable={false}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
