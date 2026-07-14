import type { Metadata } from "next";
import { DM_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const serif = Newsreader({ variable: "--font-serif", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drishti — Jyotish, made visible",
  description: "Learn Vedic astrology through an interactive birth chart, a small generative grammar, guided aspects, and moving transits.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${serif.variable}`}>{children}</body></html>;
}
