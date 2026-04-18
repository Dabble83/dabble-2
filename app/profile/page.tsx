"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/ui";
import { getSupabaseClient } from "@/src/lib/supabaseClient";

async function authHeaders() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
}

export default function ProfilePage() {
  const router = useRouter();
  const [status, setStatus] = useState("Checking session...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function routeProfile() {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setError("Supabase public env vars are missing.");
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        router.replace("/dabble/signin");
        return;
      }

      setStatus("Loading profile...");
      const headers = await authHeaders();
      if (!headers) {
        router.replace("/dabble/signin");
        return;
      }

      const response = await fetch("/api/profile/check", {
        headers,
        cache: "no-store",
      });
      const body = await response.json();

      if (!response.ok) {
        setError(body.error || "Unable to load your profile.");
        return;
      }

      if (body.complete && body.username) {
        router.replace(`/profile/${body.username}`);
        return;
      }

      router.replace("/profile/setup");
    }

    routeProfile();
  }, [router]);

  return (
    <div className="py-16">
      <section className="ui-container max-w-2xl">
        <Card title="Profile">
          <p className="font-sans text-sm text-[var(--text-secondary)]">{status}</p>
          {error ? <p className="mt-3 font-sans text-sm text-red-600">{error}</p> : null}
        </Card>
      </section>
    </div>
  );
}