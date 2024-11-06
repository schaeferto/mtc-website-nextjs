import coverImage from "../public/cover_2.webp";
import mottoImage from "../public/motto.jpg";
import homeLeagueImage from "../public/home_liga.jpg";
import homeContactImage from "../public/home_contact.jpg";
import homeTrainingImage from "../public/home_training.jpg";
import Image, { StaticImageData } from "next/image";
import "./globals.css";
import Link from "next/link";

const Overlay = () => {
  return (
    <div className={"absolute h-full w-full flex flex-col items-center"}>
      <div className={"grow flex flex-col items-center"}>
        <div
          className={`text-[80px]  md:text-[140px] mt-12 text-center text-white font-findel`}
        >
          M T C
        </div>
        <div
          className={`text-[30px] md:text-[60px] md:mt-0 mt-12 text-center text-white font-montserrat`}
        >
          Munich Triathlon Club
        </div>
        <div
          className={`text-xl mt-16 md:w-full w-2/3 text-center text-white font-montserrat`}
        >
          Herzlich Willkommen im Biber-Club!
        </div>
      </div>
      <div className={"mb-40 mt-12"}>
        <button className={"bg-mtc-yellow py-3 px-8 rounded-full text-black "}>
          JETZT MITMACHEN
        </button>
      </div>
    </div>
  );
};

export function CoverImage() {
  return (
    <Image
      className={`h-full w-full object-cover`}
      src={coverImage}
      alt={"Home Background"}
    />
  );
}

export function Cover() {
  return (
    <div className={`flex w-full relative first-content-height`}>
      <Overlay />
      <CoverImage />
    </div>
  );
}

export function Motto() {
  return (
    <div
      className={
        "bg-mtc-background text-mtc-black flex flex-col items-center p-8"
      }
    >
      <h2 className={"text-2xl md:text-4xl font-bold my-8"}>Unser Motto</h2>
      <Image
        src={mottoImage}
        alt={"The Team cheering."}
        className="w-[300px] md:w-[600px]"
      ></Image>
      <div className={"font-bold mt-8"}>#biberfieber</div>
      <p className={"text-center"}>
        Willkommen beim MTC München, dem Munich Triathlon Club. Wir sind ein
        junger, dynamischer Verein, der es sich zur Aufgabe gemacht hat, durch
        Zusammenhalt, Freundschaft, Transparenz und Sportsgeist das Vereinsleben
        gemeinsam zu gestalten. Wir möchten gemeinsam wachsen, sportliche
        Erfahrungen sammeln und alle, die es möchten, mit unserem #biberfieber
        anstecken.
      </p>
      <p className={"mt-8 text-center"}>
        Warum Biber? Warum denn nicht, oder habt ihr noch nie etwas von den
        Bibern an der Isar gehört? 😉
      </p>
    </div>
  );
}

function ImageWithTextAndLink({
  src,
  alt,
  text,
  href,
}: {
  src: StaticImageData;
  alt: string;
  text: string;
  href: string;
}) {
  return (
    <Link href={href} className={"relative w-full"}>
      <Image src={src} alt={alt}></Image>
      <div className={"absolute inset-0 w-full h-full flex"}>
        <div
          className={
            "backdrop-blur-sm m-auto px-3 md:px-8 py-1 md:py-2 bg-mtc-black bg-opacity-60 md:text-3xl font-bold"
          }
        >
          {text}
        </div>
      </div>
    </Link>
  );
}

function SectionLinks() {
  return (
    <div
      className={
        "flex w-full items-stretch bg-mtc-background p-2 md:p-12 gap-2 md:gap-6 pb-8"
      }
    >
      <ImageWithTextAndLink
        href={"/league"}
        src={homeLeagueImage}
        alt={"Liga"}
        text={"Liga"}
      />
      <ImageWithTextAndLink
        href={"/training"}
        src={homeTrainingImage}
        alt={"Training"}
        text={"Training"}
      />
      <ImageWithTextAndLink
        href={"/contact"}
        src={homeContactImage}
        alt={"Kontakt"}
        text={"Kontakt"}
      />
    </div>
  );
}

function News() {
  return (
    <div className={"bg-mtc-background text-mtc-black"}>
      <div className={"text-xl font-bold text-center pb-8"}>UNSERE NEWS</div>
      <hr className={"border-mtc-black mx-4"} />
      <div className={"h-12"}></div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Cover />
      <Motto />
      <SectionLinks />
      <News />
    </>
  );
}
