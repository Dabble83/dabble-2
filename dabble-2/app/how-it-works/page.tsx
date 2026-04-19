import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "How Dabble works",
  description:
    "Credits, not cash: what a credit is, how you earn and spend them, and why we use this model during the free seed phase.",
};

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="border-t border-[var(--rule)] pt-12 first:border-t-0 first:pt-0">
      <h2 className="ui-heading mb-4 text-2xl text-[var(--text-primary)] md:text-3xl">{title}</h2>
      <div className="max-w-3xl space-y-4 font-sans text-base leading-relaxed text-[var(--text-secondary)]">
        {children}
      </div>
    </section>
  );
}

/** Inline explainer — copy from Master Plan §10.6. */
export function CreditMath() {
  return (
    <p className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 font-sans text-base leading-relaxed text-[var(--text-primary)] shadow-[0_8px_30px_-18px_rgba(42,61,44,0.12)]">
      Teach a 1-hour fly-casting lesson → earn 3 credits → spend them on a drywall-patching lesson or a sourdough
      class.
    </p>
  );
}

const spendRows: { shape: string; credits: string }[] = [
  { shape: "Tip (small favor, a few minutes)", credits: "1" },
  { shape: "Short session (hands-on demo length)", credits: "3" },
  { shape: "Walk-with (longer neighborhood session)", credits: "6" },
];

export default function HowItWorksPage() {
  return (
    <div className="ui-container py-16 md:py-20">
      <header className="max-w-3xl space-y-4 pb-6">
        <p className="ui-label">Credits</p>
        <h1 className="ui-heading text-3xl text-[var(--text-primary)] md:text-4xl">How Dabble works</h1>
        <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
          A quick trail map for first-time visitors—what a credit is, how it moves, and why we keep money off the path.
        </p>
      </header>

      <div className="space-y-0">
        <Section id="what" title="What a credit is">
          <p>
            One credit is a small unit of neighbor time—roughly <strong>twenty minutes</strong> of focused, in-person
            help. It is <strong>not</strong> a dollar and <strong>not</strong> a contract. Sessions are priced in whole
            credits so expectations stay legible.
          </p>
        </Section>

        <Section id="earn" title="How to earn">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">Teach a session</strong> that both parties
              mark complete; learner confirmation and (when shipped) simple ratings help the ledger stay honest.
            </li>
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">Get rated</strong> after sessions (when
              ratings ship); good-faith feedback keeps the loop trustworthy.
            </li>
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">Time-banked loop:</strong> the skills you
              teach become credits someone else spends, so curiosity circulates instead of cash.
            </li>
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">Free-seed allocation:</strong> during the
              seed phase, eligible accounts receive starter credits so newcomers can try Dabble before their first
              teach (see below).
            </li>
          </ul>
        </Section>

        <Section id="spend" title="How to spend">
          <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full min-w-[280px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--cream)_55%,var(--surface))]">
                  <th className="px-4 py-3 font-semibold text-[var(--text-primary)]">Shape</th>
                  <th className="px-4 py-3 font-semibold text-[var(--text-primary)]">Credits</th>
                </tr>
              </thead>
              <tbody>
                {spendRows.map((row) => (
                  <tr key={row.shape} className="border-b border-[var(--rule)] last:border-b-0">
                    <td className="px-4 py-3">{row.shape}</td>
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{row.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="why" title="Why credits instead of money">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">Legal simplicity:</strong> fewer gray zones
              than charging strangers for ad-hoc services through profiles.
            </li>
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">Community culture:</strong> swaps curiosity
              for transaction optics.
            </li>
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">Access:</strong> people who could not hire a
              private tutor for an hour can still join a neighborly exchange.
            </li>
          </ul>
        </Section>

        <Section id="seed" title="Free seed phase">
          <p>
            While we are <strong>under 10,000 members</strong>, every <strong>new member</strong> receives{" "}
            <strong>three starter credits</strong> so you can book a short session before you teach your first skill.
            The cap keeps the loop generous during early growth.
          </p>
        </Section>

        <section className="border-t border-[var(--rule)] pt-12">
          <h2 className="ui-heading mb-4 text-2xl text-[var(--text-primary)] md:text-3xl">See the math once</h2>
          <CreditMath />
        </section>
      </div>
    </div>
  );
}
