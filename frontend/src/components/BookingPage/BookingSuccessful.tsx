import { fetchSuccessfulBooking } from "@/api/bookingData";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import Loading from "../Loading/Loading";

const BookingSuccessful = () => {
  const { width, height } = useWindowSize();
  const { id } = useParams();

  const { data: successfulBooking } = useQuery({
    queryFn: () => fetchSuccessfulBooking(Number(id)),
    queryKey: ["successfulBooking", id],
    staleTime: Infinity,
  });

  return (
    <div className="h-screen p-8">
      {successfulBooking ? (
        <div className="flex h-full flex-col items-center justify-center">
          <Confetti width={width} height={height} tweenDuration={1000} className="-z-10" />
          <div className="z-20 space-y-4 rounded-xl border-[1px] p-8">
            <CircleCheck size={120} color="#38b2ac" />
            <div>
              <h2 className="text-2xl">Booking Successful!</h2>
              <p className="">Here are the details of your succesful booking</p>
            </div>
            <div className="rounded-xl border-[1px] p-8">
              <p>Booking ID: {successfulBooking.booking.id}</p>
              <p>Package Name: {successfulBooking.booking.package_type.package.name}</p>
              <p>Package Type: {successfulBooking.booking.package_type.name}</p>
              <p>Start Date: {successfulBooking.booking.start_date}</p>
              <p>Qty: {successfulBooking.booking.num_of_person}</p>
            </div>
            <Button
              variant={"outline"}
              className="w-full"
              onClick={() => window.location.replace("/")}
            >
              <p>Go to Home</p>
            </Button>
          </div>
        </div>
      ) : (
        <Loading loadingMessage="Loading Successful Transaction" />
      )}
    </div>
  );
};

export default BookingSuccessful;
