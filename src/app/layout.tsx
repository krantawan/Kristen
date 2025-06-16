import { NextIntlClientProvider, useMessages, useLocale } from "next-intl";
import { ReactNode } from "react";
import { Prompt, Noto_Sans_JP, Cantata_One } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import BackgroundRotator from "./components/layout/BackgroundRotator";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["400", "500"],
  variable: "--font-prompt",
});

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "700"],
  variable: "--font-jp",
  preload: false,
});

const cantataOne = Cantata_One({
  weight: ["400"],
  variable: "--font-cantata-one",
  preload: false,
});

export const metadata = {
  title: "Kristen Lab - Arknights Toolkit",
  description:
    "Kristen Lab - a terminal-inspired toolkit for Arknights analysis and operations.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const messages = useMessages();
  const locale = useLocale();
  const fontClass =
    locale === "th"
      ? prompt.variable
      : locale === "ja"
      ? notoSansJP.variable
      : cantataOne.variable;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${fontClass} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <BackgroundRotator />
            {children}
            <Analytics />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
