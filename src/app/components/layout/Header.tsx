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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 mb-2 bg-white">
      <div className="mx-auto max-w-6xl w-full flex h-10 items-center px-2 sm:px-0">
        {/* Brand / Logo */}
        <div className="text-2xl font-bold text-[#222]">Kristen</div>

        {/* Desktop Navigation Menu - Hidden on mobile */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-1">
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink className="text-sm font-medium flex items-center text-[#222] hover:text-[#BEC93B] px-3 py-2 rounded-md transition-colors duration-200">
                    <HomeIcon className="h-4 w-4 mr-1" /> Home
                  </NavigationMenuLink>
                </Link>
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
                          href="/tutorials"
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
                          href="/event"
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
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/about/company"
                      >
                        <div className="text-sm font-medium leading-none">
                          Our Company
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Learn about our mission and values
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/about/team"
                      >
                        <div className="text-sm font-medium leading-none">
                          Our Team
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Meet the people behind the product
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/contact"
                      >
                        <div className="text-sm font-medium leading-none">
                          Contact Us
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Get in touch with our team
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Empty space for balance on desktop */}
        <div className="hidden md:block w-[72px]"></div>

        {/* Mobile Menu Button - Only visible on mobile */}
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

      {/* Mobile Menu Overlay - Only visible when open with slide animation */}
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

          {/* How to Use Section */}
          <div className="space-y-2">
            <div className="flex items-center text-sm font-medium text-muted-foreground py-2">
              <BookOpenIcon className="h-4 w-4 mr-2" />
              How to Use
            </div>
            <div className="ml-6 space-y-1">
              <Link
                href="/overview"
                onClick={closeMobileMenu}
                className="block text-sm text-muted-foreground hover:text-[#BEC93B] py-1 transition-colors duration-200"
              >
                Getting Started
              </Link>
              <Link
                href="/tutorials"
                onClick={closeMobileMenu}
                className="block text-sm text-muted-foreground hover:text-[#BEC93B] py-1 transition-colors duration-200"
              >
                Tutorials
              </Link>
              <Link
                href="/documentation"
                onClick={closeMobileMenu}
                className="block text-sm text-muted-foreground hover:text-[#BEC93B] py-1 transition-colors duration-200"
              >
                Documentation
              </Link>
              <Link
                href="/faq"
                onClick={closeMobileMenu}
                className="block text-sm text-muted-foreground hover:text-[#BEC93B] py-1 transition-colors duration-200"
              >
                FAQ
              </Link>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <div className="flex items-center text-sm font-medium text-muted-foreground py-2">
              <SproutIcon className="h-4 w-4 mr-2" />
              About
            </div>
            <div className="ml-6 space-y-1">
              <Link
                href="/about/company"
                onClick={closeMobileMenu}
                className="block text-sm text-muted-foreground hover:text-[#BEC93B] py-1 transition-colors duration-200"
              >
                Our Company
              </Link>
              <Link
                href="/about/team"
                onClick={closeMobileMenu}
                className="block text-sm text-muted-foreground hover:text-[#BEC93B] py-1 transition-colors duration-200"
              >
                Our Team
              </Link>
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="block text-sm text-muted-foreground hover:text-[#BEC93B] py-1 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
