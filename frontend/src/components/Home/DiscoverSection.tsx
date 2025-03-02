import { Card } from "../ui/card";
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "../Error/ErrorSonner";
import api from "../../lib/api";
import { AxiosError } from "axios";

interface Destination {
  description: string;
  image: string;
  name: string;
  location: string;
}

function DiscoverSection() {
  const [destinations, setDestinationsData] = useState([]);
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await api.get("apps/destination/list/");
      setDestinationsData(response.data);
    } catch (error) {
      const err = error as AxiosError;
      let errorMessage = "An unexpected error occurred.";

      if (err.response) {
        errorMessage = `Error ${err.response.status}: ${err.response.data || "Something went wrong"}`;
      } else if (err.request) {
        errorMessage =
          "Network error: Unable to reach the server. Please check your internet connection.";
      } else {
        errorMessage = "";
      }

      toast({
        title: "404 NOT FOUND",
        description: errorMessage,
      });
    }
  };

  const parsedDestinations: Destination[] = destinations;

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
      <div className="mx-auto grid max-w-[1200px] gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ">
        {parsedDestinations.slice(0, 6).map((destination, index) => {
          const gridClasses = [
            "sm:col-span-1 sm:row-span-2",
            "sm:col-span-1 sm:row-span-1",
            "sm:col-span-1 sm:row-span-2",
            "sm:col-span-1 sm:row-span-1",
          ];
          return (
            <Card
              key={index}
              className={`flex lg:max-w-sm w-full flex-col transition duration-300 ease-in-out hover:scale-105 ${gridClasses[index]}`}
            >
              <div className="h-full">
                <img
                  src={destination.image}
                  className="h-full w-full rounded-lg object-cover"
                  alt={`${destination.image} image`}
                ></img>
                <div className="relative bottom-[85px] ml-4 mr-4 rounded-2xl bg-white dark:bg-[#09090b]">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <MapPin />
                    <div>
                      <p className="text-xl font-semibold">
                        {destination.name}
                      </p>
                      <p className="text-xs">{destination.location}</p>
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
