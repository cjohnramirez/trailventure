/**
 * The site's own photography, served from Cloudinary rather than through `/_next/image`.
 *
 * Resizing happens on Cloudinary's CDN, which matters because the container this runs in has a
 * tenth of a CPU core: optimising the hero in-process took seconds at small widths and timed out
 * altogether at others. The originals stay in `public/images` as the source for these uploads.
 */

const CLOUDINARY = "https://res.cloudinary.com/dch6eenk5/image/upload/trailventure/site";

export const SITE_PHOTOS = {
  hero: `${CLOUDINARY}/hero-section`,
  hiker: `${CLOUDINARY}/hiker`,
  auth: `${CLOUDINARY}/auth`,
} as const;
