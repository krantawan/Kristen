export default function TagButton({ 
    label,
    className = "" 
  }: { 
    label: string;
    className?: string;
  }) {
    return (
      <div className="flex items-center gap-2">
        <button className={`bg-[#222] px-4 py-2 font-bold text-sm ${className}`}>
          {label}
        </button>
      </div>
    );
  }