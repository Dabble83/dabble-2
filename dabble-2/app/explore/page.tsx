import { Card, Tag } from "@/app/components/ui";

const sampleDabblers = [
  {
    username: "jane_cooks",
    name: "Jane",
    neighborhood: "Park Slope",
    offers: ["Sourdough", "Knitting"],
    wants: ["Bike repair"],
  },
  {
    username: "alex_fixes",
    name: "Alex",
    neighborhood: "Prospect Heights",
    offers: ["Bike repair", "Woodworking"],
    wants: ["Gardening"],
  },
  {
    username: "sam_grows",
    name: "Sam",
    neighborhood: "Gowanus",
    offers: ["Urban gardening", "Composting"],
    wants: ["Bread baking"],
  },
];

export default function ExplorePage() {
  const mapsEnabled = process.env.NEXT_PUBLIC_ENABLE_MAPS === "true";

  return (
    <div className="py-16">
      <section className="ui-container space-y-8">
        <header className="space-y-3">
          <p className="ui-label">Explore</p>
          <h1 className="ui-heading text-5xl">Dabblers near you</h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Phase 1 is list-first so discovery works without optional map
            integrations.
          </p>
        </header>

        <div className="ui-card p-5 font-sans text-sm text-[var(--text-secondary)]">
          {mapsEnabled
            ? "Maps are enabled. Interactive map module will be wired in a later phase."
            : "Maps are disabled. Set NEXT_PUBLIC_ENABLE_MAPS=true when map module is ready."}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sampleDabblers.map((dabbler) => (
            <Card key={dabbler.username} title={`${dabbler.name} (@${dabbler.username})`}>
              <p className="font-sans text-sm text-[var(--text-tertiary)]">
                {dabbler.neighborhood}
              </p>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="ui-label mb-2">Offers</p>
                  <div className="flex flex-wrap gap-2">
                    {dabbler.offers.map((offer) => (
                      <Tag key={offer}>{offer}</Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="ui-label mb-2">Wants</p>
                  <div className="flex flex-wrap gap-2">
                    {dabbler.wants.map((want) => (
                      <Tag key={want}>{want}</Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
