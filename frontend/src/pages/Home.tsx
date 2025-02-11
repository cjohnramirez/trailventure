import { useEffect, useState } from "react";
import api from "@/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import NavBar from "@/components/Home/NavBar";

interface UserRegisterInformation {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

interface UserProfile {
  date_of_birth: string;
  phone_number: string;
  user: UserRegisterInformation;
}

function Home() {
  const [userData, setUserData] = useState<UserProfile[]>([]);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = () => {
    api
      .get("/api/profile/")
      .then((res) => res.data)
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => alert(err));
  };

  const UserDataArray: Array<keyof UserRegisterInformation> = [
    "email",
    "first_name",
    "last_name",
    "username",
  ];

  return (
    <div>
      <div className="sticky top-0">
        <NavBar />
      </div>
      <div className="flex h-screen w-full items-center justify-center gap-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Here are some information about the user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ModeToggle />
            {userData.length > 0 &&
              UserDataArray.map((userDataText, index) => (
                <div
                  key={index}
                  className="border-black-800 my-2 rounded-lg border p-3"
                >
                  <p className="text-sm font-semibold">
                    {userDataText.replace("_", " ").toUpperCase()}
                  </p>
                  <p className="text-sm">{userData[0]["user"][userDataText]}</p>
                </div>
              ))}
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Check /> Noiceee
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Home;
