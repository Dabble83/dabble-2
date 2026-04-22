import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "Who we welcome, honest skill claims, safe meetups, credits integrity, and how reporting works — at a walking pace.",
  alternates: { canonical: "/guidelines" },
};

const respectWelcome =
  "Neighbors and curious visitors who treat others with patience and dignity—across backgrounds, ages, and skill levels. We like the trail when everyone can breathe.";

const respectZero =
  "Harassment, hate, slurs, threats, intimidation, stalking, unwanted sexual attention, or coordinated pile-ons. We remove people who break the trail rules.";

const honestBullets = [
  "Say what you have done, how often, and in what setting.",
  "If you are not a certified instructor, do not imply licenses, insurance, union cards, or endorsements you do not have.",
  "If someone needs regulated work (electrical behind walls, medical decisions, legal advice), kindly point them toward a licensed professional.",
];

const safeMeetups = [
  "Meet in a public place the first time.",
  "Tell someone you trust where you are going and how long you expect to be.",
  "Keep the session short so expectations stay small; align with seed-phase credit norms when published.",
  "Stay in skilled-amateur territory; defer to licensed professionals for regulated work.",
  "Prefer in-app messaging until you are comfortable; avoid posting phone numbers, email, or home address on profiles.",
  "Leave if anything feels unsafe; report concerns to safety@dabble.it.com.",
];

const creditsBullets = [
  "No selling credits for cash or trading credits off-platform in ways that recreate a gig economy.",
  "No ghost sessions or collusion to farm credits—if a meetup did not happen, it did not happen.",
  "Keep exchanges small, honest, and aligned with the seed-phase credit story when published.",
];

const reportingHow =
  "Email safety@dabble.it.com with who was involved, when it happened, and what occurred—stick to facts you are comfortable sharing. In-product reporting will arrive later; email is the path for now.";

const reportingNext =
  "We triage, may pause or mute accounts while we review, and follow up with the parties involved when appropriate.";

const reportingPromise =
  "During the seed phase, we acknowledge substantive reports within 72 hours on business days. Some matters need more time to untangle; if so, we still send a first note inside that window so you are not left guessing.";

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

export default function GuidelinesPage() {
  return (
    <div className="ui-container py-16 md:py-20">
      <header className="max-w-3xl space-y-4 pb-4">
        <p className="ui-label">Community</p>
        <h1 className="ui-heading text-3xl text-[var(--text-primary)] md:text-4xl">Community guidelines</h1>
        <p className="font-serif text-lg italic leading-relaxed text-[var(--text-secondary)] md:text-xl">
          The trail is better when we walk it together—calmly, honestly, and with room for beginners.
        </p>
      </header>

      <div className="space-y-0">
        <Section id="respect" title="Respect">
          <p>
            <span className="font-semibold text-[var(--text-primary)]">Who we welcome. </span>
            {respectWelcome}
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">Zero tolerance. </span>
            {respectZero}
          </p>
        </Section>

        <Section id="honest-skills" title="Honest skill claims">
          <p>
            Dabble is built around <strong className="font-semibold text-[var(--text-primary)]">skilled amateurs</strong>{" "}
            sharing what they have actually practiced—not around pretending to be something you are not.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {honestBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section id="safe-meetups" title="Safe meetups">
          <p>
            First meets stay <strong className="font-semibold text-[var(--text-primary)]">public</strong>,{" "}
            <strong className="font-semibold text-[var(--text-primary)]">short</strong>, and{" "}
            <strong className="font-semibold text-[var(--text-primary)]">easy to leave</strong>. Same checklist as our
            safety page (Master Plan §12.6):
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {safeMeetups.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            For the broader safety model—including tiers and out-of-scope lists—visit{" "}
            <Link href="/safety" className="font-semibold text-[var(--brand-text)] underline-offset-4 hover:underline">
              /safety
            </Link>{" "}
            (Master Plan §12).
          </p>
        </Section>

        <Section id="credits" title="Credits integrity">
          <ul className="list-disc space-y-2 pl-5">
            {creditsBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section id="reporting" title="Reporting">
          <p>
            <span className="font-semibold text-[var(--text-primary)]">How. </span>
            {reportingHow}
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">What happens next. </span>
            {reportingNext}
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">72-hour response promise. </span>
            {reportingPromise}
          </p>
          <p>
            <Link
              href="mailto:safety@dabble.it.com"
              className="font-semibold text-[var(--brand-text)] underline-offset-4 hover:underline"
            >
              safety@dabble.it.com
            </Link>
          </p>
        </Section>
      </div>
    </div>
  );
}
