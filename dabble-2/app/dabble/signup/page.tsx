"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

    if (data.user?.id) {
      const profileResponse = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.user.id,
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
    <div className="py-16">
      <section className="ui-container max-w-xl">
        <Card title="Create your Dabble profile">
          {loading ? (
            <p className="mb-4 font-sans text-sm text-[var(--text-secondary)]">
              Checking session...
            </p>
          ) : null}
          <form className="space-y-4" onSubmit={onSubmit}>
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
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creating..." : "Create account"}
            </Button>
            {message ? (
              <p className="font-sans text-sm text-[var(--text-secondary)]">{message}</p>
            ) : null}
          </form>
          <p className="mt-4 font-sans text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link href="/dabble/signin" className="underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </section>
    </div>
  );
}
