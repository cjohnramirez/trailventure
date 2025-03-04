<<<<<<< HEAD
=======
import { useGlobalStore } from "@/components/Contexts/GlobalContext";
import NavBar from "@/components/NavBar/NavBar";

>>>>>>> d590c20627205c050573c67dd926bf1f5e95d9f2
function BookingPage() {
  const userData = useGlobalStore(state => state.userData);
  const packageData = useGlobalStore(state => state.packageData);
  
  console.log(userData, packageData)
  return (
    <>
<<<<<<< HEAD
      
=======
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar isNavBar={true} />
      </div>
      <div>

      </div>
>>>>>>> d590c20627205c050573c67dd926bf1f5e95d9f2
    </>
  )
}

export default BookingPage;