import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useSuccessfulTransactionQuery } from "@/hooks/tanstack/booking/useQueryBooking";
import { Booking } from "@/lib/BookingPage/booking";
import { CircleCheck } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface UserBookingDetailsProps {
  booking: Booking | null;
  setOpenBookingDetails: Dispatch<SetStateAction<boolean>>;
  openBookingDetails: boolean;
}

export default function UserBookingDetails({
  booking,
  setOpenBookingDetails,
  openBookingDetails,
}: UserBookingDetailsProps) {
  const [endDate, setEndDate] = useState<string>("");

  const { data: useSingleTransaction } = useSuccessfulTransactionQuery(booking?.id || 0);

  useEffect(() => {
    const end = new Date((booking && booking.start_date) || "");
    const routePoints =
      (booking && (booking.package_type.package_route_point as unknown as any[])) || [];
    end.setDate(end.getDate() + routePoints[routePoints.length - 1].day);
    setEndDate(end.toDateString());
  }, [booking]);

  console.log(booking);
  return (
    <Dialog open={openBookingDetails} onOpenChange={() => setOpenBookingDetails(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{booking && booking.package_type.package.name}</DialogTitle>
          <DialogDescription>{booking && booking.package_type.name}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 shadow-lg">
          <div className="z-20 w-full space-y-4 rounded-xl border-[1px] p-6">
            <CircleCheck size={120} color="#38b2ac" />
            <div>
              <p className="text-xl">Booking Successful!</p>
              <p className="">Here are the details of your transaction</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border-[1px] p-4 shadow-lg">
                <p className="text-xl">{new Date(booking?.start_date || "").toDateString()}</p>
                <p>Start of Package</p>
              </div>
              <div className="rounded-xl border-[1px] p-4 shadow-lg">
                <p className={`text-xl ${new Date() > new Date(endDate) ? "text-red-500" : ""}`}>
                  {endDate || "loading..."}
                </p>
                <p>End of Package</p>
              </div>
              <div className="rounded-xl border-[1px] p-4 shadow-lg">
                <p className="text-xl">
                  {(useSingleTransaction && useSingleTransaction[0]?.amount) || "Loading..."}
                </p>
                <p>Transaction Amount (in PhP)</p>
              </div>
              <div className="rounded-xl border-[1px] p-4 shadow-lg">
                <p className="text-xl">
                  {(useSingleTransaction &&
                    new Date(useSingleTransaction[0]?.transfer_date).toDateString()) ||
                    "Loading..."}
                </p>
                <p>Transfer Date</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
