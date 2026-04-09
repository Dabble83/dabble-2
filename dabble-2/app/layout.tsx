import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { AuthNav } from "@/app/components/AuthNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dabble 2.0",
  description: "Try something new, wherever you are — prototype shell",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--text-primary)]">
        <div className="flex min-h-full flex-col">
          <header className="border-b border-[var(--border)]">
            <div className="ui-container flex items-center justify-between py-6">
              <Link href="/" className="ui-heading text-3xl text-[var(--brand-text)]">
                Dabble
              </Link>
              <nav className="flex items-center gap-6 font-sans text-sm font-medium text-[var(--text-secondary)]">
                <Link href="/explore" className="hover:text-[var(--text-primary)]">
                  Explore
                </Link>
                <Link href="/about" className="hover:text-[var(--text-primary)]">
                  About
                </Link>
                <AuthNav />
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[var(--border)]">
            <div className="ui-container py-6 font-sans text-sm text-[var(--text-tertiary)]">
              Dabble 2.0 prototype - calm local skill exchange.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
