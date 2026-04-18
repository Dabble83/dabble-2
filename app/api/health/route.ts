import { NextResponse } from "next/server";

/**
 * Liveness check — no DB, maps, AI, or third-party calls.
 * Safe to hit in CI and production probes.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "dabble-2",
    phase: 0,
    time: new Date().toISOString(),
  });
}