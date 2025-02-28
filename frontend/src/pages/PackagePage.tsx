import { useParams } from "react-router-dom";
import NavBar from "@/components/Home/NavBar";
import { Button } from "@/components/ui/button";
import api from "../lib/api";
import { AxiosError } from "axios";
import { toast } from "../components/Error/ErrorSonner";
import { useState, useEffect } from "react";
import { tourPackage } from "@/lib/SearchPage/tourPackage";
import { MapPin, Package } from "lucide-react";

function PackagePage() {
  const { id } = useParams();
  const [tourPkg, setTourPkg] = useState([]);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const fetchPkg = await api.get(`apps/package/${id}/`);
      setTourPkg(fetchPkg.data);
    } catch (error) {
      const err = error as AxiosError;
      let errorMessage = "An unexpected error occurred.";

      if (err.response) {
        errorMessage = `Error ${err.response.status}: ${err.response.data || "Something went wrong"}`;
      } else if (err.request) {
        errorMessage =
          "Network error: Unable to reach the server. Please check your internet connection.";
      } else {
        errorMessage = err.message;
      }

      toast({
        title: "404 NOT FOUND",
        description: errorMessage,
        button: {
          label: "Ignore",
          onClick: () => console.log("OK clicked"),
        },
      });
    }
  };

  const parsedTourPackage: tourPackage[] = tourPkg;

  console.log(parsedTourPackage);

  return (
    <>
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar change={false} />
      </div>
      <div className="fixed bottom-0 z-20 flex w-full justify-center px-8 py-4">
        <div className="flex w-full max-w-[500px] justify-center rounded-full border-[1px] bg-[#ffffff] p-4 dark:bg-[#09090b]">
          <div className="flex gap-4">
            <Button variant={"outline"}>Overview</Button>
            <Button variant={"outline"}>Description</Button>
            <Button variant={"outline"}>Package Type</Button>
            <Button variant={"outline"}>Reviews</Button>
          </div>
        </div>
      </div>
      <div className="mx-8 my-4 flex flex-col items-center gap-4 p-8">
        <div className="flex w-full max-w-[1200px] items-center justify-between">
          <div className="flex flex-col gap-[5px]">
            <p className="text-2xl font-semibold">
              {parsedTourPackage[0]?.name}
            </p>
            <div className="flex gap-4">
              <MapPin />
              <p>{parsedTourPackage[0]?.address}</p>
            </div>
          </div>
          <Button variant={"outline"}>Save to Wishlist</Button>
        </div>
        <div className="grid w-full max-w-[1200px] grid-cols-4 gap-4">
          {parsedTourPackage[0]?.package_image.map((image, index) => {
            const gridClasses = [
              "col-span-1 row-span-2",
              "col-span-2 row-span-2",
              "col-span-1 row-span-1",
              "col-span-1 row-span-1",
            ];

            return (
              <div
                key={index}
                className={`${gridClasses[index]} flex max-h-[400px] w-full flex-col transition duration-300 ease-in-out hover:scale-105`}
              >
                <img
                  src={image.image}
                  alt={parsedTourPackage[0]?.name + " image " + index}
                  className="h-full w-full rounded-lg object-cover"
                ></img>
              </div>
            );
          })}
        </div>
        <div className="flex w-full max-w-[1200px] gap-4">
          <div className="flex w-2/3 flex-col gap-4">
            <div className="rounded-2xl border-[1px] p-8">
              <p className="text-xl font-semibold">Description</p>
              <p>{parsedTourPackage[0]?.description}</p>
            </div>
            <div className="flex flex-col gap-8 rounded-2xl border-[1px] p-8">
              <div>
                <p className="text-xl font-semibold">Package Type</p>
                <div className="flex gap-4 pt-4">
                  {parsedTourPackage[0]?.package_type.map(
                    (packageType, index) => {
                      return (
                        <Button
                          className="flex rounded-2xl border-[1px]"
                          variant={"outline"}
                          key={index}
                        >
                          <Package />
                          <p>{packageType.name}</p>
                        </Button>
                      );
                    },
                  )}
                </div>
              </div>
              <div>
                <p className="text-xl font-semibold">Select Tour Date</p>
                
              </div>
            </div>
          </div>
          <div className="sticky top-20 h-full w-1/3 rounded-2xl border-[1px] p-8">
            <p className="text-xl font-semibold">Package Details</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PackagePage;
