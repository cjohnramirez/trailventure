import { Home, User } from "lucide-react";
import { Button } from "../ui/button";
import NavBarDropdown from "./NavBarDropdown";
import Search from "./SearchBar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetStore } from "../Contexts/GetContext";
import DefaultUserProfile from "@/assets/UserPage/defaultProfile.jpg";
import { useQuery } from "@tanstack/react-query";
import { UserData } from "@/lib/UserPage/UserData";
import { fetchUserData } from "@/api/userData/fetchUserData";

interface NavBarInterface {
  isNavBar: boolean;
  isHomePage?: boolean;
}

function NavBar({ isNavBar, isHomePage }: NavBarInterface) {
  const { data: userData } = useQuery<UserData[]>({
    queryFn: () => fetchUserData(),
    queryKey: ["navBarUserData"],
  });

  const isAuthorized = useGetStore((state) => state.isAuthorized);
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
    <div className="z-10 select-none">
      <div className={isNavBar ? `grid grid-cols-2 grid-rows-2 gap-2 xl:grid-cols-3 xl:grid-rows-1` : `grid grid-cols-2`}>
        <p className="title flex items-center text-4xl font-bold">
          <Link to="/">TRAILVENTURE</Link>
        </p>
        {!isNavBar ? (
          <div className={`col-span-full row-start-2 xl:col-span-1 xl:col-start-2 xl:row-start-1` + (isHomePage ? "hidden" : "")}>
            <></>
          </div>
        ) : (
          <div className="col-span-full row-start-2 xl:col-span-1 xl:col-start-2 xl:row-start-1">
            <Search navBar={true} />
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className={`hidden h-full sm:block ${!atUserPage && isAuthorized ? "px-2 lg:pl-[4px] lg:pr-4" : ""}`}
            onClick={handleAuthClick}
          >
            {isAuthorized ? (
              atUserPage ? (
                <div className="flex items-center gap-2">
                  <Home />
                  <p className="hidden lg:block">Go to homepage</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-1">
                  <img
                    src={userData ? userData[0]?.avatar : DefaultUserProfile}
                    className="aspect-square w-7 rounded-full object-cover"
                    alt="User avatar"
                  />
                  <p className="hidden lg:block">
                    Welcome, {userData ? userData[0]?.user?.username : "user!"}
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
