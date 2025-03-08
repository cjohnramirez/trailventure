import { useEffect, useState } from "react";
import Search from "../components/NavBar/SearchBar";
import NavBar from "@/components/NavBar/NavBar";
import DiscoverSection from "@/components/Home/DiscoverSection";
import BackgroundImage from "../assets/Home/HomePage.webp";
import { useMediaQuery } from "react-responsive";
import Footer from "@/components/Footer/Footer";
import { Calendar, SearchIcon, Shield, User } from "lucide-react";
import personHiking from "../assets/Home/personHiking.jpeg";

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

  const lg = useMediaQuery({ query: "(min-width: 900px)" });

  return (
    <div>
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar isNavBar={!forNavBar} isHomePage={true} />
      </div>
      <div className="flex h-screen w-full select-none flex-col px-8 pb-[100px]">
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <div className="absolute inset-0 box-border w-full">
            <img src={BackgroundImage} className="h-full w-full rounded-2xl object-cover" />
          </div>
          <div className="relative -top-12 flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="title text-[100px] font-semibold text-[#f4f4f5] dark:text-[#09090b] sm:m-[-20px] sm:text-[150px]">
                EXPLORE
              </p>
            </div>
            <div className="mt-[-30px]">
              <Search navBar={lg ? false : true} homePage={true} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[-90px] px-8" id="section1">
        <DiscoverSection />
      </div>
      <div className="px-8" id="section1">
        <div className="flex flex-col justify-center">
          <div className="leading-none">
            <p className="relative text-center text-[40px] font-extrabold leading-none md:text-[40px] lg:text-[70px]">
              CHOOSE ME? AHAHAHAHA
            </p>
            <p className="pb-12 pt-4 text-center font-semibold md:pb-20">
              Your No.1 Tour Package Booking Platform
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-[1200px] grid-cols-3 grid-rows-2 gap-4">
          <div className="flex flex-col justify-center col-span-1 rounded-2xl border-[1px] p-8 shadow-lg">
            <Calendar size={64} strokeWidth={1} className="mb-4" />
            <p className="text-2xl font-semibold">Hassle-Free Booking</p>
            <p>A fast, easy, and worry-free tour package booking process.</p>
          </div>
          <div className="col-span-1 row-span-2 rounded-2xl border-[1px] shadow-lg">
            <img src={personHiking} className="object-cover h-full rounded-2xl"></img>
          </div>
          <div className="flex flex-col justify-center col-span- rounded-2xl border-[1px] p-8 shadow-lg">
            <SearchIcon size={64} strokeWidth={1} className="mb-4" />
            <p className="text-2xl font-semibold">Advanced Search</p>
            <p>Find the best tour packages with our advanced search options.</p>
          </div>
          <div className="flex flex-col justify-center col-span-1 rounded-2xl border-[1px] p-8 shadow-lg">
            <User size={64} strokeWidth={1} className="mb-4" />
            <p className="text-2xl font-semibold">Designed for You</p>
            <p>Personalized recommendations to suit your preferences.</p>
          </div>
          <div className="flex flex-col justify-center col-span-1 rounded-2xl border-[1px] p-8 shadow-lg">
            <Shield size={64} strokeWidth={1} className="mb-4" />
            <p className="text-2xl font-semibold">Secure and Trusted Bookings</p>
            <p>Book with confidence knowing your bookings are secure.</p>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
