import NavBar from "@/components/Home/NavBar";
import { Button } from "../components/ui/button";
import { useReducer } from "react";
import { useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, MapPinned, PhilippinePeso, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../lib/api";
import { AxiosError } from "axios";
import { toast } from "../components/Error/ErrorSonner";
import { tourPackage } from "@/lib/SearchPage/tourPackage";

interface FilterState {
  startDate: string | undefined;
  endDate: string | undefined;
  minPrice: string | undefined;
  maxPrice: string | undefined;
  destination: string | undefined;
  reviewScore: string;
}

interface Destination {
  description: string;
  image: string;
  name: string;
  Destination: string;
}

type FilterAction =
  | { type: "SET_START_DATE"; payload: string }
  | { type: "SET_END_DATE"; payload: string }
  | { type: "SET_MIN_PRICE"; payload: string }
  | { type: "SET_MAX_PRICE"; payload: string }
  | { type: "SET_DESTINATION"; payload: string }
  | { type: "SET_REVIEW_SCORE"; payload: string }
  | { type: "RESET_FILTERS" };

function SearchPage() {
  const { location, startdate, enddate, startprice, endprice } = useParams();

  const [tourPackages, setTourPackages] = useState<tourPackage[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredTourPackages, setFilteredTourPackages] = useState<
    tourPackage[]
  >([]);
  const [_isFiltered, setIsFiltered] = useState(false);
  const [searchItem, setSearchItem] = useState<string>("");
  const [filteredDestinations, setFilteredDestinations] = useState<
    Destination[]
  >([]);

  useEffect(() => {
    getPackageData();
    applyFilters();
  }, []);

  const getPackageData = async () => {
    try {
      const fetchPackage = await api.get("apps/package/list/");
      setTourPackages(fetchPackage.data);
      setFilteredTourPackages(fetchPackage.data);

      const response = await api.get("apps/destination/list/");
      setDestinations(response.data);
      setFilteredDestinations(response.data);
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

  const initialState = {
    startDate: startdate || "",
    endDate: enddate || "",
    minPrice: startprice || "",
    maxPrice: endprice || "",
    destination: location || "",
    reviewScore: "",
  };

  const filterReducer = (state: FilterState, action: FilterAction) => {
    switch (action.type) {
      case "SET_START_DATE":
        return { ...state, startDate: action.payload };
      case "SET_END_DATE":
        return { ...state, endDate: action.payload };
      case "SET_MIN_PRICE":
        return { ...state, minPrice: action.payload };
      case "SET_MAX_PRICE":
        return { ...state, maxPrice: action.payload };
      case "SET_DESTINATION":
        return { ...state, destination: action.payload };
      case "SET_REVIEW_SCORE":
        return { ...state, reviewScore: action.payload };
      case "RESET_FILTERS":
        return initialState;
      default:
        return state;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = destinations.filter((destination) => {
      return destination.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredDestinations(filteredItems);
  };

  const [state, dispatch] = useReducer(filterReducer, initialState);
  const [selectedDestination, setSelectedDestination] =
    useState<string>("Set Location");
  const [locPopoverOpen, setLocPopoverOpen] = useState<boolean>(false);

  const reviewScores: string[] = ["5", "4", "3", "2", "1"];

  const altReviewScores: string[] = [
    "Excellent",
    "Great",
    "Good",
    "Bad",
    "Terrible",
  ];

  const applyFilters = () => {
    const filteredResults = tourPackages.filter((tourPackage: tourPackage) => {
      if (
        state.startDate &&
        new Date(tourPackage.start_date) < new Date(state.startDate)
      ) {
        return false;
      }
      if (
        state.endDate &&
        new Date(tourPackage.end_date) > new Date(state.endDate)
      ) {
        return false;
      }
      if (
        state.minPrice &&
        tourPackage.package_type[0]?.price_per_person &&
        Number(tourPackage.package_type[0].price_per_person) <
          Number(state.minPrice)
      ) {
        return false;
      }
      if (
        state.maxPrice &&
        tourPackage.package_type[0]?.price_per_person &&
        Number(tourPackage.package_type[0].price_per_person) >
          Number(state.maxPrice)
      ) {
        return false;
      }
      if (
        state.destination &&
        tourPackage.destination.name !== state.destination
      ) {
        return false;
      }
      if (state.reviewScore) {
        // Add review score filtering logic here if needed
      }
      return true;
    });

    setFilteredTourPackages(filteredResults);
    setIsFiltered(true);
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
    setFilteredTourPackages(tourPackages);
    setIsFiltered(false);
    setSelectedDestination("Set Location");
  };

  return (
    <>
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar change={false} />
      </div>
      <div className="flex">
        <aside className="sticky top-20 mx-8 my-4 flex h-full w-2/5 max-w-[430px] flex-col gap-4 rounded-2xl border-[1px] p-8 overflow-y-scroll">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Filters</p>
            <Button variant={"outline"} onClick={resetFilters}>
              <X />
              Clear Filter
            </Button>
          </div>
          <div className="flex flex-col items-center rounded-2xl border-[1px] p-8">
            <div className="flex w-full gap-4 rounded-2xl border-[1px] p-4">
              <PhilippinePeso />
              <p>Set Date Range</p>
            </div>
            <Calendar
              mode="range"
              selected={{
                from: state.startDate ? new Date(state.startDate) : undefined,
                to: state.endDate ? new Date(state.endDate) : undefined,
              }}
              onSelect={(range) => {
                if (range) {
                  const { from, to } = range;
                  if (from) {
                    dispatch({
                      type: "SET_START_DATE",
                      payload: from.toLocaleDateString() || "",
                    });
                  }
                  if (to) {
                    dispatch({
                      type: "SET_END_DATE",
                      payload: to.toLocaleDateString() || "",
                    });
                  }
                }
              }}
              className="pt-8"
            />
          </div>
          <div className="rounded-2xl border-[1px] p-4">
            <div className="flex gap-4">
              <PhilippinePeso />
              <p>Price Range</p>
            </div>
            <div className="flex items-center gap-4 py-4">
              <p>Minimum</p>
              <Slider
                value={[Number(state.minPrice) || 0]}
                onValueChange={(value) => {
                  const newMinPrice = value[0];
                  if (newMinPrice <= Number(state.maxPrice)) {
                    dispatch({
                      type: "SET_MIN_PRICE",
                      payload: newMinPrice.toString(),
                    });
                  }
                }}
                step={500}
                max={100000}
              />
              <Input
                value={state.minPrice}
                onChange={(e) => {
                  const newMinPrice = Number(e.target.value);
                  if (newMinPrice <= Number(state.maxPrice)) {
                    dispatch({
                      type: "SET_MIN_PRICE",
                      payload: e.target.value,
                    });
                  }
                }}
                className="w-1/3"
              />
            </div>
            <div className="flex items-center gap-4">
              <p>Maximum</p>
              <Slider
                value={[Number(state.maxPrice) || 25000]}
                onValueChange={(value) => {
                  const newMaxPrice = value[0];
                  if (newMaxPrice >= Number(state.minPrice)) {
                    dispatch({
                      type: "SET_MAX_PRICE",
                      payload: newMaxPrice.toString(),
                    });
                  }
                }}
                step={500}
                max={100000}
              />
              <Input
                value={state.maxPrice}
                onChange={(e) => {
                  const newMaxPrice = Number(e.target.value);
                  if (newMaxPrice >= Number(state.minPrice)) {
                    dispatch({
                      type: "SET_MAX_PRICE",
                      payload: e.target.value,
                    });
                  }
                }}
                className="w-1/3"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between rounded-2xl border-[1px] p-4">
              <div className="flex gap-4">
                <MapPinned />
                <p>Destinations</p>
              </div>
              <Popover open={locPopoverOpen} onOpenChange={setLocPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex h-full gap-4 px-6 pr-8"
                  >
                    <MapPin />
                    <div className="flex h-full flex-col justify-center text-left">
                      <p className="text-md font-bold">
                        {selectedDestination
                          ? selectedDestination
                          : "Destination"}
                      </p>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px]">
                  <div className="text-center">
                    <p className="pb-3">Enter your destination</p>
                    <DropdownMenuSeparator />
                  </div>
                  <div className="pt-2">
                    <Input value={searchItem} onChange={handleInputChange} />
                    <div className="pt-2">
                      {filteredDestinations.map((destination, index) => {
                        if (index > 2) {
                          return null;
                        }
                        return (
                          <div
                            key={index}
                            className="flex h-20 cursor-pointer items-center gap-4 rounded-xl p-4 hover:bg-zinc-900"
                            onClick={() => {
                              setSelectedDestination(destination.name);
                              dispatch({
                                type: "SET_DESTINATION",
                                payload: destination.name,
                              });
                              setLocPopoverOpen(false);
                            }}
                          >
                            <MapPinned />
                            <div className="w-5/6">
                              <p>{destination.name}</p>
                              <p className="text-xs">
                                {destination.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <div className="flex-row items-center justify-between rounded-2xl border-[1px] p-4">
              <div className="flex gap-4">
                <MapPinned />
                <p>Review Score</p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                {reviewScores.map((review, index) => {
                  return (
                    <Button
                      id={review.toString()}
                      key={index}
                      className={`w-full ${
                        state.reviewScore === review
                          ? "bg-teal-500 text-black"
                          : ""
                      }`}
                      variant={"outline"}
                      onClick={() => {
                        dispatch({
                          type: "SET_REVIEW_SCORE",
                          payload: review.toString(),
                        });
                      }}
                    >
                      <p className="text-left">
                        {altReviewScores[index]} +{reviewScores[index]}
                      </p>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
          <Button
            variant={"outline"}
            className="w-full bg-teal-500 text-white dark:text-[#09090b]"
            onClick={applyFilters}
          >
            Apply Filter
          </Button>
        </aside>
        <div className="mx-8 my-4 flex w-3/5 flex-col gap-4 rounded-2xl border-[1px] p-8">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Search Results</p>
            <div className="rounded-2xl border-[1px] px-8 py-2">
              <p className="text-sm">
                Found {filteredTourPackages.length} search result
                {filteredTourPackages.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filteredTourPackages.length > 0 ? (
              filteredTourPackages.map((tourPackage: tourPackage, index) => {
                return (
                  <Link to={`/package/${index + 1}`} key={index}>
                    <div className="h-full flex-row rounded-xl border-[1px] p-4">
                      <div className="h-1/2 w-full pb-4">
                        <img
                          src={tourPackage.package_image[0]?.image || ""}
                          alt={String(tourPackage.package_image[0]?.id || "")}
                          className="h-full w-full rounded-xl object-cover"
                        />
                      </div>
                      <div className="flex h-1/2 flex-col justify-between rounded-xl border-[1px] p-4">
                        <div>
                          <p className="text-lg font-semibold">
                            {tourPackage.name}
                          </p>
                          <p className="text-xs">
                            {tourPackage.description.substring(0, 50) + "..."}
                          </p>
                        </div>
                        <div className="flex flex-row items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold">
                              Cheapest Package
                            </p>
                            <p className="text-xs">Price per person</p>
                          </div>
                          <div className="rounded-xl border-[1px]">
                            <p className="p-2 text-sm font-semibold">
                              PHP{" "}
                              {Math.floor(
                                Number(
                                  tourPackage.package_type[0]?.price_per_person,
                                ),
                              ) || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-2 flex h-32 items-center justify-center rounded-xl border-[1px] p-4">
                <p>No packages found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPage;
