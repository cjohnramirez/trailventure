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
import DefaultProfile from "@/assets/UserPage/defaultProfile.jpg";
import { useQueryUser } from "@/hooks/tanstack/user/useQueryUser";

function NavBarDropdown() {
  const { theme, setTheme } = useTheme();

  const { userDataQuery } = useQueryUser();

  const { data: userData } = userDataQuery;
  const smallScreen = useMediaQuery({ query: "(max-width: 640px)" });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-full py-4 shadow-lg">
          <Menu />
          Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-8 select-none p-2">
        <DropdownMenuGroup>
          {smallScreen && userData && (
            <>
              <DropdownMenuItem>
                <Link to="/user-page" className="flex items-center gap-2">
                  <img
                    src={
                      userData && userData[0]?.avatar
                        ? "https://res.cloudinary.com/dch6eenk5/" + userData[0]?.avatar
                        : DefaultProfile
                    }
                    alt="avatar"
                    className="h-8 w-8 rounded-full"
                  />
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
          {userData ? (
            <DropdownMenuItem>
              <Link to="/logout">Logout</Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <Link to="/login">Login</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavBarDropdown;
