export default function TagButton({ 
    label,
    className = "",
    onClick
  }: { 
    label: string;
    className?: string;
    onClick?: () => void;
  }) {
    return (
      <div className="flex items-center gap-2">
        <button className={`bg-[#222] px-4 py-2 font-bold text-sm cursor-pointer ${className}`} onClick={onClick}>
          {label}
        </button>
      </div>
    );
  }