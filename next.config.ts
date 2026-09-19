import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Static-export friendly: no remote loader required.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Poster frames for the click-to-play testimonial video facade.
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
