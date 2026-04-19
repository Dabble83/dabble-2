import Link from "next/link";
import { CategoryIcon } from "@/app/components/CategoryIcon";
import type { CategoryIconCategory } from "@/app/components/CategoryIcon";
import { HeroIllustration } from "@/app/components/HeroIllustration";
import { TestimonialRow } from "@/app/components/TestimonialRow";
import { ButtonLink } from "@/app/components/ui";

const SKILL_CATEGORIES: { label: string; slug: CategoryIconCategory }[] = [
  { label: "Outdoor", slug: "outdoor" },
  { label: "DIY", slug: "diy" },
  { label: "Craft", slug: "craft" },
  { label: "Food", slug: "food" },
  { label: "Music", slug: "music" },
  { label: "Bikes", slug: "bikes" },
  { label: "Water", slug: "water" },
  { label: "Bird", slug: "bird" },
];

export default function Home() {
  return (
    <div className="pb-20">
      <section className="py-16 md:py-24">
        <div className="ui-container">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-8">
              <p className="ui-label">Trade skills with people nearby</p>
              <h1 className="max-w-xl font-serif font-semibold leading-[1.08] tracking-tight text-[var(--text-primary)] [font-size:var(--fs-display)]">
                Try something new, wherever you are.
              </h1>
              <p className="max-w-xl font-sans text-lg leading-relaxed text-[var(--text-secondary)]">
                Dabble connects you with skilled neighbors and traveling locals who can teach you a real skill in an
                hour — fly casting, sourdough, drywall, first kayak strokes. No cash, no pressure, just curiosity in
                action.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <ButtonLink href="/explore" variant="primary" className="px-8 py-3 text-base">
                  Find a skill
                </ButtonLink>
                <ButtonLink href="/profile/setup" variant="secondary" className="px-8 py-3 text-base">
                  Offer a skill
                </ButtonLink>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[26rem] rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_24px_60px_-24px_rgba(42,61,44,0.12)]">
                <HeroIllustration />
                <p className="mt-6 text-center font-serif text-sm italic text-[var(--text-secondary)]">
                  Illustration: homes, paths, and a small exchange — the shape of a block that looks out for one
                  another.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--rule)] py-14">
        <div className="ui-container space-y-6">
          <h2 className="font-serif font-semibold text-[var(--text-primary)] [font-size:var(--fs-h2)]">
            Browse by category
          </h2>
          <p className="max-w-2xl font-sans text-[var(--text-secondary)] [font-size:var(--fs-small)]">
            Line-art placeholders per §2.2; each tile links to Explore with a category hint for filtering (when wired).
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {SKILL_CATEGORIES.map(({ label, slug }) => (
              <Link
                key={slug}
                href={`/explore?category=${slug}`}
                className="ui-card flex flex-col items-center gap-3 px-3 py-4 text-center font-sans font-medium text-[var(--text-primary)] transition-colors [font-size:var(--fs-small)] hover:border-[var(--clay-dark)] hover:bg-[color-mix(in_srgb,var(--clay)_18%,var(--surface))]"
              >
                <CategoryIcon category={slug} size={36} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--rule)] bg-[color-mix(in_srgb,var(--surface)_70%,var(--background))] py-12">
        <div className="ui-container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl font-sans leading-relaxed text-[var(--text-secondary)] [font-size:var(--fs-body)]">
            Everyone starts with <span className="font-medium text-[var(--text-primary)]">3 free credits</span>{" "}
            during our seed phase. Earn more by teaching.{" "}
            <span className="font-medium text-[var(--text-primary)]">1 credit ≈ 20 minutes.</span>
          </p>
          <Link
            href="/how-it-works"
            className="shrink-0 font-sans font-semibold text-[var(--brand-text)] underline-offset-4 [font-size:var(--fs-small)] hover:underline"
          >
            How it works
          </Link>
        </div>
      </section>

      <TestimonialRow />
    </div>
  );
}
