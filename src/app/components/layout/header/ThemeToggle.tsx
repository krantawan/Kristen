"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

type Props = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

export default function ThemeToggle({ isDarkMode, toggleTheme }: Props) {
  const t = useTranslations("header.menu");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        {isDarkMode ? t("switch_to_light_mode") : t("switch_to_dark_mode")}
      </TooltipContent>
    </Tooltip>
  );
}
