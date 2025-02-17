import { useEffect, useState } from "react";
import api from "@/apps";
import Search from "../components/Home/Search";
import NavBar from "@/components/Home/NavBar";
import DiscoverSection from "@/components/Home/DiscoverSection";

function Home() {
  const [_userData, setUserData] = useState([]);
  const [showNavbar, setShowNavbar] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await api.get("/apps/profile/");
      setUserData(response.data);
    } catch (err) {
      alert(err);
    }
  };

  const checkSectionInView = () => {
    const section = document.getElementById('section');
    if (!section) return;

    const { top, bottom } = section.getBoundingClientRect();
    console.log("top: " + top, "bottom: " + bottom);
    console.log(showNavbar);
    const viewportHeight = window.innerHeight;
  
    setShowNavbar(top < viewportHeight && bottom > 0);
  };

  useEffect(() => {
    window.addEventListener('scroll', checkSectionInView);

    return () => window.removeEventListener('scroll', checkSectionInView);
  }, []);

  return (
    <div>
      <div className="sticky top-0 bg-[#ffffff] py-4 dark:bg-[#09090b] z-20 px-8">
        <NavBar change={showNavbar} />
      </div>
      <div className="flex h-screen w-full flex-col pb-[100px] px-8">
        <div className="mb-4 flex h-full flex-col items-center justify-center rounded-2xl bg-opacity-0 bg-homepage bg-cover bg-center">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="title m-[-40px] text-[200px] font-semibold text-[#f4f4f5] dark:text-[#09090b]">
                EXPLORE
              </p>
            </div>
            <Search navBar={!showNavbar} />
          </div>
        </div>
      </div>
      <div className="mt-[-100px] px-8" id="section">
        <DiscoverSection />
      </div>
    </div>
  );
}

export default Home;
