/**
 * Named photo slots for site imagery.
 *
 * To add a photo, put the file in `web/public/images/` and set `src` to its public path
 * (e.g. "/images/hero.jpg"). A slot with `src: null` renders a neutral placeholder.
 */
export type PhotoSlot = {
  src: string | null;
  alt: string;
};

export const photos = {
  /** Home hero in light mode. Landscape, at least 2400px wide. Light EXPLORE sits on top. */
  hero: {
    src: null,
    alt: "Rice terraces stepping down a green mountain valley",
  },
  /** Home hero in dark mode. A bright, airy landscape: off-black EXPLORE sits on top. */
  heroDark: {
    src: null,
    alt: "Morning haze over rice terraces and a mountain village",
  },
  /** Login and register cards. Portrait, at least 1200px wide. */
  auth: {
    src: null,
    alt: "A hiker walking a mountain trail toward distant peaks",
  },
} satisfies Record<string, PhotoSlot>;
