"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell } from "@/app/components/AuthShell";
import { Button, Card, Input } from "@/app/components/ui";
import { getSupabaseClient } from "@/src/lib/supabaseClient";
import { useAuthSession } from "@/src/hooks/useAuthSession";

export default function SignUpPage() {
  const router = useRouter();
  const { session, loading } = useAuthSession();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) {
      router.replace("/profile");
    }
  }, [loading, router, session]);

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
        setMessage(profileBody.error || "Account created, but profile setup failed. Please sign in.");
        return;
      }
    }

    setSubmitting(false);
    const hasSession = Boolean(data.session);
    if (hasSession) {
      router.push("/profile/setup");
      return;
    }

    setMessage("Account created. Check your email to confirm, then sign in.");
    router.push("/dabble/signin");
  };

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
              One calm card — we will ask for the rest once you are inside.
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
