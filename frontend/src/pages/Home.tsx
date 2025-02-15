import { useEffect, useState } from "react";
import api from "@/apps";
import { Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import SearchPopCalendar from "../components/Home/SearchPopCalendar";
import SearchPopGuests from "../components/Home/SearchPopGuests";
import NavBar from "@/components/Home/NavBar";

function Home() {
  const [_userData, setUserData] = useState([]);

  const [firstDate, setFirstDate] = useState<Date | null>(new Date());
  const [secondDate, setSecondDate] = useState<Date | null>(new Date());

  const [roomOptionState, setRoomOptionState] = useState({
    Rooms: 1,
    Adults: 1,
    Children: 1,
  });

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = () => {
    api
      .get("/apps/profile/")
      .then((res) => res.data)
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="flex flex-col h-screen w-full p-8">
      <div className="sticky top-0">
        <NavBar />
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-opacity-0 bg-homepage bg-cover bg-center p-4 h-full">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="text-[120px] font-semibold text-[#f4f4f5] dark:text-[#09090b]">
              EXPLORE
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-full border-[1px] bg-[#f4f4f5] px-4 py-2 dark:bg-[#09090b] sm:w-full md:w-[850px]">
            <div className="flex gap-4 pr-4">
              <SearchPopCalendar
                setFirstDate={setFirstDate}
                setSecondDate={setSecondDate}
                firstDate={firstDate}
                secondDate={secondDate}
              />
              <Button variant="outline" className="w-30 rounded-full">
                <SearchPopGuests
                  setRoomOptionState={setRoomOptionState}
                  roomOptionState={roomOptionState}
                />
              </Button>
            </div>
            <Input
              className="h-[50px] rounded-full border-none bg-sky-500 px-4 text-white placeholder-white dark:text-black dark:placeholder-black"
              placeholder="Search"
            ></Input>
            <Button className="w-10 rounded-full" variant="outline">
              <Search />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
