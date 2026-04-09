import Link from "next/link";
import { Button } from "@/app/components/ui";

export default function Home() {
  return (
    <div className="py-20">
      <main className="ui-container flex max-w-3xl flex-col gap-8">
        <p className="ui-label">Phase 1 foundation</p>
        <h1 className="ui-heading text-5xl">Dabble 2.0</h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
          Try something new, wherever you are. We are building the core app
          with a calm design system, optional integrations, and clear agent
          handoffs.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/design/preview"
            className="inline-flex"
          >
            <Button>Open design preview</Button>
          </Link>
          <Link href="/api/health" className="inline-flex">
            <Button variant="secondary">Check API health</Button>
          </Link>
          <a
            href="https://nextjs.org/docs"
            className="inline-flex items-center text-sm font-medium text-[var(--text-secondary)] underline-offset-4 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js docs
          </a>
        </div>
      </main>
    </div>
  );
}
