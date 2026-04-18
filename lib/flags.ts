// Feature flags — toggle via environment variables or hardcoded for now.
// Convention: NEXT_PUBLIC_ prefix = client-safe, no prefix = server-only.

export const flags = {
  // Show the Explore map split layout
  exploreMapEnabled: process.env.NEXT_PUBLIC_FLAG_EXPLORE_MAP !== 'false',

  // Show Safety & Guidelines links in footer
  safetyPagesEnabled: process.env.NEXT_PUBLIC_FLAG_SAFETY_PAGES !== 'false',

  // Profile builder V2 multi-step flow
  profileBuilderV2: process.env.NEXT_PUBLIC_FLAG_PROFILE_BUILDER_V2 === 'true',

  // Waitlist mode — replaces Sign Up with "Join Waitlist"
  waitlistMode: process.env.NEXT_PUBLIC_FLAG_WAITLIST === 'true',
} as const

export type FeatureFlag = keyof typeof flags
