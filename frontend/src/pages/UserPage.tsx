import NavBar from "@/components/NavBar/NavBar";
import { useState } from "react";
import DefaultProfile from "@/assets/UserPage/defaultProfile.jpg";
import DefaultBanner from "@/assets/UserPage/defaultBanner.jpeg";
import { siFacebook, siX, siInstagram } from "simple-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Edit } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { UserData } from "@/lib/UserPage/userData";
import { useQuery } from "@tanstack/react-query";
import { fetchUserData, fetchUserBooking, fetchUserReviews } from "@/api/userData";
import Loading from "@/components/Loading/Loading";
import { tourPackageReviews } from "@/lib/TourPackagePage/tourPackageReview";
import { Rating } from "react-simple-star-rating";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Booking } from "@/lib/BookingPage/booking";

function UserPage() {
  const [editMode, setEditMode] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

  const { data: userData, isLoading: isUserDataLoading } = useQuery<UserData[]>({
    queryFn: () => fetchUserData(),
    queryKey: ["userData"],
  });

  const { data: userBooking, isLoading: isUserBookingLoading } = useQuery<Booking[]>({
    queryFn: () => fetchUserBooking(),
    queryKey: ["userBooking"],
  });

  const { data: UserReview, isLoading: isUserReviewLoading } = useQuery<tourPackageReviews[]>({
    queryFn: () => fetchUserReviews(),
    queryKey: ["userComment"],
  });

  if (isUserDataLoading || isUserBookingLoading || isUserReviewLoading) {
    return <Loading loadingMessage="Loading User Data" />;
  }

  return (
    <div className="w-full">
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar isNavBar={true} />
      </div>
      <div className="p-8">
        <div className="relative w-full select-none">
          <img
            src={
              userData && userData[0]?.avatar
                ? "https://res.cloudinary.com/dch6eenk5/" + userData?.[0]?.banner
                : DefaultBanner
            }
            className="h-full max-h-[300px] w-full rounded-2xl object-cover object-bottom"
          ></img>
          <img
            src={
              userData && userData[0]?.avatar
                ? "https://res.cloudinary.com/dch6eenk5/" + userData?.[0]?.avatar
                : DefaultProfile
            }
            className="absolute left-[90px] top-[120px] z-10 hidden aspect-square w-[250px] rounded-2xl object-cover lg:block"
          ></img>
          <div className="relative top-[-75px] w-full sm:top-[-165px] sm:p-12">
            <div className="max-w-[800px] rounded-2xl border-[1px] bg-white p-8 leading-tight dark:bg-[#09090b] lg:h-[220px] lg:w-[700px]">
              <div className="flex flex-col md:left-[290px] lg:relative">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      userData && userData[0]?.avatar
                        ? "https://res.cloudinary.com/dch6eenk5/" + userData?.[0]?.avatar
                        : DefaultProfile
                    }
                    className="block aspect-square w-10 rounded-full object-cover sm:w-20 lg:hidden"
                  ></img>
                  <div>
                    <p className="text-xs sm:text-base">Customer Profile</p>
                    <p className="text-xl font-semibold sm:text-3xl">
                      {userData?.[0]?.user?.first_name + " " + userData?.[0]?.user?.last_name}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex w-[220px] items-center gap-4 rounded-3xl border-[1px] p-4">
                  <p className="border-r-2 pr-4">Links</p>
                  <div>
                    <a
                      href={userData?.[0]?.user?.user_profile_links?.facebook || ""}
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentColor"
                      >
                        <path d={siFacebook.path} />
                      </svg>
                    </a>
                  </div>
                  <div>
                    <a
                      href={userData?.[0]?.user?.user_profile_links?.twitter || ""}
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentColor"
                      >
                        <path d={siX.path} />
                      </svg>
                    </a>
                  </div>
                  <div>
                    <a
                      href={userData?.[0]?.user?.user_profile_links?.instagram || ""}
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentColor"
                      >
                        <path d={siInstagram.path} />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative top-[-40px] xl:flex w-full sm:top-[-165px]">
          <div className="xl:w-1/2">
            <div className="col-span-1">
              <div className="my-4 max-w-[1300px] rounded-2xl border-[1px] p-8 sm:ml-12 sm:mr-12 lg:mr-0 xl:my-0">
                <p className="mb-4 text-lg font-semibold">Your Booking</p>
                {userBooking && userBooking.length > 0 ? (
                  userBooking.map((booking: Booking, index: number) => (
                    <div key={index} className="mb-4 rounded-xl border-[1px] p-4 sm:p-8">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <img
                          src={`https://res.cloudinary.com/dch6eenk5/${booking.package_type?.package?.images?.image || ""}`}
                          alt={booking.id + " package image"}
                          className="h-32 rounded-xl object-cover sm:w-1/3"
                        />
                        <div className="flex h-full flex-col justify-between gap-4 sm:w-2/3">
                          <div>
                            <p className="text-md font-semibold">
                              {booking.package_type?.package?.name}
                            </p>
                            <p className="text-sm">{booking.package_type?.name}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <Button variant={"outline"}>See Booking Details</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="mt-8 flex w-full items-center justify-center rounded-xl border-[1px] p-4">
                    No bookings available
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex max-w-[1300px] flex-col rounded-2xl border-[1px] p-8 sm:ml-12 sm:mr-12 lg:mr-0">
              <p className="text-lg font-semibold">Your Reviews</p>
              <DropdownMenuSeparator className="my-4" />
              <div
                className={
                  UserReview &&
                  UserReview.length > 0 &&
                  UserReview[0]?.review_by_user?.user?.length !== 0
                    ? "grid grid-rows-1 gap-4 lg:grid-cols-2 xl:grid-cols-1"
                    : ""
                }
              >
                {UserReview &&
                UserReview.length > 0 &&
                UserReview[0]?.review_by_user.user.length !== 0 ? (
                  UserReview.map((review, index) => {
                    return (
                      <div key={index} className="rounded-xl border-[1px] p-4">
                        <div className="flex items-center justify-between pb-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={`https://res.cloudinary.com/dch6eenk5/${review.review_by_user.customer_profile[0]?.avatar}`}
                              alt="avatar"
                              className="h-6 w-6 rounded-full"
                            />
                            <p>{review.review_by_user.user}</p>
                          </div>
                          <div>
                            <Rating
                              initialValue={review.rating}
                              disableFillHover={true}
                              allowHover={false}
                              size={20}
                              SVGstyle={{ display: "inline" }}
                              allowFraction={true}
                              fillColor={"#16baa8"}
                            />
                          </div>
                        </div>
                        <div>
                          <p>{review.comment}</p>
                        </div>
                        <div className="mt-2 sm:flex justify-between border-t-2 pt-2">
                          <div>
                            <p className="text-sm">{review.transaction.booking.package}</p>
                          </div>
                          <p className="sm:block hidden">{new Date(review.created).toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex w-full items-center justify-center rounded-xl border-[1px] p-4">
                    <p>No reviews yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="xl:w-1/2 xl:mt-0 mt-4">
            <div className="col-span-1 flex max-w-[1300px] flex-col rounded-2xl border-[1px] p-8 sm:ml-12 sm:mr-12 lg:mr-0">
              <div className="items-center justify-between gap-4 pb-4 sm:flex">
                <p className="text-lg font-semibold">User Details</p>
                <Button
                  variant={"outline"}
                  className="h-full"
                  onClick={() => {
                    setEditMode(!editMode);
                  }}
                >
                  <Edit />
                  <p>{editMode ? "Save Edit" : "Edit User Details"}</p>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-1">
                {editMode ? (
                  <>
                    <div className="items-center rounded-2xl border-[1px] p-4 sm:flex">
                      <p className="mb-2 w-[150px] sm:mb-0 sm:pr-4">First Name</p>
                      <Input
                        type="text"
                        placeholder="Enter your new first name"
                        className="rounded-xl sm:rounded-full"
                      />
                    </div>
                    <div className="items-center rounded-2xl border-[1px] p-4 sm:flex">
                      <p className="mb-2 w-[150px] sm:mb-0 sm:pr-4">Last Name</p>
                      <Input
                        type="text"
                        placeholder="Enter your new last name"
                        className="rounded-xl sm:rounded-full"
                      />
                    </div>
                    <div className="items-center rounded-2xl border-[1px] p-4 sm:flex">
                      <p className="mb-2 w-[150px] sm:mb-0 sm:pr-4">Email</p>
                      <Input
                        type="email"
                        placeholder="Enter your new email"
                        className="rounded-xl sm:rounded-full"
                      />
                    </div>
                    <div className="items-center rounded-2xl border-[1px] p-4 sm:flex">
                      <p className="mb-2 w-[150px] sm:mb-0 sm:pr-4">Date of Birth</p>
                      <div className="w-full">
                        <Popover>
                          <PopoverTrigger asChild className="w-full">
                            <Button
                              variant={"outline"}
                              className="flex justify-start rounded-xl sm:rounded-full"
                            >
                              <CalendarIcon />
                              <p>{dateOfBirth?.toLocaleDateString()}</p>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Calendar
                              mode="single"
                              selected={dateOfBirth ? new Date(dateOfBirth) : undefined}
                              onSelect={(date) => {
                                setDateOfBirth(date || null);
                              }}
                              className="rounded-md border shadow"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="items-center rounded-2xl border-[1px] p-4 sm:flex sm:p-4 sm:py-6">
                      <p className="mb-2 border-b-[1px] sm:mb-0 sm:w-[150px] sm:border-b-0 sm:border-r-[1px] sm:pr-2">
                        First Name
                      </p>
                      <p className="sm:pl-4">{userData?.[0]?.user?.first_name}</p>
                    </div>
                    <div className="items-center rounded-2xl border-[1px] p-4 sm:flex sm:p-4 sm:py-6">
                      <p className="mb-2 border-b-[1px] sm:mb-0 sm:w-[150px] sm:border-b-0 sm:border-r-[1px] sm:pr-2">
                        Last Name
                      </p>
                      <p className="sm:pl-4">{userData?.[0]?.user?.last_name}</p>
                    </div>
                    <div className="items-center rounded-2xl border-[1px] p-4 sm:flex sm:p-4 sm:py-6">
                      <p className="mb-2 border-b-[1px] sm:mb-0 sm:w-[150px] sm:border-b-0 sm:border-r-[1px] sm:pr-2">
                        Email
                      </p>
                      <p className="sm:pl-4">{userData?.[0]?.user?.email}</p>
                    </div>
                    <div className="items-center rounded-2xl border-[1px] p-4 sm:flex sm:p-4 sm:py-6">
                      <p className="mb-2 border-b-[1px] sm:mb-0 sm:w-[150px] sm:border-b-0 sm:border-r-[1px] sm:pr-2">
                        Date of Birth
                      </p>
                      <p className="sm:pl-4">{userData?.[0]?.date_of_birth}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
