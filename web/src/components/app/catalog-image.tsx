"use client";

import Image, { type ImageLoaderProps } from "next/image";

const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

/** Resizes on Cloudinary's CDN: automatic format and quality, capped at the requested width. */
export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const match = CLOUDINARY_UPLOAD.exec(src);
  if (!match) return src;
  const transforms = `f_auto,q_${quality ?? "auto"},w_${width},c_limit`;
  return `${match[1]}${transforms}/${match[2]}`;
}

export function isCloudinary(src: string) {
  return CLOUDINARY_UPLOAD.test(src);
}

/**
 * Catalog photos come from the API as Cloudinary URLs, or as `/static/...` paths served by Django
 * (before Cloudinary is configured). Cloudinary URLs are resized on its CDN; static paths are
 * already web-sized WebPs and load as-is.
 */
export function CatalogImage({ alt, ...props }: React.ComponentProps<typeof Image>) {
  const src = typeof props.src === "string" ? props.src : "";
  if (isCloudinary(src)) return <Image alt={alt} {...props} loader={cloudinaryLoader} />;
  if (src.startsWith("/static/")) return <Image alt={alt} {...props} unoptimized />;
  return <Image alt={alt} {...props} />;
}
