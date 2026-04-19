"use client";

import type { ComponentProps, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import Link from "next/link";
import { useState } from "react";
import { TagInput } from "./TagInput";

const BUTTON_BASE =
  "inline-flex items-center justify-center rounded-lg border-2 px-5 py-2.5 font-sans text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sage)] disabled:pointer-events-none disabled:opacity-50";

function buttonVariantStyles(variant: "primary" | "secondary" | "ghost" | "destructive") {
  if (variant === "primary") {
    return "border-[var(--brand-border)] bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]";
  }
  if (variant === "secondary") {
    return "border-[var(--clay-dark)] bg-transparent text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--clay)_42%,var(--surface))]";
  }
  if (variant === "ghost") {
    return "border-transparent bg-transparent text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--rule)_70%,transparent)]";
  }
  return "border-[color-mix(in_srgb,var(--ember)_55%,var(--ink))] bg-[var(--ember)] text-white hover:bg-[color-mix(in_srgb,var(--ember)_88%,var(--ink))]";
}

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={`${BUTTON_BASE} ${buttonVariantStyles(variant)} ${className}`} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
} & Omit<ComponentProps<typeof Link>, "className">;

/** Next.js `Link` styled like `Button` (primary sage / secondary clay outline). */
export function ButtonLink({ children, variant = "primary", className = "", ...props }: ButtonLinkProps) {
  return (
    <Link className={`${BUTTON_BASE} ${buttonVariantStyles(variant)} ${className}`} {...props}>
      {children}
    </Link>
  );
}

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "muted" | "emphasis";
};

export function Card({ title, children, className = "", variant = "default" }: CardProps) {
  const variantClass =
    variant === "default"
      ? "ui-card"
      : variant === "muted"
        ? "rounded-xl border border-[var(--rule)] bg-[var(--cream)]"
        : "rounded-xl border-2 border-[var(--clay-dark)] bg-[var(--surface)]";

  return (
    <section className={`${variantClass} p-6 ${className}`}>
      {title ? (
        <h3 className="mb-4 font-serif font-semibold tracking-tight text-[var(--text-primary)] [font-size:var(--fs-h3)]">
          {title}
        </h3>
      ) : null}
      {children}
    </section>
  );
}

const inputShellClass =
  "w-full rounded-lg border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 font-sans text-base text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand)_22%,transparent)]";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input {...rest} className={`${inputShellClass} ${className}`} />;
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <Input {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return <textarea {...rest} className={`${inputShellClass} min-h-28 resize-y ${className}`} />;
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--brand)_35%,transparent)] bg-[color-mix(in_srgb,var(--brand)_14%,white)] px-3 py-1 font-sans text-xs font-medium text-[var(--text-primary)]">
      {children}
    </span>
  );
}

export function TagInputPreview() {
  const [values, setValues] = useState<string[]>(["Sourdough", "Mending"]);
  return (
    <TagInput
      label="Tag input"
      description="Chip entry for offers and wants; press Enter or comma to add."
      values={values}
      onChange={setValues}
      placeholder="Type and press Enter"
    />
  );
}

export function BrandReferenceHero() {
  return (
    <header className="space-y-4 border-b border-[var(--rule)] pb-10">
      <p className="ui-label">Stakeholder reference · Gate C</p>
      <h1 className="font-serif font-semibold leading-[1.08] tracking-tight text-[var(--text-primary)] [font-size:var(--fs-display)]">
        Dabble brand reference
      </h1>
      <p className="max-w-2xl font-sans leading-relaxed text-[var(--text-secondary)] [font-size:var(--fs-body)]">
        Single surface for color, type, voice, map affordances, and UI primitives. Values track{" "}
        <span className="font-medium text-[var(--text-primary)]">docs/CURSOR_BUILD_PROMPTS.md</span>.
      </p>
    </header>
  );
}

