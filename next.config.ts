import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Media files have stable names and rarely change — cache 7 days, serve stale
    // while revalidating. (Default was max-age=0: every visit re-downloaded everything.)
    const media = { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" };
    return [
      { source: "/Vids/:path*", headers: [media] },
      { source: "/uploads/:path*", headers: [media] },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.melirox.com" }],
        destination: "https://melirox.com/:path*",
        permanent: true, // 308 permanent — consolidates www -> non-www for Google
      },
    ];
  },
};

export default nextConfig;
