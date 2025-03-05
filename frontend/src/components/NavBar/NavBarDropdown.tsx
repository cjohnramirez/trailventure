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
import { useTheme } from "@/components/ui/theme-provider";
import { useMediaQuery } from "react-responsive";
import { useGlobalStore } from "../Contexts/GlobalContext";

function NavBarDropdown() {
  const { theme, setTheme } = useTheme();
  const userData = useGlobalStore((state) => state.userData);

  const smallScreen = useMediaQuery({ query: "(max-width: 640px)" });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-full">
          <Menu />
          Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-8 select-none p-2">
        <DropdownMenuGroup>
          {smallScreen && (
            <>
              <DropdownMenuItem>
                <Link to="/user-page" className="flex gap-2 items-center">
                  <img src={userData ? userData[0]?.avatar : ""} alt="avatar" className="w-8 h-8 rounded-full" />
                  <p>{userData && userData[0]?.user?.username}</p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem>
            <div>
              {theme === "dark" ? (
                <button
                  onClick={() => {
                    setTheme("light");
                  }}
                >
                  Light Mode
                </button>
              ) : (
                <button
                  onClick={() => {
                    setTheme("dark");
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
