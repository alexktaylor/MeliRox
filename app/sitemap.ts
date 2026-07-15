import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://melirox.com",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
