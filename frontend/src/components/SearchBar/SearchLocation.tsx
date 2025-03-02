import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";

interface SearchLocationProps {
  firstDate: Date;
  secondDate: Date;
  setFirstDate: (date: Date) => void;
  setSecondDate: (date: Date) => void;
}

export default function SearchLocation({
  firstDate,
  secondDate,
  setFirstDate,
  setSecondDate,
}: SearchLocationProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex h-full w-full justify-start gap-4 px-6 pr-8"
        >
          <CalendarIcon />
          <div className="flex h-full flex-col justify-center text-left">
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
            mode="range"
            selected={{ from: firstDate, to: secondDate }}
            onSelect={(range) => {
              if (range) {
                if (range.from) {
                  setFirstDate(range.from);
                }
                if (range.to) {
                  setSecondDate(range.to);
                }
              }
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
