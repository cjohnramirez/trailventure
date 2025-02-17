import { useState } from "react";
import { MapPin, PhilippinePeso, Search as SearchIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface forNavBar {
  navBar: boolean;
}

function Search({ navBar }: forNavBar) {
  const [firstDate, setFirstDate] = useState<Date | null>(new Date());
  const [secondDate, setSecondDate] = useState<Date | null>(new Date());

  return (
    <div className="flex items-center gap-4 rounded-full border-[1px] bg-[#f4f4f5] px-4 py-2 dark:bg-[#09090b] m-[-6px]">
      <div className="flex items-center gap-4">
        <Button variant="outline" className="flex h-full gap-4 px-6 pr-8">
          <MapPin />
          <div className="flex h-full flex-col justify-center text-left">
            <p className="text-md font-bold">Location</p>
            {!navBar ? <p className="text-xs">Enter your location</p> : <></>}
          </div>
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex h-full gap-4 px-6 pr-8">
              <CalendarIcon />
              <div className="flex h-full flex-col justify-center text-left">
                <p className="text-md font-bold">Date</p>
                {!navBar ? <p className="text-xs">Choose your date</p> : <></>}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full flex-row">
            <div className="text-center">
              <p className="pb-3">Set your range of stay</p>
              <DropdownMenuSeparator />
            </div>
            <div className="flex">
              <Calendar
                mode="single"
                selected={firstDate || undefined}
                onSelect={(date) => date && setFirstDate(date)}
              />
              <Calendar
                mode="single"
                selected={secondDate || undefined}
                onSelect={(date) => date && setSecondDate(date)}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Button variant="outline" className="flex h-full gap-4 px-6 pr-8">
          <PhilippinePeso />
          <div className="flex h-full flex-col justify-center text-left">
            <p className="text-md font-bold">Price</p>
            {!navBar ? <p className="text-xs">Enter your budget</p> : <></>}
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-full bg-teal-500 text-white dark:text-[#09090b]"
        >
          {!navBar ? (
            <p className="py-2 px-2 text-md">Find My Trailventure</p>
          ) : (
            <div className="py-[6px]">
              <SearchIcon />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
export default Search;
