import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import Link from "next/link";
import { DevAxeReporter } from "@/app/components/DevAxeReporter";
import { SkipToMain } from "@/app/components/SkipToMain";
import { SiteHeader } from "@/app/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
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
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--text-primary)]">
        <SkipToMain />
        <div className="flex min-h-full flex-col">
          <SiteHeader />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <footer className="border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_60%,var(--background))]">
            <div className="ui-container flex flex-col gap-2 py-10 font-sans text-sm text-[var(--text-secondary)] md:flex-row md:items-center md:justify-between">
              <span>Dabble — local skills, shared kindly.</span>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Link href="/about" className="text-[var(--text-secondary)] underline-offset-4 hover:underline">
                  About
                </Link>
                <Link href="/how-it-works" className="text-[var(--text-secondary)] underline-offset-4 hover:underline">
                  How it works
                </Link>
                <Link href="/safety" className="text-[var(--text-secondary)] underline-offset-4 hover:underline">
                  Safety
                </Link>
                <Link href="/guidelines" className="text-[var(--text-secondary)] underline-offset-4 hover:underline">
                  Guidelines
                </Link>
              </div>
            </div>
          </footer>
        </div>
        {process.env.NODE_ENV === "development" ? <DevAxeReporter /> : null}
      </body>
    </html>
  );
}
