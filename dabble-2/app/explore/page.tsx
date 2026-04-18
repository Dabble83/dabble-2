"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button, Tag } from "@/app/components/ui";
import { MapAdapterShell } from "@/app/explore/MapAdapterShell";
import type { DiscoverableProfile } from "@/src/lib/exploreTypes";

const BAND_PALETTE = [
  "#cdd8ce", // sage
  "#d8cfc5", // warm terracotta
  "#c8d0d8", // dusty slate
  "#d4cfcc", // warm taupe
  "#cec8d4", // lavender dust
] as const;

function bandColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h * 31) + seed.charCodeAt(i)) >>> 0;
  return BAND_PALETTE[h % BAND_PALETTE.length];
}

function nameInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase() || "N";
}

function ExploreProfileCard({
  dabbler,
  featured,
  highlighted,
}: {
  dabbler: DiscoverableProfile;
  featured?: boolean;
  highlighted?: boolean;
}) {
  const name = dabbler.display_name || "Neighbor";
  const handle = dabbler.username ? `@${dabbler.username}` : "";
  const place = dabbler.location_label || "Neighborhood not set";
  const color = bandColor(dabbler.id);

  return (
    <article
      id={`explore-card-${dabbler.id}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-[var(--surface)] shadow-[0_12px_40px_-20px_rgba(42,61,44,0.15)] transition hover:border-[color-mix(in_srgb,var(--brand)_40%,var(--border))] ${
        highlighted
          ? "border-[var(--brand-border)] ring-2 ring-[color:rgba(109,133,112,0.35)]"
          : "border-[var(--border)]"
      } ${featured ? "lg:row-span-2 lg:justify-between" : ""}`}
    >
      <div className="relative h-[72px] shrink-0" style={{ background: color }}>
        <div className="absolute -bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--brand)] shadow-sm">
          <span className="font-sans text-sm font-bold leading-none text-white">
            {nameInitials(name)}
          </span>
        </div>
      </div>

      <div className={`flex flex-1 flex-col px-6 pb-6 pt-9 ${featured ? "lg:pt-11" : ""}`}>
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
      </div>
    </article>
  );
}

export default function ExplorePage() {
  const mapsEnabled = process.env.NEXT_PUBLIC_ENABLE_MAPS === "true";
  const mapsBrowserKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapSplitLayout = mapsEnabled && Boolean(mapsBrowserKey);
  const [profiles, setProfiles] = useState<DiscoverableProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [neighborhood, setNeighborhood] = useState("all");
  const [highlightId, setHighlightId] = useState<string | null>(null);

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

  const listColumn = (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-1">
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
              className="h-[48px] w-full rounded-xl border-2 border-[var(--border)] bg-white px-3 font-sans text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand)]"
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
        <div
          className={
            mapSplitLayout ? "flex flex-col gap-5" : "grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-3"
          }
        >
          {filteredProfiles.map((dabbler, index) => (
            <ExploreProfileCard
              key={dabbler.id}
              dabbler={dabbler}
              featured={!mapSplitLayout ? index === 0 : false}
              highlighted={dabbler.id === highlightId}
            />
          ))}
        </div>
      ) : null}
    </div>
  );

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

        <MapAdapterShell
          enabled={mapsEnabled}
          points={profiles}
          onSelectProfile={(p) => {
            setHighlightId(p.id);
            const el = document.getElementById(`explore-card-${p.id}`);
            el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }}
        >
          {listColumn}
        </MapAdapterShell>
      </section>
    </div>
  );
}
