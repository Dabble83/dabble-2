"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell } from "@/app/components/AuthShell";
import { Button, Card, Input } from "@/app/components/ui";
import { getSupabaseClient } from "@/src/lib/supabaseClient";
import { useAuthSession } from "@/src/hooks/useAuthSession";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { session, loading } = useAuthSession();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

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

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectTo = `${origin}/dabble/update-password`;

    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    setSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <AuthShell>
      <div className="w-full max-w-md">
        <p className="mb-6 text-center font-serif text-lg italic text-[var(--text-secondary)]">
          It happens. We will send you a link to choose a new password.
        </p>
        <Card className="border-[var(--border)] shadow-[0_28px_80px_-40px_rgba(42,61,44,0.25)]">
          <div className="mb-6 border-b border-[var(--border)] pb-6">
            <h1 className="ui-heading text-3xl">Forgot password</h1>
            <p className="mt-2 font-sans text-sm text-[var(--text-tertiary)]">
              Enter the email for your account. If it matches an account, you will get a reset link shortly.
            </p>
          </div>
          {loading ? (
            <p className="mb-4 font-sans text-sm text-[var(--text-secondary)]">Checking session...</p>
          ) : null}
          {sent ? (
            <div className="space-y-4">
              <p className="font-sans text-sm text-[var(--text-secondary)]">
                Check your inbox (and spam) for an email from us. The link expires after a while for security.
              </p>
              <Button type="button" className="w-full py-3 text-base" onClick={() => router.push("/dabble/signin")}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={onSubmit}>
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
              <Button type="submit" className="w-full py-3 text-base" disabled={submitting}>
                {submitting ? "Sending link..." : "Send reset link"}
              </Button>
              {message ? <p className="font-sans text-sm text-red-600">{message}</p> : null}
            </form>
          )}
          <p className="mt-6 text-center font-sans text-sm text-[var(--text-secondary)]">
            Remembered it?{" "}
            <Link
              href="/dabble/signin"
              className="font-medium text-[var(--brand-text)] underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </AuthShell>
  );
}
