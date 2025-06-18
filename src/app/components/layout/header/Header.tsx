"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import HeaderNavMenu from "./HeaderNavMenu";
import LanguageDropdown from "./LanguageDropdown";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-[#333]">
      <div className="relative mx-auto max-w-7xl w-full h-10">
        {/* LEFT */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <div className="text-xl font-bold font-mono text-[#FACC15]">
            Kristen
          </div>
        </div>

        {/* CENTER */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
          <HeaderNavMenu />
        </div>

        {/* RIGHT */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-4">
          <div className="h-8 flex items-center gap-1 border border-[#333] rounded px-3">
            <LanguageDropdown />
          </div>
          <div className="h-8 flex items-center justify-center border border-[#333] rounded px-1">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-300 hover:text-[#FACC15] transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
    </header>
  );
}
