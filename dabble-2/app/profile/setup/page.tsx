"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Tag } from "@/app/components/ui";
import { getSupabaseClient } from "@/src/lib/supabaseClient";
import type { ProfileRecord } from "@/src/lib/profileTypes";

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
      }

      setLoading(false);
    }

    loadInitial();
  }, [router]);

  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) return;

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
        skills: offers
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
        interests: wants
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
      }),
    });

    const body = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(body.error || "Unable to save profile.");
      return;
    }

    const nextUsername = body.profile?.username || username;
    router.push(`/profile/${nextUsername}`);
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

          <div className="flex items-center justify-between gap-4">
            {message ? (
              <p className="font-sans text-sm text-red-600">{message}</p>
            ) : (
              <span />
            )}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
