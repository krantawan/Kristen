"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

export default function ThemeToggle({ isDarkMode, toggleTheme }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="p-2 text-gray-300 hover:text-[#FACC15] transition-colors"
        >
          {isDarkMode ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </TooltipContent>
    </Tooltip>
  );
}