const PALETTE_SWATCHES: { name: string; token: string; hex: string; note: string; swatch: string }[] = [
  { name: "Ink", token: "--ink", hex: "#1c2424", note: "Primary text", swatch: "bg-[var(--ink)]" },
  { name: "Sage", token: "--sage", hex: "#6d8570", note: "Primary brand, default map pin", swatch: "bg-[var(--sage)]" },
  { name: "Sage dark", token: "--sage-dark", hex: "#4d5c4d", note: "Borders, pressed, guide pin", swatch: "bg-[var(--sage-dark)]" },
  { name: "Sage hover", token: "--sage-hover", hex: "#5f745f", note: "Hover on sage controls", swatch: "bg-[var(--sage-hover)]" },
  { name: "Clay", token: "--clay", hex: "#d4c4b0", note: "Secondary surfaces", swatch: "bg-[var(--clay)]" },
  { name: "Clay dark", token: "--clay-dark", hex: "#b8a794", note: "Clay hover, want pin", swatch: "bg-[var(--clay-dark)]" },
  { name: "Ember", token: "--ember", hex: "#c4705a", note: "Rare emphasis, attention pin", swatch: "bg-[var(--ember)]" },
  { name: "Forest", token: "--forest", hex: "#2a3d2c", note: "Links, selected map pin", swatch: "bg-[var(--forest)]" },
  { name: "Cream", token: "--cream", hex: "#f4f0e6", note: "Page canvas", swatch: "bg-[var(--cream)]" },
  { name: "Stone", token: "--stone", hex: "#6b736b", note: "Secondary text, muted pin", swatch: "bg-[var(--stone)]" },
  { name: "Rule", token: "--rule", hex: "#e2ddd4", note: "Dividers, hairlines", swatch: "bg-[var(--rule)]" },
];

function PaletteSwatchRow({
  name,
  token,
  hex,
  note,
  swatch,
}: {
  name: string;
  token: string;
  hex: string;
  note: string;
  swatch: string;
}) {
  return (
    <div className="ui-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6">
      <div
        className={`h-16 w-full shrink-0 rounded-lg border border-[var(--rule)] sm:h-14 sm:w-24 ${swatch}`}
        aria-hidden
      />
      <div className="min-w-0 flex-1 space-y-1 font-sans">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-semibold text-[var(--text-primary)] [font-size:var(--fs-small)]">{name}</span>
          <code className="rounded bg-[color-mix(in_srgb,var(--rule)_55%,var(--surface))] px-1.5 py-0.5 font-mono text-[var(--text-secondary)] [font-size:var(--fs-micro)]">
            {token}
          </code>
          <span className="font-mono text-[var(--text-tertiary)] [font-size:var(--fs-micro)]">{hex}</span>
        </div>
        <p className="leading-snug text-[var(--text-secondary)] [font-size:var(--fs-small)]">{note}</p>
      </div>
    </div>
  );
}

export function PaletteSwatchGrid() {
  return (
    <section className="space-y-6">
      <h2 className="font-serif font-semibold text-[var(--text-primary)] [font-size:var(--fs-h2)]">Palette</h2>
      <p className="max-w-3xl font-sans text-[var(--text-secondary)] [font-size:var(--fs-body)]">
        Full brand ramp from CURSOR_BUILD_PROMPTS §1.2. Semantic tokens such as{" "}
        <code className="font-mono [font-size:var(--fs-micro)]">--brand</code> alias to sage for legacy screens.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {PALETTE_SWATCHES.map((row) => (
          <PaletteSwatchRow key={row.token} {...row} />
        ))}
      </div>
    </section>
  );
}

export function TypeSpecimen() {
  return (
    <section className="space-y-8">
      <h2 className="font-serif font-semibold text-[var(--text-primary)] [font-size:var(--fs-h2)]">Typography</h2>
      <p className="max-w-3xl font-sans text-[var(--text-secondary)] [font-size:var(--fs-body)]">
        Fraunces for display and editorial moments; Inter for UI chrome and dense copy. Sizes use §1.3 CSS variables.
      </p>
      <Card title="Fraunces — display & headings">
        <div className="space-y-6">
          <p className="font-serif font-normal leading-tight text-[var(--text-primary)] [font-size:var(--fs-display)]">
            Display — neighbors learning together
          </p>
          <p className="font-serif font-medium leading-tight text-[var(--text-primary)] [font-size:var(--fs-h1)]">
            H1 medium — Welcome to the block
          </p>
          <p className="font-serif font-semibold leading-snug text-[var(--text-primary)] [font-size:var(--fs-h2)]">
            H2 semibold — Upcoming sessions near you
          </p>
          <p className="font-serif font-semibold text-[var(--text-primary)] [font-size:var(--fs-h3)]">
            H3 semibold — Offer tags and wants
          </p>
          <p className="font-serif font-medium text-[var(--text-primary)] [font-size:var(--fs-h4)]">
            H4 medium — Supporting line for forms
          </p>
        </div>
      </Card>
      <Card title="Inter — body scale">
        <div className="space-y-4">
          <p className="font-sans font-normal leading-relaxed text-[var(--text-primary)] [font-size:var(--fs-body)]">
            Body — Dabble keeps exchanges calm and legible. Line length stays comfortable for onboarding, bios, and
            safety copy.
          </p>
          <p className="font-sans font-medium leading-relaxed text-[var(--text-secondary)] [font-size:var(--fs-small)]">
            Small / label weight — Used for field labels, helper text, and metadata above lists.
          </p>
          <p className="font-sans font-normal leading-relaxed text-[var(--text-tertiary)] [font-size:var(--fs-micro)]">
            Micro — Timestamps, legal hints, and map legend keys.
          </p>
        </div>
      </Card>
    </section>
  );
}

function LabeledButtonRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="ui-label">{label}</p>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

export function ButtonStateShowcase() {
  return (
    <section className="space-y-6">
      <h2 className="font-serif font-semibold text-[var(--text-primary)] [font-size:var(--fs-h2)]">Buttons</h2>
      <p className="max-w-3xl font-sans text-[var(--text-secondary)] [font-size:var(--fs-body)]">
        Primary (sage fill), secondary (clay outline), ghost (transparent), destructive (ember). Focus rings use sage
        outline for keyboard trails.
      </p>
      <Card title="States by variant">
        <div className="space-y-8">
          <LabeledButtonRow label="Primary — sage">
            <Button>Save draft</Button>
            <Button disabled>
              Disabled
            </Button>
          </LabeledButtonRow>
          <LabeledButtonRow label="Secondary — clay outline">
            <Button variant="secondary">Back</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </LabeledButtonRow>
          <LabeledButtonRow label="Ghost">
            <Button variant="ghost">Skip for now</Button>
            <Button variant="ghost" disabled>
              Disabled
            </Button>
          </LabeledButtonRow>
          <LabeledButtonRow label="Destructive — ember">
            <Button variant="destructive">Remove from map</Button>
            <Button variant="destructive" disabled>
              Disabled
            </Button>
          </LabeledButtonRow>
        </div>
      </Card>
    </section>
  );
}

export function CardVariantShowcase() {
  return (
    <section className="space-y-6">
      <h2 className="font-serif font-semibold text-[var(--text-primary)] [font-size:var(--fs-h2)]">Cards</h2>
      <p className="max-w-3xl font-sans text-[var(--text-secondary)] [font-size:var(--fs-body)]">
        Default uses surface + rule border; muted sits on cream for stacked editorial sections; emphasis frames key
        actions with clay-dark border.
      </p>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Default" variant="default">
          <p className="font-sans leading-relaxed text-[var(--text-secondary)] [font-size:var(--fs-small)]">
            Standard panel for forms, lists, and previews.
          </p>
        </Card>
        <Card title="Muted" variant="muted">
          <p className="font-sans leading-relaxed text-[var(--text-secondary)] [font-size:var(--fs-small)]">
            Lower contrast shell for secondary columns or background modules.
          </p>
        </Card>
        <Card title="Emphasis" variant="emphasis">
          <p className="font-sans leading-relaxed text-[var(--text-secondary)] [font-size:var(--fs-small)]">
            Highlights decisions that need a touch more presence without shouting.
          </p>
        </Card>
      </div>
    </section>
  );
}

export function FormControlsShowcase() {
  return (
    <section className="space-y-6">
      <h2 className="font-serif font-semibold text-[var(--text-primary)] [font-size:var(--fs-h2)]">Form controls</h2>
      <Card title="Text fields">
        <div className="space-y-6">
          <label className="block space-y-2">
            <span className="ui-label">TextInput — display name</span>
            <TextInput placeholder="Jordan Kim" autoComplete="name" />
          </label>
          <label className="block space-y-2">
            <span className="ui-label">TextInput — neighborhood</span>
            <TextInput placeholder="Park Slope, Brooklyn" />
          </label>
          <label className="block space-y-2">
            <span className="ui-label">TextArea — public bio</span>
            <Textarea placeholder="What do you love teaching or learning on your block?" rows={4} />
          </label>
          <TagInputPreview />
        </div>
      </Card>
    </section>
  );
}

const CATEGORY_LABELS = ["Outdoor", "DIY", "Craft", "Food", "Music"] as const;

function CategoryIconPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex w-28 flex-col items-center gap-2">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-[var(--rule)] bg-[color-mix(in_srgb,var(--surface)_88%,var(--cream))]"
        aria-hidden
      />
      <span className="text-center font-sans text-[var(--text-tertiary)] [font-size:var(--fs-micro)]">{label}</span>
    </div>
  );
}

