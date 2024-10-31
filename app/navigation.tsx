"use client";

import Image from "next/image";
import {
  PiFacebookLogoThin,
  PiInstagramLogoThin,
  PiEnvelopeThin,
} from "react-icons/pi";
import "./globals.css";
import { IconContext } from "react-icons";

export default function Navigation() {
  return (
    <header className="bg-mtc-black text-white h-24 flex items-center w-full justify-between">
      <div>
        <Image
          src="/logo-transparent.png"
          alt="Logo"
          width={84}
          height={84}
          className={`ml-3`}
        />
      </div>
      <nav className={"flex items-center"}>
        <div className={"flex mr-24 gap-8 text-xl"}>
          <a href={"/"} className={""}>
            Home
          </a>
          <a href={"/news"}>News</a>
          <a href={"/verein"}>Verein</a>
          <a href={"/sponsoren"}>Sponsoren</a>
        </div>
        <IconContext.Provider value={{ color: "#FDE480", size: "36" }}>
          <div className={"flex gap-2 mr-12"}>
            <PiInstagramLogoThin size={36} />
            <PiFacebookLogoThin size={36} />
            <PiEnvelopeThin size={36} />
          </div>
        </IconContext.Provider>
      </nav>
    </header>
  );
}
