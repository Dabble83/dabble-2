"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthNav } from "@/app/components/AuthNav";
import { CreditBalanceBadge } from "@/app/components/CreditBalanceBadge";
const navLinkClass =
  "font-sans text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]";

const ctaClass =
  "inline-flex items-center justify-center rounded-lg border border-[var(--brand-border)] bg-[var(--brand)] px-6 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-hover)]";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)]/90 bg-[color-mix(in_srgb,var(--background)_92%,transparent)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--background)_85%,transparent)]">
      <div className="ui-container flex items-center justify-between gap-4 py-4 md:py-5">
        <Link
          href="/"
          className="font-serif text-2xl font-medium tracking-tight text-[var(--brand-text)] md:text-3xl"
          onClick={() => setMenuOpen(false)}
        >
          Dabble
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          <Link href="/explore" className={navLinkClass}>
            Explore
          </Link>
          <Link href="/about" className={navLinkClass}>
            About
          </Link>
          <Link href="/how-it-works" className={navLinkClass}>
            How it works
          </Link>
          <Link href="/safety" className={navLinkClass}>
            Safety
          </Link>
          <Link href="/guidelines" className={navLinkClass}>
            Guidelines
          </Link>
          <CreditBalanceBadge />
          <AuthNav />
          <Link href="/dabble/signup" className={`${ctaClass} shrink-0`}>
            Join
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <CreditBalanceBadge />
          <Link
            href="/dabble/signup"
            className={`${ctaClass} px-4 py-2 text-xs`}
            onClick={() => setMenuOpen(false)}
          >
            Join
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-white/80 font-sans text-sm text-[var(--text-primary)]"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-[var(--border)] bg-[var(--background)] px-6 py-5 md:hidden"
        >
          <div className="flex flex-col gap-4 font-sans text-base font-medium text-[var(--text-secondary)]">
            <Link href="/explore" className="py-1" onClick={() => setMenuOpen(false)}>
              Explore
            </Link>
            <Link href="/about" className="py-1" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/how-it-works" className="py-1" onClick={() => setMenuOpen(false)}>
              How it works
            </Link>
            <Link href="/safety" className="py-1" onClick={() => setMenuOpen(false)}>
              Safety
            </Link>
            <Link href="/guidelines" className="py-1" onClick={() => setMenuOpen(false)}>
              Guidelines
            </Link>
            <div className="border-t border-[var(--border)] pt-4" onClick={() => setMenuOpen(false)}>
              <AuthNav layout="stack" />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
