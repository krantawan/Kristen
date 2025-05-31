// components/ui/MobileMenu.tsx

"use client";

import Link from "next/link";
import { HomeIcon, BookOpenIcon, SproutIcon } from "lucide-react";
import LanguageDropdown from "./LanguageDropdown";
import ThemeToggle from "./ThemeToggle";
import { useTranslations } from "next-intl";

type MobileMenuProps = {
  isOpen: boolean;
  toggleTheme: () => void;
  isDarkMode: boolean;
};

export default function MobileMenu({
  isOpen,
  toggleTheme,
  isDarkMode,
}: MobileMenuProps) {
  const t = useTranslations("header.menu");
  if (!isOpen) return null;
  return (
    <div className="md:hidden border-t border-[#333] bg-[#1a1a1a] px-4 py-4 space-y-4">
      <nav className="space-y-3">
        <Link
          href="/"
          className="flex items-center text-sm font-mono text-gray-300 hover:text-[#FACC15] py-2 transition-colors duration-200"
        >
          <HomeIcon className="h-4 w-4 mr-2" /> {t("home")}
        </Link>

        <div className="space-y-2">
          <div className="flex items-center text-sm font-mono text-gray-400 py-2">
            <BookOpenIcon className="h-4 w-4 mr-2" /> {t("tools")}
          </div>
          <div className="ml-6 space-y-1">
            <Link
              href="/"
              className="block text-sm font-mono text-gray-400 hover:text-[#FACC15]"
            >
              {t("recruitment")}
            </Link>
            <Link
              href="/events"
              className="block text-sm font-mono text-gray-400 hover:text-[#FACC15]"
            >
              {t("events")}
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm font-mono text-gray-400 py-2">
            <SproutIcon className="h-4 w-4 mr-2" /> {t("about")}
          </div>
          <div className="ml-6 space-y-1">
            <Link
              href="/about/project"
              className="block text-sm font-mono text-gray-400 hover:text-[#FACC15]"
            >
              {t("about_project")}
            </Link>
            <Link
              href="/about/devlog"
              className="block text-sm font-mono text-gray-400 hover:text-[#FACC15]"
            >
              {t("devlog")}
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex justify-between items-center pt-4 border-t border-[#333]">
        <LanguageDropdown />
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
}
