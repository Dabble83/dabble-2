import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page is not on the map — head home or explore neighbors on Dabble.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="ui-container py-24 text-center md:py-32">
      <p className="ui-label">404</p>
      <h1 className="ui-heading mt-3 text-4xl text-[var(--text-primary)] md:text-5xl">This trail dead-ends</h1>
      <p className="mx-auto mt-4 max-w-md font-serif text-lg text-[var(--text-secondary)]">
        The page you wanted is not here. Try the home map or Explore to find neighbors.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex rounded-lg border border-[var(--brand-border)] bg-[var(--brand)] px-6 py-3 font-sans text-sm font-semibold text-white hover:bg-[var(--brand-hover)]"
        >
          Home
        </Link>
        <Link
          href="/explore"
          className="inline-flex rounded-lg border border-[var(--border)] bg-white px-6 py-3 font-sans text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--brand-border)]"
        >
          Explore
        </Link>
      </div>
    </div>
  );
}
