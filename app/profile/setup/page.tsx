"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Textarea } from "@/app/components/ui";
import { TagInput } from "@/app/components/TagInput";
import { getSupabaseClient } from "@/src/lib/supabaseClient";
import type { ProfileRecord } from "@/src/lib/profileTypes";
import { isProfileComplete, missingProfileFields } from "@/src/lib/profileCompletion";

const EXPERIENCE_NOTE_MAX = 280;
const TRAVEL_PLANS_MAX = 500;

const starterLearnIdeas = ["Cooking", "Home repair", "Cycling", "Gardening", "Photography", "Music"];
const starterTeachIdeas = ["Yoga", "Baking", "Woodworking", "Drawing", "Language", "Hiking"];

function nameInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase() || "N";
}

function ProfileSetupAvatarPreview({
  displayName,
  avatarUrl,
  localPreviewUrl,
}: {
  displayName: string;
  avatarUrl: string;
  localPreviewUrl: string | null;
}) {
  const [storedBroken, setStoredBroken] = useState(false);
  const showImage = Boolean(localPreviewUrl || (avatarUrl.trim() !== "" && !storedBroken));

  return (
    <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full border-2 border-[var(--border)] bg-[var(--surface)] shadow-sm">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={localPreviewUrl || avatarUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={() => {
            if (!localPreviewUrl) setStoredBroken(true);
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[var(--brand-border)] font-sans text-4xl font-semibold text-white">
          {nameInitials(displayName || "Dabbler")}
        </div>
      )}
    </div>
  );
}

/**
 * Step order (5 steps):
 *  1. Skills & interests (tag selection — moved to first)
 *  2. Basics (name, username, neighborhood)
 *  3. Story & details (intros, bio, experience, availability)
 *  4. Travel plans (new step)
 *  5. Discoverability (location sharing, radius)
 *
 * Avatar upload is surfaced in step 2 (basics) to keep it close to identity.
 */
