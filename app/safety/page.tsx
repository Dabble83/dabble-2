import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/app/components/ui";

export const metadata: Metadata = {
  title: "Safety",
  description:
    "Four-tier safety model for Dabble meetups — from passing curiosity to longer sessions — plus guardrails, credits (not cash), and how we think about risk at human pace.",
  alternates: { canonical: "/safety" },
};

const intro =
  "Dabble routes exchange through credits and time-boxed curiosity, not cash for services. That reduces transactional liability and keeps meetups in a skilled-amateur frame: neighbors sharing know-how, not hired professionals or gig marketplaces.";

const tiers: { id: string; title: string; lead: string; examples: string[] }[] = [
  {
    id: "tier-1",
    title: "Tier 1 — Curiosity in passing",
    lead: "Short, informal moments without scheduling pressure.",
    examples: [
      "Showing how to tie a bowline once while rigging a line at a public dock.",
      "Pointing out three edible mushrooms on an organized woods walk where the host group sets safety rules.",
      "Explaining one breaker reset step while a neighbor watches their own panel.",
    ],
  },
  {
    id: "tier-2",
    title: "Tier 2 — Deliberate public session",
    lead: "A planned exchange in a public or community setting, kept short.",
    examples: [
      "Forty minutes at a library table folding sourdough basics side by side.",
      "Helping someone swap brake pads at a farmers-market bike booth hosted by a local collective.",
      "Paddle-float practice at a staffed public beach where venue rules govern life jackets.",
    ],
  },
  {
    id: "tier-3",
    title: "Tier 3 — Continued practice with the same neighbor",
    lead: "Follow-ups after a Tier 2 session, still bounded and still aligned with Dabble’s no-cash / no-gigs posture.",
    examples: [
      "A second public session on the same topic because the first met both people’s boundaries.",
      "A small neighborhood circle (few people) hosted in a rented room or yard where everyone opts in.",
    ],
  },
  {
    id: "tier-4",
    title: "Tier 4 — Outside what Dabble coordinates",
    lead: "These are not coordinated through Dabble’s product surface; people may choose them privately, but the platform does not schedule or supervise them.",
    examples: [
      "Solo work inside strangers’ private homes as a first meeting.",
      "Recurring dependent care, childcare without guardians present, or medical services.",
      "Anything that implies professional licensing, insurance, or background checks Dabble does not verify.",
    ],
  },
];

const neverHost = [
  "Marketplace listings, cash tips solicited through profiles, urgency mechanics, leaderboards, or other product non-goals (payments, hustles, churn prompts).",
  "Sexual solicitation, dating, or escorting framed as “sessions.”",
  "Medical diagnosis, prescription advice, supervised withdrawal, or crisis mental-health treatment carried through Dabble chat.",
  "Weapons training aimed at harm, evasion of law, or instructions for illegal conduct wherever the participants are.",
];

const checklist = [
  "Meet in a public place the first time.",
  "Tell someone you trust where you are going and how long you expect to be.",
  "Keep the session short so expectations stay small; align with seed-phase credit norms when published.",
  "Stay in skilled-amateur territory; defer to licensed professionals for regulated work.",
  "Prefer in-app messaging until you are comfortable; avoid posting phone numbers, email, or home address on profiles.",
  "Leave if anything feels unsafe; report concerns to safety@dabble.it.com.",
];

export default function SafetyPage() {
  return (
    <div className="ui-container py-16 md:py-20">
      <header className="max-w-3xl space-y-4">
        <p className="ui-label">Safety & trust</p>
        <h1 className="ui-heading text-3xl text-[var(--text-primary)] md:text-4xl">
          How we keep Dabble calm and low-risk
        </h1>
        <p className="font-sans text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">{intro}</p>
      </header>

      <section className="mt-14 space-y-6">
        <h2 className="ui-heading text-2xl text-[var(--text-primary)] md:text-3xl">Four-tier framework</h2>
        <p className="max-w-2xl font-sans text-sm text-[var(--text-secondary)]">
          Tiers and examples follow Master Plan §12.1–§12.4.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {tiers.map((tier) => (
            <Card key={tier.id} title={tier.title}>
              <p className="mb-3 font-sans text-sm leading-relaxed text-[var(--text-secondary)]">{tier.lead}</p>
              <ul className="list-disc space-y-2 pl-5 font-sans text-sm leading-relaxed text-[var(--text-secondary)]">
                {tier.examples.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-4">
        <h2 className="ui-heading text-2xl text-[var(--text-primary)] md:text-3xl">What we never host</h2>
        <p className="font-sans text-sm text-[var(--text-secondary)]">Out-of-scope list from Master Plan §12.5.</p>
        <ul className="max-w-3xl list-disc space-y-2 pl-5 font-sans text-base leading-relaxed text-[var(--text-secondary)]">
          {neverHost.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-16 space-y-4">
        <h2 className="ui-heading text-2xl text-[var(--text-primary)] md:text-3xl">Meeting for the first time</h2>
        <p className="font-sans text-sm text-[var(--text-secondary)]">Safe-meetup checklist from Master Plan §12.6.</p>
        <ul className="max-w-3xl list-disc space-y-2 pl-5 font-sans text-base leading-relaxed text-[var(--text-secondary)]">
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <footer className="mt-16 border-t border-[var(--rule)] pt-8">
        <p className="font-sans text-sm text-[var(--text-secondary)]">
          <Link
            href="mailto:safety@dabble.it.com"
            className="font-semibold text-[var(--brand-text)] underline-offset-4 hover:underline"
          >
            Report a concern
          </Link>{" "}
          — safety@dabble.it.com
        </p>
      </footer>
    </div>
  );
}
