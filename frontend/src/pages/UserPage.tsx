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
import { fetchUserData } from "@/api/userData/fetchUserData";

function UserPage() {
  const [editMode, setEditMode] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

  const { data: userData } = useQuery<UserData[]>({
    queryFn: () => fetchUserData(),
    queryKey: ["userPageUserData"],
  });

  return (
    <div className="w-full">
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar isNavBar={true} />
      </div>
      <div className="p-8">
        <div className="relative w-full">
          <img
            src={userData && userData[0]?.avatar ? "https://res.cloudinary.com/dch6eenk5/" + userData?.[0]?.banner : DefaultBanner}
            className="h-full max-h-[300px] w-full rounded-2xl object-cover object-bottom"
          ></img>
          <img
            src={userData && userData[0]?.avatar ? "https://res.cloudinary.com/dch6eenk5/" + userData?.[0]?.avatar : DefaultProfile}
            className="absolute left-[90px] top-[120px] z-10 hidden aspect-square w-[250px] rounded-2xl object-cover lg:block"
          ></img>
          <div className="relative top-[-75px] w-full sm:top-[-165px] sm:p-12">
            <div className="max-w-[800px] rounded-2xl border-[1px] bg-white p-8 leading-tight dark:bg-[#09090b] lg:h-[220px] lg:w-[700px]">
              <div className="flex flex-col md:left-[290px] lg:relative">
                <div className="flex items-center gap-4">
                  <img
                    src={userData && userData[0]?.avatar ? "https://res.cloudinary.com/dch6eenk5/" + userData?.[0]?.avatar : DefaultProfile}
                    className="block aspect-square w-10 sm:w-20 rounded-full object-cover lg:hidden"
                  ></img>
                  <div>
                    <p className="text-xs sm:text-base">Customer Profile</p>
                    <p className="text-xl sm:text-3xl font-semibold">
                      {userData?.[0]?.user?.first_name + " " + userData?.[0]?.user?.last_name}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex w-[220px] items-center gap-4 rounded-3xl border-[1px] p-4">
                  <p className="border-r-2 pr-4">Links</p>
                  <div>
                    <a href={userData?.[0]?.user?.user_profile_links?.facebook || ""} target="_blank">
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
                    <a href={userData?.[0]?.user?.user_profile_links?.twitter || ""} target="_blank">
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
                    <a href={userData?.[0]?.user?.user_profile_links?.instagram || ""} target="_blank">
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
        <div className="relative top-[-40px] w-full sm:top-[-165px]">
          <div className="flex flex-col rounded-2xl border-[1px] p-8 sm:ml-12 sm:mr-12 lg:mr-0">
            <div className="justify-between gap-4 pb-4 sm:flex">
              <p className="pb-4 text-2xl">User Details</p>
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
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
  );
}

export default UserPage;
