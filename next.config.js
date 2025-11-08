/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lightweight-charts"]
  }
};

module.exports = nextConfig;
