import NavBar from "@/components/NavBar/NavBar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { toast } from "@/components/Error/ErrorSonner";
import { tourPackage } from "@/lib/SearchPage/tourPackage";
import SearchPageDate from "@/components/SearchPage/SearchPageDate";
import SearchPageDestination from "@/components/SearchPage/SearchPageDestination";
import SearchPagePrice from "@/components/SearchPage/SearchPagePrice";
import SearchPageReview from "@/components/SearchPage/SearchPageReview";
import { useMediaQuery } from "react-responsive";
import "../components/Loading/Loading.css";

interface Destination {
  description: string;
  image: string;
  name: string;
  Destination: string;
}

function SearchPage() {
  const { location, startdate, enddate, startprice, endprice } = useParams();

  const [tourPackages, setTourPackages] = useState<tourPackage[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredTourPackages, setFilteredTourPackages] = useState<tourPackage[]>([]);
  const [_isFiltered, setIsFiltered] = useState(false);
  const [searchItem, setSearchItem] = useState<string>("");
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);

  const [startDate, setStartDate] = useState<string>(startdate || "");
  const [endDate, setEndDate] = useState<string>(enddate || "");
  const [minPrice, setMinPrice] = useState<string>(startprice || "");
  const [maxPrice, setMaxPrice] = useState<string>(endprice || "");
  const [destination, setDestination] = useState<string>(location || "");
  const [reviewScore, setReviewScore] = useState<string>("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getPackageData();
      applyFilters();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (tourPackages.length > 0) {
      setLoading(true);
      applyFilters();
      setLoading(false);
    }
  }, [tourPackages]);

  const getPackageData = async () => {
    try {
      const response = await api.get("apps/destination/list/");
      setDestinations(response.data);

      const fetchPackage = await api.get("apps/package/list/");
      setTourPackages(fetchPackage.data);
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
      });
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

  const [selectedDestination, setSelectedDestination] = useState<string>("Set Location");
  const [locPopoverOpen, setLocPopoverOpen] = useState<boolean>(false);

  const reviewScores: string[] = ["5", "4", "3", "2", "1"];

  const altReviewScores: string[] = ["Excellent", "Great", "Good", "Bad", "Terrible"];

  const applyFilters = () => {
    const filteredResults = tourPackages.filter((tourPackage: tourPackage) => {
      if (startDate && new Date(tourPackage.start_date) < new Date(startDate)) {
        return false;
      }
      if (endDate && new Date(tourPackage.end_date) > new Date(endDate)) {
        return false;
      }
      if (
        minPrice &&
        tourPackage.package_type[0]?.price_per_person &&
        Number(tourPackage.package_type[0].price_per_person) < Number(minPrice)
      ) {
        return false;
      }
      if (
        maxPrice &&
        tourPackage.package_type[0]?.price_per_person &&
        Number(tourPackage.package_type[0].price_per_person) > Number(maxPrice)
      ) {
        return false;
      }
      if (destination && tourPackage.destination.name !== destination) {
        return false;
      }
      if (reviewScore) {
        // Add review score filtering logic here if needed
      }
      return true;
    });

    setFilteredTourPackages(filteredResults);
    setIsFiltered(true);
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setMinPrice("");
    setMaxPrice("");
    setDestination("");
    setReviewScore("");
    setFilteredTourPackages(tourPackages);
    setIsFiltered(false);
    setSelectedDestination("Set Location");
  };

  const largeScreen = useMediaQuery({ query: "(max-width: 1280px)" });

  return (
    <>
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar isNavBar={false} isHomePage={true} />
      </div>
      <div className="w-screen flex-col md:flex-row lg:flex">
        <aside className="m-8 flex h-full flex-col gap-4 sm:rounded-2xl sm:border-[1px] sm:p-8 lg:sticky lg:top-20 lg:mt-2 lg:w-2/5 lg:overflow-y-scroll">
          <div className="flex items-center justify-between pb-4">
            <p className="text-xl font-semibold">Filters</p>
            <Button variant={"outline"} onClick={resetFilters}>
              <X />
              Clear Filter
            </Button>
          </div>
          <SearchPageDate
            state={{ startDate, endDate }}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
          <SearchPagePrice
            state={{ minPrice, maxPrice }}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
          />
          <SearchPageDestination
            state={destination}
            locPopoverOpen={locPopoverOpen}
            selectedDestination={selectedDestination}
            setLocPopoverOpen={setLocPopoverOpen}
            searchItem={searchItem}
            handleInputChange={handleInputChange}
            filteredDestinations={filteredDestinations}
            setSelectedDestination={setSelectedDestination}
            setDestination={setDestination}
          />
          <SearchPageReview
            reviewScore={reviewScore}
            setReviewScore={setReviewScore}
            altReviewScores={altReviewScores}
            reviewScores={reviewScores}
          />
          <Button
            variant={"outline"}
            className="w-full bg-teal-500 text-white dark:text-[#09090b]"
            onClick={applyFilters}
          >
            Apply Filter
          </Button>
        </aside>
        <div className="m-8 flex flex-col gap-4 rounded-2xl sm:border-[1px] sm:p-8 lg:ml-0 lg:mt-2 lg:w-3/5">
          <div className="justify-between sm:flex">
            <p className="pb-2 text-xl font-semibold sm:pb-0">Search Results</p>
            <div className="rounded-2xl border-[1px] px-8 py-2">
              <p className="text-sm">
                Found {filteredTourPackages.length} search result
                {filteredTourPackages.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {!loading && filteredTourPackages.length > 0 ? (
              filteredTourPackages.map((tourPackage: tourPackage, index) => {
                return (
                  <Link to={`/package/${tourPackage.id}/`} key={index}>
                    <div className="h-[400px] flex-row rounded-xl border-[1px] p-4 xl:h-full">
                      <div className="h-1/2 w-full pb-4 sm:h-2/3 xl:h-1/2">
                        <img
                          src={tourPackage.package_image[0]?.image || ""}
                          alt={String(tourPackage.package_image[0]?.id || "")}
                          className="h-full w-full rounded-xl object-cover"
                        />
                      </div>
                      <div className="flex h-1/2 flex-col justify-between rounded-xl border-[1px] p-4 sm:h-1/3 xl:h-1/2">
                        <div>
                          <p className="text-lg font-semibold">{tourPackage.name}</p>
                          <p className="hidden text-xs sm:block">
                            {largeScreen
                              ? tourPackage.description.substring(0, 70) + "..."
                              : tourPackage.description.substring(0, 100) + "..."}
                          </p>
                        </div>
                        <div className="flex-row items-center justify-between gap-4 sm:flex">
                          <div className="flex-row">
                            <p className="text-sm font-semibold">Cheapest Package</p>
                            <p className="text-xs">Price per person</p>
                          </div>
                          <div className="rounded-xl border-[1px]">
                            <p className="p-2 text-sm font-semibold">
                              PHP{" "}
                              {Math.floor(Number(tourPackage.package_type[0]?.price_per_person)) ||
                                ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div
                className={
                  loading
                    ? `hidden`
                    : `col-span-2 flex h-32 items-center justify-center rounded-xl border-[1px] p-4`
                }
              >
                <p>No packages found matching your filters</p>
              </div>
            )}
            {loading && (
              <div className="col-span-full h-screen pb-96">
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <span className="loader"></span>
                  <p className="mt-10 text-lg">Searching</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPage;
