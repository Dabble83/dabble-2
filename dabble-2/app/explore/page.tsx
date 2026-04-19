"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Button, Tag } from "@/app/components/ui";
import { FilterBar } from "@/app/explore/FilterBar";
import { MapAdapterShell } from "@/app/explore/MapAdapterShell";
import {
  enrichDiscoverableProfile,
  EXPLORE_CATEGORIES,
  EXPLORE_CATEGORY_IDS,
  pinColorForCategory,
} from "@/src/lib/exploreCategories";
import type { DiscoverableProfile, ExploreCategoryId } from "@/src/lib/exploreTypes";

function parseCategoriesFromParams(sp: URLSearchParams): ExploreCategoryId[] {
  const raw = sp.get("cat")?.split(",").filter(Boolean) ?? [];
  return raw.filter((c): c is ExploreCategoryId => EXPLORE_CATEGORY_IDS.includes(c as ExploreCategoryId));
}

function parseOriginFromParams(sp: URLSearchParams): { lat: number; lng: number } | null {
  const olat = Number(sp.get("olat"));
  const olng = Number(sp.get("olng"));
  if (Number.isFinite(olat) && Number.isFinite(olng)) return { lat: olat, lng: olng };
  return null;
}

function parseDistanceKm(sp: URLSearchParams, hasOrigin: boolean): number {
  if (!hasOrigin) return 50;
  const kmParsed = Number(sp.get("km"));
  if (Number.isFinite(kmParsed) && kmParsed >= 1 && kmParsed <= 50) return Math.round(kmParsed);
  return 50;
}

function parseTeachingNow(sp: URLSearchParams): boolean {
  return sp.get("now") === "1";
}

function nameInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase() || "N";
}

function categoryLanePhrase(ids: ExploreCategoryId[]): string {
  const labels = EXPLORE_CATEGORIES.filter((c) => ids.includes(c.id)).map((c) => c.label);
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0] ?? "";
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

function hasActiveUrlFilters(
  cats: ExploreCategoryId[],
  teachingNow: boolean,
  hasOrigin: boolean,
): boolean {
  return cats.length > 0 || teachingNow || hasOrigin;
}

/** Headline when the API returned zero rows but URL filters are in play. */
function serverFilteredEmptyHeadline(
  cats: ExploreCategoryId[],
  teachingNow: boolean,
  hasOrigin: boolean,
): string {
  const lane = categoryLanePhrase(cats);
  if (lane) {
    return hasOrigin
      ? `No one nearby teaching ${lane} yet.`
      : `No one teaching ${lane} yet.`;
  }
  if (teachingNow && hasOrigin) return "No one nearby teaching right now yet.";
  if (teachingNow) return "No one teaching right now yet.";
  if (hasOrigin) return "No one nearby yet.";
  return "No discoverable profiles match these filters yet.";
}

function ExploreCardSkeleton() {
  return (
    <article
      className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_12px_40px_-20px_rgba(42,61,44,0.12)]"
      aria-hidden
    >
      <div className="relative h-[72px] shrink-0 bg-[color-mix(in_srgb,var(--border)_85%,var(--surface))]" />
      <div className="relative px-6 pb-6 pt-9">
        <div className="absolute -top-5 left-5 h-11 w-11 rounded-full border-2 border-[var(--surface)] bg-[color-mix(in_srgb,var(--border)_80%,var(--surface))]" />
        <div className="h-3 w-[28%] max-w-[7rem] rounded bg-[color-mix(in_srgb,var(--border)_88%,var(--surface))]" />
        <div className="mt-3 h-8 w-[72%] max-w-xs rounded-md bg-[color-mix(in_srgb,var(--border)_82%,var(--surface))]" />
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <div className="h-2.5 w-14 rounded bg-[color-mix(in_srgb,var(--border)_88%,var(--surface))]" />
            <div className="flex flex-wrap gap-2">
              <div className="h-7 w-20 rounded-full bg-[color-mix(in_srgb,var(--border)_88%,var(--surface))]" />
              <div className="h-7 w-24 rounded-full bg-[color-mix(in_srgb,var(--border)_88%,var(--surface))]" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2.5 w-28 rounded bg-[color-mix(in_srgb,var(--border)_88%,var(--surface))]" />
            <div className="flex flex-wrap gap-2">
              <div className="h-7 w-16 rounded-full bg-[color-mix(in_srgb,var(--border)_88%,var(--surface))]" />
            </div>
          </div>
        </div>
        <div className="mt-6 h-4 w-28 rounded bg-[color-mix(in_srgb,var(--border)_90%,var(--surface))]" />
      </div>
    </article>
  );
}

