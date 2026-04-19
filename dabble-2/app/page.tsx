import Link from "next/link";
import { HeroIllustration } from "@/app/components/HeroIllustration";

const primaryCta =
  "inline-flex items-center justify-center rounded-lg border border-[var(--brand-border)] bg-[var(--brand)] px-8 py-3 font-sans text-base font-semibold text-white transition-colors hover:bg-[var(--brand-hover)]";
const secondaryCta =
  "inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-6 py-3 font-sans text-base font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--brand-border)] hover:text-[var(--text-primary)]";

export default function Home() {
  return (
    <div className="py-16 md:py-24">
      <section className="ui-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <p className="ui-label">A gentle place to learn and share</p>
            <h1 className="ui-heading max-w-xl text-4xl leading-[1.08] text-[var(--text-primary)] md:text-5xl lg:text-[3.25rem]">
              Learn something new from the block next door
            </h1>
            <p className="max-w-lg font-serif text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
              Dabble connects neighbors who want to teach what they love with neighbors who are
              curious to try something new — bread, bikes, music, repair, and everything in between.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/dabble/signup" className={primaryCta}>
                Start your profile
              </Link>
              <Link href="/explore" className={secondaryCta}>
                Browse neighbors
              </Link>
            </div>
            <p className="max-w-md font-sans text-sm leading-relaxed text-[var(--text-tertiary)]">
              No hustle, no leaderboard — just clear profiles, calm layouts, and room to say what
              you offer and what you hope to learn.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[26rem] rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_24px_60px_-24px_rgba(42,61,44,0.12)]">
              <HeroIllustration />
              <p className="mt-6 text-center font-serif text-sm italic text-[var(--text-secondary)]">
                Illustration: homes, paths, and a small exchange — the shape of a block that looks
                out for one another.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="credits-strip-heading"
        className="mt-16 border-y border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_70%,var(--background))] md:mt-24"
      >
        <div className="ui-container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="max-w-2xl space-y-2">
            <p id="credits-strip-heading" className="ui-label">
              Credits, not cash
            </p>
            <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
              Neighbor time moves in small credits—about twenty minutes each—so you can teach, learn, and tip without
              turning the block into a marketplace.
            </p>
          </div>
          <Link
            href="/how-it-works"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[var(--brand-border)] bg-[var(--brand)] px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-hover)] md:px-8"
          >
            How credits work
          </Link>
        </div>
      </section>
    </div>
  );
}
