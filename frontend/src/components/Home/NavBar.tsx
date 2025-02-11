import { Menu, Search, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

function NavBar() {
  return (
    <div className="flex-col border-[1px] bg-white p-4 shadow-md dark:bg-[#09090b]">
      <div className="flex items-center justify-between">
        <Button variant="outline">Add</Button>
        <p className="font-extrabold">TRAILVENTURE</p>
        <div className="flex border-[1px] rounded-md">
          <DropdownMenu>
            <DropdownMenuTrigger className="px-2">
              <Menu />
            </DropdownMenuTrigger>
          </DropdownMenu>
          <Button variant="ghost">
            <User />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center pt-4">
        <Input className="h-[50px] md:max-w-[500px] rounded-full" />
      </div>
    </div>
  );
}

export default NavBar;
