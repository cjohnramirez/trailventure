import { useState } from "react";
import {
  BedDouble,
  Calendar as CalendarIcon,
  Menu,
  Minus,
  MoveRight,
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
import { ModeToggle } from "../mode-toggle";
import { Link } from "react-router-dom";

function NavBar() {
  const [firstDate, setFirstDate] = useState<Date | undefined>(new Date());
  const [secondDate, setSecondDate] = useState<Date | undefined>(new Date());

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
        <p className="text-2xl font-extrabold">TRAILVENTURE</p>
        <div className="flex items-center gap-2">
          <div className="rounded-md border-[1px]">
            {/*NavBarDropdown */}
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
                  <DropdownMenuItem>
                    <Link to="/logout">Logout</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost">
              <User />
            </Button>
          </div>
          <ModeToggle />
        </div>
      </div>
      <div className="my-4 flex w-full items-center justify-center">
        <div className="flex items-center gap-4 rounded-full border-[1px] pl-4 sm:w-full md:w-[700px]">
          <Search className="min-w-[15px]" />
          <Input
            className="h-[50px] rounded-full border-none px-4"
            placeholder="Search"
          ></Input>
          <div className="flex gap-4 pr-4">
            {/* NavBarPopCalendar */}
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
                    selected={firstDate}
                    onSelect={setFirstDate}
                  />
                  <Calendar
                    mode="single"
                    selected={secondDate}
                    onSelect={setSecondDate}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline" className="w-30 rounded-full">
              {/* NavBarPopUsers */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-2">
                    {roomOptionState.rooms}
                    <BedDouble />
                    {roomOptionState.adults + roomOptionState.children}
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
                        <p className="text-sm">
                          {option.substring(0, 1).toLocaleUpperCase() +
                            option.substring(1)}
                        </p>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            className="w-8 rounded-full"
                            onClick={() => {
                              setRoomOptionState((prevState) => ({
                                ...prevState,
                                [option]:
                                  prevState[option as keyof typeof prevState] +
                                  1,
                              }));
                            }}
                          >
                            <Plus />
                          </Button>
                          {
                            roomOptionState[
                              option as keyof typeof roomOptionState
                            ]
                          }
                          <Button
                            variant="outline"
                            className="w-8 rounded-full"
                            onClick={() => {
                              setRoomOptionState((prevState) => ({
                                ...prevState,

                                [option]:
                                  prevState[option as keyof typeof prevState] >
                                  1
                                    ? prevState[
                                        option as keyof typeof prevState
                                      ] - 1
                                    : prevState[
                                        option as keyof typeof prevState
                                      ],
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
            </Button>
            <Button className="w-10 rounded-full" variant="outline">
              <Search />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
