import type { MetadataRoute } from "next";

import { getDestinations, searchPackages } from "@/lib/catalog/api";
import type { PackageCard } from "@/lib/catalog/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 3600;

async function allPackages(): Promise<PackageCard[]> {
  const packages: PackageCard[] = [];
  for (let page = 1; page <= 50; page += 1) {
    const result = await searchPackages({ page });
    if (!result) break;
    packages.push(...result.results);
    if (page >= result.total_pages) break;
  }
  return packages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, packages] = await Promise.all([
    getDestinations().catch(() => []),
    allPackages().catch(() => []),
  ]);
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/search`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.3 },
    ...destinations.map((destination) => ({
      url: `${siteUrl}/search?destination=${destination.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...packages.map((pkg) => ({
      url: `${siteUrl}/package/${pkg.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
