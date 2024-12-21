"use client";

import coverImage from "../public/cover_2.webp";
import mottoImage from "../public/motto.jpg";
import homeLeagueImage from "../public/home_liga.jpg";
import homeContactImage from "../public/home_contact.jpg";
import homeTrainingImage from "../public/home_training.jpg";
import Image, { StaticImageData } from "next/image";
import "./globals.css";
import Link from "next/link";
import { useCallback } from "react";
import { PiIdentificationCardLight } from "react-icons/pi";
import { PiPersonSimpleRunLight } from "react-icons/pi";
import useEmblaCarousel from "embla-carousel-react";
import { NewsContent } from "@/app/news/news-content";

const Overlay = () => {
  return (
    <div className={"absolute h-full w-full flex flex-col items-center mt-6"}>
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

const CoverImage = () => {
  return (
    <Image
      className={`object-cover first-content`}
      src={coverImage}
      alt={"Home Background"}
      priority={true}
    />
  );
};

const Cover = () => {
  return (
    <div className={`relative first-content mb-12`}>
      <Overlay />
      <CoverImage />
    </div>
  );
};

const Motto = () => {
  return (
    <div className={"flex flex-col items-center"}>
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
    <Link href={href} className={"relative md:w-full"}>
      <Image src={src} alt={alt}></Image>
      <div className={"absolute inset-0 w-full h-full flex"}>
        <div
          className={
            "backdrop-blur-sm m-auto px-3 md:px-8 py-1 md:py-2 bg-mtc-black bg-opacity-60 md:text-4xl text-2xl font-bold"
          }
        >
          {text}
        </div>
      </div>
    </Link>
  );
};

const SectionLinks = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="embla">
      <div className="embla__viewport overflow-hidden pb-12 " ref={emblaRef}>
        <div className="embla__container flex">
          <div className="embla__slide basis-10/12 px-2 shrink-0 grow-0 min-w-0 ">
            <ImageWithTextAndLink
              href={"/league"}
              src={homeLeagueImage}
              alt={"Liga"}
              text={"Liga"}
            />
          </div>
          <div className="embla__slide basis-10/12 px-2 shrink-0 grow-0 min-w-0">
            <ImageWithTextAndLink
              href={"/training"}
              src={homeTrainingImage}
              alt={"Training"}
              text={"Training"}
            />
          </div>
          <div className="embla__slide basis-10/12 px-2 shrink-0 grow-0 min-w-0">
            <ImageWithTextAndLink
              href={"/contact"}
              src={homeContactImage}
              alt={"Kontakt"}
              text={"Kontakt"}
            />
          </div>
        </div>
      </div>
      <button className="embla__prev text-black" onClick={scrollPrev}>
        Prev
      </button>
      <button className="embla__next text-black" onClick={scrollNext}>
        Next
      </button>
    </div>
  );
};

const Apply = () => {
  return (
    <div className={`bg-mtc-background text-mtc-black pb-28`}>
      <h1 className={"text-2xl md:text-4xl font-extrabold text-center mb-20"}>
        INTERESSE GEWECKT?
      </h1>
      <div
        className={
          "flex md:flex-row flex-col items-center justify-center gap-12"
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
      <NewsContent isShortVersion={true} />
      <Apply />
    </div>
  );
}
