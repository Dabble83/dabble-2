/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure environment variables are loaded
  env: {
    // Next.js automatically loads .env.local, but we can explicitly reference them here
    // to ensure they're available at build time
  },
}

module.exports = nextConfig







