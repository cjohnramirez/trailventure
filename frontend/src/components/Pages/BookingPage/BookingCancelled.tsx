import { CircleX } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "../../ui/button";
import Loading from "../../Loading/Loading";
import useMutationBooking from "@/hooks/tanstack/booking/useMutationBooking";

const BookingCancelled = () => {
  const { id } = useParams();
  const { useDeleteBookingMutation } = useMutationBooking();

  const { data: deletedBooking } = useDeleteBookingMutation(id ? parseInt(id) : 0);

  return (
    <div className="flex h-dvh items-center justify-center p-8">
      {deletedBooking ? (
        <div className="flex h-full max-w-[800px] flex-col items-center justify-center">
          <div className="space-y-4 rounded-xl border-[1px] p-8 shadow-lg">
            <CircleX size={120} color="#f56565" />
            <div>
              <h2 className="text-2xl">Booking Cancelled</h2>
              <p className="">Here are the details of your cancelled booking</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border-[1px] p-8 py-4 shadow-lg sm:py-8">
                <p className="text-2xl">{deletedBooking.booking.id}</p>
                <p>Booking ID</p>
              </div>
              <div className="rounded-xl border-[1px] p-8 py-4 shadow-lg sm:py-8">
                <p className="text-2xl">{deletedBooking.booking.package_type.package.name}</p>
                <p>Package Name</p>
              </div>
              <div className="rounded-xl border-[1px] p-8 py-4 shadow-lg sm:py-8">
                <p className="text-2xl">{deletedBooking.booking.package_type.name}</p>
                <p>Package Type</p>
              </div>
              <div className="rounded-xl border-[1px] p-8 py-4 shadow-lg sm:py-8">
                <p className="text-2xl">{deletedBooking.booking.num_of_person}</p>
                <p>Qty</p>
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
        <Loading loadingMessage="Loading Failed Transaction" />
      )}
    </div>
  );
};

export default BookingCancelled;
