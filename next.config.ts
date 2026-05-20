import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "pixup3d.com" },
      { protocol: "https", hostname: "**.pixup3d.com" },
    ],
  },
};

export default nextConfig;
