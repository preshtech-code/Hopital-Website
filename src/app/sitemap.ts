import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://st-peters-hospital.example", lastModified: new Date(), priority: 1 }];
}
