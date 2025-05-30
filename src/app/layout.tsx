import type { ReactNode } from "react";
import { Roboto, Prompt } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-prompt",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${prompt.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
