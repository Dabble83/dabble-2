import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "At Dabble we welcome, honest skill claims, safe meetups, credits integrity.",
  alternates: { canonical: "/guidelines" },
};

const respectWelcome =
  "Dabblers and curious visitors who treat each other with patience and dignity — across backgrounds, ages, and skill levels. The swap works best when everyone’s current abilities and boundaries are respected.";

const respectZero =
  "Harassment, hate, slurs, threats, intimidation, stalking, unwanted sexual attention, or coordinated pile-ons. People who break the trail rules don’t stay in the Dabble community.";

const honestBullets = [
  "Say what you have done, how often, and in what setting.",
  "If you are not a certified instructor, do not imply licenses, insurance, union cards, or endorsements you do not have.",
  "If someone needs regulated work, e.g. electrical behind walls, medical decisions, legal advice — point them kindly toward a licensed professional.",
];

const safeMeetups = [
  "Meet in a public place the first time.",
  "Tell someone you trust where you are going and how long you expect to be.",
  "Keep the session short so expectations stay small.",
  "Stay in skilled-amateur territory; defer to licensed professionals for regulated work.",
  "Prefer in-app messaging until you are comfortable; keep phone numbers, email, and home addresses off your public profile.",
  "Leave if anything feels unsafe.",
];

const creditsBullets = [
  "No selling credits for cash or trading credits off-platform in ways that produce a gig economy — the swap is the point.",
  "No ghost sessions or collusion to farm credits. If a meetup didn’t happen, it didn’t happen.",
  "Keep exchanges honest, fun and mutually beneficial.",
];


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
      <header className="flex flex-col gap-6 pb-4 sm:flex-row sm:items-start">
        <div className="max-w-3xl flex-1 space-y-4">
          <p className="ui-label">Community</p>
          <h1 className="ui-heading text-3xl text-[var(--text-primary)] md:text-4xl">Community guidelines</h1>
          <p className="font-serif text-lg italic leading-relaxed text-[var(--text-secondary)] md:text-xl">
            Dabble works because it is a community of trust and honesty and with room for beginners.
          </p>
        </div>
        <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-2xl sm:h-44 sm:w-44" aria-hidden>
          <Image
            src="/images/share.png"
            alt="Two people sharing knowledge in the community"
            fill
            className="object-cover"
          />
        </div>
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
            Dabble is built on{" "}
            <strong className="font-semibold text-[var(--text-primary)]">skilled amateurs</strong>{" "}
            sharing what they have actually practiced &mdash; talent, skills, ideas, and knowledge
            &mdash; not on pretending to be something they are not.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {honestBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section id="safe-meetups" title="Safe meetups">
          <p>
            First meets stay{" "}
            <strong className="font-semibold text-[var(--text-primary)]">public</strong>,{" "}
            <strong className="font-semibold text-[var(--text-primary)]">short</strong>, and{" "}
            <strong className="font-semibold text-[var(--text-primary)]">easy to leave</strong>.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {safeMeetups.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section id="credits" title="Credits integrity">
          <ul className="list-disc space-y-2 pl-5">
            {creditsBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

      </div>
    </div>
  );
}
