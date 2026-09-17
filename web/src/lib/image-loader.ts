"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * next/image loader. Unsplash photos must be hotlinked from Unsplash's CDN (API guidelines), so
 * they are resized there with imgix parameters instead of through the Next.js image optimizer.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    return url.toString();
  }
  return src;
}
