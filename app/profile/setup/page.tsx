"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Textarea } from "@/app/components/ui";
import { TagInput } from "@/app/components/TagInput";
import { getSupabaseClient } from "@/src/lib/supabaseClient";
import type { ProfileRecord } from "@/src/lib/profileTypes";
import { isProfileComplete, missingProfileFields } from "@/src/lib/profileCompletion";

const EXPERIENCE_NOTE_MAX = 280;

const starterLearnIdeas = ["Cooking", "Home repair", "Cycling", "Gardening"];

const STEPS = [
  { id: 1, label: "Basics", description: "Name and place" },
  { id: 2, label: "Story & skills", description: "What you share and seek" },
  { id: 3, label: "Discoverability", description: "Who can find you" },
] as const;

type FormSnapshot = {
  displayName: string;
  username: string;
  locationLabel: string;
  teachTags: string[];
  learnTags: string[];
  interestsIntro: string;
  skillsIntro: string;
  bio: string;
  experienceNote: string;
  availabilityNote: string;
  isDiscoverable: boolean;
  showExactLocation: boolean;
  travelRadiusKm: number;
};

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [savePhase, setSavePhase] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [teachTags, setTeachTags] = useState<string[]>([]);
  const [learnTags, setLearnTags] = useState<string[]>([]);
  const [interestsIntro, setInterestsIntro] = useState("");
  const [skillsIntro, setSkillsIntro] = useState("");
  const [bio, setBio] = useState("");
  const [experienceNote, setExperienceNote] = useState("");
  const [availabilityNote, setAvailabilityNote] = useState("");
  const [isDiscoverable, setIsDiscoverable] = useState(false);
  const [showExactLocation, setShowExactLocation] = useState(false);
  const [travelRadiusKm, setTravelRadiusKm] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const stepStatus = useMemo(() => {
    return STEPS.map((s) => ({
      ...s,
      current: s.id === step,
      done: s.id < step,
    }));
  }, [step]);

  const completionFraction = useMemo(() => {
    let score = 0;
    if (displayName.trim() && username.trim()) score += 1;
    if (locationLabel.trim()) score += 1;
    if (teachTags.length > 0 && learnTags.length > 0) score += 1;
    return Math.round((score / 3) * 100);
  }, [displayName, username, locationLabel, teachTags, learnTags]);

  const captureForm = useCallback((): FormSnapshot => {
    return {
      displayName,
      username,
      locationLabel,
      teachTags: [...teachTags],
      learnTags: [...learnTags],
      interestsIntro,
      skillsIntro,
      bio,
      experienceNote,
      availabilityNote,
      isDiscoverable,
      showExactLocation,
      travelRadiusKm,
    };
  }, [
    displayName,
    username,
    locationLabel,
    teachTags,
    learnTags,
    interestsIntro,
    skillsIntro,
    bio,
    experienceNote,
    availabilityNote,
    isDiscoverable,
    showExactLocation,
    travelRadiusKm,
  ]);

  const restoreForm = useCallback((s: FormSnapshot) => {
    setDisplayName(s.displayName);
    setUsername(s.username);
    setLocationLabel(s.locationLabel);
    setTeachTags(s.teachTags);
    setLearnTags(s.learnTags);
    setInterestsIntro(s.interestsIntro);
    setSkillsIntro(s.skillsIntro);
    setBio(s.bio);
    setExperienceNote(s.experienceNote);
    setAvailabilityNote(s.availabilityNote);
    setIsDiscoverable(s.isDiscoverable);
    setShowExactLocation(s.showExactLocation);
    setTravelRadiusKm(s.travelRadiusKm);
  }, []);

  const clearSaveTimer = useCallback(() => {
    if (saveResetTimer.current) {
      clearTimeout(saveResetTimer.current);
      saveResetTimer.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearSaveTimer();
  }, [clearSaveTimer]);

  function buildLocalProfile(): ProfileRecord {
    return {
      id: userId || "",
      username: username.trim(),
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
      interests_intro: interestsIntro.trim() || null,
      skills_intro: skillsIntro.trim() || null,
      interests: learnTags,
      skills: teachTags,
      skills_offered: teachTags,
      skills_curious: learnTags,
      experience_note: experienceNote.slice(0, EXPERIENCE_NOTE_MAX).trim() || null,
      availability_note: availabilityNote.trim() || null,
      location_label: locationLabel.trim() || null,
      is_discoverable: isDiscoverable,
      show_exact_location: showExactLocation,
      travel_radius_km: travelRadiusKm,
    };
  }

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
        setTeachTags(profile.skills_offered ?? profile.skills ?? []);
        setLearnTags(profile.skills_curious ?? profile.interests ?? []);
        setInterestsIntro(profile.interests_intro || "");
        setSkillsIntro(profile.skills_intro || "");
        setBio(profile.bio || "");
        setExperienceNote(profile.experience_note?.slice(0, EXPERIENCE_NOTE_MAX) || "");
        setAvailabilityNote(profile.availability_note || "");
        setIsDiscoverable(Boolean(profile.is_discoverable));
        setShowExactLocation(profile.show_exact_location === true);
        const tr =
          typeof profile.travel_radius_km === "number" && Number.isFinite(profile.travel_radius_km)
            ? Math.min(50, Math.max(0, Math.round(profile.travel_radius_km)))
            : 0;
        setTravelRadiusKm(tr);
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

  const persist = async (localProfile: ProfileRecord): Promise<boolean | "redirect"> => {
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
        skillsOffered: localProfile.skills_offered ?? localProfile.skills,
        skillsCurious: localProfile.skills_curious ?? localProfile.interests,
        experienceNote: localProfile.experience_note,
        availabilityNote: localProfile.availability_note,
        showExactLocation: localProfile.show_exact_location,
        travelRadiusKm: localProfile.travel_radius_km,
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
      return "redirect";
    }
    return true;
  };

  const runSaveWithOptimism = async (opts: { advanceStep?: boolean }) => {
    if (!userId) return;
    const snap = captureForm();
    const localProfile = buildLocalProfile();
    const missing = missingProfileFields(localProfile);
    setValidationErrors(missing);

    clearSaveTimer();
    setSavePhase("saving");
    setSaving(true);
    setMessage(null);

    try {
      const result = await persist(localProfile);
      setSaving(false);
      if (result === false) {
        restoreForm(snap);
        setSavePhase("error");
        return;
      }
      if (result === "redirect") {
        setSavePhase("idle");
        return;
      }
      /** Optimistic-friendly: form state stayed authoritative; no refetch. Show synced briefly. */
      setSavePhase("saved");
      if (opts.advanceStep) {
        setStep((s) => Math.min(3, s + 1));
      } else if (missing.length > 0) {
        setMessage(`Saved. To complete your profile, add: ${missing.join(", ")}.`);
      } else {
        setMessage("Profile saved.");
      }
      saveResetTimer.current = setTimeout(() => {
        setSavePhase("idle");
        saveResetTimer.current = null;
      }, 2400);
    } catch {
      setSaving(false);
      restoreForm(snap);
      setSavePhase("error");
      setMessage("Network error while saving profile.");
    }
  };

  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runSaveWithOptimism({ advanceStep: false });
  };

  const goNext = async () => {
    await runSaveWithOptimism({ advanceStep: true });
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  if (loading) {
    return (
      <div className="py-16 md:py-20">
        <section className="ui-container max-w-3xl space-y-4">
          <h1 className="ui-heading text-3xl text-[var(--text-primary)] md:text-4xl">Profile setup</h1>
          <Card>
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
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="font-sans text-sm font-medium text-[var(--text-primary)]">
              Step {step} of {STEPS.length}
            </p>
            <p className="font-sans text-xs text-[var(--text-tertiary)]">
              About {completionFraction}% complete (basics, offers, and wants)
            </p>
          </div>
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
          <p className="mt-4 font-sans text-sm text-[var(--text-secondary)]" aria-live="polite">
            {savePhase === "saving" || saving
              ? "Saving your changes…"
              : savePhase === "saved"
                ? "All changes saved — you can keep editing."
                : savePhase === "error"
                  ? "That save did not stick. Fix any message above and try again."
                  : null}
          </p>
        </nav>

        <form className="space-y-8" onSubmit={onSave}>
          {step === 1 ? (
            <Card title="Basics" titleLevel={2} className="shadow-[0_16px_48px_-28px_rgba(42,61,44,0.12)]">
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
            <Card title="Story & skills" titleLevel={2} className="shadow-[0_16px_48px_-28px_rgba(42,61,44,0.12)]">
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
                <label className="block space-y-2">
                  <span className="ui-label">How you would describe your skill level</span>
                  <Textarea
                    placeholder="One line for your public profile — honest, humble, specific."
                    value={experienceNote}
                    onChange={(e) => setExperienceNote(e.target.value.slice(0, EXPERIENCE_NOTE_MAX))}
                    maxLength={EXPERIENCE_NOTE_MAX}
                    rows={2}
                  />
                  <span className="font-sans text-xs text-[var(--text-tertiary)]">
                    {experienceNote.length}/{EXPERIENCE_NOTE_MAX}
                  </span>
                </label>
                <label className="block space-y-2">
                  <span className="ui-label">When you are usually free</span>
                  <Textarea
                    placeholder="Weekday evenings, Saturday mornings, etc."
                    value={availabilityNote}
                    onChange={(e) => setAvailabilityNote(e.target.value)}
                    rows={3}
                  />
                </label>
                <div>
                  <p className="ui-label mb-2">Ideas to borrow</p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {starterLearnIdeas.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="rounded-full border border-dashed border-[var(--border)] px-3 py-1 font-sans text-xs text-[var(--text-secondary)] transition hover:border-[var(--brand)] hover:text-[var(--text-primary)]"
                        onClick={() => {
                          if (!learnTags.includes(item)) {
                            setLearnTags((t) => [...t, item]);
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
                    label="I can teach"
                    description="Press Enter after each skill or hobby."
                    values={teachTags}
                    onChange={setTeachTags}
                    placeholder="e.g. Sourdough"
                  />
                  <TagInput
                    label="I'd love to learn"
                    description="Small tags read best in Explore."
                    values={learnTags}
                    onChange={setLearnTags}
                    placeholder="e.g. Bike tune-ups"
                  />
                </div>
              </div>
            </Card>
          ) : null}

          {step === 3 ? (
            <Card title="Discoverability" titleLevel={2} className="shadow-[0_16px_48px_-28px_rgba(42,61,44,0.12)]">
              <div className="space-y-6">
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
                <label className="flex items-start gap-4 font-serif text-base leading-relaxed text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    className="mt-1.5 h-4 w-4 accent-[var(--brand)]"
                    checked={showExactLocation}
                    onChange={(e) => setShowExactLocation(e.target.checked)}
                  />
                  <span>
                    Show my precise pin on the map when Explore has maps on. If you leave this off,
                    only your neighborhood label travels with your profile.
                  </span>
                </label>
                <div className="space-y-2">
                  <label htmlFor="travel-radius" className="ui-label">
                    How far you will meet (0–50 km)
                  </label>
                  <input
                    id="travel-radius"
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={travelRadiusKm}
                    onChange={(e) => setTravelRadiusKm(Number(e.target.value))}
                    className="w-full accent-[var(--brand)]"
                  />
                  <p className="font-sans text-xs text-[var(--text-tertiary)]">
                    {travelRadiusKm === 0 ? "No extra travel beyond your area label." : `About ${travelRadiusKm} km.`}
                  </p>
                </div>
              </div>
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
