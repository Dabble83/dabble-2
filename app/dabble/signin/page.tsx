"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell } from "@/app/components/AuthShell";
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
    <AuthShell>
      <div className="flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="lg:flex-1">
          <div className="relative h-40 w-full overflow-hidden rounded-2xl lg:hidden">
            <Image
              src="/images/try.png"
              alt="Two people sharing skills outdoors"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative hidden aspect-[3/4] overflow-hidden rounded-3xl lg:block">
            <Image
              src="/images/try.png"
              alt="Two people sharing skills outdoors"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="w-full max-w-md lg:flex-shrink-0">
          <p className="mb-6 text-center font-serif text-lg italic text-[var(--text-secondary)]">
            Welcome back! Let&rsquo;s start dabbling.
          </p>
          <Card className="border-[var(--border)] shadow-[0_28px_80px_-40px_rgba(42,61,44,0.25)]">
            <div className="mb-6 border-b border-[var(--border)] pb-6">
              <h1 className="ui-heading text-3xl">Sign in</h1>
              <p className="mt-2 font-sans text-sm text-[var(--text-tertiary)]">
                Use the email and password you chose when you joined Dabble.
              </p>
            </div>
            {loading ? (
              <p className="mb-4 font-sans text-sm text-[var(--text-secondary)]">Checking session...</p>
            ) : null}
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
              <label className="block space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="ui-label">Password</span>
                  <Link
                    href="/dabble/forgot-password"
                    className="shrink-0 font-sans text-xs font-medium text-[var(--brand-text)] underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <Button type="submit" className="w-full py-3 text-base" disabled={submitting}>
                {submitting ? "Signing in..." : "Continue"}
              </Button>
              {message ? <p className="font-sans text-sm text-red-600">{message}</p> : null}
            </form>
            <p className="mt-6 text-center font-sans text-sm text-[var(--text-secondary)]">
              New to Dabble?{" "}
              <Link href="/dabble/signup" className="font-medium text-[var(--brand-text)] underline-offset-4 hover:underline">
                Create your profile
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </AuthShell>
  );
}
