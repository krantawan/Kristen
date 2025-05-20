export default function TagButton({ 
    label,
    className = "" 
  }: { 
    label: string;
    className?: string;
  }) {
    return (
      <button className={`bg-[#222] text-white px-4 py-2 font-bold text-sm ${className}`}>
        {label}
      </button>
    );
  }