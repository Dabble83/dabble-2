"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/app/components/ui";
import { getSupabaseClient } from "@/src/lib/supabaseClient";
import { useAuthSession } from "@/src/hooks/useAuthSession";

export default function SignInPage() {
  const router = useRouter();
  const { session, loading } = useAuthSession();
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/profile");
  };

  return (
    <div className="py-16">
      <section className="ui-container max-w-xl">
        <Card title="Sign in">
          {loading ? (
            <p className="mb-4 font-sans text-sm text-[var(--text-secondary)]">
              Checking session...
            </p>
          ) : null}
          <form className="space-y-4" onSubmit={onSubmit}>
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
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in..." : "Continue"}
            </Button>
            {message ? (
              <p className="font-sans text-sm text-red-600">{message}</p>
            ) : null}
          </form>
          <p className="mt-4 font-sans text-sm text-[var(--text-secondary)]">
            New here?{" "}
            <Link href="/dabble/signup" className="underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </Card>
      </section>
    </div>
  );
}
