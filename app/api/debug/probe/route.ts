import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ ok: false, hasUrl, hasServiceKey, reason: "no client" });
  }

  const { data, error, count } = await supabase
    .from("profiles")
    .select("id,username,is_discoverable", { count: "exact" })
    .eq("is_discoverable", true)
    .limit(5);

  return NextResponse.json({
    ok: !error,
    hasUrl,
    hasServiceKey,
    error: error?.message ?? null,
    count,
    sample: data?.map((p: { username: string }) => p.username) ?? [],
  });
}
