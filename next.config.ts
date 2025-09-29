import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable host header check bypass for Replit proxy
  experimental: {
    // Allow all hosts in dev mode for Replit proxy support
  },
  
  // Configure for Replit environment
  env: {
    HOSTNAME: "0.0.0.0",
    PORT: "5000"
  }
};

export default nextConfig;
