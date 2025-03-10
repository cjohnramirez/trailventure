import NavBar from "@/components/NavBar/NavBar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, MapPin, Package, PhilippinePeso } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { tourPackage } from "@/lib/TourPackagePage/tourPackage";
import { fetchPackage } from "@/api/tourPackageData";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserData } from "@/lib/UserPage/userData";
import { fetchUserData } from "@/api/userData";
import { AdditionalFees } from "@/lib/BookingPage/additionalFees";
import { postCheckoutData, postBookingData, fetchAdditionalFeesData } from "@/api/bookingData";

function BookingPage() {
  const { tourpackageId, tourpackagetype, numofperson } = useParams();

  const { data: packageData } = useQuery<tourPackage[]>({
    queryFn: () => fetchPackage(Number(tourpackageId)),
    queryKey: ["bookingData", tourpackageId],
  });

  console.log(packageData)

  const { data: userData } = useQuery<UserData[]>({
    queryFn: () => fetchUserData(),
    queryKey: ["userData"],
  });

  const { data: additionalFees } = useQuery<AdditionalFees[]>({
    queryFn: () => fetchAdditionalFeesData(),
    queryKey: ["additionalFeesData"],
  });

  const { mutateAsync: mutateBookingData } = useMutation({
    mutationFn: postBookingData,
  })

  const { mutateAsync: mutateCheckoutData } = useMutation({
    mutationFn: postCheckoutData,
  })

  const [startUserDate, setStartDate] = useState(new Date());
  const [quantity, setQuantity] = useState(Number(numofperson));
  const [currency, _setCurrency] = useState<string>("PHP");
  const [totalPrice, setTotalPrice] = useState<Number>(0);

  const packagetype = Number(tourpackagetype);
  const routePoints = packageData?.[0]?.package_type[packagetype]?.package_route_point || [];
  const numOfDays = routePoints[routePoints.length - 1]?.day;
  const endUserPackageDate = new Date(startUserDate);
  endUserPackageDate.setDate(startUserDate.getDate() + numOfDays);
  const formattedEndUserPackageDate = endUserPackageDate.toLocaleDateString();
 
  const basePrice = packageData
    ? Math.round(+packageData[0]?.package_type[Number(tourpackagetype)]?.price_per_person)
    : 0;
  const siteFeePrice = packageData
    ? Math.round(
        +(additionalFees?.[0]?.site_fees_percent ?? 0) *
          0.01 *
          +packageData[0]?.package_type[Number(tourpackagetype)]?.price_per_person,
      )
    : 0;
  const taxPrice = packageData
    ? Math.round(
        +(additionalFees?.[0]?.tax_paid_percent ?? 0) *
          0.01 *
          +packageData[0]?.package_type[Number(tourpackagetype)]?.price_per_person,
      )
    : 0;

  useEffect(() => {
    setTotalPrice((basePrice + siteFeePrice + taxPrice) * quantity);
  }, [basePrice, siteFeePrice, taxPrice]);

  const updateInvoice = () => {
    setTotalPrice((basePrice + siteFeePrice + taxPrice) * quantity);
  };

  const handleCheckoutButton = async () => {
    try {
      const bookingResponse = await mutateBookingData({
        num_of_person: quantity,
        currency: currency,
        package_type: packageData?.[0]?.package_type[Number(tourpackagetype)]?.id || 0,
        user: userData ? userData[0]?.user.id : 0,
      });
  
      if (bookingResponse?.id) {
        await mutateCheckoutData(bookingResponse.id);
        console.log("Checkout completed successfully!");
      } else {
        console.warn("Booking response did not contain an ID.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const handleClick = () => {
    handleCheckoutButton();
  };

  return (
    <>
      <nav className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar isNavBar={true} />
      </nav>
      <main className="flex-row px-8 lg:flex pb-8">
        <div className="flex-col gap-2 lg:flex lg:w-2/3">
          <div className="mb-4 flex flex-col rounded-2xl border-[1px] p-8 lg:mb-0 lg:flex-row lg:items-center xl:p-4">
            <img
              src={"https://res.cloudinary.com/dch6eenk5/" + packageData?.[0]?.package_image[0].image}
              className="h-[200px] w-full rounded-2xl object-cover lg:h-auto lg:w-64"
            ></img>
            <div className="lg:mx-8">
              <h1 className="mt-4 text-2xl font-semibold lg:mt-0">{packageData?.[0]?.name}</h1>
              <div className="flex gap-4">
                <MapPin />
                <p>{packageData?.[0]?.address}</p>
              </div>
              <div className="mt-4 flex gap-4 rounded-2xl border-[1px] p-4">
                <Package />
                <p>Package Type: {packageData?.[0]?.package_type[Number(tourpackagetype)]?.name}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border-[1px] p-8">
            <div className="pb-4">
              <p className="text-xl font-semibold">Package Configuration</p>
              <p>These are your package details. Change if you wish.</p>
            </div>
            <DropdownMenuSeparator />
            <div className="gap-4 pt-4 md:grid xl:grid-cols-3">
              <div className="flex items-center gap-4 pb-4 md:pb-0">
                <p className="w-1/2 xl:w-auto">Start of package</p>
                <Popover>
                  <PopoverTrigger asChild className="w-1/2 xl:w-auto">
                    <div className="w-1/2">
                      <Button variant={"outline"} className="flex w-full xl:w-auto">
                        <CalendarIcon />
                        <p className="text-md">{startUserDate.toLocaleDateString()}</p>
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={startUserDate}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(new Date(date));
                        }
                      }}
                      disabled={{
                        before: new Date(),
                        after: packageData
                          ? new Date(packageData && packageData[0]?.end_date)
                          : new Date(),
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center gap-4 pb-4 md:pb-0">
                <p className="w-1/2 xl:w-auto">End of package</p>
                <div className="flex w-1/2 items-center justify-center gap-2 rounded-full border-[1px] p-2 px-4 xl:w-auto">
                  <CalendarIcon size={16} />
                  <p className="text-sm font-medium">{formattedEndUserPackageDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pb-4 md:pb-0">
                <p className="w-1/2 xl:w-auto">Number of person</p>
                <Input
                  type="number"
                  className="w-1/2 rounded-2xl border-[1px] p-[5px] pl-4 text-center xl:w-28"
                  value={quantity}
                  onChange={(e) => {
                    const newQuantity = Number(e.target.value);
                    if (newQuantity >= 1) {
                      setQuantity(newQuantity);
                    }
                  }}
                ></Input>
              </div>
              <div className="col-start-2 hidden items-center justify-end xl:flex">
                <p>Update your changes</p>
              </div>
              <div className="col-span-full col-start-3">
                <Button variant={"outline"} onClick={updateInvoice} className="w-full">
                  <p>Update</p>
                </Button>
              </div>
            </div>
          </div>
          <div className="mb-4 mt-4 items-center justify-between rounded-2xl border-[1px] p-8 sm:flex lg:mb-0">
            <div className="">
              <p className="text-xl font-semibold">Package Rules</p>
              <p>Before proceeding, read the rules for this tour package.</p>
            </div>
            <DropdownMenuSeparator className="hidden sm:block" />
            <div className="w-full sm:w-auto">
              <Dialog>
                <DialogTrigger className="w-full sm:w-auto" asChild>
                  <Button variant={"outline"} className="mt-4 w-full sm:mt-0 sm:w-auto">
                    Read Here
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>This is an example</DialogTitle>
                    <DialogDescription>The text would be shown here</DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <aside className="mb-4 flex-col justify-between rounded-2xl border-[1px] p-8 lg:mb-0 lg:ml-4 lg:flex lg:w-1/3">
          <div>
            <div className="flex w-full flex-row items-start justify-between pb-4">
              <p className="text-xl font-semibold">Invoice</p>
              <div className="flex items-center gap-2 rounded-2xl border-[1px] p-1 px-4">
                <PhilippinePeso size={18} />
                <p>In PHP</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="flex justify-between py-4">
              <p>Number of people</p>
              <p>x {quantity}</p>
            </div>
            <DropdownMenuSeparator />
            <div className="flex justify-between py-4">
              <p>Base Price</p>
              <p>
                {" "}
                {currency + " "}
                {basePrice}
              </p>
            </div>
            <div className="flex justify-between py-4">
              <p>Site Fees</p>
              <p>
                {currency + " "}
                {siteFeePrice}
              </p>
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <p>Tax Fees</p>
                <p className="text-sm">(Includes VAT, Tourism Tax, etc)</p>
              </div>
              <p>
                {currency + " "}
                {taxPrice}
              </p>
            </div>
          </div>
          <div>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between py-4">
              <p>Total Price</p>
              <p>
                {currency + " "}
                {Number(totalPrice)}
              </p>
            </div>
            <Button variant={"outline"} className="w-full" onClick={handleClick}>
              <p>Proceed to Checkout</p>
            </Button>
          </div>
        </aside>
      </main>
    </>
  );
}

export default BookingPage;
