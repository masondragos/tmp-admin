import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for Replit environment
  env: {
    HOSTNAME: "0.0.0.0",
    PORT: "5000"
  }
};

export default nextConfig;
