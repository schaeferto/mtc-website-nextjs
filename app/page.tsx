import coverImage from "../public/cover_2.webp";
import Image from "next/image";
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
        <button className={"bg-mtc-yellow py-3 px-8 rounded-full text-black"}>
          JETZT MITMACHEN
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className={`flex h- w-full relative display-height`}>
      <Overlay />
      <Image
        className={`h-full w-full object-cover`}
        src={coverImage}
        alt={"Home Background"}
      ></Image>
    </div>
  );
}
