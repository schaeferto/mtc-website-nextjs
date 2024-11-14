"use client";

import Image from "next/image";
import {
  PiFacebookLogoThin,
  PiInstagramLogoThin,
  PiEnvelopeThin,
  PiListLight,
  PiXLight,
} from "react-icons/pi";
import "./globals.css";
import { IconContext } from "react-icons";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import Link from "next/link";

const DesktopMenu = () => (
  <nav className={"flex items-center"}>
    <div className={"flex mr-24 gap-8 text-xl"}>
      <Link href={"/"} className={""}>
        Home
      </Link>
      <Link href={"/news"}>News</Link>
      <Link href={"/verein"}>Verein</Link>
      <Link href={"/sponsoren"}>Sponsoren</Link>
    </div>
    <NavIconList />
  </nav>
);

const MobileMenu = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <div className={"flex items-center mr-4"}>
      <NavIconList />
      <PiListLight size={40} onClick={onMenuClick} />
    </div>
  );
};

const NavIconList = () => {
  return (
    <IconContext.Provider value={{ color: "#FDE480", size: "36" }}>
      <div className={"flex gap-2 lg:mr-12 mr-8"}>
        <Link href={"https://www.instagram.com/mtc_munich/"} target={"_blank"}>
          <PiInstagramLogoThin />
        </Link>
        <Link href={"https://www.facebook.com/mtcmunich/"} target={"_blank"}>
          <PiFacebookLogoThin />
        </Link>
        <Link href={"mailto:munichtriathlonclub@gmail.com"}>
          <PiEnvelopeThin />
        </Link>
      </div>
    </IconContext.Provider>
  );
};

const SideMenu = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed top-0 right-0 bg-transparent z-10 w-full h-full flex overflow-auto">
      <div onClick={onClose} className={"grow backdrop-blur-sm"}></div>
      <div
        className={
          "flex flex-col w-60 h-full bg-mtc-black overflow-auto items-center"
        }
      >
        <PiXLight
          size={40}
          onClick={onClose}
          className={"shrink-0 self-end m-6"}
        >
          Close
        </PiXLight>
        <nav className={"flex flex-col gap-6 text-2xl mt-32"}>
          <Link href="/" onClick={onClose}>
            Home
          </Link>
          <Link href="/news" onClick={onClose}>
            News
          </Link>
          <Link href="/verein" onClick={onClose}>
            Verein
          </Link>
          <Link href="/sponsoren" onClick={onClose}>
            Sponsoren
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default function Navigation() {
  const [isClient, setIsClient] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const isSmartphone = useMediaQuery({ query: "(min-width: 768px)" });

  useEffect(() => {
    if (isSideMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isSideMenuOpen]);

  // Set isClient to true, when this component is in client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  const handleMenuClick = () => {
    setIsSideMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsSideMenuOpen(false);
  };

  let prevScrollpos = window.scrollY;
  window.onscroll = function () {
    const currentScrollPos = window.scrollY;
    const elementById = document.getElementById("navigation");
    if(!elementById) {
      throw new Error('navigation not found');
    }
    if (prevScrollpos > currentScrollPos) {
      elementById.style.top = "40px";
    } else {
      elementById.style.top = "-56px";
    }
    prevScrollpos = currentScrollPos;
  };

  return (
    <nav
      className="bg-mtc-black text-white h-24 flex items-center w-full justify-between fixed top-[40px] z-10"
      id={"navigation"}
    >
      <div>
        <Link href={"/"}>
          <Image
            src="/logo-transparent.png"
            alt="Logo"
            width={84}
            height={84}
            className={`ml-3`}
          />
        </Link>
      </div>
      {isSmartphone ? (
        <DesktopMenu />
      ) : (
        <MobileMenu onMenuClick={handleMenuClick} />
      )}
      {isSideMenuOpen && <SideMenu onClose={handleCloseMenu} />}
    </nav>
  );
}
