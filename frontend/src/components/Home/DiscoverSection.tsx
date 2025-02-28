import { Card } from "../ui/card";
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "../Error/ErrorSonner"
import api from "../../lib/api";
import  { AxiosError } from 'axios';

interface Destination {
  description: string,
  image: string,
  name: string,
  location: string,
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
      const err = error as AxiosError
      let errorMessage = "An unexpected error occurred.";

      if (err.response) {
        errorMessage = `Error ${err.response.status}: ${err.response.data || "Something went wrong"}`;
      } else if (err.request) {
        errorMessage = "Network error: Unable to reach the server. Please check your internet connection.";
      } else {
        errorMessage = err.message;
      }
      
      toast({
        title: '404 NOT FOUND',
        description: errorMessage,
        button: {
          label: 'Ignore',
          onClick: () => console.log('OK clicked'),
        },
      });
    }
  };

  const parsedDestinations : Destination[] = destinations;
  console.log(destinations)
  
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
        {parsedDestinations.slice(0,6).map((destination, index) => {
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
                  src={destination.image}
                  className="h-full w-full rounded-lg object-cover"
                  alt={`${destination.image} image`}
                ></img>
                <div className="relative bottom-[85px] ml-4 mr-4 rounded-2xl bg-white dark:bg-[#09090b]">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <MapPin />
                    <div>
                      <p className="text-xl font-semibold">{destination.name}</p>
                      <p className="text-xs">
                        {destination.location}
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
