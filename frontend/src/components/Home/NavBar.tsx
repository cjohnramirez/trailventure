import { Contact, Home, Plus, User } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import NavBarDropdown from "./NavBarDropdown";

function NavBar() {
  return (
    <div className="flex-col pb-8">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-extrabold">
          TRAILVENTURE
        </p>
        <div className="flex items-center gap-2">
          <div className="flex w-full dark:bg-opacity-50 bg-opacity-50 p-2 rounded-full">
            <div className="flex w-full items-center gap-2">
              <Button variant="outline" className="rounded-full">
                <Home />
                Home
              </Button>
              <NavBarDropdown />
              <Button variant="outline" className="rounded-full">
                <User />
                User
              </Button>
              <Button variant="outline" className="rounded-full">
                <Contact />
                Contact
              </Button>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full">
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
