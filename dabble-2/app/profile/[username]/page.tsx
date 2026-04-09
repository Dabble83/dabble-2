"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, Tag } from "@/app/components/ui";
import type { ProfileRecord } from "@/src/lib/profileTypes";

const fallbackProfiles: Record<
  string,
  { name: string; neighborhood: string; offers: string[]; wants: string[] }
> = {
  "demo-user": {
    name: "Demo User",
    neighborhood: "Park Slope",
    offers: ["Sourdough", "Knitting"],
    wants: ["Bike repair", "Woodworking"],
  },
};

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const response = await fetch(
        `/api/profile/by-username?username=${encodeURIComponent(username)}`,
        { cache: "no-store" },
      );
      const body = await response.json();

      if (!response.ok) {
        setError(body.error || "Unable to load this profile.");
        return;
      }

      setProfile(body.profile);
    }

    loadProfile();
  }, [username]);

  const fallback = fallbackProfiles[username];

  return (
    <div className="py-16">
      <section className="ui-container max-w-2xl">
        <Card title={profile?.display_name || fallback?.name || "Dabbler"}>
          <p className="font-sans text-sm text-[var(--text-tertiary)]">
            @{username} {profile?.location_label ? `- ${profile.location_label}` : ""}
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <p className="ui-label mb-2">Offers</p>
              <div className="flex flex-wrap gap-2">
                {(profile?.skills || fallback?.offers || []).map((offer) => (
                  <Tag key={offer}>{offer}</Tag>
                ))}
              </div>
            </div>
            <div>
              <p className="ui-label mb-2">Wants</p>
              <div className="flex flex-wrap gap-2">
                {(profile?.interests || fallback?.wants || []).map((want) => (
                  <Tag key={want}>{want}</Tag>
                ))}
              </div>
            </div>
          </div>

          {error ? <p className="mt-4 font-sans text-sm text-red-600">{error}</p> : null}
        </Card>
      </section>
    </div>
  );
}
