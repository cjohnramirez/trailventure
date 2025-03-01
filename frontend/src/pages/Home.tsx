import Search from "../components/Home/SearchBar";
import NavBar from "@/components/Home/NavBar";
import DiscoverSection from "@/components/Home/DiscoverSection";
import BackgroundImage from "../assets/Home/HomePage.png";

function Home() {
  return (
    <div>
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar change={true} />
      </div>
      <div className="flex h-[600px] w-full select-none flex-col px-8 pb-[100px] lg:h-screen">
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <div className="absolute inset-0 box-border w-full">
            <img
              src={BackgroundImage}
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
          <div className="relative -top-12 flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="title m-[-20px] md:m-[-40px] lg:m-[-20px] text-[100px] font-semibold text-[#f4f4f5] dark:text-[#09090b] md:text-[150px] lg:text-[200px]">
                EXPLORE
              </p>
            </div>
            <div className="lg:mt-[-30px]">
              <Search navBar={false} />
            </div>
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
