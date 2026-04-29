import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Dabble swaps talent, skills, ideas, and knowledge between Dabblers — low-stakes in-person learning without a gig-marketplace feel. Dabble makes curiosity is portable.",
  alternates: { canonical: "/about" },
};

const values: { name: string; blurb: string }[] = [
  { name: "Curiosity", blurb: "Questions worth asking out loud." },
  { name: "Real connections", blurb: "No hustle, room to be a beginner and to take your time." },
  { name: "Care", blurb: "Safety, honesty, and respect for boundaries set the pace." },
  {
    name: "Swaps and Credits, not cash",
    blurb: "Small units of Dabbler time so you can teach, learn, and tip.",
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
            — a home block, a trailhead parking lot, or a new city for the weekend — the question
            stays the same: who nearby will trade a little honest curiosity?
          </p>
          <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            <span className="font-semibold text-[var(--text-primary)]">Mission.</span> Make
            low-stakes, in-person skill swaps —{" "}
            <span className="font-semibold text-[var(--text-primary)]">Dabblers first</span>, with
            room for{" "}
            <span className="font-semibold text-[var(--text-primary)]">traveling serendipity</span>{" "}
            when a moment lines up. Not a gig marketplace, not a course catalog — a fun path from
            &ldquo;I wonder how that works&rdquo; to &ldquo;we tried it together.&rdquo;
          </p>
        </header>

        <section aria-labelledby="portable-heading" className="space-y-4 border-t border-[var(--border)] pt-10">
          <h2 id="portable-heading" className="ui-heading text-2xl text-[var(--text-primary)] md:text-3xl">
            Curiosity is portable
          </h2>
          <div className="space-y-4 font-serif text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            <p>
              You pack questions the way you pack a jacket. The reflex to ask &ldquo;could someone
              show me?&rdquo; travels with you. Dabble balances{" "}
              <span className="font-semibold text-[var(--text-primary)]">roots and roam</span>:
              repeat faces on familiar sidewalks, and the odd perfect afternoon — kayakers rigging
              boats on a stream, a stoop conversation about drywall in New York City a fly-cast
              lesson on a borrowed riffle. Experiences that deepen your travel and deepen your sense
              of community, where ever you are.
            </p>
            <p>
              Dabble began on snow: a ski trip when I wanted to improve my turns, a fly rod I did
              not quite know how to use, the desire to experience a place in a more real way, and
              the kindness of someone who slowed down long enough to show me the cast. It was not a
              lesson package — just humans passing a skill hand to hand. There is a vast pool of
              skills and knowledge all around us all the time and people who love to share their
              passions, tap into it with Dabble!
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
            A small team that believes local trust and a mutual desire to share scales. We are
            listening to early Dabblers to craft this new space.
          </p>
        </section>
      </article>
    </div>
  );
}
