"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthShell } from "@/app/components/AuthShell";
import { Button, Card, Input } from "@/app/components/ui";
import { getSupabaseClient } from "@/src/lib/supabaseClient";
import { useAuthSession } from "@/src/hooks/useAuthSession";
import { ONBOARDING_CATEGORY_GROUPS, tagLabelForSubtopic } from "@/src/lib/onboardingQuiz";

type Phase = "form" | "quiz" | "welcome";

const QUIZ_STEPS = ["Curious about", "Can teach", "Where you’re based"] as const;

export default function SignUpPage() {
  const router = useRouter();
  const { session, loading } = useAuthSession();
  const [phase, setPhase] = useState<Phase>("form");
  const [quizStep, setQuizStep] = useState(0);
  const [bearerToken, setBearerToken] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [curious, setCurious] = useState<Set<string>>(() => new Set());
  const [teach, setTeach] = useState<Set<string>>(() => new Set());
  const [locationLabel, setLocationLabel] = useState("");
  const [approxLat, setApproxLat] = useState<number | null>(null);
  const [approxLng, setApproxLng] = useState<number | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const authHeader = useMemo(() => {
    const t = bearerToken ?? session?.access_token;
    if (!t) return null;
    return { Authorization: `Bearer ${t}`, "Content-Type": "application/json" };
  }, [bearerToken, session?.access_token]);

  useEffect(() => {
    if (loading) return;
    if (session && phase === "form" && !bearerToken) {
      router.replace("/profile");
    }
  }, [loading, session, phase, bearerToken, router]);

  const toggleTag = useCallback((set: Set<string>, updater: (s: Set<string>) => void, tag: string) => {
    const next = new Set(set);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    updater(next);
  }, []);

  const onUseApproxLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setMessage("Location isn’t available in this browser.");
      return;
    }
    setGeoLoading(true);
    setMessage(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setApproxLat(pos.coords.latitude);
        setApproxLng(pos.coords.longitude);
        setGeoLoading(false);
      },
      () => {
        setMessage("Could not read your location. You can still type a city or neighborhood below.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, maximumAge: 120_000, timeout: 12_000 },
    );
  }, []);

  const saveOnboardingProfile = useCallback(async () => {
    const headers = authHeader;
    if (!headers) {
      setMessage("Session expired. Please sign in again.");
      return false;
    }
    if (!locationLabel.trim() && (approxLat == null || approxLng == null)) {
      setMessage("Add a city or neighborhood, or drop an approximate pin.");
      return false;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers,
        body: JSON.stringify({
          displayName: displayName.trim() || undefined,
          skillsCurious: [...curious],
          skillsOffered: [...teach],
          locationLabel: locationLabel.trim() || null,
          lat: approxLat,
          lng: approxLng,
          showExactLocation: false,
          isDiscoverable: false,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setMessage(body.error || "Could not save your profile.");
        setSubmitting(false);
        return false;
      }
      setSubmitting(false);
      return true;
    } catch {
      setMessage("Network error while saving.");
      setSubmitting(false);
      return false;
    }
  }, [authHeader, approxLat, approxLng, curious, displayName, locationLabel, teach]);

  const goWelcome = useCallback(() => {
    setPhase("welcome");
    setQuizStep(0);
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase public env vars are missing.");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      setSubmitting(false);
      setMessage(error.message);
      return;
    }

    if (data.user?.id && data.session?.access_token) {
      setBearerToken(data.session.access_token);
      setPhase("quiz");
      setQuizStep(0);

      const profileResponse = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({
          displayName,
        }),
      });

      if (!profileResponse.ok) {
        const profileBody = await profileResponse.json();
        setSubmitting(false);
        setMessage(profileBody.error || "Account created, but profile setup failed. You can continue or sign in later.");
        return;
      }
    }

    setSubmitting(false);
    const hasSession = Boolean(data.session);
    if (hasSession) {
      return;
    }

    setMessage("Account created. Check your email to confirm, then sign in.");
    router.push("/dabble/signin");
  };

  const skipQuiz = () => {
    goWelcome();
  };

  const nextQuizStep = async () => {
    if (quizStep < 2) {
      setQuizStep((s) => s + 1);
      setMessage(null);
      return;
    }
    const ok = await saveOnboardingProfile();
    if (ok) goWelcome();
  };

  const backQuizStep = () => {
    setQuizStep((s) => Math.max(0, s - 1));
    setMessage(null);
  };

  if (phase === "welcome") {
    return (
      <AuthShell>
        <div className="w-full max-w-md">
          <Card className="border-[var(--border)] shadow-[0_28px_80px_-40px_rgba(42,61,44,0.25)]">
            <h1 className="ui-heading text-3xl">You&apos;re in</h1>
            <p className="mt-4 font-serif text-lg leading-relaxed text-[var(--text-secondary)]">
              You&apos;ve got 3 credits to start — here&apos;s how Dabble works
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/how-it-works"
                className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--brand-border)] bg-[var(--brand)] px-5 py-3 text-center font-sans text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-hover)]"
              >
                How Dabble works
              </Link>
              <Button type="button" variant="secondary" className="w-full py-3" onClick={() => router.push("/profile/setup")}>
                Finish my profile
              </Button>
            </div>
            <p className="mt-6 text-center font-sans text-sm text-[var(--text-tertiary)]">
              <Link href="/explore" className="font-medium text-[var(--brand-text)] underline-offset-4 hover:underline">
                Browse Explore
              </Link>
            </p>
          </Card>
        </div>
      </AuthShell>
    );
  }

  if (phase === "quiz") {
    return (
      <AuthShell>
        <div className="w-full max-w-lg">
          <Card className="border-[var(--border)] shadow-[0_28px_80px_-40px_rgba(42,61,44,0.25)]">
            <div className="mb-2 flex items-start justify-between gap-4">
              <div>
                <p className="ui-label">Step {quizStep + 1} of 3</p>
                <h1 className="ui-heading mt-1 text-2xl md:text-3xl">{QUIZ_STEPS[quizStep]}</h1>
              </div>
              <button
                type="button"
                onClick={skipQuiz}
                className="shrink-0 font-sans text-sm font-medium text-[var(--brand-text)] underline-offset-4 hover:underline"
              >
                Skip for now
              </button>
            </div>
            <p className="mb-6 font-sans text-sm text-[var(--text-tertiary)]">
              {quizStep === 0
                ? "Pick anything that sparks you — tap to add or remove."
                : quizStep === 1
                  ? "What could you share with a neighbor in a short, friendly session?"
                  : "Rough area is enough for the map; exact address stays off your public profile until you choose."}
            </p>

            {quizStep <= 1 ? (
              <div className="space-y-8">
                {ONBOARDING_CATEGORY_GROUPS.map((group) => (
                  <div key={group.categoryId}>
                    <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                      {group.categoryLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.subtopics.map((sub) => {
                        const tag = tagLabelForSubtopic(sub, group);
                        const selected =
                          quizStep === 0 ? curious.has(tag) : teach.has(tag);
                        const set = quizStep === 0 ? curious : teach;
                        const setSetter = quizStep === 0 ? setCurious : setTeach;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => toggleTag(set, setSetter, tag)}
                            className={`rounded-full border px-3 py-1.5 font-sans text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] ${
                              selected
                                ? "border-[var(--brand-border)] text-[var(--text-primary)]"
                                : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[color-mix(in_srgb,var(--brand)_40%,var(--border))]"
                            }`}
                            style={
                              selected
                                ? { backgroundColor: `color-mix(in srgb, ${group.pinHex} 18%, white)` }
                                : undefined
                            }
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                <label className="block space-y-2">
                  <span className="ui-label">City or region</span>
                  <Input
                    placeholder="e.g. Northeast Portland, Hudson Valley"
                    value={locationLabel}
                    onChange={(e) => setLocationLabel(e.target.value)}
                  />
                </label>
                <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,var(--background))] p-4">
                  <p className="font-sans text-sm text-[var(--text-secondary)]">
                    Approximate map pin (optional). Coordinates stay private on Explore until you turn on exact
                    location in settings.
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-3"
                    onClick={() => void onUseApproxLocation()}
                    disabled={geoLoading}
                  >
                    {geoLoading ? "Locating…" : "Use my approximate location"}
                  </Button>
                  {approxLat != null && approxLng != null ? (
                    <p className="mt-3 font-mono text-xs text-[var(--text-tertiary)]">
                      {approxLat.toFixed(3)}, {approxLng.toFixed(3)}
                    </p>
                  ) : null}
                </div>
              </div>
            )}

            {message ? <p className="mt-4 font-sans text-sm text-[var(--text-secondary)]">{message}</p> : null}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              {quizStep > 0 ? (
                <Button type="button" variant="secondary" onClick={backQuizStep} disabled={submitting}>
                  Back
                </Button>
              ) : (
                <span />
              )}
              <Button type="button" className="min-w-[7rem]" onClick={() => void nextQuizStep()} disabled={submitting}>
                {quizStep < 2 ? "Next" : submitting ? "Saving…" : "Finish"}
              </Button>
            </div>
          </Card>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="w-full max-w-md">
        <p className="mb-6 text-center font-serif text-lg italic text-[var(--text-secondary)]">
          Join as a neighbor, not a user ID.
        </p>
        <Card className="border-[var(--border)] shadow-[0_28px_80px_-40px_rgba(42,61,44,0.25)]">
          <div className="mb-6 border-b border-[var(--border)] pb-6">
            <h1 className="ui-heading text-3xl">Create your space</h1>
            <p className="mt-2 font-sans text-sm text-[var(--text-tertiary)]">
              Then a quick three-step trail map — curiosity, teaching, and where you roam.
            </p>
          </div>
          {loading ? (
            <p className="mb-4 font-sans text-sm text-[var(--text-secondary)]">Checking session...</p>
          ) : null}
          <form className="space-y-5" onSubmit={onSubmit}>
            <label className="block space-y-2">
              <span className="ui-label">Display name</span>
              <Input
                placeholder="How neighbors will know you"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="ui-label">Email</span>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="ui-label">Password</span>
              <Input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <Button type="submit" className="w-full py-3 text-base" disabled={submitting}>
              {submitting ? "Creating..." : "Create account"}
            </Button>
            {message ? (
              <p className="font-sans text-sm text-[var(--text-secondary)]">{message}</p>
            ) : null}
          </form>
          <p className="mt-6 text-center font-sans text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link href="/dabble/signin" className="font-medium text-[var(--brand-text)] underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </AuthShell>
  );
}
