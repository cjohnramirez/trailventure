/** Shapes returned by the catalog API (api/apps/catalog/serializers.py). Prices are centavos. */

export type CatalogPhoto = {
  url: string;
  alt: string;
  credit_name: string;
  credit_url: string;
};

export type DestinationSummary = {
  slug: string;
  name: string;
  region: string;
  country: string;
};

export type Destination = DestinationSummary & {
  description: string;
  photo: CatalogPhoto;
  package_count: number;
};

export type PackageCard = {
  slug: string;
  name: string;
  description: string;
  address: string;
  destination: DestinationSummary;
  cover: CatalogPhoto | null;
  min_price: number;
  rating_avg: number;
  rating_count: number;
};

export type PackagePage = {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: PackageCard[];
};

export type ItineraryStop = {
  day: number;
  position: number;
  title: string;
  location: string;
  description: string;
  start_time: string | null;
  end_time: string | null;
};

export type Tier = {
  id: number;
  name: string;
  description: string;
  price: number;
  amenities: string[];
  itinerary: ItineraryStop[];
};

export type PackageDetail = Omit<PackageCard, "cover"> & {
  images: CatalogPhoto[];
  amenities: string[];
  tiers: Tier[];
  available_from: string;
  available_until: string;
};
