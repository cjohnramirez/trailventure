import { useGlobalStore } from "@/components/Contexts/GlobalContext";
import NavBar from "@/components/NavBar/NavBar";

function BookingPage() {
  const userData = useGlobalStore(state => state.userData);
  const packageData = useGlobalStore(state => state.packageData);
  
  console.log(userData, packageData)
  return (
    <>
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar isNavBar={true} />
      </div>
      <div>

      </div>
    </>
  )
}

export default BookingPage;