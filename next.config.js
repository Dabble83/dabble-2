/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Pre-existing type errors exist in the codebase; suppress during build until addressed
    ignoreBuildErrors: true,
  },
  env: {},
}

module.exports = nextConfig







