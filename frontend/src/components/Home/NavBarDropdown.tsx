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
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";

function NavBarDropdown() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("system")
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Menu />
          Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 p-2 select-none">
        <DropdownMenuGroup>
          <DropdownMenuItem>Messages</DropdownMenuItem>
          <DropdownMenuItem>Notifications</DropdownMenuItem>
          <DropdownMenuItem>Trips</DropdownMenuItem>
          <DropdownMenuItem>Wishlist</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <div>
              {darkMode ? (
                <button
                  onClick={() => {
                    setTheme("light");
                    setDarkMode(false);
                  }}
                >
                  Light Mode
                </button>
              ) : (
                <button
                  onClick={() => {
                    setTheme("dark");
                    setDarkMode(true);
                  }}
                >
                  Dark Mode
                </button>
              )}
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/about-us">About Us</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/logout">Logout</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavBarDropdown;
