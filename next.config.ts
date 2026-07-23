import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
