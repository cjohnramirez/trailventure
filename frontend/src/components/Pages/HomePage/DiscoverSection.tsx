import { Card } from "../../ui/card";
import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchHomeDestinationData } from "@/api/homeData";

interface Destination {
  description: string;
  image: string;
  name: string;
  location: string;
}

function DiscoverSection() {
  const { data: destinations } = useQuery<Destination[]>({
    queryFn: () => fetchHomeDestinationData(),
    queryKey: ["discoverDestinationData"],
  });

  return (
    <div className="flex flex-col justify-center py-10 md:py-20">
      <div className="">
        <p className="relative text-center text-[40px] font-extrabold leading-none md:text-[40px] lg:text-[70px]">
          FEATURED DESTINATIONS
        </p>
        <p className="pb-12 pt-4 text-center font-semibold md:pb-20">
          Choose your next travel destination
        </p>
      </div>
      <div className="mx-auto grid max-w-[1200px] gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 ">
        {Array.isArray(destinations) && destinations.map((destination, index) => {
          const gridClasses = [
            "md:col-span-1 md:row-span-2",
            "md:col-span-1 md:row-span-1",
            "md:col-span-1 md:row-span-2",
            "md:col-span-1 md:row-span-1",
          ];
          return (
            <Card
              key={index}
              className={`flex max-w-[400px] lg:max-w-sm w-full flex-col transition duration-300 ease-in-out hover:scale-105 ${gridClasses[index]}`}
            >
              <div className="sm:block flex flex-col h-full">
                <img
                  src={"https://res.cloudinary.com/dch6eenk5/" + destination.image}
                  className="sm:h-full w-full rounded-lg object-cover h-4/5  shadow-lg"
                  alt={`${destination.image} image`}
                ></img>
                <div className="sm:relative sm:bottom-[85px] sm:ml-4 sm:mr-4 rounded-2xl bg-white dark:bg-[#09090b]">
                  <div className="flex items-center gap-2 px-4 py-2 shadow-lg">
                    <MapPin />
                    <div>
                      <p className="sm:text-xl font-semibold">
                        {destination.name}
                      </p>
                      <p className="sm:block hidden text-xs">{destination.location}</p>
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
