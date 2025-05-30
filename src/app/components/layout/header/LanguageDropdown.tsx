"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export default function LanguageDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  function switchLocale(to: string) {
    const localePattern = new RegExp(`^/(${routing.locales.join("|")})`);
    const pathWithoutLocale = pathname.replace(localePattern, "");
    router.replace(`/${to}${pathWithoutLocale || "/"}`);
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
