import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://melirox.com/sitemap.xml",
    host: "https://melirox.com",
  };
}
