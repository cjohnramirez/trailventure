import { useState } from "react";
import { Plus, Search, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ModeToggle } from "../mode-toggle";
import NavBarDropdown from "./NavBarDropdown";
import NavBarPopCalendar from "./NavBarPopCalendar";
import NavBarPopGuests from "./NavBarPopGuests";

function NavBar() {
  const [firstDate, setFirstDate] = useState<Date | null>(new Date());
  const [secondDate, setSecondDate] = useState<Date | null>(new Date());

  const [roomOptionState, setRoomOptionState] = useState({
    Rooms: 1,
    Adults: 1,
    Children: 1,
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
            <NavBarDropdown />
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
            <NavBarPopCalendar
              setFirstDate={setFirstDate}
              setSecondDate={setSecondDate}
              firstDate={firstDate}
              secondDate={secondDate}
            />
            <Button variant="outline" className="w-30 rounded-full">
              <NavBarPopGuests
                setRoomOptionState={setRoomOptionState}
                roomOptionState={roomOptionState}
              />
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
