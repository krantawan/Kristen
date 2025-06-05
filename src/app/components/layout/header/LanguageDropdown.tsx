"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageDropdown() {
  const router = useRouter();
  const locale = useLocale();

  function switchLocale(to: string) {
    document.cookie = `NEXT_LOCALE=${to}; path=/`;
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center font-mono text-sm uppercase text-gray-300 hover:text-[#FACC15]">
          <Globe className="h-4 w-4 mr-1" /> {locale}
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#1a1a1a] border border-[#333] text-sm font-mono text-gray-300">
        <DropdownMenuItem onClick={() => switchLocale("en")}>
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale("th")}>
          🇹🇭 Thai
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale("ja")}>
          🇯a Japanese
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
