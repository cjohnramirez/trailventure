import { useState } from "react";
import {
  BedDouble,
  Calendar as CalendarIcon,
  Menu,
  Minus,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

function NavBar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const roomOptions: string[] = ["rooms", "adults", "children"];

  const [roomOptionState, setRoomOptionState] = useState({
    rooms: 1,
    adults: 1,
    children: 1,
  });

  return (
    <div className="flex-col border-[1px] bg-white px-4 pt-4 shadow-md dark:bg-[#09090b]">
      <div className="flex items-center justify-between">
        <Button variant="outline">
          <Plus />
          <p>Add Item</p>
        </Button>
        <p className="text-xl font-extrabold">TRAILVENTURE</p>
        <div className="flex rounded-md border-[1px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-9 w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem>Messages</DropdownMenuItem>
                <DropdownMenuItem>Notifications</DropdownMenuItem>
                <DropdownMenuItem>Trips</DropdownMenuItem>
                <DropdownMenuItem>Wishlist</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>About Us</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost">
            <User />
          </Button>
        </div>
      </div>
      <div className="my-4 flex w-full items-center justify-center">
        <div className="flex items-center gap-4 rounded-full border-[1px] pl-4 sm:w-full md:w-[600px]">
          <Search className="min-w-[15px]" />
          <Input
            className="h-[50px] rounded-full border-none px-4"
            placeholder="Search"
          ></Input>
          <div className="flex gap-4 pr-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  <div className="flex items-center gap-2">
                    <p>{date?.toLocaleDateString()}</p>
                    <CalendarIcon />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
            <Button variant="outline" className="w-30 rounded-full">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-2">
                    {roomOptionState.rooms}
                    <BedDouble />
                    {roomOptionState.adults + roomOptionState.children}
                    <Users />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="mr-4 mt-2 pb-[2px]">
                  <div>
                    {roomOptions.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 pb-4"
                      >
                        <p className="text-sm">{option.substring(0, 1).toLocaleUpperCase() + option.substring(1)}</p>
                        <div className="flex gap-2 items-center justify-end">
                          <Button variant="outline" className="rounded-full w-8" onClick={() => {
                            setRoomOptionState((prevState) => ({
                              ...prevState,
                              [option]: prevState[option as keyof typeof prevState] + 1
                            }));
                          }}>
                            <Plus />
                          </Button>
                          {roomOptionState[option as keyof typeof roomOptionState]}
                          <Button variant="outline" className="rounded-full w-8" onClick={() => {
                            setRoomOptionState((prevState) => ({
                              ...prevState,
                              [option]: prevState[option as keyof typeof prevState] - 1
                            }));
                          }}>
                            <Minus />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
