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
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

function localizedPath(locale: string, path: string) {
  const cleaned = path.startsWith(`/${locale}`)
    ? path.slice(locale.length + 1)
    : path;
  return path === "/" ? `/${locale}` : `/${locale}${cleaned}`;
}

export default function HeaderNavMenu() {
  const locale = useLocale();
  const t = useTranslations("header.menu");

  const fontClass = locale === "th" ? "font-thai" : "font-mono";

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center gap-1">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href={localizedPath(locale, "/")}
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
          <NavigationMenuTrigger className={fontClass}>
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
                    href={localizedPath(locale, "/")}
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
                    href={localizedPath(locale, "/events")}
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

        <NavigationMenuItem>
          <NavigationMenuTrigger className={fontClass}>
            <SproutIcon className="h-4 w-4 mr-1" /> {t("about")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[300px] border border-[#333] rounded-md">
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
                <NavigationMenuLink asChild key={item.href}>
                  <Link
                    href={localizedPath(locale, item.href)}
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 text-gray-300 hover:text-[#FACC15]",
                      fontClass
                    )}
                  >
                    <div
                      className={cn(
                        "text-sm font-medium leading-none",
                        fontClass
                      )}
                    >
                      {item.title}
                    </div>
                    <p
                      className={cn(
                        "line-clamp-2 text-sm leading-snug text-gray-400",
                        fontClass
                      )}
                    >
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
