import { NextIntlClientProvider, useMessages, useLocale } from "next-intl";
import { ReactNode } from "react";
import { Prompt, Noto_Sans_JP } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

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
      : "";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${fontClass} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
