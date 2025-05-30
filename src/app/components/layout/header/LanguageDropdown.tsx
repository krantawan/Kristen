"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";

export default function LanguageDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center font-mono text-sm text-gray-300 hover:text-[#FACC15]">
          <Globe className="h-4 w-4 mr-1" /> EN
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#1a1a1a] border border-[#333] text-sm font-mono text-gray-300">
        <DropdownMenuItem>🇺🇸 English</DropdownMenuItem>
        <DropdownMenuItem>🇹🇭 Thai</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
