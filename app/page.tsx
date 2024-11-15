"use client";

import coverImage from "../public/cover_2.webp";
import mottoImage from "../public/motto.jpg";
import homeLeagueImage from "../public/home_liga.jpg";
import homeContactImage from "../public/home_contact.jpg";
import homeTrainingImage from "../public/home_training.jpg";
import newsAllgaeuImage from "../public/allgaeu_news.jpg";
import newsSchongauImage from "../public/schongau_news.jpg";
import newsChallengeImage from "../public/challenge_news.jpg";
import Image, { StaticImageData } from "next/image";
import "./globals.css";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";

const Overlay = () => {
  return (
    <div className={"absolute h-full w-full flex flex-col items-center mt-20"}>
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
          className={`md:text-3xl text-xl mt-16 md:w-full w-2/3 text-center text-white font-montserrat`}
        >
          Herzlich Willkommen im Biber-Club!
        </div>
      </div>
      <div className={"mb-60 mt-12"}>
        <button
          className={
            "bg-mtc-yellow py-3 px-8 text-xl rounded-full text-mtc-black font-medium"
          }
        >
          JETZT MITMACHEN
        </button>
      </div>
    </div>
  );
};

const CoverImage = () => {
  return (
    <Image
      className={`h-full w-full object-cover`}
      src={coverImage}
      alt={"Home Background"}
    />
  );
};

const Cover = () => {
  return (
    <div className={`flex w-full relative first-content-height mb-12`}>
      <Overlay />
      <CoverImage />
    </div>
  );
};

const Motto = () => {
  return (
    <div
      className={"bg-mtc-background text-mtc-black flex flex-col items-center"}
    >
      <h2 className={"text-2xl md:text-4xl font-bold mb-8"}>Unser Motto</h2>
      <hr className={"border-mtc-black mb-8 w-5/6"}></hr>
      <Image
        src={mottoImage}
        alt={"The Team cheering."}
        className="w-full md:w-[600px] mb-8"
      ></Image>
      <div className={"font-bold mb-2 mx-4"}>#biberfieber</div>
      <div className={"text-center mx-4 mb-8"}>
        Willkommen beim MTC München, dem Munich Triathlon Club. Wir sind ein
        junger, dynamischer Verein, der es sich zur Aufgabe gemacht hat, durch
        Zusammenhalt, Freundschaft, Transparenz und Sportsgeist das Vereinsleben
        gemeinsam zu gestalten. Wir möchten gemeinsam wachsen, sportliche
        Erfahrungen sammeln und alle, die es möchten, mit unserem #biberfieber
        anstecken.
      </div>
      <div className={"text-center mx-4 mb-12"}>
        Warum Biber? Warum denn nicht, oder habt ihr noch nie etwas von den
        Bibern an der Isar gehört? 😉
      </div>
    </div>
  );
};

