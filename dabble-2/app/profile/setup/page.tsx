"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Tag, Textarea } from "@/app/components/ui";
import { getSupabaseClient } from "@/src/lib/supabaseClient";
import type { ProfileRecord } from "@/src/lib/profileTypes";
import { isProfileComplete, missingProfileFields } from "@/src/lib/profileCompletion";

const starterInterests = ["Cooking", "Home repair", "Cycling", "Gardening"];

export default function ProfileSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [offers, setOffers] = useState("");
  const [wants, setWants] = useState("");
  const [interestsIntro, setInterestsIntro] = useState("");
  const [skillsIntro, setSkillsIntro] = useState("");
  const [isDiscoverable, setIsDiscoverable] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    async function loadInitial() {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setMessage("Supabase public env vars are missing.");
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        router.replace("/dabble/signin");
        return;
      }

      setUserId(user.id);
      const metadataName = (user.user_metadata?.display_name as string) || "";
      setDisplayName(metadataName);

      const response = await fetch(`/api/profile/me?userId=${encodeURIComponent(user.id)}`, {
        cache: "no-store",
      });
      const body = await response.json();
      const profile = body.profile as ProfileRecord | null;

      if (profile) {
        setUsername(profile.username || "");
        setDisplayName(profile.display_name || metadataName);
        setLocationLabel(profile.location_label || "");
        setOffers((profile.skills || []).join(", "));
        setWants((profile.interests || []).join(", "));
        setInterestsIntro(profile.interests_intro || "");
        setSkillsIntro(profile.skills_intro || "");
        setIsDiscoverable(Boolean(profile.is_discoverable));
      }

      setLoading(false);
    }

    loadInitial();
  }, [router]);

  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) return;

    const localProfile: ProfileRecord = {
      id: userId,
      username: username.trim(),
      display_name: displayName.trim() || null,
      interests_intro: interestsIntro.trim() || null,
      skills_intro: skillsIntro.trim() || null,
      interests: wants
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
      skills: offers
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
      location_label: locationLabel.trim() || null,
      is_discoverable: isDiscoverable,
    };
    const missing = missingProfileFields(localProfile);
    setValidationErrors(missing);

    setSaving(true);
    setMessage(null);

    const response = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        displayName,
        username,
        locationLabel,
        interestsIntro,
        skillsIntro,
        isDiscoverable,
        skills: localProfile.skills,
        interests: localProfile.interests,
      }),
    });

    const body = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(body.error || "Unable to save profile.");
      return;
    }

    const nextUsername = body.profile?.username || username.trim();
    if (isProfileComplete(localProfile) && nextUsername) {
      router.push(`/profile/${nextUsername}`);
      return;
    }
    setMessage(
      `Saved. To complete your profile, add: ${missing.join(", ")}.`,
    );
  };

  if (loading) {
    return (
      <div className="py-16">
        <section className="ui-container max-w-3xl">
          <Card title="Profile setup">
            <p className="font-sans text-sm text-[var(--text-secondary)]">
              Loading your profile...
            </p>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="py-16">
      <section className="ui-container max-w-3xl space-y-6">
        <header className="space-y-2">
          <p className="ui-label">Profile setup</p>
          <h1 className="ui-heading text-4xl">Tell your neighbors about you</h1>
          <p className="font-sans text-sm text-[var(--text-secondary)]">
            Required to complete profile: display name, username, neighborhood, offers, wants.
          </p>
        </header>

        <form className="space-y-6" onSubmit={onSave}>
          <Card title="Basics">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="ui-label">Display name</span>
                <Input
                  placeholder="Your display name"
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
              <label className="block space-y-2 md:col-span-2">
                <span className="ui-label">Neighborhood</span>
                <Input
                  placeholder="Park Slope, Brooklyn"
                  value={locationLabel}
                  onChange={(e) => setLocationLabel(e.target.value)}
                  required
                />
              </label>
              <label className="block space-y-2 md:col-span-2">
                <span className="ui-label">Interests intro</span>
                <Textarea
                  placeholder="What are you curious about lately?"
                  value={interestsIntro}
                  onChange={(e) => setInterestsIntro(e.target.value)}
                  rows={3}
                />
              </label>
              <label className="block space-y-2 md:col-span-2">
                <span className="ui-label">Skills intro</span>
                <Textarea
                  placeholder="What do you enjoy helping neighbors with?"
                  value={skillsIntro}
                  onChange={(e) => setSkillsIntro(e.target.value)}
                  rows={3}
                />
              </label>
            </div>
          </Card>

          <Card title="Interests and skills">
            <p className="mb-3 text-sm text-[var(--text-secondary)]">
              Start with simple comma-separated lists. You can refine this in a
              richer editor later.
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {starterInterests.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="ui-label">What you can offer</span>
                <Input
                  placeholder="e.g. Sourdough, bike tune-ups"
                  value={offers}
                  onChange={(e) => setOffers(e.target.value)}
                />
              </label>
              <label className="block space-y-2">
                <span className="ui-label">What you want to learn</span>
                <Input
                  placeholder="e.g. Woodworking, gardening"
                  value={wants}
                  onChange={(e) => setWants(e.target.value)}
                />
              </label>
            </div>
          </Card>

          <Card title="Discoverability">
            <label className="flex items-start gap-3 font-sans text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[var(--brand)]"
                checked={isDiscoverable}
                onChange={(e) => setIsDiscoverable(e.target.checked)}
              />
              <span>
                Show my profile in Explore so nearby dabblers can find me.
                You can turn this off anytime.
              </span>
            </label>
          </Card>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              {validationErrors.length > 0 ? (
                <p className="font-sans text-sm text-red-600">
                  Missing: {validationErrors.join(", ")}
                </p>
              ) : null}
              {message ? (
                <p className="font-sans text-sm text-[var(--text-secondary)]">{message}</p>
              ) : null}
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
