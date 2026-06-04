import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Vercel/static hosting
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
