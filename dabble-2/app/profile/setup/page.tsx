"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Textarea } from "@/app/components/ui";
import { TagInput } from "@/app/components/TagInput";
import { getSupabaseClient } from "@/src/lib/supabaseClient";
import type { ProfileRecord } from "@/src/lib/profileTypes";
import { isProfileComplete, missingProfileFields } from "@/src/lib/profileCompletion";

const starterInterests = ["Cooking", "Home repair", "Cycling", "Gardening"];

const STEPS = [
  { id: 1, label: "Basics", description: "Name and place" },
  { id: 2, label: "Story & skills", description: "What you share and seek" },
  { id: 3, label: "Discoverability", description: "Who can find you" },
] as const;

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [interestTags, setInterestTags] = useState<string[]>([]);
  const [interestsIntro, setInterestsIntro] = useState("");
  const [skillsIntro, setSkillsIntro] = useState("");
  const [bio, setBio] = useState("");
  const [isDiscoverable, setIsDiscoverable] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const stepStatus = useMemo(() => {
    return STEPS.map((s) => ({
      ...s,
      current: s.id === step,
      done: s.id < step,
    }));
  }, [step]);

  const loadInitial = useCallback(async () => {
    setMessage(null);
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setMessage("Supabase public env vars are missing.");
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      const accessToken = sessionData.session?.access_token;
      if (!user) {
        router.replace("/dabble/signin");
        return;
      }

      setUserId(user.id);
      const metadataName = (user.user_metadata?.display_name as string) || "";
      setDisplayName(metadataName);

      if (!accessToken) {
        setMessage("Session token missing. Please sign in again.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/profile/me", {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const body = await response.json();
      if (!response.ok) {
        setMessage(body.error || "Unable to load your existing profile.");
        setLoading(false);
        return;
      }
      const profile = body.profile as ProfileRecord | null;

      if (profile) {
        setUsername(profile.username || "");
        setDisplayName(profile.display_name || metadataName);
        setLocationLabel(profile.location_label || "");
        setSkillTags(profile.skills || []);
        setInterestTags(profile.interests || []);
        setInterestsIntro(profile.interests_intro || "");
        setSkillsIntro(profile.skills_intro || "");
        setBio(profile.bio || "");
        setIsDiscoverable(Boolean(profile.is_discoverable));
      }

      setLoading(false);
    } catch {
      setMessage("Network error while loading profile data.");
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadInitial();
    }, 0);
    return () => clearTimeout(timeout);
  }, [loadInitial]);

  const persist = async (localProfile: ProfileRecord) => {
    if (!userId) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase public env vars are missing.");
      return false;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      setMessage("Session token missing. Please sign in again.");
      return false;
    }

    const response = await fetch("/api/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userId,
        displayName: localProfile.display_name ?? displayName,
        username: localProfile.username,
        locationLabel: localProfile.location_label,
        interestsIntro: localProfile.interests_intro,
        skillsIntro: localProfile.skills_intro,
        bio: localProfile.bio,
        isDiscoverable: localProfile.is_discoverable,
        skills: localProfile.skills,
        interests: localProfile.interests,
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      setMessage(body.error || "Unable to save profile.");
      return false;
    }
    const nextUsername = body.profile?.username || username.trim();
    if (body.profile?.username) {
      setUsername(body.profile.username);
    }
    if (isProfileComplete(localProfile) && nextUsername) {
      router.push(`/profile/${nextUsername}`);
      return true;
    }
    return true;
  };

  const buildLocalProfile = (): ProfileRecord => ({
    id: userId || "",
    username: username.trim(),
    display_name: displayName.trim() || null,
    bio: bio.trim() || null,
    interests_intro: interestsIntro.trim() || null,
    skills_intro: skillsIntro.trim() || null,
    interests: interestTags,
    skills: skillTags,
    location_label: locationLabel.trim() || null,
    is_discoverable: isDiscoverable,
  });

  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) return;

    const localProfile = buildLocalProfile();
    const missing = missingProfileFields(localProfile);
    setValidationErrors(missing);

    setSaving(true);
    setMessage(null);

    try {
      const ok = await persist(localProfile);
      setSaving(false);
      if (!ok) return;

      if (missing.length > 0) {
        setMessage(`Saved. To complete your profile, add: ${missing.join(", ")}.`);
      } else {
        setMessage("Profile saved.");
      }
    } catch {
      setSaving(false);
      setMessage("Network error while saving profile.");
    }
  };

  const goNext = async () => {
    if (!userId) return;
    setSaving(true);
    setMessage(null);
    try {
      const localProfile = buildLocalProfile();
      const ok = await persist(localProfile);
      setSaving(false);
      if (!ok) return;
      setStep((s) => Math.min(3, s + 1));
    } catch {
      setSaving(false);
      setMessage("Network error while saving.");
    }
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  if (loading) {
    return (
      <div className="py-16 md:py-20">
        <section className="ui-container max-w-3xl">
          <Card title="Profile setup">
            <p className="font-sans text-sm text-[var(--text-secondary)]">Loading your profile...</p>
            {message ? (
              <div className="mt-3">
                <p className="font-sans text-sm text-red-600">{message}</p>
                <div className="mt-2">
                  <Button variant="secondary" onClick={loadInitial}>
                    Retry
                  </Button>
                </div>
              </div>
            ) : null}
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24">
      <section className="ui-container max-w-3xl space-y-10">
        <header className="space-y-3">
          <p className="ui-label">Profile setup</p>
          <h1 className="ui-heading text-4xl md:text-5xl">Introduce yourself to the block</h1>
          <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)]">
            Three short steps — enough structure to feel welcoming, enough space to sound like you.
          </p>
        </header>

        <nav aria-label="Setup progress" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
          <ol className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
            {stepStatus.map((s) => (
              <li key={s.id} className="flex flex-1 gap-3 md:block">
                <div className="flex items-center gap-3 md:mb-2">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-sans text-sm font-semibold ${
                      s.done
                        ? "border-[var(--brand-border)] bg-[var(--brand)] text-white"
                        : s.current
                          ? "border-[var(--brand-border)] bg-white text-[var(--brand-text)]"
                          : "border-[var(--border)] bg-white/60 text-[var(--text-tertiary)]"
                    }`}
                  >
                    {s.done ? "✓" : s.id}
                  </span>
                  <span
                    className={`font-sans text-sm font-semibold md:hidden ${
                      s.current ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="font-sans text-sm font-semibold text-[var(--text-primary)]">{s.label}</p>
                  <p className="mt-1 font-sans text-xs text-[var(--text-tertiary)]">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <form className="space-y-8" onSubmit={onSave}>
          {step === 1 ? (
            <Card title="Basics" className="shadow-[0_16px_48px_-28px_rgba(42,61,44,0.12)]">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block space-y-2 md:col-span-2">
                  <span className="ui-label">Display name</span>
                  <Input
                    placeholder="How neighbors will greet you"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </label>
                <label className="block space-y-2">
                  <span className="ui-label">Username</span>
                  <Input
                    placeholder="your_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="ui-label">Neighborhood</span>
                  <Input
                    placeholder="Park Slope, Brooklyn"
                    value={locationLabel}
                    onChange={(e) => setLocationLabel(e.target.value)}
                    required
                  />
                </label>
              </div>
            </Card>
          ) : null}

          {step === 2 ? (
            <Card title="Story & skills" className="shadow-[0_16px_48px_-28px_rgba(42,61,44,0.12)]">
              <div className="space-y-6">
                <label className="block space-y-2">
                  <span className="ui-label">What you are curious about</span>
                  <Textarea
                    placeholder="A few sentences about what you would love to try with a neighbor..."
                    value={interestsIntro}
                    onChange={(e) => setInterestsIntro(e.target.value)}
                    rows={4}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="ui-label">What you enjoy sharing</span>
                  <Textarea
                    placeholder="What do you like teaching, showing, or doing alongside someone else?"
                    value={skillsIntro}
                    onChange={(e) => setSkillsIntro(e.target.value)}
                    rows={4}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="ui-label">Short bio (optional)</span>
                  <Textarea
                    placeholder="A line or two for your public profile — who you are on the block."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                  />
                </label>
                <div>
                  <p className="ui-label mb-2">Ideas to borrow</p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {starterInterests.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="rounded-full border border-dashed border-[var(--border)] px-3 py-1 font-sans text-xs text-[var(--text-secondary)] transition hover:border-[var(--brand)] hover:text-[var(--text-primary)]"
                        onClick={() => {
                          if (!interestTags.includes(item)) {
                            setInterestTags((t) => [...t, item]);
                          }
                        }}
                      >
                        + {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <TagInput
                    label="What you can offer"
                    description="Press Enter after each skill or hobby."
                    values={skillTags}
                    onChange={setSkillTags}
                    placeholder="e.g. Sourdough"
                  />
                  <TagInput
                    label="What you want to learn"
                    description="Small tags read best in Explore."
                    values={interestTags}
                    onChange={setInterestTags}
                    placeholder="e.g. Bike tune-ups"
                  />
                </div>
              </div>
            </Card>
          ) : null}

          {step === 3 ? (
            <Card title="Discoverability" className="shadow-[0_16px_48px_-28px_rgba(42,61,44,0.12)]">
              <label className="flex items-start gap-4 font-serif text-base leading-relaxed text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  className="mt-1.5 h-4 w-4 accent-[var(--brand)]"
                  checked={isDiscoverable}
                  onChange={(e) => setIsDiscoverable(e.target.checked)}
                />
                <span>
                  Let neighbors find me in Explore. You can turn this off anytime — your profile
                  stays yours.
                </span>
              </label>
            </Card>
          ) : null}

          <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              {validationErrors.length > 0 ? (
                <p className="font-sans text-sm text-red-600">Missing: {validationErrors.join(", ")}</p>
              ) : null}
              {message ? (
                <p className="font-sans text-sm text-[var(--text-secondary)]">{message}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              {step > 1 ? (
                <Button type="button" variant="secondary" onClick={goBack} disabled={saving}>
                  Back
                </Button>
              ) : null}
              {step < 3 ? (
                <Button type="button" onClick={goNext} disabled={saving}>
                  {saving ? "Saving..." : "Save & continue"}
                </Button>
              ) : (
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save profile"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
