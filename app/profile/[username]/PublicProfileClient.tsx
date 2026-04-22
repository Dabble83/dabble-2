"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Card, Tag } from "@/app/components/ui";
import { TestimonialCard } from "@/app/components/TestimonialCard";
import { getSupabaseClient } from "@/src/lib/supabaseClient";
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

function nameInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase() || "N";
}

/**
 * When exact location is off, show a single city / neighborhood line (first comma segment).
 * Viewing your own profile uses the full label so you can edit confidently.
 */
function publicLocationLine(
  profile: ProfileRecord | null,
  fallback: string,
  viewerIsOwner: boolean,
): string {
  const raw = profile?.location_label?.trim() || fallback;
  if (!raw) return "";
  if (viewerIsOwner || profile?.show_exact_location === true) return raw;
  const first = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)[0];
  return first ?? raw;
}

const placeholderTestimonials: { quote: string; footer: string }[] = [
  {
    quote: "“We are saving a spot here for kind words after real meetups — nothing performative, just honest.”",
    footer: "Placeholder · testimonials ship with Wave 6",
  },
  {
    quote: "“Dabble keeps the trail calm: short sessions, public first meets, room for beginners.”",
    footer: "Placeholder · trail-guide tone",
  },
];

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ownCreditBalance, setOwnCreditBalance] = useState<number | null>(null);
  const [viewerIsOwner, setViewerIsOwner] = useState(false);
  const [sessionSheetOpen, setSessionSheetOpen] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOwnCreditBalance(null);
    setViewerIsOwner(false);
    setAvatarBroken(false);
    try {
      const response = await fetch(
        `/api/profile/by-username?username=${encodeURIComponent(username)}`,
        { cache: "no-store" },
      );
      const body = await response.json();

      if (response.status === 404) {
        setProfile(null);
        setError(body.error || "This dabbler could not be found.");
        setLoading(false);
        return;
      }

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

  useEffect(() => {
    let cancelled = false;
    async function loadOwnCredits() {
      if (!profile?.id) {
        setOwnCreditBalance(null);
        return;
      }
      const supabase = getSupabaseClient();
      if (!supabase) {
        setOwnCreditBalance(null);
        return;
      }
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      const uid = data.session?.user?.id;
      if (!token || !uid || uid !== profile.id) {
        setOwnCreditBalance(null);
        setViewerIsOwner(false);
        return;
      }
      const response = await fetch("/api/profile/me", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json();
      if (cancelled) return;
      if (response.ok && body.profile) {
        const me = body.profile as ProfileRecord;
        setViewerIsOwner(true);
        setOwnCreditBalance(typeof me.credit_balance === "number" ? me.credit_balance : null);
        setProfile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            availability_note: me.availability_note ?? prev.availability_note,
            experience_note: me.experience_note ?? prev.experience_note,
            location_label: me.location_label ?? prev.location_label,
            show_exact_location: me.show_exact_location ?? prev.show_exact_location,
            avatar_url: me.avatar_url ?? prev.avatar_url,
            bio: me.bio ?? prev.bio,
            interests_intro: me.interests_intro ?? prev.interests_intro,
            skills_intro: me.skills_intro ?? prev.skills_intro,
            interests: me.interests ?? prev.interests,
            skills: me.skills ?? prev.skills,
            skills_offered: me.skills_offered ?? prev.skills_offered,
            skills_curious: me.skills_curious ?? prev.skills_curious,
          };
        });
      } else {
        setOwnCreditBalance(null);
        setViewerIsOwner(false);
      }
    }
    void loadOwnCredits();
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  const fallback = fallbackProfiles[username];
  const displayName = profile?.display_name || fallback?.name || "Neighbor";
  const teaches = profile?.skills_offered ?? profile?.skills ?? fallback?.offers ?? [];
  const curious = profile?.skills_curious ?? profile?.interests ?? fallback?.wants ?? [];
  const locationLine = publicLocationLine(profile, fallback?.neighborhood ?? "", viewerIsOwner);
  const experienceLine = profile?.experience_note?.trim() || null;
  const avatarUrl = profile?.avatar_url?.trim() || null;

  return (
    <div className="pb-16 md:pb-20">
      <header className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--brand)_10%,var(--surface))]">
        <div className="ui-container py-10 md:py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-[var(--border)] bg-[var(--surface)] shadow-sm">
              {avatarUrl && !avatarBroken ? (
                <Image
                  src={avatarUrl}
                  alt={`Profile photo of ${displayName}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                  onError={() => setAvatarBroken(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--brand-border)] font-sans text-2xl font-semibold text-white">
                  {nameInitials(displayName)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-text)]">
                {locationLine || "Area not set"}
              </p>
              <h1 className="ui-heading text-3xl text-[var(--text-primary)] md:text-4xl lg:text-5xl">
                {displayName}
              </h1>
              <p className="font-sans text-sm text-[var(--text-secondary)]">@{username}</p>
              {experienceLine ? (
                <p className="max-w-2xl font-serif text-base italic leading-relaxed text-[var(--text-secondary)] md:text-lg">
                  {experienceLine}
                </p>
              ) : (
                <p className="max-w-2xl font-serif text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
                  Curious, calm, and glad you stopped by — say what you would like to try together.
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="ui-container space-y-10 py-10 md:space-y-12 md:py-14">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Card title="Teaches" titleLevel={2}>
            <div className="flex flex-wrap gap-2">
              {teaches.length ? (
                teaches.map((tag) => <Tag key={tag}>{tag}</Tag>)
              ) : (
                <span className="font-sans text-sm text-[var(--text-tertiary)]">Nothing listed yet.</span>
              )}
            </div>
          </Card>
          <Card title="Curious about" titleLevel={2}>
            <div className="flex flex-wrap gap-2">
              {curious.length ? (
                curious.map((tag) => <Tag key={tag}>{tag}</Tag>)
              ) : (
                <span className="font-sans text-sm text-[var(--text-tertiary)]">Nothing listed yet.</span>
              )}
            </div>
          </Card>
        </div>

        {profile?.availability_note?.trim() ? (
          <Card title="Availability" titleLevel={2}>
            <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
              {profile.availability_note.trim()}
            </p>
          </Card>
        ) : null}

        <Card title="Testimonials" titleLevel={2}>
          <p className="mb-6 font-sans text-sm leading-relaxed text-[var(--text-secondary)]">
            After you swap a session, kind words can land here — for now, placeholders keep the space warm.
          </p>
          <ul className="grid gap-4 md:grid-cols-2">
            {placeholderTestimonials.map((t) => (
              <li key={t.footer}>
                <TestimonialCard quote={t.quote} footer={t.footer} />
              </li>
            ))}
          </ul>
        </Card>

        {profile?.bio ? (
          <Card title="About" titleLevel={2}>
            <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)]">{profile.bio}</p>
          </Card>
        ) : null}

        {(profile?.interests_intro || profile?.skills_intro) && (
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {profile?.interests_intro ? (
              <Card title="Curious in their own words" titleLevel={2}>
                <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
                  {profile.interests_intro}
                </p>
              </Card>
            ) : null}
            {profile?.skills_intro ? (
              <Card title="Happy to share" titleLevel={2}>
                <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
                  {profile.skills_intro}
                </p>
              </Card>
            ) : null}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="primary" onClick={() => setSessionSheetOpen(true)}>
            Propose a session
          </Button>
          {ownCreditBalance != null ? (
            <div className="flex items-center gap-2">
              <span className="ui-label">Your credits</span>
              <Tag>{ownCreditBalance} credits</Tag>
            </div>
          ) : null}
        </div>

        {loading ? <p className="font-sans text-sm text-[var(--text-secondary)]">Loading profile...</p> : null}
        {error ? (
          <Card>
            <p className="font-sans text-sm text-red-800">{error}</p>
            <div className="mt-4">
              <Button variant="secondary" type="button" onClick={loadProfile}>
                Retry
              </Button>
            </div>
          </Card>
        ) : null}
      </div>

      {sessionSheetOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={() => setSessionSheetOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-sheet-title"
            onClick={(e) => e.stopPropagation()}
          >
            <Card title="Sessions coming soon" titleId="session-sheet-title" titleLevel={2} className="max-w-md">
              <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
                Proposals and scheduling will arrive in Wave 6. Until then, say hello in person when paths cross, or
                keep your curiosity in the notes on your profile.
              </p>
              <div className="mt-6">
                <Button type="button" variant="secondary" onClick={() => setSessionSheetOpen(false)}>
                  Close
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
