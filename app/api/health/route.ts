import { NextResponse } from "next/server";
import { isAIEnabled, isCreditsEnabled, isFreeSeedPhase, isMapsEnabled } from "@/lib/flags";

/**
 * Liveness check — no DB or third-party calls. Includes static env-derived flags only.
 * Safe to hit in CI and production probes.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "dabble-2",
    phase: 0,
    time: new Date().toISOString(),
    flags: {
      maps: isMapsEnabled(),
      credits: isCreditsEnabled(),
      freeSeedPhase: isFreeSeedPhase(),
      ai: isAIEnabled(),
    },
  });
}
