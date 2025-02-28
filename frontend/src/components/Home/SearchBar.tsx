import { useEffect, useState } from "react";
import {
  MapPin,
  PhilippinePeso,
  Search as SearchIcon,
  MapPinned,
} from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import api from "../../lib/api";

interface forNavBar {
  navBar: boolean;
}

interface Destination {
  description: string,
  image: string,
  name: string,
  Destination: string,
}

function Search({ navBar }: forNavBar) {
  const [destinations, setDestinationsData] = useState([]);
  useEffect(() => {
    getUserData();
  }, []);

  
  const getUserData = async () => {
    try {
      const response = await api.get("apps/destination/list/");
      setDestinationsData(response.data);
    } catch (err) {
      
    }
  };

  const parsedDestinations : Destination[] = destinations;

  const [firstDate, setFirstDate] = useState<Date>(new Date());
  const [secondDate, setSecondDate] = useState<Date>(new Date());

  const [minimumPrice, setMinimumPrice] = useState<number[] | null>([580]);
  const [maximumPrice, setMaximumPrice] = useState<number[] | null>([12000]);

  const [searchItem, setSearchItem] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string | "">("Set Location");
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>(parsedDestinations);

  const [locPopoverOpen, setLocPopoverOpen] = useState<boolean>(false);

  function saveToStorage({ name, variable }: { name: string; variable: any }) {
    if (selectedDestination) {
      localStorage.setItem(name, variable);
    }
  }
  saveToStorage({ name: "destination", variable: selectedDestination });
  saveToStorage({ name: "FirstDate", variable: firstDate });
  saveToStorage({ name: "LastDate", variable: secondDate });
  saveToStorage({ name: "Minimum", variable: minimumPrice });
  saveToStorage({ name: "Maximum", variable: maximumPrice });

  const loadStorage = () => {
    const Destination = localStorage.getItem("Destination");
    if (Destination) setSelectedDestination(Destination);

    const firstDate = localStorage.getItem("FirstDate");
    if (firstDate) setFirstDate(new Date(firstDate));

    const lastDate = localStorage.getItem("LastDate");
    if (lastDate) setSecondDate(new Date(lastDate));

    const minimumPrice = localStorage.getItem("Minimum");
    if (minimumPrice) setMinimumPrice([Number(minimumPrice)]);

    const maximumPrice = localStorage.getItem("Maximum");
    if (maximumPrice) setMaximumPrice([Number(maximumPrice)]);
  };

  useEffect(() => {
    loadStorage();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = parsedDestinations.filter((destination) => {
      return destination.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredDestinations(filteredItems);
  };

  return (
    <div
      className={
        "flex items-center gap-4 " +
        (navBar
          ? " "
          : "rounded-full border-[1px] bg-[#f4f4f5] px-4 py-2 dark:bg-[#09090b]")
      }
    >
      <div className="flex items-center gap-4">
        <Popover open={locPopoverOpen} onOpenChange={setLocPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex h-full gap-4 px-6 pr-8">
              <MapPin />
              <div className="flex h-full flex-col justify-center text-left">
                {!navBar ? (
                  <div>
                    <p className="text-md font-bold">Destination</p>
                    <p className="text-xs">
                      {selectedDestination
                        ? selectedDestination
                        : "Enter your Destination"}
                    </p>
                  </div>
                ) : (
                  <p className="text-md font-bold">
                    {selectedDestination ? selectedDestination : "Destination"}
                  </p>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px]">
            <div className="text-center">
              <p className="pb-3">Set your destination</p>
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
                        setLocPopoverOpen(false);
                      }}
                    >
                      <MapPinned/>
                      <div className="w-5/6">
                        <p>{destination.name}</p>
                        <p className="text-xs">{destination.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex h-full gap-4 px-6 pr-8">
              <CalendarIcon />
              <div className="flex h-full flex-col justify-center text-left">
                {!navBar ? (
                  <div>
                    <p className="text-md font-bold">Date</p>
                    <p className="text-xs">
                      {firstDate.toLocaleDateString() ===
                        new Date().toLocaleDateString() &&
                      secondDate.toLocaleDateString() ===
                        new Date().toLocaleDateString()
                        ? "Choose your date"
                        : firstDate.toLocaleDateString() +
                          " to " +
                          secondDate.toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-md font-bold">
                    {firstDate.toLocaleDateString() ==
                      new Date().toLocaleDateString() &&
                    secondDate.toLocaleDateString() ==
                      new Date().toLocaleDateString()
                      ? "Date"
                      : firstDate.toLocaleDateString() +
                        " to " +
                        secondDate.toLocaleDateString()}
                  </p>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          {}
          <PopoverContent className="w-full flex-row">
            <div className="text-center">
              <p className="pb-3">Set your range of stay</p>
              <DropdownMenuSeparator />
            </div>
            <div className="flex">
              <Calendar
                mode="single"
                selected={firstDate}
                onSelect={(date) => {
                  if (date && date < secondDate) {
                    date && setFirstDate(date);
                  }
                }}
              />
              <Calendar
                mode="single"
                selected={secondDate}
                onSelect={(date) => {
                  if (date && date > firstDate) {
                    setSecondDate(date);
                  }
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex h-full gap-4 px-6 pr-8">
              <PhilippinePeso />
              <div className="flex h-full flex-col justify-center text-left">
                {!navBar ? (
                  <div>
                    <p className="text-md font-bold">Price</p>
                    <p className="text-xs">
                      {minimumPrice &&
                      minimumPrice[0] === 580 &&
                      maximumPrice &&
                      maximumPrice[0] === 12000
                        ? "Enter your budget"
                        : "PHP " +
                          minimumPrice +
                          " to " +
                          "PHP " +
                          maximumPrice}
                    </p>
                  </div>
                ) : (
                  <p className="text-md font-bold">
                    {minimumPrice &&
                    minimumPrice[0] === 580 &&
                    maximumPrice &&
                    maximumPrice[0] === 12000
                      ? "Price"
                      : "PHP " + minimumPrice + " to " + "PHP " + maximumPrice}
                  </p>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px]">
            <div className="text-center">
              <p className="pb-3">Set your price range</p>
              <DropdownMenuSeparator />
            </div>
            <div className="flex flex-col gap-8 pb-2 pt-4">
              <div className="flex items-center gap-4">
                <p>Minimum</p>
                <Slider
                  defaultValue={[580]}
                  max={12000}
                  step={100}
                  min={580}
                  onValueChange={(e) => {
                    if (e[0] <= maximumPrice![0]) {
                      setMinimumPrice(e);
                    }
                  }}
                  value={minimumPrice!}
                />
                <Input
                  className="w-1/3"
                  onChange={(e) => {
                    if (Number(e.target.value) <= maximumPrice![0]) {
                      setMinimumPrice([Number(e.target.value)]);
                    }
                  }}
                  value={minimumPrice![0]}
                ></Input>
              </div>
              <div className="flex items-center gap-4">
                <p>Maximum</p>
                <Slider
                  defaultValue={[50]}
                  max={12000}
                  step={100}
                  min={580}
                  onValueChange={(e) => {
                    if (e[0] >= minimumPrice![0]) {
                      setMaximumPrice(e);
                    }
                  }}
                  value={maximumPrice!}
                />
                <Input
                  className="w-1/3"
                  onChange={(e) => {
                    if (Number(e.target.value) >= minimumPrice![0]) {
                      setMaximumPrice([Number(e.target.value)]);
                    }
                  }}
                  value={maximumPrice![0]}
                ></Input>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          className="h-full bg-teal-500 text-white dark:text-[#09090b]"
        >
          <Link
            to={`/search/${selectedDestination}/${firstDate.toLocaleDateString().replace(/\//g, "-")}/${secondDate.toLocaleDateString().replace(/\//g, "-")}/${minimumPrice}/${maximumPrice}`}
          >
            {!navBar ? (
              <p className="text-md px-2 py-2">Find My Trailventure</p>
            ) : (
              <div className="py-[3px]">
                <SearchIcon />
              </div>
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
}
export default Search;
