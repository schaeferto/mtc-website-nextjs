import mottoImage from "@/public/motto.jpg";
import Image from "next/image";
import Link from "next/link";
import {
  PiIdentificationCardLight,
  PiPersonSimpleRunLight,
} from "react-icons/pi";
import { NewsContent } from "@/app/(frontend)/news/news-content";
import { Video } from "@/app/(frontend)/video";
import { SectionLinks } from "@/app/(frontend)/section-links";
import { getPublishedNews } from "@/lib/news";

const ScrollIndicator = () => {
  return (
    <div className="absolute bottom-24 md:bottom-16 left-0 right-0 z-20 flex flex-col items-center motion-safe:animate-bounce">
      <span className="text-white text-sm font-medium mb-2 tracking-wider">
        Scroll
      </span>
      <svg
        className="w-6 h-6 text-hummel-pollen"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
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

/** Gestrichelte Flugbahn einer Hummel, endet in einer kleinen Hummel. */
const Flugbahn = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 220 90"
    className={className}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 80 C 40 10, 80 90, 120 45 S 175 10, 190 34"
      stroke="currentColor"
      strokeWidth={2}
      strokeDasharray="4 7"
      strokeLinecap="round"
    />
    <g transform="translate(196 30) rotate(25)">
      <ellipse cx="-2" cy="-9" rx="7" ry="5" fill="#ffffff" opacity="0.75" />
      <ellipse cx="0" cy="0" rx="13" ry="9" fill="#F7C948" />
      <rect x="-4" y="-9" width="4" height="18" fill="#231C12" />
      <rect x="4" y="-8.5" width="4" height="17" fill="#231C12" />
      <circle cx="-12" cy="0" r="5" fill="#231C12" />
    </g>
  </svg>
);

const Overlay = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center pt-6 z-10 bg-gradient-to-b from-hummel-pelz/40 via-transparent to-hummel-pelz/60">
      <div className="grow flex flex-col items-center">
        <h1 className="text-[80px] md:text-[140px] leading-none text-center text-white font-findel">
          M T C
        </h1>
        <p className="text-[30px] md:text-[60px] mt-6 text-center text-white font-montserrat">
          Munich Triathlon Club
        </p>
        <p className="md:text-3xl text-xl mt-12 md:w-full w-2/3 text-center text-white font-montserrat">
          Herzlich Willkommen im Biber-Club!
        </p>
      </div>
      <div className="mb-60 mt-12 flex flex-col items-center">
        <Flugbahn className="w-40 md:w-52 -mb-2 ml-24 text-white/80" />
        <Link
          href="/join"
          className="bg-hummel-pollen text-hummel-pelz py-3 px-8 text-xl rounded-full font-semibold shadow-[0_4px_0_#D98E04] hover:translate-y-[2px] hover:shadow-[0_2px_0_#D98E04] transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-hummel-pollen"
        >
          Jetzt mitmachen
        </Link>
      </div>
    </div>
  );
};

const Cover = () => {
  return (
    <div className="relative first-content flex flex-col">
      <div className="relative grow min-h-[inherit]">
        <Overlay />
        <Video fileName={"header-2"} />
        <ScrollIndicator />
      </div>
      <div className="hummel-band h-7 md:h-9 w-full" aria-hidden="true" />
    </div>
  );
};

const Motto = () => {
  return (
    <section className="relative z-20 px-4 md:px-8 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <div className="lg:w-1/2 w-full max-w-[560px] relative">
            <div
              className="wabe absolute inset-0 bg-hummel-pollen translate-x-4 translate-y-4"
              aria-hidden="true"
            />
            <Image
              src={mottoImage}
              alt="Das Team jubelt gemeinsam."
              className="wabe relative w-full aspect-[1.15] object-cover"
            />
          </div>

          <div className="lg:w-1/2 flex flex-col justify-center max-w-[60ch]">
            <span className="text-hummel-honig font-handwritten text-4xl block rotate-[-2deg] mb-2">
              #biberfieber
            </span>
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-6 text-hummel-pelz leading-tight">
              Unser Motto
            </h2>
            <div className="space-y-4 text-base text-hummel-pelz/80 leading-relaxed">
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
              <p className="text-hummel-pelz/60 italic">
                Warum Biber? Warum denn nicht, oder habt ihr noch nie etwas von
                den Bibern an der Isar gehört? 😉
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ApplyLink = ({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <Link
    href={href}
    className="group flex items-center w-[320px] bg-hummel-pollen text-hummel-pelz rounded-full py-3 pl-4 pr-8 gap-4 hover:bg-white transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-hummel-pollen"
  >
    <span className="flex items-center justify-center w-14 h-14 rounded-full bg-hummel-pelz text-hummel-pollen shrink-0">
      {icon}
    </span>
    <span className="flex flex-col">
      <span className="font-bold text-lg">{title}</span>
      <span className="text-sm">{text}</span>
    </span>
  </Link>
);

const Apply = () => {
  return (
    <section className="bg-hummel-pelz text-white">
      <div className="hummel-band h-7 md:h-9 w-full" aria-hidden="true" />
      <div className="px-4 py-20 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center">
          Interesse geweckt?
        </h2>
        <p className="mt-4 text-white/70 text-center max-w-[50ch]">
          Schnupper bei einem Training rein oder werde gleich Teil des Schwarms.
        </p>
        <div className="flex md:flex-row flex-col items-center justify-center gap-6 mt-12">
          <ApplyLink
            href="/apply-training"
            icon={<PiPersonSimpleRunLight size={32} />}
            title="Probetraining"
            text="Komm vorbei und lerne uns kennen."
          />
          <ApplyLink
            href="/join"
            icon={<PiIdentificationCardLight size={32} />}
            title="Mitglied werden"
            text="Genauere Infos gibt es hier."
          />
        </div>
      </div>
    </section>
  );
};

export default async function Home() {
  const articles = await getPublishedNews(2);
  return (
    <div>
      <Cover />
      <Motto />
      <SectionLinks />
      <NewsContent isShortVersion={true} articles={articles} />
      <Apply />
    </div>
  );
}
