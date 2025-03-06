export interface tourPackage {
  id: number;
  name: string;
  description: string;
  address: string;
  start_date: string;
  end_date: string;
  package_image: tourPackageImage[];
  package_type: tourPackageType[];
  package_amenity: tourPackageAmenity[];
  destination: tourDestination;
}

interface tourPackageImage {
  image: string;
  id: Number;
}

interface tourPackageType {
  id: number;
  price_per_person: string;
  name: string;
  package_route_point: tourPackageTypeRoutePoints[];
  package_type_amenity: tourPackageTypeAmenities[];
}

interface tourPackageTypeRoutePoints {
  title: string;
  point_number: number;
  location: string;
  description: string;
  day: number;
  start_time: string;
  end_time: string;
}

interface tourPackageTypeAmenities {
  name: string,
}

interface tourPackageAmenity {
  name: string
}

interface tourDestination {
  name: string;
  id: string;
}