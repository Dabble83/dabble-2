import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Credits, not cash: what a Dabble credit is, how you earn and spend it, and how the swap empowers, lowers costs, and deepens experiences.",
  alternates: { canonical: "/how-it-works" },
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
      Teach a one-hour fly-casting lesson → earn 3 credits → spend them on a drywall-patching demo
      or a sourdough class.
    </p>
  );
}

const spendRows: { shape: string; credits: string }[] = [
  { shape: "Tip (small favor, a few minutes)", credits: "1" },
  { shape: "Short session (hands-on demo length)", credits: "3" },
  { shape: "Walk-with (longer session in your area)", credits: "6" },
];

export default function HowItWorksPage() {
  return (
    <div className="ui-container py-16 md:py-20">
      <header className="flex flex-col gap-6 pb-6 sm:flex-row sm:items-start">
        <div className="max-w-3xl flex-1 space-y-4">
          <p className="ui-label">Credits</p>
          <h1 className="ui-heading text-3xl text-[var(--text-primary)] md:text-4xl">How Dabble works</h1>
          <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            A short trail map for first-time Dabblers. What a credit is, how it moves, and how the
            swap deepens what you already know.
          </p>
        </div>
        <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-2xl sm:h-44 sm:w-44" aria-hidden>
          <Image
            src="/images/meet.png"
            alt="Two people meeting to share a skill"
            fill
            className="object-cover"
          />
        </div>
      </header>

      <div className="space-y-0">
        <Section id="what" title="What a credit is">
          <p>
            One credit is a small unit of Dabbler time — roughly <strong>twenty minutes</strong> of
            focused, in-person help. It is <strong>not</strong> a dollar and <strong>not</strong> a
            contract. Sessions are priced in whole credits so expectations stay clear.
          </p>
        </Section>

        <Section id="earn" title="How to earn">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">Teach a session</strong>{" "}
              that both Dabblers mark complete; learner confirmation and (when complete) simple
              ratings keep the ledger honest.
            </li>
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">Get rated</strong> after
              sessions (when ratings are given); good-faith feedback keeps the loop trustworthy.
            </li>
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">A swap loop:</strong>{" "}
              the talent and skills you share become credits someone else spends, so curiosity
              circulates.
            </li>
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">
                Free allocation during pilot:
              </strong>{" "}
              during the introductory phase of Dabble, eligible Dabblers receive starter credits so
              newcomers can try a session before their first teach (see below).
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

        <Section id="why" title="Why credits, not money">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">Legal simplicity:</strong>{" "}
              fewer gray zones than charging strangers for ad-hoc services through profiles.
            </li>
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">Community first:</strong>{" "}
              an exchange of talent, skills, ideas, and knowledge and a way to deepen the experience
              of a place.
            </li>
            <li>
              <strong className="font-semibold text-[var(--text-primary)]">Access:</strong> Dabblers
              who could not hire a private tutor can still take part in the swap, lowering costs
              while deepening experiences.
            </li>
          </ul>
        </Section>

        <Section id="seed" title="Free introductory phase">
          <p>
            While the community is <strong>under 1,000 Dabblers</strong>, every{" "}
            <strong>new member</strong> receives <strong>six starter credits</strong> so you can
            book a short session before you teach your first skill. The cap keeps the swap generous
            while we&rsquo;re getting started.
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
