/**
 * Named photo slots for site imagery.
 *
 * To add a photo, put the file in `web/public/images/` and set `src` to its public path
 * (e.g. "/images/hero.jpg"). A slot with `src: null` renders a neutral placeholder.
 * `credit` shows a "Photo by … on Unsplash" line for photos that came from Unsplash.
 */
export type PhotoSlot = {
  src: string | null;
  alt: string;
  credit?: { name: string; url: string };
};

const UTM = "utm_source=trailventure&utm_medium=referral";

export const photos = {
  /** Home hero in light mode. Landscape, at least 2400px wide. Light EXPLORE sits on top. */
  hero: {
    src: null,
    alt: "Rice terraces stepping down a green mountain valley",
  },
  /** Home hero in dark mode. Landscape, at least 2400px wide. Darkened under light EXPLORE. */
  heroDark: {
    src: null,
    alt: "Morning haze over rice terraces and a mountain village",
  },
  /** Login and register cards. Portrait, at least 1200px wide. */
  auth: {
    src: "/images/site/auth.webp",
    alt: "A hiker walking a mountain trail toward distant peaks",
    credit: { name: "Josh Hild", url: `https://unsplash.com/@joshhild?${UTM}` },
  },
  /** The tall image in the home page "Choose us" grid. */
  hiker: {
    src: "/images/site/hiker.webp",
    alt: "Two hikers on a grassy ridge pointing out across the mountains",
    credit: { name: "Dario Brönnimann", url: `https://unsplash.com/@dariobroe?${UTM}` },
  },
} satisfies Record<string, PhotoSlot>;
