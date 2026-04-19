import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Wherever you are: neighbors first, traveling serendipity welcome — curiosity is portable, and Dabble keeps the exchange calm.",
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
        <header className="space-y-4">
          <p className="ui-label">About Dabble</p>
          <h1 className="ui-heading text-3xl text-[var(--text-primary)] md:text-4xl lg:text-[2.75rem]">
            Try something new, wherever you are
          </h1>
          <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            Most days that means the neighbor who already lives on your block. Some days it means the person at the
            put-in, the bench outside the hardware store, or the trail you only visit once —{" "}
            <strong className="font-semibold text-[var(--text-primary)]">curiosity is portable</strong>, and the best
            swaps still happen shoulder to shoulder.
          </p>
        </header>

        <div className="space-y-6 font-serif text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
          <p>
            Dabble began on snow: a ski trip with my wife, a fly rod I did not quite know how to use, and the
            kindness of someone who slowed down long enough to show me the cast. It was not a lesson package — just
            humans passing a skill hand to hand.
          </p>
          <p>
            Another seed landed in Golden, Colorado: two kayakers threading straps and buckles while a few of us
            watched from the bank. No agenda, no invoice — only the small miracle of strangers opting into the same
            afternoon and leaving a little braver about the water.
          </p>
          <p>
            The third picture is closer to the pavement: Bronx neighbors who treat DIY like a team sport — borrow a
            tool, hold a flashlight, argue gently about which screw actually belonged there. That mix of practicality
            and wit is the neighborhood Dabble wants to make easier everywhere, without flattening it into a market.
          </p>
        </div>

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
