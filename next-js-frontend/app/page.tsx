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

const ScrollIndicator = () => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
      <span className="text-white text-sm font-medium mb-2 tracking-wider">
        Scroll
      </span>
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  );
};

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
    <div className={`relative first-content`}>
      <Overlay />
      <Video fileName={"header-2"} />
      <ScrollIndicator />
    </div>
  );
};

const Motto = () => {
  return (
    <div className="relative z-20 px-4 md:px-8 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left side - Image */}
          <div className="lg:w-1/2">
            <Image
              src={mottoImage}
              alt="The Team cheering."
              className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Right side - Content */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-mtc-yellow font-handwritten text-4xl block rotate-[-2deg]">
                #biberfieber
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-mtc-black leading-tight">
              Unser Motto
            </h2>
            <div className="w-16 h-1.5 bg-mtc-yellow rounded-full mb-6"></div>
            <div className="space-y-4 text-base text-gray-600 leading-relaxed">
              <p>
                Willkommen beim MTC München, dem Munich Triathlon Club. Wir sind
                ein junger, dynamischer Verein, der es sich zur Aufgabe gemacht
                hat, durch Zusammenhalt, Freundschaft, Transparenz und
                Sportsgeist das Vereinsleben gemeinsam zu gestalten.
              </p>
              <p>
                Wir möchten gemeinsam wachsen, sportliche Erfahrungen sammeln
                und alle, die es möchten, mit unserem #biberfieber anstecken.
              </p>
              <p className="text-gray-500 italic">
                Warum Biber? Warum denn nicht, oder habt ihr noch nie etwas von
                den Bibern an der Isar gehört? 😉
              </p>
            </div>
          </div>
        </div>
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
        <Link href={"/apply-training"}>
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
