const legends = [
  { label: "Main Story", color: "#802520" },
  { label: "Side Story", color: "#d4a940" },
  { label: "Contingency Contract", color: "#5C7F71" },
];

export default function EventTag() {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
      {legends.map((legend) => (
        <div key={legend.label} className="flex items-center gap-2">
          <span
            className="inline-block w-4 h-4 rounded"
            style={{ backgroundColor: legend.color }}
          />
          <span className="text-gray-700">{legend.label}</span>
        </div>
      ))}
    </div>
  );
}
