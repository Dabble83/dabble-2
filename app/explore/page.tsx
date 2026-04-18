"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button, Tag } from "@/app/components/ui";
import { MapAdapterShell } from "@/app/explore/MapAdapterShell";
import type { DiscoverableProfile } from "@/src/lib/exploreTypes";

function ExploreProfileCard({
  dabbler,
  featured,
}: {
  dabbler: DiscoverableProfile;
  featured?: boolean;
}) {
  const name = dabbler.display_name || "Neighbor";
  const handle = dabbler.username ? `@${dabbler.username}` : "";
  const place = dabbler.location_label || "Neighborhood not set";

  return (
    <article
      className={`group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_12px_40px_-20px_rgba(42,61,44,0.15)] transition hover:border-[color-mix(in_srgb,var(--brand)_40%,var(--border))] ${
        featured ? "lg:row-span-2 lg:justify-between lg:p-8" : ""
      }`}
    >
      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-text)]">
          {place}
        </p>
        <h2 className="ui-heading mt-2 text-2xl text-[var(--text-primary)] md:text-3xl">
          {name}
        </h2>
        {handle ? (
          <p className="mt-1 font-sans text-sm text-[var(--text-tertiary)]">{handle}</p>
        ) : null}
      </div>

      <div className={`mt-6 space-y-5 ${featured ? "lg:mt-10" : ""}`}>
        <div>
          <p className="ui-label mb-2">Offers</p>
          <div className="flex flex-wrap gap-2">
            {(dabbler.skills || []).length ? (
              (dabbler.skills || []).map((offer) => <Tag key={offer}>{offer}</Tag>)
            ) : (
              <span className="font-sans text-sm text-[var(--text-tertiary)]">—</span>
            )}
          </div>
        </div>
        <div>
          <p className="ui-label mb-2">Wants to learn</p>
          <div className="flex flex-wrap gap-2">
            {(dabbler.interests || []).length ? (
              (dabbler.interests || []).map((want) => <Tag key={want}>{want}</Tag>)
            ) : (
              <span className="font-sans text-sm text-[var(--text-tertiary)]">—</span>
            )}
          </div>
        </div>
      </div>

      <Link
        href={`/profile/${dabbler.username}`}
        className="mt-6 inline-flex font-sans text-sm font-medium text-[var(--brand-text)] underline-offset-[5px] transition group-hover:underline"
      >
        View profile
      </Link>
    </article>
  );
}

export default function ExplorePage() {
  const mapsEnabled = process.env.NEXT_PUBLIC_ENABLE_MAPS === "true";
  const [profiles, setProfiles] = useState<DiscoverableProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [neighborhood, setNeighborhood] = useState("all");

  const loadDiscoverable = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/explore/discoverable", { cache: "no-store" });
      const body = await response.json();

      if (!response.ok) {
        setError(body.error || "Unable to load discoverable profiles.");
        setLoading(false);
        return;
      }

      setProfiles(body.profiles || []);
      setLoading(false);
    } catch {
      setError("Network error while loading discoverable profiles.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadDiscoverable();
    }, 0);
    return () => clearTimeout(timeout);
  }, [loadDiscoverable]);

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
    <div className="py-16 md:py-20">
      <section className="ui-container space-y-12">
        <header className="max-w-3xl space-y-4">
          <p className="ui-label">Explore</p>
          <h1 className="ui-heading text-4xl md:text-5xl">Neighbors worth meeting</h1>
          <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            Browse at your own pace. Each card is a small portrait — what someone shares, what they
            hope to learn, and where they are in the neighborhood.
          </p>
        </header>

        <MapAdapterShell enabled={mapsEnabled} points={profiles} />

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <label className="block space-y-2">
              <span className="ui-label">Search</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, skill, or curiosity"
                className="w-full rounded-xl border-2 border-[var(--border)] bg-white px-4 py-3 font-sans text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand)]"
              />
            </label>
            <label className="block space-y-2">
              <span className="ui-label">Neighborhood</span>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="h-[48px] min-w-[11rem] rounded-xl border-2 border-[var(--border)] bg-white px-3 font-sans text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand)]"
              >
                <option value="all">Everywhere</option>
                {neighborhoods.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {!loading && !error ? (
            <p className="mt-4 font-sans text-xs text-[var(--text-tertiary)]">
              Showing {filteredProfiles.length} of {profiles.length} profiles.
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 font-sans text-sm text-[var(--text-secondary)]">
            Gathering neighbors...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 font-sans text-sm text-red-800">
            <p>{error}</p>
            <div className="mt-4">
              <Button variant="secondary" onClick={loadDiscoverable}>
                Retry
              </Button>
            </div>
          </div>
        ) : null}

        {!loading && !error && profiles.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 font-sans text-sm text-[var(--text-secondary)]">
            No discoverable profiles yet. Complete profile setup and enable discoverability to appear
            here.
          </div>
        ) : null}

        {!loading && !error && profiles.length > 0 && filteredProfiles.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 font-sans text-sm text-[var(--text-secondary)]">
            No matches for your filters. Try a broader search or choose &quot;Everywhere&quot;.
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProfiles.map((dabbler, index) => (
              <ExploreProfileCard key={dabbler.id} dabbler={dabbler} featured={index === 0} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}