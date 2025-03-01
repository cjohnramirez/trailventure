import { useEffect, useState } from "react";
import Search from "../components/Home/SearchBar";
import NavBar from "@/components/Home/NavBar";
import DiscoverSection from "@/components/Home/DiscoverSection";
import BackgroundImage from "../assets/Home/HomePage.png";

function Home() {
  const [forNavBar, setforNavBar] = useState(true);

  const checkSectionInView = () => {
    const section = document.getElementById("section1");
    if (!section) return;

    const { top, bottom } = section.getBoundingClientRect();

    if (top < 0 && bottom >= 0) {
      setforNavBar(false);
    } else {
      setforNavBar(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkSectionInView);

    return () => window.removeEventListener("scroll", checkSectionInView);
  }, []);

  return (
    <div>
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar change={forNavBar} />
      </div>
      <div className="flex h-screen w-full select-none flex-col px-8 pb-[100px]">
        <div className="relative flex h-full w-full flex-col items-center justify-center bg-opacity-0 bg-cover bg-center">
          <div className="absolute inset-0 box-border w-full">
            <img src={BackgroundImage} className="h-full w-full rounded-2xl object-cover" />
          </div>
          <div className="relative -top-8 flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="title m-[-50px] text-[200px] font-semibold text-[#f4f4f5] dark:text-[#09090b]">EXPLORE</p>
            </div>
            <Search navBar={!forNavBar} />
          </div>
        </div>
      </div>
      <div className="mt-[-100px] px-8" id="section1">
        <DiscoverSection />
      </div>
    </div>
  );
}

export default Home;
