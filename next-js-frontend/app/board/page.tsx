import valentin from "../../public/board-members/valentin.jpg";
import max from "../../public/board-members/max.jpg";
import carsten from "../../public/board-members/carsten.jpg";
import eva from "../../public/board-members/eva.jpg";
import marieHarder from "../../public/board-members/marie-harder.jpeg";
import eckart from "../../public/board-members/eckart.jpg";
import Image, { StaticImageData } from "next/image";
import { PiEnvelopeLight } from "react-icons/pi";
import Link from "next/link";

export default function Board() {
  const boardMembers: {
    image: StaticImageData;
    surname: string;
    lastname: string;
    position: string;
    imageStyle?: React.CSSProperties;
  }[] = [
    {
      image: valentin,
      surname: "Valentin",
      lastname: "Müller",
      position: "1. Vorsitzender",
    },
    {
      image: max,
      surname: "Max",
      lastname: "Meurer",
      position: "2. Vorsitzender",
    },
    {
      image: carsten,
      surname: "Carsten",
      lastname: "Friedmann",
      position: "Kassenwart",
    },
    {
      image: eva,
      surname: "Eva",
      lastname: "Dörrbaum",
      position: "Schriftführerin",
    },
    {
      image: marieHarder,
      surname: "Marie",
      lastname: "Harder",
      position: "Beisitzende",
      imageStyle: {
        transform: "scale(1.4) translateX(-30px) translateY(-20px)",
        transformOrigin: "top left",
      },
    },
    {
      image: eckart,
      surname: "Eckart",
      lastname: "Sußenburger",
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
      <div className={"mb-8"}>Unsere Ansprechpartner*innen:</div>
      <div
        className={
          "grid grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-8 md:gap-x-16 mb-16"
        }
      >
        {boardMembers.map((member, index) => (
          <div key={index}>
            <div className={"overflow-hidden rounded-ee-full mb-4 w-fit"}>
              <Image
                src={member.image}
                alt={member.surname}
                height={200}
                style={member.imageStyle}
              ></Image>
            </div>
            <div className={"text-xl font-bold"}>{member.surname}</div>
            <div className={"text-xl font-bold"}>{member.lastname}</div>
            <div className={"font-medium"}>{member.position}</div>
          </div>
        ))}
      </div>

      <div className={"flex flex-col justify-center"}>
        <div className={"self-start font-bold text-xl mt-8"}>
          Fragen? Schreib uns eine Mail:
        </div>
        <div className={"self-start flex gap-2 items-center"}>
          <PiEnvelopeLight size={25}></PiEnvelopeLight>
          <Link href={"mailto:munichtriathlonclub@gmail.com"}>
            <div>munichtriathlonclub@gmail.com</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
