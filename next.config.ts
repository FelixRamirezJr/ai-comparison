import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable network host detection to avoid interface errors
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
