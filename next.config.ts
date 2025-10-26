import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify deployment with full functionality
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Ensure API routes work with Netlify Functions
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.netlify.app", "*.netlify.com"]
    }
  }
};

export default nextConfig;
