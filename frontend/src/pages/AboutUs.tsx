import NavBar from "@/components/NavBar/NavBar";
import PersonHiking from "../assets/AboutUs/personHiking.jpeg";
import { MapIcon, MapPin } from "lucide-react";
import PhilippineImage from "../assets/AboutUs/philippines.png";
import HotelImage from "../assets/AboutUs/hotel.png";
import JCR from "../assets/AboutUs/jcr.jpg";
import Gerlie from "../assets/AboutUs/gerlie.jpg";
import Kathy from "../assets/AboutUs/kathy.jpg";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface TeamInformationObject {
  name: string;
  role1: string;
  role2: string;
  role3?: string;
  photoLink: string;
}

function AboutUs() {
  const teamInformation: TeamInformationObject[] = [
    {
      name: "Gerlie Campion",
      role1: "Product Designer",
      role2: "UI Designer",
      role3: "Frontend Developer",
      photoLink: Gerlie,
    },
    {
      name: "John Carl Ramirez",
      role1: "Full Stack Developer",
      role2: "Team Lead",
      photoLink: JCR,
    },
    {
      name: "Kathleen Grace Gultiano",
      role1: "Product Designer",
      role2: "UI Designer",
      role3: "Frontend Developer",
      photoLink: Kathy,
    },
  ];

  return (
    <div>
      <div className="sticky top-0 z-20 bg-[#ffffff] px-8 py-4 dark:bg-[#09090b]">
        <NavBar isNavBar={false} />
      </div>
      <div className="h-screen select-none pb-[120px]">
        <div className="items-around mb-[70px] flex h-full flex-row justify-center gap-20 px-16 py-8">
          <div className="flex w-2/3 max-w-[500px] flex-col justify-center gap-4 pr-20">
            <MapPin size={72} strokeWidth={1} />
            <p className="text-[100px] leading-none">EXPLORE WITH US</p>
            <p>
              TrailVenture is a platform dedicated to helping outdoor
              enthusiasts discover and navigate trails worldwide. We provide
              detailed trail maps, user reviews, and real-time updates to ensure
              a safe and enjoyable experience for hikers, bikers, and
              adventurers.
            </p>
          </div>
          <div className="relative mb-[70px] h-full w-[600px] max-w-[400px] rounded-t-[100px] border-[1px] border-black dark:border-gray-700">
            <GlowingEffect
              blur={0}
              borderWidth={5}
              spread={80}
              glow={true}
              disabled={false}
              proximity={80}
              inactiveZone={0.01}
              variant={"white"}
              className="h-full rounded-t-[100px] p-4"
            />
            <img
              src={PersonHiking}
              className="h-full rounded-t-[100px] object-cover p-4"
            ></img>
          </div>
        </div>
      </div>
      <div className="relative flex h-screen select-none flex-row items-center gap-16 px-16 py-16 mr-[-10px]">
        <GlowingEffect
          blur={0}
          borderWidth={5}
          spread={80}
          glow={true}
          disabled={false}
          proximity={80}
          inactiveZone={0.01}
          variant={"white"}
        />
        <div className="flex h-full w-1/3">
          <div className="relative h-1/2 rounded-bl-3xl rounded-tr-3xl border-[1px] border-black p-4 dark:border-white">
            <GlowingEffect
              blur={0}
              borderWidth={5}
              spread={80}
              glow={true}
              disabled={false}
              proximity={80}
              inactiveZone={0.01}
              variant={"white"}
            />
            <img
              src={PhilippineImage}
              className="h-full select-none rounded-bl-3xl rounded-tr-3xl object-cover"
            ></img>
          </div>
        </div>
        <div className="w-1/3">
          <MapIcon size={72} strokeWidth={1} className="pb-4" />
          <p className="pb-6 text-5xl">Our Mission</p>
          <p>
            Our mission is to make outdoor adventures more accessible, safe, and
            enjoyable by offering reliable trail information, GPS tracking, and
            user-generated reviews. We strive to foster a global community of
            nature lovers who share their experiences and support environmental
            sustainability.
          </p>
        </div>
        <div className="flex h-full w-1/3 flex-row items-end justify-end">
          <div className="flex h-full items-end">
            <div className="relative h-1/2 rounded-br-3xl rounded-tl-3xl border-[1px] border-black p-4 dark:border-white">
              <GlowingEffect
                blur={0}
                borderWidth={5}
                spread={80}
                glow={true}
                disabled={false}
                proximity={80}
                inactiveZone={0.01}
                variant={"white"}
              />
              <img
                src={HotelImage}
                className="h-full rounded-br-3xl rounded-tl-3xl object-cover"
              ></img>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-[70px] mt-20 flex h-screen select-none flex-col items-start justify-center gap-16 px-16">
        <div className="flex w-full justify-between">
          <p className="max-w-[400px] text-3xl font-semibold">
            Meet the talented team who make all this happen
          </p>
          <p className="max-w-[400px]">
            Our team of hikers, developers, and environmentalists collaborates
            to enhance mapping technology and engage the TrailVenture community.
          </p>
        </div>
        <div className="flex w-full justify-start gap-12">
          {teamInformation.map((teamMember, index) => {
            return (
              <div
                key={index}
                className="relative flex max-w-[325px] flex-col rounded-xl border-[1px] border-black p-8 shadow-2xl dark:border-white"
              >
                <GlowingEffect
                  blur={0}
                  borderWidth={4}
                  spread={80}
                  glow={true}
                  disabled={false}
                  proximity={80}
                  inactiveZone={0.01}
                  variant={"white"}
                />
                <img
                  src={teamMember.photoLink}
                  className="relative h-2/3 rounded-xl object-cover"
                />
                <div className="h-1/3">
                  <p className="pt-5 text-xl font-semibold">
                    {teamMember.name}
                  </p>
                  <p className="text-sm">{teamMember.role1}</p>
                  <p className="text-sm">{teamMember.role2}</p>
                  <p className="text-sm">{teamMember?.role3}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-1/2">
          <p className="pb-4 text-xl font-semibold">
            We're looking for talented people
          </p>
          <p>
            TrailVenture is growing fast, and we are always looking for
            passionate, dynamic, and talented individuals to join our
            distributed team all around the world
          </p>
        </div>
      </div>
    </div>
  );
}
export default AboutUs;
