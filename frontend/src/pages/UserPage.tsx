import NavBar from "@/components/Home/NavBar";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { toast } from "@/components/Error/ErrorSonner";

function UserPage() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const fetchUserData = await api.get(`/apps/users/customer/profile/`);
      setUserData(fetchUserData.data);
    } catch (error) {
      const err = error as AxiosError;
      let errorMessage = "An unexpected error occurred.";

      if (err.response) {
        errorMessage = `Error ${err.response.status}: ${err.response.data || "Something went wrong"}`;
      } else if (err.request) {
        errorMessage = "Network error: Unable to reach the server. Please check your internet connection.";
      } else {
        errorMessage = "Internal server error.";
      }

      toast({
        title: "404 NOT FOUND",
        description: errorMessage,
        button: {
          label: "Ignore",
          onClick: () => console.log("OK clicked"),
        },
      });
    }
  };

  console.log(userData)

  return (
    <>
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar change={false} />
      </div>
    </>
  )
}

export default UserPage;