import { Card } from "../ui/card";
import TokyoImage from "../../assets/Home/tokyo.jpg";
import ManilaImage from "../../assets/Home/manila.jpg";
import ParisImage from "../../assets/Home/paris.jpeg";
import NewYorkImage from "../../assets/Home/new york.jpg";
import DubaiImage from "../../assets/Home/dubai.png";
import BangkokImage from "../../assets/Home/bangkok.png";
import { MapPin } from "lucide-react";

interface Location {
  number_of_properties: number;
  city: string;
  country: string;
  cityImage: string;
}

function DiscoverSection() {
  const locations: Location[] = [
    {
      number_of_properties: 25,
      city: "Manila",
      country: "Philippines",
      cityImage: ManilaImage,
    },
    {
      number_of_properties: 30,
      city: "Tokyo",
      country: "Japan",
      cityImage: TokyoImage,
    },
    {
      number_of_properties: 15,
      city: "New York",
      country: "USA",
      cityImage: NewYorkImage,
    },
    {
      number_of_properties: 20,
      city: "Paris",
      country: "France",
      cityImage: ParisImage,
    },
    {
      number_of_properties: 31,
      city: "Dubai",
      country: "UAE",
      cityImage: DubaiImage,
    },
    {
      number_of_properties: 26,
      city: "Bangkok",
      country: "Thailand",
      cityImage: BangkokImage,
    },
  ];

  return (
    <div className="py-10">
      <div>
        <p className="relative -z-10 py-10 text-center text-[70px] font-extrabold">
          FEATURED DESTINATIONS
        </p>
        <p className="title relative bottom-[245px] -z-20 mb-[-305px] text-center text-[200px] font-bold text-gray-200 dark:text-gray-900">
          DESTINATIONS
        </p>
        <p className="py-10 text-center font-semibold">
          Choose your next travel destination
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {locations.map((location, index) => {
          const gridClasses = [
            "col-span-1 row-span-2",
            "col-span-1 row-span-1",
            "col-span-1 row-span-2",
            "col-span-1 row-span-1",
          ];
          return (
            <Card
              key={index}
              className={`flex max-w-xs flex-col transition duration-300 ease-in-out hover:scale-110 ${gridClasses[index]}`}
            >
              <div className="h-full">
                <img
                  src={location.cityImage}
                  className="h-full w-full rounded-lg object-cover"
                  alt={`${location.city} image`}
                ></img>
                <div className="relative bottom-[85px] ml-4 mr-4 rounded-2xl bg-white dark:bg-[#09090b]">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <MapPin />
                    <div>
                      <p className="text-xl font-semibold">{location.city}</p>
                      <p className="text-xs">
                        {location.number_of_properties} properties
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default DiscoverSection;