const ImageWithTextAndLink = ({
  src,
  alt,
  text,
  href,
}: {
  src: StaticImageData;
  alt: string;
  text: string;
  href: string;
}) => {
  return (
    <Link href={href} className={"relative w-[47%] md:w-full"}>
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
};

const SectionLinks = () => {
  return (
    <div
      className={
        "flex w-full flex-wrap md:flex-nowrap items-stretch justify-center bg-mtc-background gap-2 md:p-12 md:gap-6 pb-12"
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
};

const News = () => {
  const [isClient, setIsClient] = useState(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 768px)" });

  // Set isClient to true, when this component is in client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  const newsShort = [
    {
      image: newsAllgaeuImage,
      header: "Allgäu Triathlon 2024",
      text: "Es war ein Spektakel. Der Allgäu Triathlon 2024. Unsere Biber waren auf der Mitteldistanz und der Olympischen Distanz unterwegs. Was alle gemeinsam hatten: Sie wurden plörre nass. Inklusive der Biber-Fans am Rand. Da half die beste Regenjacke nicht. Am Ende schafften es drei Biber sogar aufs Podium!",
    },
    {
      image: newsSchongauImage,
      header: "Landesliga Süd Damen Schongau",
      text: "Unsere Biber-Damen haben die Ligasaison eröffnet und am vergangenen Wochenende haben sie sie auch in Schongau beendet. Es war uns ein Fest! Bei strahlendem Sonnenschein und unter stürmischem Biber-Jubel gingen Janet, Lisa, Vicky und Anne an den Start. Die dritte Person im Ziel wurde gewertet, also war eine Team-Strategie gefragt. Wie so oft, musste die flexibel noch einmal angepasst werden. Ins Ziel gekommen sind sie aber alle!",
    },
    {
      image: newsChallengeImage,
      header: " Challenge Roth 2024",
      text: "Am ersten Juli-Wochenende stand für einige unserer Biber das Saisonhighlight an. Bei der Challenge Roth gingen Valentin, Jens und Anne an den Start. Valentin schaffte seine Bestzeit auf der Langdistanz und Jens feierte in Roth sein Langdistanz-Debüt. Wo ginge das besser, als bei dem weltweit größten Wettkampf auf der Triathlon-Langdistanz.",
    },
  ];

  return (
    <div
      className={
        "bg-mtc-background text-mtc-black px-0 md:px-20 flex flex-col pb-12"
      }
    >
      <div className={"text-3xl font-bold text-center mb-8"}>UNSERE NEWS</div>
      <hr className={"border-mtc-black pb-4 mx-4 md:mx-0"} />
      {newsShort.map((news, index) => (
        <div key={index}>
          {isBigScreen ? (
            <div className={"flex"}>
              <Image
                src={news.image}
                alt={"News Image"}
                className={"mb-8 object-cover w-1/4 grow-2"}
              ></Image>
              <div className={"flex flex-col p-8 shrink"}>
                <h3 className={"text-xl font-bold mb-8"}>{news.header}</h3>
                <p className={"mb-8"}>{news.text}</p>
              </div>
            </div>
          ) : (
            <div className={"flex flex-col"}>
              <h3 className={"text-xl font-bold mb-8 mx-4 text-center"}>
                {news.header}
              </h3>
              <Image
                src={news.image}
                alt={"News Image"}
                className={"mb-8"}
              ></Image>
              <p className={"text-center mb-8 mx-4"}>{news.text}</p>
            </div>
          )}
          <hr className={"border-mtc-black mb-8 mx-4 md:mx-0"} />
        </div>
      ))}
      <button
        className={
          "bg-mtc-yellow py-3 px-8 mt-8 mb-8 text-xl rounded-full text-black w-[300px] font-medium self-center"
        }
      >
        MEHR BERICHTE
      </button>
    </div>
  );
};

const Apply = () => {
  return (
    <div className={`bg-mtc-background text-mtc-black pb-12`}>
      <h1 className={"text-2xl md:text-4xl font-extrabold text-center mb-8"}>
        INTERESSE GEWECKT?
      </h1>
      <div
        className={
          "flex md:flex-row flex-col items-center justify-center gap-8"
        }
      >
        <div
          className={
            "flex border-b-2 border-mtc-yellow w-[340px] bg-white py-4 px-2"
          }
        >
          <div>IMAGE</div>
          <div>
            <div className={"font-bold"}>Probetraining</div>
            <div className={"text-xs"}>Komm vorbei und lerne uns kennen.</div>
          </div>
        </div>
        <div
          className={
            "flex  border-b-2 border-mtc-yellow w-[340px] bg-white py-4 px-2"
          }
        >
          <div>IMAGE</div>
          <div>
            <div className={"font-bold"}>Mitglied werden</div>
            <div className={"text-xs"}>Genauere Infos gibt es hier.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className={"bg-mtc-background"}>
      <Cover />
      <Motto />
      <SectionLinks />
      <News />
      <Apply />
    </div>
  );
}
