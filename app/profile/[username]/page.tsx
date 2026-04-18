"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Tag } from "@/app/components/ui";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/profile/by-username?username=${encodeURIComponent(username)}`,
        { cache: "no-store" },
      );
      const body = await response.json();

      if (!response.ok) {
        setError(body.error || "Unable to load this profile.");
        setLoading(false);
        return;
      }

      setProfile(body.profile);
      setLoading(false);
    } catch {
      setError("Network error while loading this profile.");
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadProfile();
    }, 0);
    return () => clearTimeout(timeout);
  }, [loadProfile]);

  const fallback = fallbackProfiles[username];
  const displayName = profile?.display_name || fallback?.name || "Neighbor";
  const neighborhood = profile?.location_label || fallback?.neighborhood || "";
  const offers = profile?.skills || fallback?.offers || [];
  const wants = profile?.interests || fallback?.wants || [];

  return (
    <div>
      <header className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--brand)_10%,var(--surface))]">
        <div className="ui-container py-12 md:py-16">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-text)]">
            {neighborhood || "Neighborhood not set"}
          </p>
          <h1 className="ui-heading mt-3 text-4xl text-[var(--text-primary)] md:text-5xl">{displayName}</h1>
          <p className="mt-2 font-sans text-base text-[var(--text-tertiary)]">@{username}</p>
        </div>
      </header>

      <div className="ui-container py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
          <div className="space-y-8">
            {profile?.interests_intro ? (
              <section>
                <h2 className="ui-label mb-3">Curious about</h2>
                <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)]">
                  {profile.interests_intro}
                </p>
              </section>
            ) : null}
            {profile?.skills_intro ? (
              <section>
                <h2 className="ui-label mb-3">Happy to share</h2>
                <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)]">
                  {profile.skills_intro}
                </p>
              </section>
            ) : null}
            {!profile?.interests_intro && !profile?.skills_intro && !loading && !error ? (
              <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)]">
                This neighbor has not added a story yet — say hello and ask what they are working on
                lately.
              </p>
            ) : null}

            {loading ? (
              <p className="font-sans text-sm text-[var(--text-secondary)]">Loading profile...</p>
            ) : null}
            {error ? (
              <div className="space-y-4 rounded-2xl border border-red-200 bg-red-50/80 p-5">
                <p className="font-sans text-sm text-red-800">{error}</p>
                <Button variant="secondary" onClick={loadProfile}>
                  Retry
                </Button>
              </div>
            ) : null}
          </div>

          <aside className="space-y-8 lg:border-l lg:border-[var(--border)] lg:pl-10">
            <section>
              <h2 className="ui-label mb-3">Offers</h2>
              <div className="flex flex-wrap gap-2">
                {offers.length ? (
                  offers.map((offer) => <Tag key={offer}>{offer}</Tag>)
                ) : (
                  <span className="font-sans text-sm text-[var(--text-tertiary)]">—</span>
                )}
              </div>
            </section>
            <section>
              <h2 className="ui-label mb-3">Wants to learn</h2>
              <div className="flex flex-wrap gap-2">
                {wants.length ? (
                  wants.map((want) => <Tag key={want}>{want}</Tag>)
                ) : (
                  <span className="font-sans text-sm text-[var(--text-tertiary)]">—</span>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}