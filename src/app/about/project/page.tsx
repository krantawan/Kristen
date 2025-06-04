"use client";

import Header from "@/app/components/layout/header/Header";
import Footer from "@/app/components/layout/Footer";
import PRTSSystemHeader from "@/components/ui/PRTSSystemHeader";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";

export default function AboutProjectPage() {
  const t = useTranslations("components.about.project");
  const locale = useLocale();

  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const full = 'echo "All systems operational."';
    let i = 0;
    const interval = setInterval(() => {
      setPrompt(full.slice(0, i + 1));
      i++;
      if (i === full.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />

      <div
        className={`min-h-screen text-sm transition-colors duration-300 ${
          locale === "th" ? "" : "font-mono"
        } bg-neutral-100 text-black dark:bg-[#1a1a1a] dark:text-white`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Top color bars */}
          <div className="flex h-2 w-full">
            <div className="bg-[#5C7F71] w-[60%]" />
            <div className="bg-[#d4a940] w-[30%]" />
            <div className="bg-[#802520] w-[10%]" />
          </div>

          <PRTSSystemHeader
            version="v2.3"
            user="KALAFIA"
            status="ONLINE"
            title={">> " + t("header_title")}
            description={t("header_description")}
          />

          <div className="space-y-6 bg-neutral-100 dark:bg-[#161616] p-4 rounded-b-md">
            {/* Developer Section */}
            <div>
              <p className="text-emerald-600 dark:text-green-400">~$ whoami</p>
              <div className="flex items-center gap-4 mt-2">
                <Image
                  src="/dev/specter_icon_kalafia.png"
                  alt="Kristen"
                  width={64}
                  height={64}
                  draggable={false}
                  className="rounded-full border border-yellow-500"
                />
                <div>
                  <p className="text-black dark:text-white">KALAFIA</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Lead Developer
                  </p>
                </div>
              </div>
            </div>

            <Separator className="border-t border-dashed border-zinc-500 my-4" />

            {/* Special Thanks */}
            <div>
              <p className="text-emerald-600 dark:text-green-400">
                ~$ cat thanks.txt
              </p>
              <ul className="pl-4 mt-2 text-gray-700 dark:text-gray-300 list-disc space-y-1">
                <li>
                  <span className="text-black dark:text-white">Lonetail</span> —
                  for design inspiration from Arknights
                </li>
              </ul>
            </div>

            <Separator className="border-t border-dashed border-zinc-500 my-4" />

            {/* Prompt */}
            <div className="text-emerald-600 dark:text-green-400">
              ~$ {prompt}
              <span className="ml-1 animate-blink">▊</span>
              <p className="text-gray-600 dark:text-gray-400 mt-1">✔ OK</p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
