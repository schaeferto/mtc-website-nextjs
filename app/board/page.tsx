import valentin from "../../public/valentin.jpg";
import max from "../../public/max.jpg";
import carsten from "../../public/carsten.jpg";
import eva from "../../public/eva.jpg";
import lisa from "../../public/lisa.jpg";
import eckart from "../../public/eckart.jpg";
import Image, { StaticImageData } from "next/image";
import { PiEnvelopeLight } from "react-icons/pi";
import Link from "next/link";

export default function Board() {
  const boardMembers: {
    image: StaticImageData;
    name: string;
    position: string;
  }[] = [
    {
      image: valentin,
      name: "Valentin Müller",
      position: "1. Vorsitzender",
    },
    {
      image: max,
      name: "Max Meurer",
      position: "2. Vorsitzender",
    },
    {
      image: carsten,
      name: "Carsten Friedmann",
      position: "Kassenwart",
    },
    {
      image: eva,
      name: "Eva Dörrbaum",
      position: "Schriftführerin",
    },
    {
      image: lisa,
      name: "Lisa Montag",
      position: "Beisitzende",
    },
    {
      image: eckart,
      name: "Eckart Sußenburger",
      position: "Beisitzender",
    },
  ];

  return (
    <div
      className={"first-content text-mtc-black flex flex-col items-center p-8"}
    >
      <h1 className={"text-center mb-4 text-3xl font-bold uppercase"}>
        Vorstand
      </h1>
      <div className={"mb-8"}>Unsere Ansprechpartner:</div>
      <div
        className={
          "grid grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-8 md:gap-x-16 mb-8"
        }
      >
        {boardMembers.map((member, index) => (
          <div key={index}>
            <Image
              src={member.image}
              alt={member.name}
              height={200}
              className={"rounded-ee-full mb-4"}
            ></Image>
            <div className={"text-xl font-bold"}>{member.name}</div>
            <div className={"font-medium"}>{member.position}</div>
          </div>
        ))}
      </div>

      <div className={"self-start font-bold text-xl mt-8"}>Kontakt</div>
      <div className={"self-start flex gap-2 items-center"}>
        <PiEnvelopeLight size={25}></PiEnvelopeLight>
        <Link href={"mailto:munichtriathlonclub@gmail.com"}>
          <div>munichtriathlonclub@gmail.com</div>
        </Link>
      </div>
    </div>
  );
}