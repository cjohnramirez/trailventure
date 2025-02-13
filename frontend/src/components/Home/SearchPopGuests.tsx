import { BedDouble, Minus, Plus, Users } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";

function NavBarPopGuests({
  setRoomOptionState,
  roomOptionState,
}: {
  setRoomOptionState: React.Dispatch<
    React.SetStateAction<{ Rooms: number; Adults: number; Children: number }>
  >;
  roomOptionState: { Rooms: number; Adults: number; Children: number };
}) {
  const roomOptions: string[] = ["Rooms", "Adults", "Children"];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2">
          {roomOptionState.Rooms}
          <BedDouble />
          {roomOptionState.Adults + roomOptionState.Children}
          <Users />
        </div>
      </PopoverTrigger>
      <PopoverContent className="mr-8 mt-2 w-60 pb-[2px]">
        <div className="text-center">
          <p className="pb-3">Set the amount of guests</p>
          <DropdownMenuSeparator />
        </div>
        <div className="pt-4">
          {roomOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 pb-4"
            >
              <p className="text-sm">{option}</p>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  className="w-8 rounded-full"
                  onClick={() => {
                    setRoomOptionState((prevState) => ({
                      ...prevState,
                      [option]: prevState[option as keyof typeof prevState] + 1,
                    }));
                  }}
                >
                  <Plus />
                </Button>
                {roomOptionState[option as keyof typeof roomOptionState]}
                <Button
                  variant="outline"
                  className="w-8 rounded-full"
                  onClick={() => {
                    setRoomOptionState((prevState) => ({
                      ...prevState,
                      [option]: Math.max(
                        prevState[option as keyof typeof prevState] - 1,
                        1,
                      ),
                    }));
                  }}
                >
                  <Minus />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NavBarPopGuests;