export function CategoryIconPlaceholderRow() {
  return (
    <section className="space-y-6">
      <h2 className="font-serif font-semibold text-[var(--text-primary)] [font-size:var(--fs-h2)]">
        Category icons
      </h2>
      <p className="max-w-3xl font-sans text-[var(--text-secondary)] [font-size:var(--fs-body)]">
        Placeholder slots until §2 illustration set ships. Labels match top-level browse categories.
      </p>
      <Card>
        <div className="flex flex-wrap justify-between gap-6">
          {CATEGORY_LABELS.map((label) => (
            <CategoryIconPlaceholder key={label} label={label} />
          ))}
        </div>
      </Card>
    </section>
  );
}

const MAP_PIN_SAMPLES: { role: string; token: string; hex: string; note: string; pin: string }[] = [
  { role: "Default", token: "--sage", hex: "#6d8570", note: "General pin", pin: "bg-[var(--sage)]" },
  { role: "Selected", token: "--forest", hex: "#2a3d2c", note: "Active selection", pin: "bg-[var(--forest)]" },
  { role: "Offering / guide", token: "--sage-dark", hex: "#4d5c4d", note: "Teaching or hosting", pin: "bg-[var(--sage-dark)]" },
  { role: "Seeking / want", token: "--clay-dark", hex: "#b8a794", note: "Learning or asking", pin: "bg-[var(--clay-dark)]" },
  { role: "Attention", token: "--ember", hex: "#c4705a", note: "Rare map warning", pin: "bg-[var(--ember)]" },
  { role: "Muted / cluster", token: "--stone", hex: "#6b736b", note: "Clusters, low confidence", pin: "bg-[var(--stone)]" },
];

export function MapPinColorSamples() {
  return (
    <section className="space-y-6">
      <h2 className="font-serif font-semibold text-[var(--text-primary)] [font-size:var(--fs-h2)]">Map pins</h2>
      <p className="max-w-3xl font-sans text-[var(--text-secondary)] [font-size:var(--fs-body)]">
        Token mapping from CURSOR_BUILD_PROMPTS §2.3. Circles read as simplified pins on light map tiles.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MAP_PIN_SAMPLES.map((row) => (
          <div key={row.role} className="ui-card flex gap-4 p-4">
            <div
              className={`h-12 w-12 shrink-0 rounded-full border border-[color-mix(in_srgb,var(--ink)_14%,var(--rule))] shadow-[0_1px_0_color-mix(in_srgb,var(--ink)_10%,transparent)] ${row.pin}`}
              aria-hidden
            />
            <div className="min-w-0 space-y-1 font-sans">
              <p className="font-semibold text-[var(--text-primary)] [font-size:var(--fs-small)]">{row.role}</p>
              <p className="font-mono text-[var(--text-tertiary)] [font-size:var(--fs-micro)]">
                {row.token} · {row.hex}
              </p>
              <p className="text-[var(--text-secondary)] [font-size:var(--fs-micro)]">{row.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const VOICE_DO = [
  "Plain, neighborly sentences with concrete verbs.",
  'Calm invitations ("Share what you love") instead of hype.',
  "Benefits for the block or community, not abstract growth metrics.",
  'Use "dabblers" when it fits; otherwise "neighbors" or "people".',
];

const VOICE_DONT = [
  "Hustle tone, fake urgency, or scarcity tricks.",
  'Marketplace / gig jargon ("leverage", "rockstar", "10x").',
  "Shaming incomplete profiles or guilt-based nudges.",
  "Promises you cannot keep; stay honest and local.",
];

export function VoiceDoDont() {
  return (
    <section className="space-y-6">
      <h2 className="font-serif font-semibold text-[var(--text-primary)] [font-size:var(--fs-h2)]">Voice</h2>
      <p className="max-w-3xl font-sans text-[var(--text-secondary)] [font-size:var(--fs-body)]">
        Product tone from CURSOR_BUILD_PROMPTS §1.5 — keep marketing, errors, and map copy aligned.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Do" variant="muted">
          <ul className="list-disc space-y-2 pl-5 font-sans leading-relaxed text-[var(--text-secondary)] [font-size:var(--fs-small)]">
            {VOICE_DO.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card title="Don’t" variant="emphasis">
          <ul className="list-disc space-y-2 pl-5 font-sans leading-relaxed text-[var(--text-secondary)] [font-size:var(--fs-small)]">
            {VOICE_DONT.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}

export { TagInput } from "./TagInput";

export function TagShowcase() {
  return (
    <section className="space-y-6">
      <h2 className="font-serif font-semibold text-[var(--text-primary)] [font-size:var(--fs-h2)]">Tags</h2>
      <Card>
        <div className="flex flex-wrap gap-2">
          <Tag>Sourdough</Tag>
          <Tag>Bike repair</Tag>
          <Tag>Woodworking</Tag>
          <Tag>Urban gardening</Tag>
        </div>
      </Card>
    </section>
  );
}
