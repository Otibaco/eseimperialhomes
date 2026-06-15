import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { Outfit } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "ESE Imperial Homes",
  description: "Luxury Real Estate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${inter.variable}
        ${outfit.variable}
        ${playfair.variable}
        ${jetbrains.variable}
      `}
    >
      <body>{children}</body>
    </html>
  );
}