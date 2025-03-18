import { CircleCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "../../ui/button";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import Loading from "../../Loading/Loading";
import { useSuccessfulTransactionQuery } from "@/hooks/tanstack/booking/useQueryBooking";

const BookingSuccessful = () => {
  const { width, height } = useWindowSize();
  const { id } = useParams();

  const { data: successfulTransaction } = useSuccessfulTransactionQuery(Number(id));

  console.log(successfulTransaction);

  return (
    <>
      {successfulTransaction ? (
        <div className="h-dvh p-8">
          <div className="flex h-full flex-col items-center justify-center">
            <Confetti width={width} height={height} tweenDuration={1000} className="-z-10" />
            <div className="z-20 space-y-4 rounded-xl border-[1px] p-8 shadow-lg">
              <CircleCheck size={120} color="#38b2ac" />
              <div>
                <h2 className="text-2xl">Booking Successful!</h2>
                <p className="">Here are the details of your transaction</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
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
        </div>
      ) : (
        <Loading loadingMessage="Loading Successful Transaction" />
      )}
    </>
  );
};

export default BookingSuccessful;
