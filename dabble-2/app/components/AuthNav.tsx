"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/src/lib/supabaseClient";
import { useAuthSession } from "@/src/hooks/useAuthSession";

export function AuthNav() {
  const router = useRouter();
  const { session, loading } = useAuthSession();

  const onSignOut = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase.auth.signOut();
    router.push("/dabble/signin");
    router.refresh();
  };

  if (loading) {
    return (
      <span className="font-sans text-sm text-[var(--text-tertiary)]" aria-live="polite">
        Session...
      </span>
    );
  }

  if (!session) {
    return (
      <Link href="/dabble/signin" className="hover:text-[var(--text-primary)]">
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/profile" className="hover:text-[var(--text-primary)]">
        My profile
      </Link>
      <button
        type="button"
        onClick={onSignOut}
        className="font-sans text-sm hover:text-[var(--text-primary)]"
      >
        Sign out
      </button>
    </div>
  );
}
