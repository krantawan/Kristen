import type { Metadata } from "next";
import { Roboto, Prompt } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400","700"],
  variable: "--font-roboto",
})

const prompt = Prompt({
  subsets: ["latin"],
  weight:   ["400","700"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "Arknights Recruitment",
  description: "Tag-based Operator Matching",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${prompt.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
