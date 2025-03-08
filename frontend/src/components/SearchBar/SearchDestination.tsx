import { MapPin, MapPinned } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";

interface SearchDateProps {
  locPopoverOpen: boolean;
  setLocPopoverOpen: (open: boolean) => void;
  selectedDestination: string | null;
  searchItem: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filteredDestinations: { name: string; description: string }[];
  setSelectedDestination: (destination: string) => void;
}

export default function SearchDate({
  locPopoverOpen,
  setLocPopoverOpen,
  selectedDestination,
  searchItem,
  handleInputChange,
  filteredDestinations,
  setSelectedDestination,
}: SearchDateProps) {
  return (
    <Popover open={locPopoverOpen} onOpenChange={setLocPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex h-full gap-4 px-6 pr-8 w-full justify-start">
          <MapPin />
          <div className="flex h-full flex-col justify-center text-left">
              <div>
                <p className="text-md font-bold">Destination</p>
                <p className="text-xs">
                  {selectedDestination
                    ? selectedDestination
                    : "Enter your Destination"}
                </p>
              </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:w-[400px]">
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
                  className="flex sm:h-20 cursor-pointer items-center gap-4 rounded-xl p-4 hover:bg-teal-500 hover:text-white"
                  onClick={() => {
                    setSelectedDestination(destination.name);
                    setLocPopoverOpen(false);
                  }}
                >
                  <MapPinned />
                  <div className="text-sm sm:text-base w-5/6">
                    <p>{destination.name}</p>
                    <p className="text-xs sm:block hidden">{destination.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