const STEPS = [
  { id: 1, label: "Skills & interests", description: "What you share and seek" },
  { id: 2, label: "Basics", description: "Name, photo, and place" },
  { id: 3, label: "Your story", description: "How you describe yourself" },
  { id: 4, label: "Travel plans", description: "Where you're headed next" },
  { id: 5, label: "Discoverability", description: "Who can find you" },
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
  travelPlans: string;
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

  // Form fields
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
  const [travelPlans, setTravelPlans] = useState("");
  const [isDiscoverable, setIsDiscoverable] = useState(false);
  const [showExactLocation, setShowExactLocation] = useState(false);
  const [travelRadiusKm, setTravelRadiusKm] = useState(0);

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const avatarLocalPreviewUrl = useMemo(() => {
    if (!avatarFile) return null;
    return URL.createObjectURL(avatarFile);
  }, [avatarFile]);

  useEffect(() => {
    return () => {
      if (avatarLocalPreviewUrl) URL.revokeObjectURL(avatarLocalPreviewUrl);
    };
  }, [avatarLocalPreviewUrl]);

  const stepStatus = useMemo(() => {
    return STEPS.map((s) => ({
      ...s,
      current: s.id === step,
      done: s.id < step,
    }));
  }, [step]);

  const completionFraction = useMemo(() => {
    let score = 0;
    if (teachTags.length > 0) score += 1;
    if (learnTags.length > 0) score += 1;
    if (displayName.trim() && username.trim()) score += 1;
    if (locationLabel.trim()) score += 1;
    return Math.round((score / 4) * 100);
  }, [displayName, username, locationLabel, teachTags, learnTags]);

  const captureForm = useCallback((): FormSnapshot => ({
    displayName, username, locationLabel, teachTags: [...teachTags], learnTags: [...learnTags],
    interestsIntro, skillsIntro, bio, experienceNote, availabilityNote, travelPlans,
    isDiscoverable, showExactLocation, travelRadiusKm,
  }), [displayName, username, locationLabel, teachTags, learnTags, interestsIntro, skillsIntro, bio, experienceNote, availabilityNote, travelPlans, isDiscoverable, showExactLocation, travelRadiusKm]);

  const restoreForm = useCallback((s: FormSnapshot) => {
    setDisplayName(s.displayName); setUsername(s.username); setLocationLabel(s.locationLabel);
    setTeachTags(s.teachTags); setLearnTags(s.learnTags); setInterestsIntro(s.interestsIntro);
    setSkillsIntro(s.skillsIntro); setBio(s.bio); setExperienceNote(s.experienceNote);
    setAvailabilityNote(s.availabilityNote); setTravelPlans(s.travelPlans);
    setIsDiscoverable(s.isDiscoverable); setShowExactLocation(s.showExactLocation);
    setTravelRadiusKm(s.travelRadiusKm);
  }, []);

  const clearSaveTimer = useCallback(() => {
    if (saveResetTimer.current) { clearTimeout(saveResetTimer.current); saveResetTimer.current = null; }
  }, []);

  useEffect(() => { return () => clearSaveTimer(); }, [clearSaveTimer]);

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
      travel_plans: travelPlans.slice(0, TRAVEL_PLANS_MAX).trim() || null,
      avatar_url: avatarUrl.trim() ? avatarUrl.trim() : null,
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
      if (!supabase) { setMessage("Supabase public env vars are missing."); setLoading(false); return; }
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      const accessToken = sessionData.session?.access_token;
      if (!user) { router.replace("/dabble/signin"); return; }
      setUserId(user.id);
      const metadataName = (user.user_metadata?.display_name as string) || "";
      setDisplayName(metadataName);
      if (!accessToken) { setMessage("Session token missing. Please sign in again."); setLoading(false); return; }
      const response = await fetch("/api/profile/me", { cache: "no-store", headers: { Authorization: `Bearer ${accessToken}` } });
      const body = await response.json();
      if (!response.ok) { setMessage(body.error || "Unable to load your existing profile."); setLoading(false); return; }
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
        setTravelPlans(profile.travel_plans?.slice(0, TRAVEL_PLANS_MAX) || "");
        setIsDiscoverable(Boolean(profile.is_discoverable));
        setShowExactLocation(profile.show_exact_location === true);
        const tr = typeof profile.travel_radius_km === "number" && Number.isFinite(profile.travel_radius_km)
          ? Math.min(50, Math.max(0, Math.round(profile.travel_radius_km))) : 0;
        setTravelRadiusKm(tr);
        setAvatarUrl(profile.avatar_url?.trim() || "");
      }
      setLoading(false);
    } catch { setMessage("Network error while loading profile data."); setLoading(false); }
  }, [router]);

  useEffect(() => {
    const timeout = setTimeout(() => { void loadInitial(); }, 0);
    return () => clearTimeout(timeout);
  }, [loadInitial]);

  const persist = async (localProfile: ProfileRecord): Promise<boolean | "redirect"> => {
    if (!userId) return false;
    const supabase = getSupabaseClient();
    if (!supabase) { setMessage("Supabase public env vars are missing."); return false; }
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) { setMessage("Session token missing. Please sign in again."); return false; }

    const response = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
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
        travelPlans: localProfile.travel_plans,
        showExactLocation: localProfile.show_exact_location,
        travelRadiusKm: localProfile.travel_radius_km,
      }),
    });

    const body = await response.json();
    if (!response.ok) { setMessage(body.error || "Unable to save profile."); return false; }
    const nextUsername = body.profile?.username || username.trim();
    if (body.profile?.username) setUsername(body.profile.username);
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
      if (result === false) { restoreForm(snap); setSavePhase("error"); return; }
      if (result === "redirect") { setSavePhase("idle"); return; }
      setSavePhase("saved");
      if (opts.advanceStep) {
        setStep((s) => Math.min(STEPS.length, s + 1));
      } else if (missing.length > 0) {
        setMessage(`Saved. To complete your profile, add: ${missing.join(", ")}.`);
      } else {
        setMessage("Profile saved.");
      }
      saveResetTimer.current = setTimeout(() => { setSavePhase("idle"); saveResetTimer.current = null; }, 2400);
    } catch {
      setSaving(false); restoreForm(snap); setSavePhase("error");
      setMessage("Network error while saving profile.");
    }
  };

  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runSaveWithOptimism({ advanceStep: false });
  };

  const goNext = async () => {
    // Step 1 (skills/interests): save and advance without requiring basics
    if (step === 1) {
      await runSaveWithOptimism({ advanceStep: true });
      return;
    }
    await runSaveWithOptimism({ advanceStep: true });
  };

  const uploadAvatarFromPicker = async () => {
    if (!avatarFile || !userId) return;
    const supabase = getSupabaseClient();
    if (!supabase) { setMessage("Supabase public env vars are missing."); return; }
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) { setMessage("Session token missing. Please sign in again."); return; }
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    clearSaveTimer();
    setAvatarUploading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const body = (await response.json()) as { avatarUrl?: string; error?: string; details?: string };
      setAvatarUploading(false);
      if (!response.ok) {
        const line = body.details ? `${body.error ?? "Upload failed"}: ${body.details}` : body.error;
        setMessage(line || "Upload failed."); return;
      }
      if (body.avatarUrl) setAvatarUrl(body.avatarUrl);
      setAvatarFile(null);
      setMessage("Photo saved.");
      saveResetTimer.current = setTimeout(() => { setMessage(null); saveResetTimer.current = null; }, 2400);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    } catch { setAvatarUploading(false); setMessage("Network error while uploading."); }
  };

  const onAvatarFileChosen = (f: File | null) => {
    setMessage(null);
    if (!f) { setAvatarFile(null); return; }
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type.toLowerCase())) {
      setMessage("Please choose JPG, PNG, WebP, or GIF.");
      if (avatarInputRef.current) avatarInputRef.current.value = "";
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setMessage("That file is larger than 5 MB. Try another image.");
      if (avatarInputRef.current) avatarInputRef.current.value = "";
      return;
    }
    setAvatarFile(f);
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
                <div className="mt-2"><Button variant="secondary" onClick={loadInitial}>Retry</Button></div>
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
          <h1 className="ui-heading text-4xl md:text-5xl">Introduce yourself to the swap</h1>
          <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)]">
            Five quick steps — start with what you love, then fill in the details.
          </p>
        </header>

        {/* Progress nav */}
        <nav aria-label="Setup progress" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="font-sans text-sm font-medium text-[var(--text-primary)]">
              Step {step} of {STEPS.length}
            </p>
            <p className="font-sans text-xs text-[var(--text-tertiary)]">
              About {completionFraction}% complete
            </p>
          </div>
          <ol className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-3">
            {stepStatus.map((s) => (
              <li key={s.id} className="flex flex-1 gap-3 md:block">
                <div className="flex items-center gap-3 md:mb-2">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-sans text-sm font-semibold ${
                    s.done ? "border-[var(--brand-border)] bg-[var(--brand)] text-white"
                    : s.current ? "border-[var(--brand-border)] bg-white text-[var(--brand-text)]"
                    : "border-[var(--border)] bg-white/60 text-[var(--text-tertiary)]"}`}>
                    {s.done ? "✓" : s.id}
                  </span>
                  <span className={`font-sans text-sm font-semibold md:hidden ${s.current ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                    {s.label}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="font-sans text-xs font-semibold text-[var(--text-primary)]">{s.label}</p>
                  <p className="mt-0.5 font-sans text-xs text-[var(--text-tertiary)]">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 font-sans text-sm text-[var(--text-secondary)]" aria-live="polite">
            {savePhase === "saving" || saving ? "Saving your changes…"
              : savePhase === "saved" ? "All changes saved — you can keep editing."
              : savePhase === "error" ? "That save did not stick. Fix any message above and try again."
              : null}
          </p>
        </nav>

        <form className="space-y-8" onSubmit={onSave}>

          {/* ── Step 1: Skills & interests (tag selection first) ── */}
          {step === 1 ? (
            <Card title="What you share and seek" titleLevel={2} className="shadow-[0_16px_48px_-28px_rgba(42,61,44,0.12)]">
              <div className="space-y-8">
                <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
                  Pick a few keywords for what you can teach and what you&apos;d love to learn. You can always add
                  more later — even two tags on each side is enough to get started.
                </p>

                {/* Quick idea chips */}
                <div>
                  <p className="ui-label mb-3">Quick ideas to borrow</p>
                  <div className="flex flex-wrap gap-2">
                    {starterTeachIdeas.map((item) => (
                      <button key={item} type="button"
                        className="rounded-full border border-dashed border-[var(--border)] px-3 py-1 font-sans text-xs text-[var(--text-secondary)] transition hover:border-[var(--brand)] hover:text-[var(--text-primary)]"
                        onClick={() => { if (!teachTags.includes(item)) setTeachTags((t) => [...t, item]); }}>
                        + {item} (teach)
                      </button>
                    ))}
                    {starterLearnIdeas.map((item) => (
                      <button key={item} type="button"
                        className="rounded-full border border-dashed border-[var(--border)] px-3 py-1 font-sans text-xs text-[var(--text-secondary)] transition hover:border-[var(--brand-text)] hover:text-[var(--text-primary)]"
                        onClick={() => { if (!learnTags.includes(item)) setLearnTags((t) => [...t, item]); }}>
                        + {item} (learn)
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
                    label="I&apos;d love to learn"
                    description="Small tags read best in Explore."
                    values={learnTags}
                    onChange={setLearnTags}
                    placeholder="e.g. Bike tune-ups"
                  />
                </div>

                <div className="rounded-xl border border-dashed border-[var(--border)] p-4">
                  <p className="font-sans text-xs text-[var(--text-tertiary)]">
                    💡 You&apos;ll have a chance to describe your skills and story in more detail in Step 3.
                    These tags just help others find you on the map.
                  </p>
                </div>
              </div>
            </Card>
          ) : null}

          {/* ── Step 2: Basics (name, photo, neighborhood) ── */}
          {step === 2 ? (
            <div className="space-y-6">
              <Card title="Your identity" titleLevel={2} className="shadow-[0_16px_48px_-28px_rgba(42,61,44,0.12)]">
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block space-y-2 md:col-span-2">
                    <span className="ui-label">Display name</span>
                    <Input
                      placeholder="How other Dabblers will know you"
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
                      placeholder="Park Slope, Hudson Valley, Northeast Portland…"
                      value={locationLabel}
                      onChange={(e) => setLocationLabel(e.target.value)}
                      required
                    />
                    <p className="font-sans text-xs text-[var(--text-tertiary)]">
                      This is what shows on Explore — be as specific or general as you like.
                    </p>
                  </label>
                </div>
              </Card>

              <Card title="Profile photo (optional)" titleLevel={2} className="shadow-[0_16px_48px_-28px_rgba(42,61,44,0.12)]">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="mx-auto shrink-0 sm:mx-0">
                    <ProfileSetupAvatarPreview
                      key={`${avatarUrl}|${avatarLocalPreviewUrl ?? ""}`}
                      displayName={displayName}
                      avatarUrl={avatarUrl}
                      localPreviewUrl={avatarLocalPreviewUrl}
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
                      A face makes Explore feel warmer. You can always change this later.
                    </p>
                    <input
                      ref={avatarInputRef}
                      id="avatar-file-input"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => onAvatarFileChosen(e.target.files?.[0] ?? null)}
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <label htmlFor="avatar-file-input">
                        <span className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[var(--brand-border)] bg-white px-4 py-2.5 font-sans text-sm font-semibold text-[var(--text-primary)] shadow-sm transition hover:bg-[color-mix(in_srgb,var(--surface)_92%,var(--background))]">
                          Choose photo
                        </span>
                      </label>
                      <Button type="button" onClick={() => void uploadAvatarFromPicker()} disabled={!avatarFile || avatarUploading}>
                        {avatarUploading ? "Uploading…" : "Upload"}
                      </Button>
                    </div>
                    <p className="font-sans text-xs text-[var(--text-tertiary)]">JPG, PNG or WebP · max 5 MB</p>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}

          {/* ── Step 3: Story & details ── */}
          {step === 3 ? (
            <Card title="Your story" titleLevel={2} className="shadow-[0_16px_48px_-28px_rgba(42,61,44,0.12)]">
              <div className="space-y-6">
                <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
                  Now add a little color. These longer descriptions appear on your public profile and help
                  people know what a session with you would actually feel like.
                </p>
                <label className="block space-y-2">
                  <span className="ui-label">What you enjoy sharing</span>
                  <Textarea
                    placeholder="What do you enjoy teaching, showing, or doing alongside someone else? How did you get into it?"
                    value={skillsIntro}
                    onChange={(e) => setSkillsIntro(e.target.value)}
                    rows={4}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="ui-label">What you are curious about</span>
                  <Textarea
                    placeholder="A few sentences about what you'd love to try with another Dabbler — kayaking, baking, repair, music, anything."
                    value={interestsIntro}
                    onChange={(e) => setInterestsIntro(e.target.value)}
                    rows={4}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="ui-label">Short bio (optional)</span>
                  <Textarea
                    placeholder="A line or two for your public profile — who you are as a Dabbler."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="ui-label">Your skill level</span>
                  <Textarea
                    placeholder="One line — honest, humble, specific. e.g. 'Self-taught for 3 years, mostly weekends.'"
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
                    rows={2}
                  />
                </label>
              </div>
            </Card>
          ) : null}

          {/* ── Step 4: Travel plans (new) ── */}
          {step === 4 ? (
            <Card title="Your travel plans" titleLevel={2} className="shadow-[0_16px_48px_-28px_rgba(42,61,44,0.12)]">
              <div className="space-y-6">
                <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
                  Dabble is for neighbors <em>and</em> travelers. If you're heading somewhere new, tell people
                  where you're going and what you hope to try — it's a great way to connect before you arrive.
                </p>

                <label className="block space-y-2">
                  <span className="ui-label">Where are you headed next? What do you want to try?</span>
                  <Textarea
                    placeholder={`Share your upcoming travel plans and what experiences you're hoping to have. For example:
• Visiting Portland in July — hoping to try sea kayaking for the first time.
• Moving to Austin in the fall — want to find someone to learn Texas BBQ from.
• Traveling through Japan — want to try a pottery class in Kyoto.
• No trips planned, but I'd love to get better at my neighborhood walks this season.`}
                    value={travelPlans}
                    onChange={(e) => setTravelPlans(e.target.value.slice(0, TRAVEL_PLANS_MAX))}
                    maxLength={TRAVEL_PLANS_MAX}
                    rows={7}
                  />
                  <div className="flex justify-between">
                    <span className="font-sans text-xs text-[var(--text-tertiary)]">
                      This shows on your public profile. Update it whenever your plans change.
                    </span>
                    <span className="font-sans text-xs text-[var(--text-tertiary)]">
                      {travelPlans.length}/{TRAVEL_PLANS_MAX}
                    </span>
                  </div>
                </label>

                <div className="rounded-xl border border-[color-mix(in_srgb,var(--brand)_25%,var(--border))] bg-[color-mix(in_srgb,var(--brand)_6%,var(--surface))] p-4">
                  <p className="font-sans text-sm font-semibold text-[var(--brand-text)]">
                    Dabble&apos;s travel feature
                  </p>
                  <p className="mt-1 font-sans text-xs leading-relaxed text-[var(--text-secondary)]">
                    When you enable location sharing in the next step, your map pin moves with your neighborhood
                    label — so Dabblers at your destination can find you in Explore before you arrive.
                    This field is optional: skip it if you have no trips planned.
                  </p>
                </div>
              </div>
            </Card>
          ) : null}

          {/* ── Step 5: Discoverability ── */}
          {step === 5 ? (
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
                    Let other Dabblers find me on Explore. You can turn this off any time — your
                    profile stays yours.
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
                    Show my precise pin on the map. If you leave this off, only your neighborhood
                    label travels with your profile.
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

          {/* Footer nav */}
          <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              {validationErrors.length > 0 ? (
                <p className="font-sans text-sm text-red-600">Missing: {validationErrors.join(", ")}</p>
              ) : null}
              {message ? <p className="font-sans text-sm text-[var(--text-secondary)]">{message}</p> : null}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              {step > 1 ? (
                <Button type="button" variant="secondary" onClick={goBack} disabled={saving}>Back</Button>
              ) : null}
              {step === 4 ? (
                <Button type="button" variant="secondary" onClick={() => setStep(5)} disabled={saving}>
                  Skip (no trips planned)
                </Button>
              ) : null}
              {step < STEPS.length ? (
                <Button type="button" onClick={() => void goNext()} disabled={saving || avatarUploading}>
                  {saving ? "Saving..." : step === 1 ? "Next: basics →" : "Save & continue"}
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
