import { Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ThemeToggle({
  isDarkMode,
  toggleTheme,
}: {
  isDarkMode: boolean;
  toggleTheme: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip key={isDarkMode ? "dark" : "light"}>
        <TooltipTrigger asChild>
          <button
            onClick={toggleTheme}
            className="p-1 text-gray-400 hover:text-[#FACC15] transition-colors"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="font-mono text-xs">
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
