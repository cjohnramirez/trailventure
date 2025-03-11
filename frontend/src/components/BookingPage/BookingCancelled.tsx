import { postDeletedBooking } from "@/api/bookingData";
import { useQuery } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";
import Loading from "../Loading/Loading";

const BookingCancelled = () => {
  const { id } = useParams();

  const { data: deletedBooking } = useQuery({
    queryFn: () => postDeletedBooking(Number(id)),
    queryKey: ["deletedBooking", id],
    staleTime: Infinity,
  });

  return (
    <div className="h-screen p-8">
      {deletedBooking ? (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="space-y-4 rounded-xl border-[1px] p-8">
            <CircleX size={120} color="#f56565" />
            <div>
              <h2 className="text-2xl">Booking Cancelled</h2>
              <p className="">Here are the details of your cancelled booking</p>
            </div>
            <div className="rounded-xl border-[1px] p-8">
              <p>Booking ID: {deletedBooking.booking.id}</p>
              <p>Package Name: {deletedBooking.booking.package_type.package.name}</p>
              <p>Package Type: {deletedBooking.booking.package_type.name}</p>
              <p>Start Date: {deletedBooking.booking.start_date}</p>
              <p>Qty: {deletedBooking.booking.num_of_person}</p>
            </div>
            <Button variant={"outline"} className="w-full" onClick={() => window.location.replace("/")}>
              <p>Go to Home</p>
            </Button>
          </div>
        </div>
      ) : (
        <Loading loadingMessage="Loading Failed Transaction"/>
      )}
    </div>
  );
};

export default BookingCancelled;
