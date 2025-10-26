import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel deployment with full functionality
  images: {
    unoptimized: true
  },
  // Ensure API routes work with Vercel Functions
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.vercel.app", "*.vercel.com"]
    }
  }
};

export default nextConfig;
