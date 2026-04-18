import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import Link from "next/link";
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