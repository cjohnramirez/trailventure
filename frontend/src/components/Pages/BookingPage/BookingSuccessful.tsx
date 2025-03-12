import { fetchSuccessfulTransaction } from "@/api/bookingData";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "../../ui/button";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import Loading from "../../Loading/Loading";

const BookingSuccessful = () => {
  const { width, height } = useWindowSize();
  const { id } = useParams();

  const { data: successfulTransaction } = useQuery({
    queryFn: () => fetchSuccessfulTransaction(Number(id)),
    queryKey: ["successfulTransaction", id],
    staleTime: Infinity,
  });

  console.log(successfulTransaction);

  return (
    <div className="h-screen p-8">
      {successfulTransaction ? (
        <div className="flex h-full flex-col items-center justify-center">
          <Confetti width={width} height={height} tweenDuration={1000} className="-z-10" />
          <div className="z-20 space-y-4 rounded-xl border-[1px] p-8 shadow-lg">
            <CircleCheck size={120} color="#38b2ac" />
            <div>
              <h2 className="text-2xl">Booking Successful!</h2>
              <p className="">Here are the details of your transaction</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="rounded-xl border-[1px] p-8 shadow-lg">
                <p className="text-2xl">{successfulTransaction[0]?.id}</p>
                <p>Transaction ID</p>
              </div>
              <div className="rounded-xl border-[1px] p-8 shadow-lg">
                <p className="text-2xl">{successfulTransaction[0]?.amount}</p>
                <p>Transaction Amount (in PhP)</p>
              </div>
              <div className="rounded-xl border-[1px] p-8 shadow-lg">
                <p className="text-2xl text-teal-500">{successfulTransaction[0]?.status}</p>
                <p>Payment ID</p>
              </div>
              <div className="rounded-xl border-[1px] p-8 shadow-lg">
                <p className="text-2xl">{successfulTransaction[0]?.booking.package}</p>
                <p>Package</p>
              </div>
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
