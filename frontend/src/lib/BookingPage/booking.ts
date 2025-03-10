export interface Booking {
  id: number;
  num_of_person: number;
  booking_date: string;
  currency: string;
  modified: string;
  package_type: PackageType;
  user: User | number;
}

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

interface PackageType {
  id: number;
  name: string;
  price_per_person: string;
  description: string;
  package_type_amenity: PackageTypeAmenity;
  package_route_point: PackageRoutePoint;
  package: Package;
}

interface PackageTypeAmenity {
  name: string;
}

interface PackageRoutePoint {
  title: string;
  point_number: number;
  location: string;
  description: string;
  day: number;
  start_time: string;
  end_time: string;
}

interface Package {
  name: string;
  images: Image
}

interface Image {
  image: string;
}