"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { useAuthSession } from "@/src/hooks/useAuthSession";

/** §2.3 outdoor sage — compact pill for header */
const pillClass =
  "inline-flex min-w-[2.25rem] items-center justify-center rounded-full border border-[color-mix(in_srgb,#6d8570_38%,var(--border))] bg-[color-mix(in_srgb,#6d8570_16%,white)] px-2.5 py-1 font-sans text-xs font-semibold tabular-nums text-[color-mix(in_srgb,#1c2424_88%,#6d8570)] shadow-[0_1px_0_rgba(255,252,247,0.6)] transition hover:border-[color-mix(in_srgb,#6d8570_55%,var(--border))] hover:bg-[color-mix(in_srgb,#6d8570_22%,white)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]";

export function CreditBalanceBadge() {
  const { session, loading: authLoading } = useAuthSession();
  const [credits, setCredits] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!session?.access_token) {
      startTransition(() => {
        setCredits(null);
        setFetchError(false);
      });
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/credits/balance", {
          headers: { Authorization: `Bearer ${session.access_token}` },
          cache: "no-store",
        });
        const body = (await res.json()) as { balance?: { availableCredits: number } };
        if (cancelled) return;
        if (!res.ok) {
          startTransition(() => {
            setFetchError(true);
            setCredits(null);
          });
          return;
        }
        startTransition(() => {
          setFetchError(false);
          setCredits(body.balance?.availableCredits ?? 0);
        });
      } catch {
        if (!cancelled) {
          startTransition(() => {
            setFetchError(true);
            setCredits(null);
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.access_token]);

  if (authLoading) {
    return (
      <span
        className="inline-block h-7 w-12 animate-pulse rounded-full bg-[color-mix(in_srgb,var(--border)_70%,var(--surface))]"
        aria-hidden
      />
    );
  }

  if (!session) return null;

  const label =
    credits != null && !fetchError ? String(credits) : fetchError ? "—" : "…";

  return (
    <Link
      href="/credits"
      className={pillClass}
      aria-label={`Credits: ${credits != null ? `${credits} available` : "loading or unavailable"}. Go to credits.`}
    >
      {label}
    </Link>
  );
}
