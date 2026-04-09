"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, Tag } from "@/app/components/ui";
import { MapAdapterShell } from "@/app/explore/MapAdapterShell";
import type { DiscoverableProfile } from "@/src/lib/exploreTypes";

export default function ExplorePage() {
  const mapsEnabled = process.env.NEXT_PUBLIC_ENABLE_MAPS === "true";
  const [profiles, setProfiles] = useState<DiscoverableProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [neighborhood, setNeighborhood] = useState("all");

  useEffect(() => {
    async function loadDiscoverable() {
      const response = await fetch("/api/explore/discoverable", { cache: "no-store" });
      const body = await response.json();

      if (!response.ok) {
        setError(body.error || "Unable to load discoverable profiles.");
        setLoading(false);
        return;
      }

      setProfiles(body.profiles || []);
      setLoading(false);
    }

    loadDiscoverable();
  }, []);

  const neighborhoods = Array.from(
    new Set(
      profiles
        .map((p) => p.location_label?.trim())
        .filter((v): v is string => Boolean(v)),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const filteredProfiles = profiles.filter((profile) => {
    const haystack = [
      profile.display_name || "",
      profile.username || "",
      ...(profile.skills || []),
      ...(profile.interests || []),
      profile.location_label || "",
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = query.trim().length === 0 || haystack.includes(query.toLowerCase());
    const matchesNeighborhood =
      neighborhood === "all" || (profile.location_label || "") === neighborhood;
    return matchesQuery && matchesNeighborhood;
  });

  return (
    <div className="py-16">
      <section className="ui-container space-y-8">
        <header className="space-y-3">
          <p className="ui-label">Explore</p>
          <h1 className="ui-heading text-5xl">Dabblers near you</h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Discovery is list-first and resilient. Optional map rendering stays
            behind an adapter so core browsing never breaks.
          </p>
        </header>

        <MapAdapterShell enabled={mapsEnabled} points={profiles} />

        <div className="ui-card p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <label className="block space-y-2">
              <span className="ui-label">Search by name, offer, or want</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. sourdough, bike repair, Alex"
                className="w-full rounded-lg border-2 border-zinc-300 bg-white px-4 py-2.5 font-sans text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--brand)]"
              />
            </label>
            <label className="block space-y-2">
              <span className="ui-label">Neighborhood</span>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="h-[42px] rounded-lg border-2 border-zinc-300 bg-white px-3 font-sans text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--brand)]"
              >
                <option value="all">All neighborhoods</option>
                {neighborhoods.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {!loading && !error ? (
            <p className="mt-3 font-sans text-xs text-[var(--text-tertiary)]">
              Showing {filteredProfiles.length} of {profiles.length} profiles.
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="ui-card p-6 font-sans text-sm text-[var(--text-secondary)]">
            Loading discoverable profiles...
          </div>
        ) : null}

        {error ? (
          <div className="ui-card p-6 font-sans text-sm text-red-600">{error}</div>
        ) : null}

        {!loading && !error && profiles.length === 0 ? (
          <div className="ui-card p-6 font-sans text-sm text-[var(--text-secondary)]">
            No discoverable profiles yet. Complete profile setup and enable
            discoverability to appear here.
          </div>
        ) : null}

        {!loading && !error && profiles.length > 0 && filteredProfiles.length === 0 ? (
          <div className="ui-card p-6 font-sans text-sm text-[var(--text-secondary)]">
            No matches for your current filters. Try a broader search or choose
            &quot;All neighborhoods&quot;.
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfiles.map((dabbler) => (
              <Card
                key={dabbler.id}
                title={`${dabbler.display_name || "Dabbler"} (@${dabbler.username})`}
              >
                <p className="font-sans text-sm text-[var(--text-tertiary)]">
                  {dabbler.location_label || "Neighborhood not set"}
                </p>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="ui-label mb-2">Offers</p>
                    <div className="flex flex-wrap gap-2">
                      {(dabbler.skills || []).map((offer) => (
                        <Tag key={offer}>{offer}</Tag>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="ui-label mb-2">Wants</p>
                    <div className="flex flex-wrap gap-2">
                      {(dabbler.interests || []).map((want) => (
                        <Tag key={want}>{want}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/profile/${dabbler.username}`}
                  className="mt-4 inline-block font-sans text-sm underline-offset-4 hover:underline"
                >
                  View profile
                </Link>
              </Card>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
