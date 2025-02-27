import { useParams } from "react-router-dom";
import NavBar from "@/components/Home/NavBar";
import { Button } from "@/components/UI/button";

function PackagePage() {
  const { name } = useParams();

  return (
    <>
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar change={false} />
      </div>
      <div className="sticky top-[72px] z-20 flex w-full justify-center bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <div className="flex w-full max-w-[900px] justify-center rounded-full border-[1px] p-4">
          <div className="flex gap-4">
            <Button variant={"outline"}>Overview</Button>
            <Button variant={"outline"}>Description</Button>
            <Button variant={"outline"}>Package Type</Button>
            <Button variant={"outline"}>Reviews</Button>
          </div>
        </div>
      </div>
      <div className="mx-8 my-4 flex flex-row justify-center gap-4 p-8">
        <div className="flex w-full justify-between max-w-[1200px]">
          <p className="text-2xl font-semibold">{name}</p>
          <Button>Save to Wishlist</Button>
        </div>
      </div>
    </>
  );
}

export default PackagePage;
