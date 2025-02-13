import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

function NavBarDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <Menu />
          Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 p-2">
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
  );
}

export default NavBarDropdown;
