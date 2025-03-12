import { useEffect, useState } from "react";
import { LucideSearch, Search as SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import api from "../../api/api";
import SearchDestination from "../SearchBar/SearchDestination";
import SearchDate from "../SearchBar/SearchDate";
import SearchPrice from "../SearchBar/SearchPrice";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useMediaQuery } from "react-responsive";
import { formatDate } from "@/lib/SearchPage/dataFormatter";

interface forNavBar {
  navBar: boolean;
  homePage?: boolean;
}

interface Destination {
  description: string;
  image: string;
  name: string;
  Destination: string;
}

function Search({ navBar, homePage }: forNavBar) {
  const [destinations, setDestinationsData] = useState([]);
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await api.get("apps/destination/list/");
      setDestinationsData(response.data);
    } catch (err) {}
  };

  const parsedDestinations: Destination[] = destinations;

  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const [secondDate, setSecondDate] = useState<Date | null>(null);

  const [minimumPrice, setMinimumPrice] = useState<string | null>(null);
  const [maximumPrice, setMaximumPrice] = useState<string | null>(null);

  const [searchItem, setSearchItem] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string | null>("Set Location");
  const [filteredDestinations, setFilteredDestinations] =
    useState<Destination[]>(parsedDestinations);

  const [locPopoverOpen, setLocPopoverOpen] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = parsedDestinations.filter((destination) => {
      return destination.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredDestinations(filteredItems);
  };

  const mediumScreen = useMediaQuery({ query: "(max-width: 1024px)" });

  const destination = selectedDestination === "Set Location" ? "None" : selectedDestination;
  const startDate = firstDate
    ? formatDate(firstDate.toLocaleDateString().replace(/\//g, "-"))
    : "None";
  const endDate = secondDate
    ? formatDate(secondDate.toLocaleDateString().replace(/\//g, "-"))
    : "None";
  const minPrice = minimumPrice || "None";
  const maxPrice = maximumPrice || "None";

  const searchUrl = `/search/${destination}/${startDate}/${endDate}/${minPrice}/${maxPrice}/1`;

  return (
    <div
      className={
        "gap-4" +
        (navBar
          ? ""
          : "flex items-center justify-center rounded-full border-[1px] bg-[#f4f4f5] dark:bg-[#09090b]")
      }
    >
      <div className={`${navBar ? "" : "flex items-center"} gap-4 ${homePage ? "p-2" : ""}`}>
        {navBar ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`flex h-full w-full shadow-lg ${homePage ? "sm:w-[400px] md:w-[450px] lg:w-full" : ""}`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="rounded-full border-[1px] bg-teal-500 p-2 text-black shadow-lg">
                    <LucideSearch className="" />
                  </div>
                  <p className="w-full pr-8 text-xs sm:pr-10 md:text-sm">Search TrailVenture</p>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={
                homePage || mediumScreen
                  ? `t-2 flex w-[330px] flex-col gap-2 rounded-[20px] md:gap-4 shadow-xl`
                  : `mt-2 flex w-full flex-row gap-4 rounded-full shadow-xl`
              }
            >
              <SearchDestination
                locPopoverOpen={locPopoverOpen}
                setLocPopoverOpen={setLocPopoverOpen}
                selectedDestination={selectedDestination}
                searchItem={searchItem}
                handleInputChange={handleInputChange}
                filteredDestinations={filteredDestinations}
                setSelectedDestination={setSelectedDestination}
              />
              <SearchDate
                firstDate={firstDate}
                secondDate={secondDate}
                setFirstDate={setFirstDate}
                setSecondDate={setSecondDate}
              />
              <SearchPrice
                state={{ minPrice: minimumPrice, maxPrice: maximumPrice }}
                setMinPrice={setMinimumPrice}
                setMaxPrice={setMaximumPrice}
              />
              <div className="w-full">
                <Button
                  variant="outline"
                  className="h-full w-full bg-teal-500 text-white dark:text-[#09090b] shadow-lg"
                >
                  <Link
                    to={searchUrl}
                  >
                    <p className="text-md px-2 py-2">Find My Trailventure</p>
                  </Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <>
            <SearchDestination
              locPopoverOpen={locPopoverOpen}
              setLocPopoverOpen={setLocPopoverOpen}
              selectedDestination={selectedDestination}
              searchItem={searchItem}
              handleInputChange={handleInputChange}
              filteredDestinations={filteredDestinations}
              setSelectedDestination={setSelectedDestination}
            />
            <SearchDate
              firstDate={firstDate}
              secondDate={secondDate}
              setFirstDate={setFirstDate}
              setSecondDate={setSecondDate}
            />
            <SearchPrice
              state={{ minPrice: minimumPrice, maxPrice: maximumPrice }}
              setMinPrice={setMinimumPrice}
              setMaxPrice={setMaximumPrice}
            />
            <Button variant="outline" className="h-full bg-teal-500 text-white dark:text-[#09090b] shadow-lg">
              <Link
                to={searchUrl}
              >
                {!navBar ? (
                  <p className="text-md px-2 py-2">Find My Trailventure</p>
                ) : (
                  <div className="py-[3px] ">
                    <SearchIcon />
                  </div>
                )}
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
export default Search;
