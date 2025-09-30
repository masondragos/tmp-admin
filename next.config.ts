import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for Replit environment
  env: {
    HOSTNAME: "0.0.0.0",
    PORT: "5000"
  },
  
  // Production optimizations for Cloud Run deployment
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
