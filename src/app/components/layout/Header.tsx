"use client";

import { useState } from "react";
import Link from "next/link";
import { HomeIcon, BookOpenIcon, SproutIcon, Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-10 mb-2 bg-white">
      <div className="mx-auto max-w-6xl w-full flex h-10 items-center px-2 sm:px-0">
        <div className="text-2xl font-bold text-[#222]">Kristen</div>

        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className="text-sm font-medium flex items-center text-[#222] hover:text-[#BEC93B] px-3 py-2 rounded-md transition-colors duration-200"
                  >
                    <HomeIcon className="h-4 w-4 mr-1" /> Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium flex items-center text-muted-foreground hover:text-[#BEC93B] data-[state=open]:text-[#BEC93B] bg-transparent hover:bg-transparent data-[state=open]:bg-transparent px-3 py-2 h-auto">
                  <BookOpenIcon className="h-4 w-4 mr-1" /> Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end bg-gradient-to-b from-background/50 to-background/80 backdrop-blur p-6 no-underline outline-none focus:shadow-md border"
                          href="/overview"
                        >
                          <BookOpenIcon className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Getting Started
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Learn how to use our platform with step-by-step
                            guides and tutorials.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    <div className="grid gap-1">
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#fff] hover:text-black focus:bg-[#05c70f] focus:text-black"
                          href="/"
                        >
                          <div className="text-sm font-medium leading-none">
                            Recruitment Assistant
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Recruitment Assistant for Arknight
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#fff] hover:text-black focus:bg-[#fff] focus:text-black"
                          href="/events"
                        >
                          <div className="text-sm font-medium leading-none">
                            Events
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Event for Arknight
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium flex items-center text-muted-foreground hover:text-[#BEC93B] data-[state=open]:text-[#BEC93B] bg-transparent hover:bg-transparent data-[state=open]:bg-transparent px-3 py-2 h-auto">
                  <SproutIcon className="h-4 w-4 mr-1" /> About
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-md shadow-lg">
                    {[
                      {
                        href: "/about/company",
                        title: "Our Company",
                        desc: "Learn about our mission and values",
                      },
                      {
                        href: "/about/team",
                        title: "Our Team",
                        desc: "Meet the people behind the product",
                      },
                      {
                        href: "/contact",
                        title: "Contact Us",
                        desc: "Get in touch with our team",
                      },
                    ].map((item) => (
                      <NavigationMenuLink asChild key={item.href}>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href={item.href}
                        >
                          <div className="text-sm font-medium leading-none">
                            {item.title}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
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
        </div>

        <div className="hidden md:block w-[72px]"></div>

        <button
          onClick={toggleMobileMenu}
          className="md:hidden ml-auto p-2 text-[#222] hover:text-[#BEC93B] transition-colors duration-200"
          aria-label="Toggle mobile menu"
        >
          <div className="transition-transform duration-200">
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </div>
        </button>
      </div>

      <div
        className={`md:hidden border-t bg-background/95 backdrop-blur transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-4 py-4 space-y-3">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center text-sm font-medium text-[#222] hover:text-[#BEC93B] py-2 transition-colors duration-200"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Home
          </Link>

          <div className="space-y-2">
            <div className="flex items-center text-sm font-medium text-muted-foreground py-2">
              <BookOpenIcon className="h-4 w-4 mr-2" />
              How to Use
            </div>
            <div className="ml-6 space-y-1">
              {["overview", "tutorials", "documentation", "faq"].map((slug) => (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  onClick={closeMobileMenu}
                  className="block text-sm text-muted-foreground hover:text-[#BEC93B] py-1 transition-colors duration-200"
                >
                  {slug.charAt(0).toUpperCase() +
                    slug.slice(1).replace("-", " ")}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm font-medium text-muted-foreground py-2">
              <SproutIcon className="h-4 w-4 mr-2" />
              About
            </div>
            <div className="ml-6 space-y-1">
              {["/about/company", "/about/team", "/contact"].map((href) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobileMenu}
                  className="block text-sm text-muted-foreground hover:text-[#BEC93B] py-1 transition-colors duration-200"
                >
                  {href
                    .replace("/about/", "")
                    .replace("/", "")
                    .replace("contact", "Contact Us")
                    .replace("company", "Our Company")
                    .replace("team", "Our Team")}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
