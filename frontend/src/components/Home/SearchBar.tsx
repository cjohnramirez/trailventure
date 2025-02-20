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

interface forNavBar {
  navBar: boolean;
}

interface Location {
  number_of_properties: number;
  city: string;
  country: string;
  description: string;
}

function Search({ navBar }: forNavBar) {
  const locations: Location[] = [
    {
      number_of_properties: 25,
      city: "Manila",
      country: "Philippines",
      description:
        "Capital of the Philippines, known for its waterfront and Chinatown.",
    },
    {
      number_of_properties: 30,
      city: "Tokyo",
      country: "Japan",
      description: "Japan's capital, famous for skyscrapers and pop culture.",
    },
    {
      number_of_properties: 15,
      city: "New York",
      country: "USA",
      description:
        "Largest city in the USA, known for Times Square and Central Park.",
    },
    {
      number_of_properties: 20,
      city: "Paris",
      country: "France",
      description:
        "France's capital, renowned for art, fashion, and the Eiffel Tower.",
    },
    {
      number_of_properties: 31,
      city: "Dubai",
      country: "UAE",
      description:
        "Known for modern architecture, luxury shopping, and nightlife.",
    },
    {
      number_of_properties: 26,
      city: "Bangkok",
      country: "Thailand",
      description: "Thailand's capital, famous for shrines and street life.",
    },
  ];

  const [firstDate, setFirstDate] = useState<Date>(new Date());
  const [secondDate, setSecondDate] = useState<Date>(new Date());

  const [minimum, setMinimum] = useState<number[] | null>([580]);
  const [maximum, setMaximum] = useState<number[] | null>([12000]);

  const [searchItem, setSearchItem] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>();
  const [filteredLocations, setFilteredLocations] =
    useState<Location[]>(locations);

  const [locPopoverOpen, setLocPopoverOpen] = useState<boolean>(false);

  function saveToStorage({ name, variable }: { name: string; variable: any }) {
    if (selectedLocation) {
      localStorage.setItem(name, variable);
    }
  }
  saveToStorage({ name: "Location", variable: selectedLocation });
  saveToStorage({ name: "FirstDate", variable: firstDate });
  saveToStorage({ name: "LastDate", variable: secondDate });
  saveToStorage({ name: "Minimum", variable: minimum });
  saveToStorage({ name: "Maximum", variable: maximum });

  const loadStorage = () => {
    const location = localStorage.getItem("Location");
    if (location) setSelectedLocation(location);

    const firstDate = localStorage.getItem("FirstDate");
    if (firstDate) setFirstDate(new Date(firstDate));

    const lastDate = localStorage.getItem("LastDate");
    if (lastDate) setSecondDate(new Date(lastDate));

    const minimum = localStorage.getItem("Minimum");
    if (minimum) setMinimum([Number(minimum)]);

    const maximum = localStorage.getItem("Maximum");
    if (maximum) setMaximum([Number(maximum)]);
  };

  useEffect(() => {
    loadStorage();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = locations.filter((location) => {
      return location.city.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredLocations(filteredItems);
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
                    <p className="text-md font-bold">Location</p>
                    <p className="text-xs">
                      {selectedLocation
                        ? selectedLocation
                        : "Enter your location"}
                    </p>
                  </div>
                ) : (
                  <p className="text-md font-bold">
                    {selectedLocation ? selectedLocation : "Location"}
                  </p>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="text-center">
              <p className="pb-3">Set your destination</p>
              <DropdownMenuSeparator />
            </div>
            <div className="pt-2">
              <Input value={searchItem} onChange={handleInputChange} />
              <div className="pt-2">
                {filteredLocations.map((location, index) => {
                  if (index > 2) {
                    return null;
                  }
                  return (
                    <div
                      key={index}
                      className="flex h-20 cursor-pointer items-center gap-4 rounded-xl p-4 hover:bg-zinc-900"
                      onClick={() => {
                        setSelectedLocation(location.city);
                        setLocPopoverOpen(false);
                      }}
                    >
                      <MapPinned />
                      <div>
                        <p>{location.city}</p>
                        <p className="text-xs">{location.description}</p>
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
                      {minimum &&
                      minimum[0] === 580 &&
                      maximum &&
                      maximum[0] === 12000
                        ? "Enter your budget"
                        : "PHP " + minimum + " to " + "PHP " + maximum}
                    </p>
                  </div>
                ) : (
                  <p className="text-md font-bold">
                    {minimum &&
                    minimum[0] === 580 &&
                    maximum &&
                    maximum[0] === 12000
                      ? "Price"
                      : "PHP " + minimum + " to " + "PHP " + maximum}
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
                  step={1}
                  min={580}
                  onValueChange={(e) => {
                    if (e[0] <= maximum![0]) {
                      setMinimum(e);
                    }
                  }}
                  value={minimum!}
                />
                <Input
                  className="w-1/3"
                  onChange={(e) => {
                    if (Number(e.target.value) <= maximum![0]) {
                      setMinimum([Number(e.target.value)]);
                    }
                  }}
                  value={minimum![0]}
                ></Input>
              </div>
              <div className="flex items-center gap-4">
                <p>Maximum</p>
                <Slider
                  defaultValue={[50]}
                  max={12000}
                  step={1}
                  min={580}
                  onValueChange={(e) => {
                    if (e[0] >= minimum![0]) {
                      setMaximum(e);
                    }
                  }}
                  value={maximum!}
                />
                <Input
                  className="w-1/3"
                  onChange={(e) => {
                    if (Number(e.target.value) >= minimum![0]) {
                      setMaximum([Number(e.target.value)]);
                    }
                  }}
                  value={maximum![0]}
                ></Input>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          className="h-full bg-teal-500 text-white dark:text-[#09090b]"
        >
          <Link to="/search">
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
