import NavBar from "@/components/NavBar/NavBar";
import JCR from "../assets/AboutUs/jcr.jpg";
import Gerlie from "../assets/AboutUs/gerlie.jpg";
import Kathy from "../assets/AboutUs/kathy.jpg";

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
        <NavBar isNavBar={true} />
      </div>
      <div>
        {
          teamInformation.map((teamMember, index) => (
            <div key={index} className="flex flex-col items-center justify-center mt-8">  
              <img src={teamMember.photoLink} alt={teamMember.name} className="w-40 h-40 rounded-full" />
            </div>
          ))
        }
      </div>
    </div>
  );
}
export default AboutUs;
