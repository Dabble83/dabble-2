"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/src/lib/supabaseClient";
import { useAuthSession } from "@/src/hooks/useAuthSession";

type AuthNavProps = {
  /** Use in mobile drawer for full-width actions */
  layout?: "inline" | "stack";
};

export function AuthNav({ layout = "inline" }: AuthNavProps) {
  const router = useRouter();
  const { session, loading } = useAuthSession();

  const onSignOut = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase.auth.signOut();
    router.push("/dabble/signin");
    router.refresh();
  };

  const stack = layout === "stack";

  if (loading) {
    return (
      <span className="font-sans text-sm text-[var(--text-tertiary)]" aria-live="polite">
        Session...
      </span>
    );
  }

  if (!session) {
    return (
      <Link
        href="/dabble/signin"
        className={`font-sans text-sm hover:text-[var(--text-primary)] ${stack ? "py-2" : ""}`}
      >
        Sign in
      </Link>
    );
  }

  return (
    <div
      className={
        stack
          ? "flex flex-col items-stretch gap-3 border-t border-[var(--border)] pt-4"
          : "flex items-center gap-6"
      }
    >
      <Link href="/profile" className={`font-sans text-sm hover:text-[var(--text-primary)] ${stack ? "py-1" : ""}`}>
        My profile
      </Link>
      <button
        type="button"
        onClick={onSignOut}
        className={`rounded-lg border border-[var(--border)] bg-white/80 px-3 py-2 text-left font-sans text-sm text-[var(--text-secondary)] hover:border-[var(--brand-border)] hover:text-[var(--text-primary)] md:border-0 md:bg-transparent md:px-0 md:py-0`}
      >
        Sign out
      </button>
    </div>
  );
}