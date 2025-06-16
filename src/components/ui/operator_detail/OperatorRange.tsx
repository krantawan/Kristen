import React from "react";

interface GridPosition {
  row: number;
  col: number;
}

interface OperatorRangeProps {
  grids: GridPosition[];
  gridSize?: number; // default to 9x9
}

const OperatorRange: React.FC<OperatorRangeProps> = ({ grids }) => {
  const rows = grids.map((g) => g.row);
  const cols = grids.map((g) => g.col);

  const minRow = Math.min(...rows, 0);
  const maxRow = Math.max(...rows, 0);
  const minCol = Math.min(...cols, 0);
  const maxCol = Math.max(...cols, 0);

  const height = maxRow - minRow + 1;
  const width = maxCol - minCol + 1;
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-300 mb-1">Range</h3>
      <div
        className={`grid gap-[1px] bg-zinc-700 p-[1px]`}
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: height * width }).map((_, i) => {
          const row = Math.floor(i / width) + minRow;
          const col = (i % width) + minCol;
          const isCenter = row === 0 && col === 0;
          const isInRange = grids.some((g) => g.row === row && g.col === col);

          return (
            <div
              key={i}
              className={`aspect-square w-5 ${
                isCenter
                  ? "bg-white/30"
                  : isInRange
                  ? "bg-yellow-500"
                  : "bg-zinc-800"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OperatorRange;
