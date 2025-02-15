import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Calendar as CalendarIcon, MoveRight } from "lucide-react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const NavBarPopCalendar = ({
  setFirstDate,
  setSecondDate,
  firstDate,
  secondDate,
}: {
  setFirstDate: (date: Date) => void;
  setSecondDate: (date: Date) => void;
  firstDate: Date | null;
  secondDate: Date | null;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className="rounded-full">
        <div className="flex items-center gap-2">
          <p>{firstDate?.toLocaleDateString()}</p>
          <MoveRight />
          <p>{secondDate?.toLocaleDateString()}</p>
          <CalendarIcon />
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
);

export default NavBarPopCalendar;
