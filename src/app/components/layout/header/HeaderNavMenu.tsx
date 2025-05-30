// components/ui/HeaderNavMenu.tsx

"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { HomeIcon, BookOpenIcon, SproutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActivePath } from "@/components/ui/useActivePath";

export default function HeaderNavMenu() {
  const isActive = useActivePath("/");
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center gap-1">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/"
              className={cn(
                "inline-flex h-10 items-center justify-center px-4 py-2 text-sm font-mono font-medium transition-colors",
                isActive
                  ? "!text-[#FACC15]"
                  : "text-gray-300 hover:text-[#FACC15]"
              )}
            >
              <HomeIcon className="h-4 w-4 mr-1 text-inherit" /> Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <BookOpenIcon className="h-4 w-4 mr-1" /> Tools
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] p-2">
              <div className="row-span-3">
                <div className="flex h-full w-full select-none flex-col justify-end bg-[#2a2a2a] p-2 border border-[#444] text-left hover:bg-[#333] transition-colors">
                  <div className="mb-2 text-lg font-mono text-[#FACC15] tracking-widest">
                    PRTS.LOG()
                  </div>
                  <p className="text-sm leading-tight text-gray-400 font-mono">
                    &gt; Accessing system modules... <br />
                    <br />
                    &gt; Tools available for operator scan, event scheduling,
                    and mission logging.
                  </p>
                </div>
              </div>
              <div className="grid gap-1">
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 font-mono text-gray-300 hover:text-[#FACC15]",
                      useActivePath("/") ? "!text-[#FACC15]" : ""
                    )}
                  >
                    <div className="text-sm font-medium leading-none">
                      Recruitment Assistant
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                      Recruitment Assistant for Arknights
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/events"
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 font-mono text-gray-300 hover:text-[#FACC15]",
                      useActivePath("/events") ? "!text-[#FACC15]" : ""
                    )}
                  >
                    <div className="text-sm font-medium leading-none">
                      Events
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                      Event timeline for Arknights
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <SproutIcon className="h-4 w-4 mr-1" /> About
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[300px] border border-[#333] rounded-md">
              {[
                {
                  href: "/about/project",
                  title: "About This Project",
                  desc: "An Arknights-inspired recruitment and event tracking tool.",
                },
                {
                  href: "/about/devlog",
                  title: "Developer Log",
                  desc: "Insights and motivations behind each feature.",
                },
              ].map((item) => (
                <NavigationMenuLink asChild key={item.href}>
                  <Link
                    href={item.href}
                    className="block select-none space-y-1 rounded-md p-3 font-mono text-gray-300 hover:text-[#FACC15]"
                  >
                    <div className="text-sm font-medium leading-none">
                      {item.title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                      {item.desc}
                    </p>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
