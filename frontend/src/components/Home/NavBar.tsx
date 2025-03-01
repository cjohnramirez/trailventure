import { User, UserCheck } from "lucide-react";
import { Button } from "../ui/button";
import NavBarDropdown from "./NavBarDropdown";
import Search from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../ProtectedRoute/AuthContext";

interface NavBarInterface {
  change: boolean;
}

function NavBar({ change }: NavBarInterface) {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (authContext?.isAuthorized) {
      navigate("/user-page");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="z-20 w-full select-none flex-col">
      <div className="flex md:flex-row flex-col items-center justify-between">
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
          <Button variant="outline" onClick={handleAuthClick}>
            {authContext?.isAuthorized ? (
              <>
                <UserCheck />
                <p>Logged In!</p>
              </>
            ) : (
              <>
                <User />
                <p>Login</p>
              </>
            )}
          </Button>
          <NavBarDropdown />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
