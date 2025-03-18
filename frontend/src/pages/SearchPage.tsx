import NavBar from "@/components/NavBar/NavBar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { Link } from "react-router-dom";
import { tourPackage } from "@/lib/TourPackagePage/tourPackage";
import SearchPageDate from "@/components/Pages/SearchPage/SearchPageDate";
import SearchPageDestination from "@/components/Pages/SearchPage/SearchPageDestination";
import SearchPagePrice from "@/components/Pages/SearchPage/SearchPagePrice";
import SearchPageReview from "@/components/Pages/SearchPage/SearchPageReview";
import { useMediaQuery } from "react-responsive";
import { useSearchQuery, useDestinationQuery } from "@/hooks/tanstack/search/useQuerySearch";
import { searchQuery } from "@/lib/SearchPage/searchQuery";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDate } from "@/lib/SearchPage/dataFormatter";

interface Destination {
  description: string;
  image: string;
  name: string;
  Destination: string;
}

function SearchPage() {
  const { location, startdate, enddate, startprice, endprice, pagenumber } = useParams();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState<string | null>(startdate || null);
  const [endDate, setEndDate] = useState<string | null>(enddate || null);
  const [minPrice, setMinPrice] = useState<string | null>(
    startprice === "None" ? null : startprice || null,
  );
  const [maxPrice, setMaxPrice] = useState<string | null>(
    endprice === "None" ? null : endprice || null,
  );
  const [destination, setDestination] = useState<string | null>(location || null);
  const [reviewScore, setReviewScore] = useState<string | null>(null);
  const [_pageRefresh, setPageRefresh] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(Number(pagenumber) || 1);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  useEffect(() => {
    setPageRefresh(true);
  }, []);

  const searchParams: searchQuery = {
    destination: destination === "Set Location" ? "None" : destination || "None",
    start_date: startdate || "None",
    end_date: enddate || "None",
    min_price: Number(minPrice) || "None",
    max_price: Number(maxPrice) || "None",
    page: pageNumber,
  };

  const { data: searchData, refetch, isLoading } = useSearchQuery(searchParams);

  const { data: destinations } = useDestinationQuery();

  const [searchItem, setSearchItem] = useState<string>("None");
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = destinations?.filter((destination: Destination) => {
      return destination.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredDestinations(filteredItems || []);
  };

  const [selectedDestination, setSelectedDestination] = useState<string>("Set Location");
  const [locPopoverOpen, setLocPopoverOpen] = useState<boolean>(false);

  const reviewScores: string[] = ["5", "4", "3", "2", "1"];

  const altReviewScores: string[] = ["Excellent", "Great", "Good", "Bad", "Terrible"];

  const searchDestination = selectedDestination === "Set Location" ? "None" : selectedDestination;
  const formattedStartDate = startDate ? formatDate(startDate.replace(/\//g, "-")) : "None";
  const formattedEndDate = endDate ? formatDate(endDate.replace(/\//g, "-")) : "None";
  const minimumPrice = minPrice || "None";
  const maximumPrice = maxPrice || "None";

  const applyFilters = () => {
    navigate(
      `/search/${searchDestination || "None"}/${formattedStartDate || "None"}/${formattedEndDate || "None"}/${minimumPrice || "None"}/${maximumPrice || "None"}/1`,
    );
    refetch();
  };

  const incrementPageNumber = () => {
    const newPageNumber = pageNumber + 1;
    setIsPageLoading(true); // Set loading state to true
    setPageNumber(newPageNumber);
    navigate(
      `/search/${location}/${startdate}/${enddate}/${startprice}/${endprice}/${newPageNumber}`,
    );
    setIsPageLoading(false);
  };

  const decrementPageNumber = () => {
    const newPageNumber = pageNumber > 1 ? pageNumber - 1 : 1;
    setIsPageLoading(true); // Set loading state to true
    setPageNumber(newPageNumber);
    navigate(
      `/search/${location}/${startdate}/${enddate}/${startprice}/${endprice}/${newPageNumber}`,
    );
    setIsPageLoading(false);
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setMinPrice(null);
    setMaxPrice(null);
    setDestination(null);
    setReviewScore(null);
    setSelectedDestination("Set Location");
    setPageNumber(1);
    navigate(`/search/None/None/None/None/None/1`);
  };

  const largeScreen = useMediaQuery({ query: "(max-width: 1280px)" });

  return (
    <>
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 shadow-md dark:bg-[#09090b]">
        <NavBar isNavBar={false} isHomePage={true} />
      </div>
      <div className="w-screen flex-col md:flex-row lg:flex">
        <aside className="m-8 flex h-full flex-col gap-4 sm:rounded-2xl sm:border-[1px] sm:p-8 sm:shadow-lg lg:sticky lg:top-20 lg:mt-2 lg:w-2/5 lg:overflow-y-scroll">
          <div className="flex items-center justify-between lg:pb-4">
            <div className="flex items-center gap-4 lg:gap-0">
              <Button
                variant={"outline"}
                className="block lg:hidden"
                onClick={() => setOpenFilter(!openFilter)}
              >
                <ChevronDown />
              </Button>
              <p className="text-xl font-semibold">Filters</p>
            </div>
            <Button variant={"outline"} onClick={resetFilters} className="shadow-md">
              <X />
              Clear Filter
            </Button>
          </div>
          <div className={`space-y-4 ${openFilter ? "block" : "hidden"} lg:block`}>
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
              className="w-full bg-teal-500 text-white shadow-md dark:text-[#09090b]"
              onClick={applyFilters}
            >
              Apply Filter
            </Button>
          </div>
        </aside>
        <div className="m-8 flex flex-col gap-4 rounded-2xl sm:border-[1px] sm:p-8 sm:shadow-lg lg:ml-0 lg:mt-2 lg:w-3/5">
          <div className="items-end justify-between lg:flex">
            <div className="items-center justify-end gap-4 pb-4 lg:pb-0 xl:flex xl:w-1/2">
              <p className="pb-2 text-center text-xl font-semibold sm:text-left xl:pb-0">
                Search Results
              </p>
              <div className="rounded-2xl border-[1px] px-8 py-2 shadow-md">
                <p className="text-center text-sm sm:text-left">
                  Found {searchData?.results?.length} search result
                </p>
              </div>
            </div>
            <Pagination className="m-0 flex select-none lg:w-1/2 lg:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={decrementPageNumber}
                    className="cursor-pointer border-[1px] shadow-lg"
                  />
                </PaginationItem>
                <PaginationItem>
                  <p className="px-4 text-center text-sm">Page {pageNumber}</p>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={incrementPageNumber}
                    className={`cursor-pointer border-[1px] shadow-lg ${searchData && searchData.next === null ? "hidden" : ""}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {!isLoading && !isPageLoading && searchData && searchData?.results?.length > 0 ? (
              searchData.results.map((tourPackage: tourPackage, index: number) => {
                return (
                  <Link to={`/package/${tourPackage.id}/`} key={index}>
                    <div className="h-[400px] flex-row rounded-xl border-[1px] p-4 shadow-md xl:h-full">
                      <div className="h-1/2 w-full pb-4 sm:h-2/3 xl:h-1/2">
                        <img
                          src={
                            "https://res.cloudinary.com/dch6eenk5/" +
                              tourPackage.package_image[0]?.image || "None"
                          }
                          alt={String(tourPackage.package_image[0]?.id || "None")}
                          className="h-full w-full rounded-xl object-cover shadow-md"
                        />
                      </div>
                      <div className="flex h-1/2 flex-col justify-between rounded-xl border-[1px] p-4 shadow-md sm:h-1/3 xl:h-1/2">
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
                            <p className="pb-2 text-xs sm:pb-0">Price per person</p>
                          </div>
                          <div className="rounded-xl border-[1px] shadow-md">
                            <p className="p-2 text-sm font-semibold">
                              PHP{" "}
                              {Math.floor(Number(tourPackage.package_type[0]?.price_per_person)) ||
                                "None"}
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
                  isLoading || isPageLoading
                    ? `hidden`
                    : `col-span-2 flex h-32 items-center justify-center rounded-xl border-[1px] p-4`
                }
              >
                <p>No packages found matching your filters</p>
              </div>
            )}
            {(isLoading || isPageLoading) && (
              <div className="col-span-full h-dvh pb-96">
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
