import { User } from "lucide-react";
import { Button } from "../UI/button";
import NavBarDropdown from "./NavBarDropdown";
import Search from "./SearchBar";
import { Link } from "react-router-dom";

interface NavBarInterface {
  change: boolean;
}

function NavBar({ change }: NavBarInterface) {
  return (
    <div className="z-20 w-full select-none flex-col">
      <div className="flex items-center justify-between">
        <p className="title text-4xl font-bold">
          <Link to="/">TRAILVENTURE</Link>
        </p>
        {change ? (
          <div className="flex items-center gap-2">
            <div className="flex w-full rounded-full bg-opacity-50 p-2 dark:bg-opacity-50"></div>
          </div>
        ) : (
          <div>
            <Search navBar={true} />
          </div>
        )}
        <div className="flex gap-2">
          <Link to="/login">
            <Button variant="outline" onClick={() => {}}>
              <User />
              <p>Login</p>
            </Button>
          </Link>
          <NavBarDropdown />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
