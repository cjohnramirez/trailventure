import NavBar from "@/components/Home/NavBar";
import { Button } from "../components/UI/button";
// import { useParams } from "react-router-dom";
import {
  ChevronDown,
  CircleCheck,
  Flag,
  MapPin,
  MapPinned,
  PhilippinePeso,
  X,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/UI/input";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ManilaImage from "../assets/Home/manila.jpg";
import { Link } from "react-router-dom";

function SearchPage() {
  // const { location, startdate, enddate, startprice, endprice } = useParams();

  // const searchQuery: String[] = [
  //   location || "",
  //   startdate || "",
  //   enddate || "",
  //   startprice || "",
  //   endprice || "",
  // ];

  const reviewScores: String[] = [
    "Excellent +5",
    "Very Good +4",
    "Good +3",
    "Bad +2",
    "Terrible +1",
  ];

  const nameOfPackage = "Manila All-Expense Tour";

  return (
    <>
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar change={false} />
      </div>
      <div className="flex">
        <aside className="sticky top-20 mx-8 my-4 flex h-[850px] w-2/5 flex-col gap-4 rounded-2xl border-[1px] p-8">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Filters</p>
            <Button variant={"outline"}>
              <X />
              Clear Filter
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-2xl border-[1px] p-4">
            <div className="flex gap-4">
              <CircleCheck />
              <p>Availability</p>
            </div>
            <Switch />
          </div>
          <div className="rounded-2xl border-[1px] p-4">
            <div className="flex gap-4">
              <PhilippinePeso />
              <p>Price Range</p>
            </div>
            <div className="flex items-center gap-4 py-4">
              <p>Minimum</p>
              <Slider />
              <Input className="w-1/3" />
            </div>
            <div className="flex items-center gap-4">
              <p>Maximum</p>
              <Slider />
              <Input className="w-1/3" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between rounded-2xl border-[1px] p-4">
              <div className="flex gap-4">
                <Flag />
                <p>Country</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"}>
                    <ChevronDown />
                    <p>Select country</p>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <p>Country A</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <p>Country B</p>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between rounded-2xl border-[1px] p-4">
              <div className="flex gap-4">
                <MapPin />
                <p>Destination Type</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"}>
                    <ChevronDown />
                    <p>Select destination type</p>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <p>Country A</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <p>Country B</p>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between rounded-2xl border-[1px] p-4">
              <div className="flex gap-4">
                <MapPinned />
                <p>Destinations</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"}>
                    <ChevronDown />
                    <p>Select destination</p>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <p>Country A</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <p>Country B</p>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
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
                    <Button id={review.toString()} key={index} className="w-full" variant={"outline"}>
                      <p className="text-left">{review}</p>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
          <Button
            variant={"outline"}
            className="w-full bg-teal-500 text-white dark:text-[#09090b]"
          >
            Apply Filter
          </Button>
        </aside>
        <div className="mx-8 my-4 flex w-3/5 flex-col gap-4 rounded-2xl border-[1px] p-8">
          <Link to={`/package/${nameOfPackage}`}>
            <div className="flex justify-between">
              <p className="text-xl font-semibold">Search Results</p>
              <div className="rounded-2xl border-[1px] px-8 py-2">
                <p className="text-sm">Found 1 search result</p>
              </div>
            </div>
            <div className="w-1/2 rounded-xl border-[1px] p-2">
              <div>
                <img src={ManilaImage} alt={ManilaImage} className="rounded-xl"></img>
              </div>
              <div className="mt-2 rounded-xl border-[1px] p-4">
                <p className="text-lg font-semibold">{nameOfPackage}</p>
                <p className="text-xs">
                  Experience what Manila has to offer in this amazing tour
                  package, suited just for you!
                </p>

                <div className="flex flex-row items-center justify-between gap-4 pt-8">
                  <div>
                    <p className="text-sm font-semibold">Cheapest Package</p>
                    <p className="text-xs">Price per person</p>
                  </div>
                  <div className="rounded-xl border-[1px] px-4 py-2">
                    <p className="text-sm font-semibold">PHP 20,500</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
export default SearchPage;
