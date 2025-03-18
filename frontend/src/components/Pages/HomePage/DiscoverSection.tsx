import { Card } from "../../ui/card";
import { MapPin } from "lucide-react";
import { useHomeDestinationQuery } from "@/hooks/tanstack/home/useQueryHome";

function DiscoverSection() {
  const { data: destinations } = useHomeDestinationQuery();

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
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.isArray(destinations) &&
          destinations.map((destination, index) => {
            const gridClasses = [
              "md:col-span-1 md:row-span-2",
              "md:col-span-1 md:row-span-1",
              "md:col-span-1 md:row-span-2",
              "md:col-span-1 md:row-span-1",
            ];
            return (
              <Card
                key={index}
                className={`flex w-full max-w-[400px] flex-col transition duration-300 ease-in-out hover:scale-105 lg:max-w-sm ${gridClasses[index]}`}
              >
                <div className="flex h-full flex-col sm:block">
                  <img
                    src={"https://res.cloudinary.com/dch6eenk5/" + destination.image}
                    className="h-4/5 w-full rounded-lg object-cover shadow-lg sm:h-full"
                    alt={`${destination.image} image`}
                  ></img>
                  <div className="rounded-2xl border-[1px] bg-white shadow-md dark:bg-[#09090b] sm:relative sm:bottom-[85px] sm:ml-4 sm:mr-4">
                    <div className="flex items-center gap-2 px-4 py-2">
                      <MapPin />
                      <div>
                        <p className="font-semibold sm:text-xl">{destination.name}</p>
                        <p className="hidden text-xs sm:block">{destination.location}</p>
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
