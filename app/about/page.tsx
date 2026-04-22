import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Neighbors first, room for traveling serendipity — low-stakes skill swaps without the gig marketplace frame. Curiosity is portable.",
  alternates: { canonical: "/about" },
};

const values: { name: string; blurb: string }[] = [
  { name: "Curiosity", blurb: "Questions worth asking out loud, at human pace." },
  { name: "Calm", blurb: "No hustle, no leaderboard — room to be a beginner." },
  { name: "Care", blurb: "Safety, honesty, and respect for boundaries come first." },
  {
    name: "Credit-not-cash",
    blurb: "Small units of neighbor time instead of pricing strangers like gigs.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-16 md:py-20">
      <article className="ui-container max-w-3xl space-y-12">
        <header className="space-y-5">
          <p className="ui-label">About Dabble</p>
          <h1 className="ui-heading text-3xl text-[var(--text-primary)] md:text-4xl lg:text-[2.75rem]">
            Wherever you are
          </h1>
          <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            — home block, trailhead parking lot, or a new city for the weekend — the question stays the same: who nearby
            will trade a little honest curiosity?
          </p>
          <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            <span className="font-semibold text-[var(--text-primary)]">Mission.</span> Make low-stakes, in-person skill
            swaps feel natural: <span className="font-semibold text-[var(--text-primary)]">neighbors first</span>, with
            room for <span className="font-semibold text-[var(--text-primary)]">traveling serendipity</span> when a
            moment lines up. Not a gig marketplace, not a course catalog — a calm path from &ldquo;I wonder how that
            works&rdquo; to &ldquo;we tried it together.&rdquo;
          </p>
        </header>

        <section aria-labelledby="portable-heading" className="space-y-4 border-t border-[var(--border)] pt-10">
          <h2 id="portable-heading" className="ui-heading text-2xl text-[var(--text-primary)] md:text-3xl">
            Curiosity is portable
          </h2>
          <div className="space-y-4 font-serif text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            <p>
              You pack questions the way you pack a jacket. The reflex to ask &ldquo;could someone show me?&rdquo;
              travels with you. Dabble balances <span className="font-semibold text-[var(--text-primary)]">roots and roam</span>
              : repeat faces on familiar sidewalks, and the odd perfect afternoon — kayakers rigging boats in Golden, a
              stoop conversation about drywall in the Bronx — without turning every hello into a transaction.
            </p>
            <p>
              Dabble began on snow: a ski trip with my wife, a fly rod I did not quite know how to use, and the
              kindness of someone who slowed down long enough to show me the cast. It was not a lesson package — just
              humans passing a skill hand to hand.
            </p>
          </div>
        </section>

        <section aria-labelledby="values-heading" className="space-y-4">
          <h2 id="values-heading" className="ui-heading text-2xl text-[var(--text-primary)] md:text-3xl">
            What we steer by
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <li
                key={v.name}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 font-sans text-sm leading-relaxed text-[var(--text-secondary)]"
              >
                <span className="font-semibold text-[var(--text-primary)]">{v.name}.</span> {v.blurb}
              </li>
            ))}
          </ul>
          <p className="font-sans text-sm text-[var(--text-tertiary)]">
            How credits move in practice:{" "}
            <Link href="/how-it-works" className="text-[var(--brand-text)] underline-offset-4 hover:underline">
              How Dabble works
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="team-heading" className="border-t border-[var(--border)] pt-10">
          <h2 id="team-heading" className="ui-heading mb-3 text-2xl text-[var(--text-primary)] md:text-3xl">
            Who is building this
          </h2>
          <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            A small team who believes local trust scales better than growth hacks. We are shipping carefully, listening
            to early dabblers, and keeping the product as human as the meetups it is meant to support.
          </p>
        </section>
      </article>
    </div>
  );
}
