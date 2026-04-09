import { Button, Card, Input, Tag } from "@/app/components/ui";

const starterInterests = ["Cooking", "Home repair", "Cycling", "Gardening"];

export default function ProfileSetupPage() {
  return (
    <div className="py-16">
      <section className="ui-container max-w-3xl space-y-6">
        <header className="space-y-2">
          <p className="ui-label">Profile setup</p>
          <h1 className="ui-heading text-4xl">Tell your neighbors about you</h1>
        </header>

        <Card title="Basics">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="ui-label">Display name</span>
              <Input placeholder="Your display name" />
            </label>
            <label className="block space-y-2">
              <span className="ui-label">Username</span>
              <Input placeholder="your_username" />
            </label>
            <label className="block space-y-2 md:col-span-2">
              <span className="ui-label">Neighborhood</span>
              <Input placeholder="Park Slope, Brooklyn" />
            </label>
          </div>
        </Card>

        <Card title="Interests and skills">
          <p className="mb-3 text-sm text-[var(--text-secondary)]">
            Choose a few to start. This is a visual shell; data wiring comes in
            the auth/data phase.
          </p>
          <div className="mb-5 flex flex-wrap gap-2">
            {starterInterests.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="ui-label">What you can offer</span>
              <Input placeholder="e.g. Sourdough, bike tune-ups" />
            </label>
            <label className="block space-y-2">
              <span className="ui-label">What you want to learn</span>
              <Input placeholder="e.g. Woodworking, gardening" />
            </label>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button>Save profile shell</Button>
        </div>
      </section>
    </div>
  );
}
