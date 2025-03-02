import { Home, User } from "lucide-react";
import { Button } from "../ui/button";
import NavBarDropdown from "./NavBarDropdown";
import Search from "./SearchBar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import DefaultUserProfile from "@/assets/UserPage/defaultProfile.jpg";
import { UserData } from "@/lib/UserPage/UserData";

interface NavBarInterface {
  isNavBar: boolean;
}

function NavBar({ isNavBar }: NavBarInterface) {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [atUserPage, setAtUserPage] = useState(location.pathname === "/user-page");
  const userData: UserData[] = (authContext?.userData ?? []) as UserData[];

  useEffect(() => {
    setAtUserPage(location.pathname === "/user-page");
  }, [location.pathname]);

  const handleAuthClick = () => {
    if (authContext?.isAuthorized) {
      const newPath = atUserPage ? "/" : "/user-page";
      navigate(newPath);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="z-10 flex w-full select-none">
      <div className="flex w-full flex-row items-center justify-between">
        <p className="title w-1/3 text-4xl font-bold">
          <Link to="/">TRAILVENTURE</Link>
        </p>
        {!isNavBar ? (
          <div className="flex w-1/3 items-center gap-2">
            <div className="flex w-full rounded-full bg-opacity-50 p-2 dark:bg-opacity-50"></div>
          </div>
        ) : (
          <div className="w-1/3 max-w-[500px]">
            <Search navBar={true} />
          </div>
        )}
        <div className="flex w-1/3 justify-end gap-2">
          <Button variant="outline" className="h-full py-0" onClick={handleAuthClick}>
            {authContext?.isAuthorized ? (
              atUserPage ? (
                <div className="flex items-center gap-2">
                  <Home />
                  <p>Go to homepage</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <img
                    src={userData[0]?.avatar || DefaultUserProfile}
                    className="w-7 rounded-full"
                    alt="User avatar"
                  />
                  <span>Welcome, {userData[0]?.user?.username || "user!"}</span>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2">
                <User />
                <p>Login</p>
              </div>
            )}
          </Button>
          <NavBarDropdown />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
