'use client'

export function Providers({ children }: { children: React.ReactNode }) {
  // TODO: NextAuth was removed due to Prisma client error ("Cannot find module './client'")
  // and because we're migrating to Supabase-only authentication.
  // The NextAuth route at /app/api/auth/[...nextauth]/route.ts has been deleted.
  // All authentication now uses Supabase directly via supabaseClient.
  // If you need to restore NextAuth, ensure Prisma Client is properly generated first.
  return <>{children}</>
}

