import { Home, User } from "lucide-react";
import { Button } from "../ui/button";
import NavBarDropdown from "./NavBarDropdown";
import Search from "./SearchBar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../Contexts/AuthContext";
import DefaultUserProfile from "@/assets/UserPage/defaultProfile.jpg";

interface NavBarInterface {
  isNavBar: boolean;
}

function NavBar({ isNavBar }: NavBarInterface) {
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const userData = useAuthStore((state) => state.userData) || [];
  const navigate = useNavigate();
  const location = useLocation();
  const [atUserPage, setAtUserPage] = useState(location.pathname === "/user-page");

  useEffect(() => {
    setAtUserPage(location.pathname === "/user-page");
  }, [location.pathname]);

  const handleAuthClick = () => {
    if (isAuthorized) {
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
          <div className="w-1/3 max-w-[500px] sm:block hidden">
            <Search navBar={true} />
          </div>
        )}
        <div className="flex w-1/3 justify-end gap-2">
          <Button
            variant="outline"
            className={`sm:block hidden h-full py-0 ${!atUserPage && isAuthorized ? "px-2 lg:pl-[4px] lg:pr-4" : ""}`}
            onClick={handleAuthClick}
          >
            {isAuthorized ? (
              atUserPage ? (
                <div className="flex items-center gap-2">
                  <Home />
                  <p className="lg:block hidden">Go to homepage</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <img
                    src={userData[0]?.avatar || DefaultUserProfile}
                    className="aspect-square w-7 rounded-full object-cover"
                    alt="User avatar"
                  />
                  <p className="hidden lg:block">
                    Welcome, {userData[0]?.user?.username || "user!"}
                  </p>
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
