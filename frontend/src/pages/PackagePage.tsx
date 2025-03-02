import { useNavigate, useParams } from "react-router-dom";
import NavBar from "@/components/NavBar/NavBar";
import { Button } from "@/components/ui/button";
import api from "../lib/api";
import { AxiosError } from "axios";
import { toast } from "../components/Error/ErrorSonner";
import { useState, useEffect } from "react";
import { tourPackage } from "@/lib/SearchPage/tourPackage";
import { MapPin, Package, Calendar as CalendarIcon, Plus, Minus, Box } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

function PackagePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tourPkg, setTourPkg] = useState([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [indexPackage, setIndexPackage] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);

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
        errorMessage = "Network error: Unable to reach the server. Please check your internet connection.";
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

  return (
    <div id="main">
      <div className="fixed bottom-0 z-20 flex w-full justify-center px-8 py-4">
        <div className="flex w-full max-w-[500px] justify-center rounded-full border-[1px] bg-[#ffffff] p-4 dark:bg-[#09090b]">
          <div className="flex gap-4">
            <Button variant={"outline"} onClick={() => document.getElementById("main")?.scrollIntoView({ behavior: "smooth" })}>
              Overview
            </Button>
            <Button variant={"outline"} onClick={() => document.getElementById("description")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
              Description
            </Button>
            <Button variant={"outline"} onClick={() => document.getElementById("packageType")?.scrollIntoView({ behavior: "smooth" })}>
              Package Type
            </Button>
            <Button variant={"outline"} onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })}>
              Reviews
            </Button>
          </div>
        </div>
      </div>
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar isNavBar={false} />
      </div>
      <div className="mx-8 my-4 flex flex-col items-center gap-4 p-8" id="description">
        <div className="flex w-full max-w-[1200px] items-center justify-between">
          <div className="flex flex-col gap-[5px]">
            <p className="text-2xl font-semibold">{parsedTourPackage[0]?.name}</p>
            <div className="flex gap-4">
              <MapPin />
              <p>{parsedTourPackage[0]?.address}</p>
            </div>
          </div>
          <Button variant={"outline"}>Save to Wishlist</Button>
        </div>
        <div className="grid w-full max-w-[1200px] grid-cols-4 gap-4">
          {parsedTourPackage[0]?.package_image.map((image, index) => {
            const gridClasses = ["col-span-1 row-span-2", "col-span-2 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-1"];
            return (
              <div key={index} className={`${gridClasses[index]} flex h-full w-full flex-col transition duration-300 ease-in-out hover:scale-105`}>
                <img src={image.image} alt={parsedTourPackage[0]?.name + " image " + index} className="h-full w-full rounded-lg object-cover"></img>
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
            <div className="flex flex-col gap-8 rounded-2xl border-[1px] p-8" id="packageType">
              <div className="flex flex-col gap-4 rounded-2xl border-[1px] p-8">
                <div>
                  <p className="text-xl font-semibold">Package Type</p>
                  <div className="flex gap-4 pt-4">
                    {parsedTourPackage[0]?.package_type.map((packageType, index) => {
                      return (
                        <Button
                          className={`flex rounded-2xl border-[1px] ${indexPackage == index ? "bg-teal-500 text-black" : ""}`}
                          variant={"outline"}
                          key={index}
                          onClick={() => {
                            setIndexPackage(index);
                          }}
                        >
                          <Package />
                          <p>{packageType.name}</p>
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div>
                  <p className="text-xl font-semibold">Package Amenities</p>
                  <p>These are amenities that are available for all packages</p>
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    {parsedTourPackage[0]?.package_amenity.map((amenity, index) => {
                      return (
                        <div key={index} className="flex gap-4 rounded-full border-[1px] p-2 px-4">
                          <Box />
                          <p>{amenity.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div>
                  <p className="text-xl font-semibold">Package Type Amenities</p>
                  <p>These are amenities that are available for the selected package</p>
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    {parsedTourPackage[0]?.package_type[indexPackage].package_type_amenity.map((amenity, index) => {
                      return (
                        <div key={index} className="flex gap-4 rounded-full border-[1px] p-2 px-4">
                          <Box />
                          <p>{amenity.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="flex items-center gap-4">
                  <div className="flex w-2/3 items-center gap-4">
                    <p className="text-xl font-semibold">Select Tour Date</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} className="p-6">
                          <p>{date?.toLocaleDateString()}</p>
                          <CalendarIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={{
                            before: new Date(parsedTourPackage[0]?.start_date),
                            after: new Date(parsedTourPackage[0]?.end_date),
                          }}
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <p className="text-xl font-semibold">Quantity</p>
                  <div className="flex w-1/3 items-center gap-4 rounded-full border-[1px] p-2 px-4">
                    <p>Person</p>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        setQuantity(quantity + 1);
                      }}
                      className="p-2"
                    >
                      <Plus />
                    </Button>
                    <p>{quantity}</p>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        if (quantity > 1) {
                          setQuantity(quantity - 1);
                        }
                      }}
                      className="p-2"
                    >
                      <Minus />
                    </Button>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="flex justify-between">
                  <div>
                    <p className="text-2xl font-semibold">PHP {Number(parsedTourPackage[0]?.package_type[indexPackage].price_per_person) * quantity}</p>
                    <p>Check all required fields before proceeding</p>
                  </div>
                  <Button
                    variant={"outline"}
                    className="h-full bg-teal-500 px-10 text-black"
                    onClick={() => {
                      navigate("/booking");
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border-[1px] p-8">
              <p className="pb-4 text-xl font-semibold" id="reviews">
                Reviews
              </p>
            </div>
          </div>
          <div className="sticky top-20 h-full w-1/3 rounded-2xl border-[1px] p-8">
            <p className="pb-4 text-xl font-semibold">Package Type Itinerary</p>
            <div>
              {parsedTourPackage[0]?.package_type[indexPackage]?.package_route_point?.map((routePoints, index) => {
                return (
                  <div key={index} className="mb-4 flex flex-col gap-2 rounded-xl border-[1px] p-4">
                    <div className="flex gap-4">
                      <div className="flex gap-4 rounded-xl border-[1px] p-2 px-4">
                        <p className="border-r-2 pr-4">Route {routePoints.point_number}</p>
                        <p>Day {routePoints.day}</p>
                      </div>
                    </div>
                    <div className="flex justify-between gap-2">
                      <MapPin />
                      <div className="flex w-full justify-between">
                        <p>{routePoints.location}</p>
                        <p>
                          {new Date(`1970-01-01T${routePoints.start_time}`).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p>{routePoints.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackagePage;
