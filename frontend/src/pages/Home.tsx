import { useEffect, useState } from "react";
import api from "@/api";
import NavBar from "@/components/Home/NavBar";
import Banaue from "../assets/Banaue.jpg";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

function Home() {
  const [userData, setUserData] = useState([]);

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

  return (
    <div>
      <div className="sticky top-0">
        <NavBar />
      </div>
      <div className="p-4">
        <Card className="pt-6 md:flex">
          <CardContent className="md:w-1/2 lg:w-2/3">
            <img
              src={Banaue}
              className="w-full rounded-lg object-cover md:h-full md:max-h-[500px]"
            />
          </CardContent>
          <CardFooter className="flex-col gap-y-6 text-left md:w-1/2 md:justify-center md:py-20 lg:w-1/3">
            <p className="w-full text-[50px] leading-none">EXPLORE THE UNEXPLORED.</p>
            <p className="text-sm">
              We invite you to venture beyond the familiar and discover new
              possibilities. It challenges you to step outside your comfort
              zone, embracing the unknown with curiosity and courage. Whether
              it's uncharted places, fresh ideas, or hidden potentials, there's
              always something waiting to be uncovered. Dare to go beyond
              boundaries and redefine what's possible.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Home;
