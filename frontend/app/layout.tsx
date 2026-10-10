import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IntegraX - Legal & Business Document Intelligence",
  description: "Next-generation contract intelligence platform with deterministic evidence grounding and clause-level analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
