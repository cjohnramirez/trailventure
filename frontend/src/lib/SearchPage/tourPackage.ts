export interface tourPackage {
  id: Number;
  name: string;
  description: string;
  address: string;
  start_date: string;
  end_date: string;
  package_image: tourPackageImage[];
  package_type: tourPackageType[];
  destination: tourDestination;
}

interface tourPackageImage {
  image: string;
  id: Number;
}

interface tourPackageType {
  price_per_person: string;
  name: string;
}

interface tourDestination {
  name: string;
  id: string;
}