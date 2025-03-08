import { Button } from "@/components/ui/button";
import { MapPin, MapPinned } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch } from "react";

interface SearchPageDestinationProps {
  locPopoverOpen: boolean;
  selectedDestination: string;
  setLocPopoverOpen: (open: boolean) => void;
  searchItem: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filteredDestinations: { name: string; description: string }[];
  setSelectedDestination: (destination: string) => void;
  dispatch: Dispatch<FilterAction>;
}

type FilterAction = { type: "SET_DESTINATION"; payload: string }


export default function SearchPageDestination({
  locPopoverOpen,
  selectedDestination,
  setLocPopoverOpen,
  searchItem,
  handleInputChange,
  filteredDestinations,
  setSelectedDestination,
  dispatch,
}: SearchPageDestinationProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border-[1px] p-4">
      <div className="flex gap-4">
        <MapPinned />
        <p>Destinations</p>
      </div>
      <Popover open={locPopoverOpen} onOpenChange={setLocPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex h-full gap-4 px-6 pr-8">
            <MapPin />
            <div className="flex h-full flex-col justify-center text-left">
              <p className="text-md">
                {selectedDestination ? selectedDestination : "Destination"}
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
                      <p className="text-xs">{destination.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
