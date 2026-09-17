import sitePhotos from "@/content/site-photos.json";

/** A photo hotlinked from Unsplash, with the credit the Unsplash API guidelines require. */
export type Photo = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  color: string;
  photographer: string;
  photographerUrl: string;
  unsplashUrl: string;
  photoUrl: string;
};

export type SitePhotoSlot = keyof typeof sitePhotos;

export const photos: Record<SitePhotoSlot, Photo> = sitePhotos;
