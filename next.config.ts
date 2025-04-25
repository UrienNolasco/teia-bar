import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* config options here */
  generateBuildId: () => {
    // Isso gerará um ID de build único a cada deploy
    return `build-${Date.now()}`
  },
  images: {
    remotePatterns: [
      {
        hostname: "i.imgur.com",
      },
    ],
  },
}

export default nextConfig
