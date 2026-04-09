import { notFound } from "next/navigation";
import { Card, Tag } from "@/app/components/ui";

const demoProfiles: Record<
  string,
  { name: string; neighborhood: string; offers: string[]; wants: string[] }
> = {
  "demo-user": {
    name: "Demo User",
    neighborhood: "Park Slope",
    offers: ["Sourdough", "Knitting"],
    wants: ["Bike repair", "Woodworking"],
  },
  "alex-fixes": {
    name: "Alex",
    neighborhood: "Prospect Heights",
    offers: ["Bike repair", "Home tools"],
    wants: ["Urban gardening"],
  },
};

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = demoProfiles[username];

  if (!profile) {
    notFound();
  }

  return (
    <div className="py-16">
      <section className="ui-container max-w-2xl">
        <Card title={profile.name}>
          <p className="font-sans text-sm text-[var(--text-tertiary)]">
            @{username} - {profile.neighborhood}
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <p className="ui-label mb-2">Offers</p>
              <div className="flex flex-wrap gap-2">
                {profile.offers.map((offer) => (
                  <Tag key={offer}>{offer}</Tag>
                ))}
              </div>
            </div>
            <div>
              <p className="ui-label mb-2">Wants</p>
              <div className="flex flex-wrap gap-2">
                {profile.wants.map((want) => (
                  <Tag key={want}>{want}</Tag>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