function ExploreEmptyIllustration() {
  return (
    <div
      className="mx-auto flex aspect-[4/3] w-full max-w-[14rem] items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--brand)_22%,var(--border))] bg-[color-mix(in_srgb,var(--brand)_8%,var(--surface))] p-6"
      aria-hidden
    >
      <svg viewBox="0 0 120 96" className="h-full w-full text-[color-mix(in_srgb,var(--brand)_55%,var(--text-tertiary))]" aria-hidden>
        <ellipse cx="60" cy="78" rx="44" ry="10" fill="currentColor" opacity="0.12" />
        <path
          d="M24 62c12-18 28-26 44-26s32 8 44 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.35"
        />
        <circle cx="42" cy="38" r="10" fill="currentColor" opacity="0.2" />
        <circle cx="78" cy="34" r="14" fill="currentColor" opacity="0.15" />
        <path
          d="M58 22 L68 42 L52 42 Z"
          fill="currentColor"
          opacity="0.25"
        />
      </svg>
    </div>
  );
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
  const enriched = enrichDiscoverableProfile(dabbler);
  const color = pinColorForCategory(enriched.primary_category as ExploreCategoryId);

  return (
    <article
      id={`explore-card-${dabbler.id}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-[var(--surface)] shadow-[0_12px_40px_-20px_rgba(42,61,44,0.15)] transition hover:border-[color-mix(in_srgb,var(--brand)_40%,var(--border))] ${
        highlighted
          ? "border-[var(--brand-border)] ring-2 ring-[color:rgba(109,133,112,0.35)]"
          : "border-[var(--border)]"
      } ${featured ? "lg:row-span-2 lg:justify-between" : ""}`}
    >
      <div className="relative h-[72px] shrink-0" style={{ backgroundColor: color }}>
        <div className="absolute -bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--brand)] shadow-sm">
          <span className="font-sans text-sm font-bold leading-none text-white">{nameInitials(name)}</span>
        </div>
      </div>

      <div className={`flex flex-1 flex-col px-6 pb-6 pt-9 ${featured ? "lg:pt-11" : ""}`}>
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-text)]">
            {place}
          </p>
          <h2 className="ui-heading mt-2 text-2xl text-[var(--text-primary)] md:text-3xl">{name}</h2>
          {handle ? <p className="mt-1 font-sans text-sm text-[var(--text-tertiary)]">{handle}</p> : null}
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

function ExplorePageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mapsEnabled = process.env.NEXT_PUBLIC_ENABLE_MAPS === "true";
  const mapsBrowserKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapSplitLayout = mapsEnabled && Boolean(mapsBrowserKey);

  const [profiles, setProfiles] = useState<DiscoverableProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [neighborhood, setNeighborhood] = useState("all");
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [mobileShowMap, setMobileShowMap] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const origin = parseOriginFromParams(searchParams);
  const hasOrigin = origin != null;
  const selectedCategories = parseCategoriesFromParams(searchParams);
  const distanceKm = parseDistanceKm(searchParams, hasOrigin);
  const teachingNow = parseTeachingNow(searchParams);

  const replaceParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(searchParams.toString());
      mutate(p);
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const toggleCategory = useCallback(
    (id: ExploreCategoryId) => {
      replaceParams((p) => {
        const current = new Set(p.get("cat")?.split(",").filter(Boolean) ?? []);
        if (current.has(id)) current.delete(id);
        else current.add(id);
        const ordered = EXPLORE_CATEGORY_IDS.filter((c) => current.has(c));
        if (ordered.length) p.set("cat", ordered.join(","));
        else p.delete("cat");
      });
    },
    [replaceParams],
  );

  const onDistanceKmChange = useCallback(
    (km: number) => {
      if (!hasOrigin) return;
      const clamped = Math.min(50, Math.max(1, Math.round(km)));
      replaceParams((p) => {
        p.set("km", String(clamped));
      });
    },
    [replaceParams, hasOrigin],
  );

  const onTeachingNowChange = useCallback(
    (v: boolean) => {
      replaceParams((p) => {
        if (v) p.set("now", "1");
        else p.delete("now");
      });
    },
    [replaceParams],
  );

  const onUseMyLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        replaceParams((p) => {
          p.set("olat", String(pos.coords.latitude));
          p.set("olng", String(pos.coords.longitude));
          const kmParsed = Number(p.get("km"));
          if (!Number.isFinite(kmParsed) || kmParsed < 1 || kmParsed > 50) {
            p.set("km", "50");
          }
        });
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
      },
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 12_000 },
    );
  }, [replaceParams]);

  const queryKey = searchParams.toString();
  const fetchKey = `${queryKey}::${reloadToken}`;

  useEffect(() => {
    if (!filterSheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilterSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filterSheetOpen]);

  useEffect(() => {
    if (!filterSheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [filterSheetOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setFilterSheetOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorStatus(null);
        const url = queryKey ? `/api/explore/discoverable?${queryKey}` : "/api/explore/discoverable";
        const response = await fetch(url, { cache: "no-store" });
        let body: { error?: string; profiles?: DiscoverableProfile[] } = {};
        try {
          body = (await response.json()) as typeof body;
        } catch {
          body = {};
        }
        if (cancelled) return;
        if (!response.ok) {
          setErrorStatus(response.status);
          const isServerError = response.status >= 500;
          setError(
            isServerError
              ? "The server had trouble finishing that request. Your filters stay as they are—try again in a moment."
              : body.error || "We could not load neighbors just then.",
          );
          setProfiles([]);
          setLoading(false);
          return;
        }
        setProfiles(body.profiles || []);
        setLoading(false);
      } catch {
        if (cancelled) return;
        setErrorStatus(0);
        setError("We could not reach the network. Check your connection, then try again.");
        setProfiles([]);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchKey, queryKey]);

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

  const urlFilterCount =
    selectedCategories.length + (teachingNow ? 1 : 0) + (hasOrigin ? 1 : 0);
  const activeUrlFilters = hasActiveUrlFilters(selectedCategories, teachingNow, hasOrigin);

  const filterBarProps = {
    selectedCategories,
    onToggleCategory: toggleCategory,
    distanceKm,
    onDistanceKmChange,
    teachingNow,
    onTeachingNowChange,
    hasOrigin,
    onUseMyLocation,
    locationLoading,
  };

  const listColumn = (
    <div className="space-y-6">
      {mapSplitLayout ? (
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <p className="font-sans text-sm text-[var(--text-secondary)]">
            {mobileShowMap ? "Map view" : "List view"}
          </p>
          {mobileShowMap ? (
            <Button type="button" variant="secondary" onClick={() => setMobileShowMap(false)}>
              Show list
            </Button>
          ) : (
            <Button type="button" onClick={() => setMobileShowMap(true)}>
              Show on map
            </Button>
          )}
        </div>
      ) : null}

      <div className="hidden md:block">
        <FilterBar {...filterBarProps} />
      </div>
      <div className="md:hidden">
        <Button
          type="button"
          variant="secondary"
          className="w-full justify-between gap-3"
          onClick={() => setFilterSheetOpen(true)}
        >
          <span>Filters</span>
          {urlFilterCount > 0 ? (
            <span className="inline-flex min-w-[1.35rem] justify-center rounded-full bg-[var(--brand)] px-2 py-0.5 font-sans text-xs font-bold text-white">
              {urlFilterCount}
            </span>
          ) : null}
        </Button>
        {filterSheetOpen ? (
          <div
            className="fixed inset-0 z-[60] flex flex-col justify-end md:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="explore-filter-sheet-title"
          >
            <button
              type="button"
              className="absolute inset-0 bg-[rgba(28,36,36,0.42)]"
              aria-label="Close filters"
              onClick={() => setFilterSheetOpen(false)}
            />
            <div className="relative mt-auto max-h-[min(88dvh,42rem)] w-full overflow-hidden rounded-t-2xl border border-b-0 border-[var(--border)] bg-[var(--surface)] shadow-[0_-16px_48px_-16px_rgba(42,61,44,0.22)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
                <h2 id="explore-filter-sheet-title" className="font-serif text-lg text-[var(--text-primary)]">
                  Filters
                </h2>
                <Button type="button" variant="secondary" onClick={() => setFilterSheetOpen(false)}>
                  Done
                </Button>
              </div>
              <div className="max-h-[calc(88dvh-5.5rem)] overflow-y-auto overscroll-contain px-5 pb-10 pt-5">
                <FilterBar {...filterBarProps} embedded />
              </div>
            </div>
          </div>
        ) : null}
      </div>

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
        {!loading && !error && profiles.length > 0 ? (
          <p className="mt-4 font-sans text-xs text-[var(--text-tertiary)]">
            Showing {filteredProfiles.length} of {profiles.length} profiles (URL filters apply server-side; search
            and neighborhood refine this page).
          </p>
        ) : null}
      </div>

      {loading ? (
        <div
          className={
            mapSplitLayout ? "flex flex-col gap-5" : "grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-3"
          }
        >
          <ExploreCardSkeleton />
          <ExploreCardSkeleton />
          <ExploreCardSkeleton />
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,var(--background))] p-8 md:p-10">
          <p className="font-serif text-xl text-[var(--text-primary)]">
            {errorStatus != null && errorStatus >= 500
              ? "Something paused on our side."
              : "This page couldn’t finish loading."}
          </p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[var(--text-secondary)]">{error}</p>
          <div className="mt-8">
            <Button type="button" onClick={() => setReloadToken((t) => t + 1)}>
              Retry
            </Button>
          </div>
        </div>
      ) : null}

      {!loading && !error && profiles.length === 0 && activeUrlFilters ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center md:px-10 md:py-12">
          <ExploreEmptyIllustration />
          <h2 className="ui-heading mt-8 text-2xl text-[var(--text-primary)] md:text-3xl">
            {serverFilteredEmptyHeadline(selectedCategories, teachingNow, hasOrigin)}
          </h2>
          <p className="mt-4 font-serif text-lg text-[var(--text-secondary)]">Be the first?</p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/profile/setup"
              className="inline-flex items-center justify-center rounded-lg border border-[var(--brand-border)] bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-hover)]"
            >
              Set up your profile
            </Link>
          </div>
        </div>
      ) : null}

      {!loading && !error && profiles.length === 0 && !activeUrlFilters ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center md:px-10 md:py-12">
          <ExploreEmptyIllustration />
          <h2 className="ui-heading mt-8 text-2xl text-[var(--text-primary)] md:text-3xl">No neighbors here yet</h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            Complete profile setup and turn on discoverability to appear on Explore—or be the first in your area to
            share a skill.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/profile/setup"
              className="inline-flex items-center justify-center rounded-lg border border-[var(--brand-border)] bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-hover)]"
            >
              Set up your profile
            </Link>
          </div>
        </div>
      ) : null}

      {!loading && !error && profiles.length > 0 && filteredProfiles.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center md:px-10 md:py-12">
          <ExploreEmptyIllustration />
          <h2 className="ui-heading mt-8 text-2xl text-[var(--text-primary)] md:text-3xl">Nothing matches here</h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            Try a different search, choose &quot;Everywhere&quot; for neighborhood, or loosen filters in the bar
            above.
          </p>
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
            Browse at your own pace. Each card is a small portrait — what someone shares, what they hope to learn, and
            where they are in the neighborhood.
          </p>
        </header>

        <MapAdapterShell
          enabled={mapsEnabled}
          points={profiles}
          mobileShowMap={mapSplitLayout ? mobileShowMap : false}
          onSelectProfile={(p) => {
            setHighlightId(p.id);
            setMobileShowMap(false);
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

function ExplorePageFallback() {
  return (
    <div className="py-16 md:py-20">
      <section className="ui-container space-y-10">
        <div className="max-w-3xl space-y-4">
          <div className="h-6 w-28 animate-pulse rounded bg-[var(--border)]" />
          <div className="h-11 w-full max-w-xl animate-pulse rounded-lg bg-[var(--border)]" />
          <div className="h-24 w-full max-w-2xl animate-pulse rounded-2xl bg-[var(--border)]" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <ExploreCardSkeleton />
          <ExploreCardSkeleton />
          <ExploreCardSkeleton />
        </div>
      </section>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExplorePageFallback />}>
      <ExplorePageInner />
    </Suspense>
  );
}
