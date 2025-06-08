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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HomeIcon, BookOpenIcon, SproutIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActivePath } from "@/components/ui/useActivePath";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function HeaderNavMenu() {
  const locale = useLocale();
  const t = useTranslations("header.menu");

  const fontClass = locale === "en" ? "font-mono" : "";

  const pathname = usePathname();
  const isToolsActive = pathname === "/" || pathname.startsWith("/events");
  const isAboutActive = pathname.startsWith("/about");

  return (
    <div className="flex items-center">
      <NavigationMenu delayDuration={250}>
        <NavigationMenuList className="flex items-center gap-1">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href={"/"}
                className={cn(
                  "inline-flex h-10 items-center justify-center px-4 py-2 text-sm font-medium transition-colors",
                  fontClass,
                  useActivePath("/")
                    ? "!text-[#FACC15]"
                    : "text-gray-300 hover:text-[#FACC15]"
                )}
              >
                <HomeIcon className="h-4 w-4 mr-1 text-inherit" /> {t("home")}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href={"/operators"}
                className={cn(
                  "inline-flex h-10 items-center justify-center px-4 py-2 text-sm font-medium transition-colors",
                  fontClass,
                  useActivePath("/operators")
                    ? "!text-[#FACC15]"
                    : "text-gray-300 hover:text-[#FACC15]"
                )}
              >
                <UserIcon className="h-4 w-4 mr-1 text-inherit" />{" "}
                {t("operators")}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(
                fontClass,
                "inline-flex h-10 items-center justify-center px-4 py-2 text-sm font-medium transition-colors text-gray-300 hover:text-[#FACC15]",
                isToolsActive ? "!text-[#FACC15]" : ""
              )}
            >
              <BookOpenIcon className="h-4 w-4 mr-1" /> {t("tools")}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] p-2">
                <div className="row-span-3">
                  <div className="flex h-full w-full select-none flex-col justify-end bg-[#2a2a2a] p-2 border border-[#444] text-left hover:bg-[#333] transition-colors">
                    <div
                      className={cn(
                        "mb-2 text-lg text-[#FACC15] tracking-widest font-mono"
                      )}
                    >
                      PRTS.LOG()
                    </div>
                    <p
                      className={cn(
                        "text-sm leading-tight text-gray-400 font-mono"
                      )}
                    >
                      &gt; {t("tools_desc")}
                      <br />
                      <br />
                      &gt; {t("tools_desc2")}
                    </p>
                  </div>
                </div>
                <div className="grid gap-1">
                  <NavigationMenuLink asChild>
                    <Link
                      href={"/"}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 text-gray-300 hover:text-[#FACC15]",
                        fontClass,
                        useActivePath("/") ? "!text-[#FACC15]" : ""
                      )}
                    >
                      <div
                        className={cn(
                          "text-sm font-medium leading-none",
                          fontClass
                        )}
                      >
                        {t("recruitment")}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                        {t("recruitment_desc")}
                      </p>
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Link
                      href={"/events"}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 text-gray-300 hover:text-[#FACC15]",
                        fontClass,
                        useActivePath("/events") ? "!text-[#FACC15]" : ""
                      )}
                    >
                      <div
                        className={cn(
                          "text-sm font-medium leading-none",
                          fontClass
                        )}
                      >
                        {t("events")}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                        {t("events_desc")}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* About dropdown using DropdownMenu instead */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "inline-flex h-10 items-center justify-center px-4 py-2 text-sm font-medium transition-colors text-gray-300 hover:text-[#FACC15]",
            fontClass,
            isAboutActive ? "!text-[#FACC15]" : ""
          )}
        >
          <SproutIcon className="h-4 w-4 mr-1" /> {t("about")}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-[#1a1a1a] border border-[#333] rounded-md w-[300px]"
        >
          {[
            {
              href: "/about/project",
              title: t("about_project"),
              desc: t("about_project_desc"),
            },
            {
              href: "/about/devlog",
              title: t("devlog"),
              desc: t("devlog_desc"),
            },
          ].map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className={cn(
                  "block select-none space-y-1 rounded-md p-3 text-gray-300 hover:text-[#FACC15] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] focus:text-[#FACC15]",
                  fontClass,
                  pathname === item.href ? "!text-[#FACC15]" : ""
                )}
              >
                <div className="flex flex-col p-2">
                  <div
                    className={cn(
                      "text-sm font-medium leading-none w-full",
                      fontClass
                    )}
                  >
                    {item.title}
                  </div>
                  <div>
                    <p
                      className={cn(
                        "line-clamp-2 text-sm leading-snug text-gray-400",
                        fontClass
                      )}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
