"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AuthShell } from "@/app/components/AuthShell";
import { Button, Card, Input } from "@/app/components/ui";
import { getSupabaseClient } from "@/src/lib/supabaseClient";

type Gate = "pending" | "open" | "closed";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const openedRef = useRef(false);
  const [gate, setGate] = useState<Gate>("pending");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      queueMicrotask(() => {
        setGate("closed");
        setMessage("Supabase public env vars are missing.");
      });
      return;
    }

    let alive = true;

    const markOpen = () => {
      if (!alive || openedRef.current) return;
      openedRef.current = true;
      setGate("open");
    };

    // Only open the gate on PASSWORD_RECOVERY — not on a regular session.
    // getSession() alone is not enough: the recovery token in the URL hash
    // is exchanged asynchronously by the Supabase client, so we rely on
    // onAuthStateChange to fire PASSWORD_RECOVERY once the exchange completes.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        markOpen();
      }
    });

    const tid = window.setTimeout(() => {
      if (!alive || openedRef.current) return;
      setGate("closed");
    }, 6000);

    return () => {
      alive = false;
      window.clearTimeout(tid);
      data.subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase public env vars are missing.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/profile");
  };

  return (
    <AuthShell>
      <div className="w-full max-w-md">
        <div className="relative mb-5 h-28 w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/try.png"
            alt="Two people sharing skills outdoors"
            fill
            className="object-cover object-top"
          />
        </div>
        <p className="mb-6 text-center font-serif text-lg italic text-[var(--text-secondary)]">
          Almost there — pick a new password you haven&rsquo;t used elsewhere.
        </p>
        <Card className="border-[var(--border)] shadow-[0_28px_80px_-40px_rgba(42,61,44,0.25)]">
          <div className="mb-6 border-b border-[var(--border)] pb-6">
            <h1 className="ui-heading text-3xl">Set new password</h1>
            <p className="mt-2 font-sans text-sm text-[var(--text-tertiary)]">
              Use the link from your email to reach this page. After you save, you will stay signed in.
            </p>
          </div>
          {gate === "pending" ? (
            <p className="font-sans text-sm text-[var(--text-secondary)]">Confirming your reset link...</p>
          ) : null}
          {gate === "closed" ? (
            <div className="space-y-4">
              <p className="font-sans text-sm text-[var(--text-secondary)]">
                This link is invalid or has expired. Request a fresh reset email and try again.
              </p>
              {message ? <p className="font-sans text-sm text-red-600">{message}</p> : null}
              <Button type="button" className="w-full py-3 text-base" onClick={() => router.push("/dabble/forgot-password")}>
                Request new link
              </Button>
              <p className="text-center font-sans text-sm text-[var(--text-secondary)]">
                <Link href="/dabble/signin" className="font-medium text-[var(--brand-text)] underline-offset-4 hover:underline">
                  Back to sign in
                </Link>
              </p>
            </div>
          ) : null}
          {gate === "open" ? (
            <form className="space-y-5" onSubmit={onSubmit}>
              <label className="block space-y-2">
                <span className="ui-label">New password</span>
                <Input
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </label>
              <label className="block space-y-2">
                <span className="ui-label">Confirm password</span>
                <Input
                  type="password"
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </label>
              <Button type="submit" className="w-full py-3 text-base" disabled={submitting}>
                {submitting ? "Saving..." : "Save password"}
              </Button>
              {message ? <p className="font-sans text-sm text-red-600">{message}</p> : null}
            </form>
          ) : null}
        </Card>
      </div>
    </AuthShell>
  );
}
