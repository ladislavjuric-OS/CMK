import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PATHS: {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.85, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.85, changeFrequency: "monthly" },
  { path: "/materials", priority: 0.9, changeFrequency: "weekly" },
  { path: "/audit", priority: 0.9, changeFrequency: "weekly" },
  { path: "/momentum", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.85, changeFrequency: "weekly" },
  { path: "/tools/readiness", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools/intake", priority: 0.75, changeFrequency: "monthly" },
  { path: "/tools/campaignintelligence", priority: 0.75, changeFrequency: "monthly" },
  { path: "/data/privacy", priority: 0.4, changeFrequency: "yearly" },
  { path: "/data/terms", priority: 0.4, changeFrequency: "yearly" },
  { path: "/data/refund", priority: 0.4, changeFrequency: "yearly" },
  { path: "/login", priority: 0.35, changeFrequency: "yearly" },
  { path: "/llms.txt", priority: 0.25, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PATHS.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
