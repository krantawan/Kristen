import { HomeIcon, BookOpenIcon, SproutIcon } from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-5">
        <div className="mx-auto max-w-4xl w-full flex h-12 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">Kristen</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-base font-medium flex items-center text-[#222]">
              <HomeIcon className="h-4 w-4 mr-1" />
              Home
            </Link>
            <Link href="/overview" className="text-base font-medium text-muted-foreground flex items-center">
              <BookOpenIcon className="h-4 w-4 mr-1" />
              How to Use
            </Link>
            <Link href="/about" className="text-base font-medium text-muted-foreground flex items-center">
              <SproutIcon className="h-4 w-4 mr-1" />
              About
            </Link>
          </nav>
        </div>
      </header>
  );
}