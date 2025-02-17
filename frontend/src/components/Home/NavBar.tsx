import { Contact, Home, Plus, User } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import NavBarDropdown from "./NavBarDropdown";
import Search from "./Search";

interface NavBarInterface {
  change: boolean;
}

function NavBar({ change }: NavBarInterface) {
  return (
    <div className="z-20 w-full flex-col">
      <div className="flex items-center justify-between">
        <p className="title text-4xl font-bold">TRAILVENTURE</p>
        {change ? (
          <div className="flex items-center gap-2">
            <div className="flex w-full rounded-full bg-opacity-50 p-2 dark:bg-opacity-50">
              <div className="flex w-full items-center gap-2">
                <Button variant="outline">
                  <Home />
                  Home
                </Button>
                <NavBarDropdown />
                <Button variant="outline">
                  <User />
                  User
                </Button>
                <Button variant="outline">
                  <Contact />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Search navBar={true}/>
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus />
            <p>Add Item</p>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
