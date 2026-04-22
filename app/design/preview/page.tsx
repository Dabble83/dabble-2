import type { Metadata } from "next";
import { TagInputDemo } from "@/app/design/preview/TagInputDemo";
import { Button, Card, Input, Tag } from "@/app/components/ui";

export const metadata: Metadata = {
  title: "Design preview",
  description:
    "Internal typography and component preview for Dabble — not part of the public product surface.",
  robots: { index: false, follow: false },
};

export default function DesignPreviewPage() {
  return (
    <div className="py-16">
      <div className="ui-container space-y-10">
        <header className="space-y-3">
          <p className="ui-label">Gate C approval surface</p>
          <h1 className="ui-heading text-5xl">Dabble 2.0 Design Preview</h1>
          <p className="max-w-2xl font-serif text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            This page is the single visual contract for typography, spacing, and
            component style before broader feature implementation.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <Card title="Buttons" titleLevel={2}>
            <div className="flex flex-wrap gap-3">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary action</Button>
              <Button disabled className="opacity-60">
                Disabled
              </Button>
            </div>
          </Card>

          <Card title="Tags" titleLevel={2}>
            <div className="flex flex-wrap gap-2">
              <Tag>Sourdough</Tag>
              <Tag>Bike repair</Tag>
              <Tag>Woodworking</Tag>
              <Tag>Urban gardening</Tag>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card title="Form fields" titleLevel={2}>
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="ui-label">Display name</span>
                <Input placeholder="Your name" />
              </label>
              <label className="block space-y-2">
                <span className="ui-label">Neighborhood</span>
                <Input placeholder="Park Slope, Brooklyn" />
              </label>
              <TagInputDemo />
            </div>
          </Card>

          <Card title="Editorial text" titleLevel={2}>
            <p className="text-lg leading-8 text-[var(--text-primary)]">
              Dabble helps neighbors learn and share skills in person. The UI
              stays calm, clear, and human so the focus remains on connection.
            </p>
            <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
              Review this page before feature work expands, and we will lock
              these patterns as the default system.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
