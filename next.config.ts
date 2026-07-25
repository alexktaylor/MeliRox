import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Media caches for an hour then revalidates (cheap 304 if unchanged). Short enough
    // that re-encodes propagate quickly; long enough to avoid re-downloading each visit.
    // (Files are re-encoded under the same name, so a long immutable cache would trap
    //  browsers on stale copies — see the ?v= cache-buster on video srcs.)
    const media = { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" };
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
