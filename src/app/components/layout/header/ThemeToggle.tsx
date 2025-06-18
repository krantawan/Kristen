"use client";

import Image from "next/image";
import Link from "next/link";

export default function ThemeToggle() {
  return (
    <Link href="https://ko-fi.com/kranchww_" target="_blank">
      <Image
        src="/web-ui/kofi_symbol.png"
        alt="Ko-fi"
        width={32}
        height={32}
        className="p-1 hover:scale-130 transition-all duration-300"
      />
    </Link>
  );
}
