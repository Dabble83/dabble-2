"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseClient } from "@/src/lib/supabaseClient";

type BalancePayload = {
  availableCredits: number;
  heldCredits: number;
  updatedAt: string | null;
};

type LedgerEntry = {
  id: string;
  delta: number;
  reason: string;
  sessionId: string | null;
  createdAt: string;
};

type RowView = LedgerEntry & { balanceAfter: number };

async function authHeaders(): Promise<HeadersInit | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
}

function reasonLabel(reason: string): string {
  const map: Record<string, string> = {
    seed_signup: "Starter credits",
    session_settle: "Session settled",
    session_bonus_rating: "Quality bonus",
    refund: "Refund",
    admin_adjustment: "Adjustment",
  };
  return (
    map[reason] ??
    reason.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

function attachRunning(entriesDesc: LedgerEntry[], balanceNow: number): RowView[] {
  let running = balanceNow;
  return entriesDesc.map((e) => {
    const balanceAfter = running;
    running -= e.delta;
    return { ...e, balanceAfter };
  });
}

function CreditsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusSessionId = searchParams.get("sid");
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  const [redirecting, setRedirecting] = useState(true);
  const [balance, setBalance] = useState<BalancePayload | null>(null);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseClient();
      if (!supabase) {
        setError("App configuration is incomplete.");
        setLoading(false);
        setRedirecting(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        router.replace("/dabble/signin");
        return;
      }

      setRedirecting(false);
      const headers = await authHeaders();
      if (!headers) {
        router.replace("/dabble/signin");
        return;
      }

      try {
        const [balRes, ledRes] = await Promise.all([
          fetch("/api/credits/balance", { headers, cache: "no-store" }),
          fetch("/api/credits/ledger?limit=100&offset=0", { headers, cache: "no-store" }),
        ]);

        const balBody = (await balRes.json()) as { balance?: BalancePayload; error?: string };
        const ledBody = (await ledRes.json()) as {
          entries?: LedgerEntry[];
          total?: number;
          hasMore?: boolean;
          error?: string;
        };

        if (cancelled) return;

        if (!balRes.ok) {
          setError(balBody.error || "Could not load balance.");
          setLoading(false);
          return;
        }

        setBalance(
          balBody.balance ?? {
            availableCredits: 0,
            heldCredits: 0,
            updatedAt: null,
          },
        );

        if (!ledRes.ok) {
          setError(ledBody.error || "Could not load activity history.");
          setEntries([]);
          setTotal(0);
          setHasMore(false);
        } else {
          setError(null);
          setEntries(ledBody.entries ?? []);
          setTotal(ledBody.total ?? 0);
          setHasMore(Boolean(ledBody.hasMore));
        }
      } catch {
        if (!cancelled) setError("Network error while loading credits.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!focusSessionId || loading) return;
    const el = rowRefs.current[focusSessionId];
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusSessionId, loading, entries]);

  const rowsWithRunning = useMemo(() => {
    if (!balance) return [];
    return attachRunning(entries, balance.availableCredits);
  }, [entries, balance]);

  const loadMore = async () => {
    if (!balance || loadMoreLoading || !hasMore) return;
    const headers = await authHeaders();
    if (!headers) return;
    setLoadMoreLoading(true);
    try {
      const res = await fetch(`/api/credits/ledger?limit=100&offset=${entries.length}`, {
        headers,
        cache: "no-store",
      });
      const body = (await res.json()) as { entries?: LedgerEntry[]; hasMore?: boolean };
      if (!res.ok) return;
      const next = body.entries ?? [];
      setEntries((prev) => [...prev, ...next]);
      setHasMore(Boolean(body.hasMore));
    } finally {
      setLoadMoreLoading(false);
    }
  };

  if (redirecting) {
    return (
      <div className="ui-container py-16">
        <p className="font-sans text-sm text-[var(--text-secondary)]">Checking session…</p>
      </div>
    );
  }

  return (
    <div className="ui-container space-y-10 py-16 md:space-y-12 md:py-20">
      <header className="max-w-3xl space-y-3">
        <p className="ui-label">Credits</p>
        <h1 className="ui-heading text-4xl text-[var(--text-primary)] md:text-5xl">Your neighbor time</h1>
        <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)]">
          Whole credits, short sessions, no cash on the path. Numbers here match what you can book and earn.
        </p>
      </header>

      {error ? (
        <div className="max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 font-sans text-sm text-[var(--text-secondary)]">
          {error}
        </div>
      ) : null}

      {!loading && balance ? (
        <section className="max-w-2xl space-y-3">
          <h2 className="ui-heading text-xl text-[var(--text-primary)]">Balance</h2>
          <div className="rounded-2xl border border-[color-mix(in_srgb,#6d8570_28%,var(--border))] bg-[color-mix(in_srgb,#6d8570_10%,var(--surface))] p-6 md:p-8">
            <p className="font-sans text-sm text-[var(--text-secondary)]">Available to book</p>
            <p className="mt-1 font-serif text-4xl font-medium tabular-nums text-[var(--text-primary)] md:text-5xl">
              {balance.availableCredits}
              <span className="ml-2 font-sans text-lg font-semibold text-[var(--text-tertiary)]">credits</span>
            </p>
            {balance.heldCredits > 0 ? (
              <p className="mt-3 font-sans text-sm text-[var(--text-secondary)]">
                {balance.heldCredits} on hold for pending sessions
              </p>
            ) : null}
            {balance.updatedAt ? (
              <p className="mt-4 font-sans text-xs text-[var(--text-tertiary)]">
                Last movement {new Date(balance.updatedAt).toLocaleString()}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {!loading && balance ? (
        <section className="max-w-4xl space-y-4">
          <h2 className="ui-heading text-xl text-[var(--text-primary)]">Activity</h2>

          {entries.length === 0 && !error ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center md:px-10">
              <p className="font-serif text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
                You have 3 credits to start. Offer a lesson or book one to see activity here.
              </p>
            </div>
          ) : null}

          {entries.length === 0 && error ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-8 font-sans text-sm text-[var(--text-secondary)] md:px-10">
              Activity history is not available right now. If your balance loaded above, try refreshing the page in a
              moment.
            </div>
          ) : null}

          {entries.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_12px_40px_-24px_rgba(42,61,44,0.12)]">
                <table className="min-w-full border-collapse text-left font-sans text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_55%,var(--surface))]">
                      <th className="px-4 py-3 font-semibold text-[var(--text-primary)] md:px-5">Date</th>
                      <th className="px-4 py-3 font-semibold text-[var(--text-primary)] md:px-5">Event</th>
                      <th className="px-4 py-3 font-semibold text-[var(--text-primary)] md:px-5">Delta</th>
                      <th className="px-4 py-3 font-semibold text-[var(--text-primary)] md:px-5">Balance after</th>
                      <th className="px-4 py-3 font-semibold text-[var(--text-primary)] md:px-5">Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsWithRunning.map((row) => (
                      <tr
                        key={row.id}
                        ref={(el) => {
                          if (row.sessionId) {
                            rowRefs.current[row.sessionId] = el;
                          }
                        }}
                        className={`border-b border-[var(--border)]/80 last:border-0 ${
                          focusSessionId && row.sessionId === focusSessionId
                            ? "bg-[color-mix(in_srgb,var(--brand)_12%,var(--surface))]"
                            : ""
                        }`}
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-[var(--text-secondary)] md:px-5">
                          {new Date(row.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="px-4 py-3 text-[var(--text-primary)] md:px-5">{reasonLabel(row.reason)}</td>
                        <td
                          className={`px-4 py-3 font-medium tabular-nums md:px-5 ${
                            row.delta >= 0 ? "text-[#5c7a56]" : "text-[#8b4a42]"
                          }`}
                        >
                          {formatDelta(row.delta)}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-[var(--text-primary)] md:px-5">
                          {row.balanceAfter}
                        </td>
                        <td className="px-4 py-3 md:px-5">
                          {row.sessionId ? (
                            <Link
                              href={`/credits?sid=${encodeURIComponent(row.sessionId)}`}
                              className="font-medium text-[var(--brand-text)] underline-offset-2 hover:underline"
                            >
                              View
                            </Link>
                          ) : (
                            <span className="text-[var(--text-tertiary)]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hasMore ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => void loadMore()}
                    disabled={loadMoreLoading}
                    className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 font-sans text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--brand-border)] disabled:opacity-50"
                  >
                    {loadMoreLoading ? "Loading…" : "Load older activity"}
                  </button>
                  <p className="font-sans text-xs text-[var(--text-tertiary)]">
                    “Balance after” reflects loaded rows ({entries.length} of {total}).
                  </p>
                </div>
              ) : null}
            </>
          ) : null}
        </section>
      ) : null}

      {loading ? (
        <p className="font-sans text-sm text-[var(--text-secondary)]">Loading credits…</p>
      ) : null}

      <section className="max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
        <h2 className="ui-heading text-lg text-[var(--text-primary)]">How credits work</h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-[var(--text-secondary)]">
          One credit is about twenty minutes of neighborly help. Tips, short sessions, and walk-withs each cost a
          small number of credits so expectations stay clear. The full trail map lives on How it works.
        </p>
        <Link
          href="/how-it-works"
          className="mt-5 inline-flex font-sans text-sm font-semibold text-[var(--brand-text)] underline-offset-4 hover:underline"
        >
          Read How it works
        </Link>
      </section>
    </div>
  );
}

function CreditsFallback() {
  return (
    <div className="ui-container py-16">
      <p className="font-sans text-sm text-[var(--text-secondary)]">Loading…</p>
    </div>
  );
}

export default function CreditsPage() {
  return (
    <Suspense fallback={<CreditsFallback />}>
      <CreditsPageInner />
    </Suspense>
  );
}
