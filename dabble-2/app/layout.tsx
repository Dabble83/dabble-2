import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dabble 2.0",
  description: "Warm local skill exchange — editorial community platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--text-primary)]">
        <div className="flex min-h-full flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_60%,var(--background))]">
            <div className="ui-container flex flex-col gap-2 py-10 font-sans text-sm text-[var(--text-tertiary)] md:flex-row md:items-center md:justify-between">
              <span>Dabble — neighbors learning together.</span>
              <Link href="/about" className="text-[var(--text-secondary)] underline-offset-4 hover:underline">
                About this prototype
              </Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
