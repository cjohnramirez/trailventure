import NavBar from "@/components/NavBar/NavBar";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { toast } from "@/components/Error/ErrorSonner";

interface UserData {
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
  };
  date_of_birth: string;
  phone_number: string;
  avatar: string;
  banner: string;
}

function UserPage() {
  const [userData, setUserData] = useState<UserData[]>([]);

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
        errorMessage =
          "Network error: Unable to reach the server. Please check your internet connection.";
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

  return (
    <div className="w-full">
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar isNavBar={true} />
      </div>
      <div className="p-8">
        <div className="relative w-full p-4">
          <img
            src={userData[0]?.banner}
            className="object-bottom h-full max-h-[300px] w-full rounded-2xl object-cover"
          ></img>
          <img
            src={userData[0]?.avatar}
            className="absolute left-[120px] top-[120px] z-10 aspect-square w-[250px] rounded-[60px] object-cover"
          ></img>
          <div className="relative top-[-165px] w-full p-12">
            <div className="h-[240px] w-full rounded-2xl bg-[#09090b] p-8 shadow-2xl shadow-teal-500/20 leading-tight">
              <div className="flex flex-col relative left-[320px]">
                <p className="text-[50px]">
                  {userData[0]?.user.first_name +
                    " " +
                    userData[0]?.user.last_name}
                </p>
                <p>Customer Profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
