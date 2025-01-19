import mottoImage from "../public/motto.jpg";
import Image from "next/image";
import "./globals.css";
import Link from "next/link";
import {
  PiIdentificationCardLight,
  PiPersonSimpleRunLight,
} from "react-icons/pi";
import { NewsContent } from "@/app/news/news-content";
import { Video } from "@/app/video";
import { SectionLinks } from "@/app/section-links";

const Overlay = () => {
  return (
    <div
      className={"absolute h-full w-full flex flex-col items-center mt-6 z-10"}
    >
      <div className={"grow flex flex-col items-center"}>
        <div
          className={`text-[80px]  md:text-[140px] text-center text-white font-findel`}
        >
          M T C
        </div>
        <div
          className={`text-[30px] md:text-[60px] md:mt-0 mt-12 text-center text-white font-montserrat`}
        >
          Munich Triathlon Club
        </div>
        <div
          className={`md:text-3xl text-xl mt-16 md:w-full w-2/3 text-center text-white font-montserrat`}
        >
          Herzlich Willkommen im Biber-Club!
        </div>
      </div>
      <div className={"mb-60 mt-12"}>
        <Link href={"/join"}>
          <button
            className={
              "bg-mtc-yellow py-3 px-8 text-xl rounded-full font-medium"
            }
          >
            JETZT MITMACHEN
          </button>
        </Link>
      </div>
    </div>
  );
};

const Cover = () => {
  return (
    <div className={`relative first-content mb-16`}>
      <Overlay />
      <Video fileName={"header-video"} />
    </div>
  );
};

const Motto = () => {
  return (
    <div className={"flex flex-col items-center"}>
      <h2 className={"text-2xl md:text-4xl font-bold mb-8"}>Unser Motto</h2>
      <hr className={"border-mtc-black w-5/6 md:max-w-3xl"}></hr>
      <Image
        src={mottoImage}
        alt={"The Team cheering."}
        className="w-full md:w-[600px] my-16"
      ></Image>
      <div className={"font-bold mb-2 mx-4"}>#biberfieber</div>
      <div className={"text-center mx-4 mb-8 max-w-3xl"}>
        Willkommen beim MTC München, dem Munich Triathlon Club. Wir sind ein
        junger, dynamischer Verein, der es sich zur Aufgabe gemacht hat, durch
        Zusammenhalt, Freundschaft, Transparenz und Sportsgeist das Vereinsleben
        gemeinsam zu gestalten. Wir möchten gemeinsam wachsen, sportliche
        Erfahrungen sammeln und alle, die es möchten, mit unserem #biberfieber
        anstecken.
      </div>
      <div className={"text-center mx-4 max-w-3xl"}>
        Warum Biber? Warum denn nicht, oder habt ihr noch nie etwas von den
        Bibern an der Isar gehört? 😉
      </div>
    </div>
  );
};

const Apply = () => {
  return (
    <div className={`bg-mtc-background text-mtc-black mb-16`}>
      <h1 className={"text-2xl md:text-4xl font-extrabold text-center"}>
        INTERESSE GEWECKT?
      </h1>
      <div
        className={
          "flex md:flex-row flex-col items-center justify-center gap-6 py-16"
        }
      >
        <Link href={"/training"}>
          <div
            className={
              "flex border-b-2 border-mtc-yellow w-[320px] bg-white p-2 px-4 gap-4"
            }
          >
            <PiPersonSimpleRunLight size={46} />
            <div className={"flex flex-col justify-center"}>
              <div className={"font-bold"}>Probetraining</div>
              <div className={"text-xs"}>Komm vorbei und lerne uns kennen.</div>
            </div>
          </div>
        </Link>
        <Link href={"/join"}>
          <div
            className={
              "flex border-b-2 border-mtc-yellow w-[320px] bg-white p-2 px-4 gap-4"
            }
          >
            <PiIdentificationCardLight size={46} />
            <div className={"flex flex-col justify-center"}>
              <div className={"font-bold"}>Mitglied werden</div>
              <div className={"text-xs"}>Genauere Infos gibt es hier.</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div>
      <Cover />
      <Motto />
      <SectionLinks />
      <NewsContent isShortVersion={true} newsCount={2} />
      <Apply />
    </div>
  );
}
