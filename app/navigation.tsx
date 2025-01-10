"use client";

import Image from "next/image";
import {
  PiFacebookLogoLight,
  PiInstagramLogoLight,
  PiEnvelopeLight,
  PiListLight,
  PiXLight,
  PiCaretDown,
  PiCaretLeft,
  PiCaretRight,
} from "react-icons/pi";
import "./globals.css";
import { IconContext } from "react-icons";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import Link from "next/link";

const DesktopMenu = () => {
  const [display, setDisplay] = useState("hidden");
  return (
    <nav className={"flex items-center"}>
      <div className={"flex mr-24 gap-8 text-xl"}>
        <Link href={"/"} className={""}>
          Home
        </Link>
        <Link href={"/news"}>News</Link>
        <div
          className={"relative cursor-pointer"}
          onMouseOver={() => setDisplay("block")}
          onMouseOut={() => setDisplay("hidden")}
        >
          <div className={"cursor-pointer flex gap-2 items-start"}>
            <span>Verein</span>
            <PiCaretDown size={22} className={"self-center"}></PiCaretDown>
          </div>
          <div
            className={`${display} absolute z-10 bg-mtc-black px-6 py-3 whitespace-nowrap cursor-default flex flex-col gap-2`}
            onMouseOut={() => setDisplay("hidden")}
            onClick={() => setDisplay("hidden")}
          >
            <Link href={"/training"} className={"block"}>
              Training
            </Link>
            <Link href={"/league"} className={"block"}>
              Liga
            </Link>
            <Link href={"/board"} className={"block"}>
              Vorstand
            </Link>
            <Link href={"/join"} className={"block"}>
              Mitglied werden
            </Link>
          </div>
        </div>
        <Link href={"/sponsors"}>Sponsoren</Link>
      </div>
      <NavIconList />
    </nav>
  );
};

const MobileMenu = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <div className={"flex items-center mr-4"}>
      <NavIconList />
      <PiListLight
        size={40}
        onClick={onMenuClick}
        className={"cursor-pointer"}
      />
    </div>
  );
};

const NavIconList = () => {
  return (
    <IconContext.Provider value={{ color: "#FDE480", size: "36" }}>
      <div className={"flex gap-2 lg:mr-12 mr-8"}>
        <Link href={"https://www.instagram.com/mtc_munich/"} target={"_blank"}>
          <PiInstagramLogoLight />
        </Link>
        <Link href={"https://www.facebook.com/mtcmunich/"} target={"_blank"}>
          <PiFacebookLogoLight />
        </Link>
        <Link href={"mailto:munichtriathlonclub@gmail.com"}>
          <PiEnvelopeLight />
        </Link>
      </div>
    </IconContext.Provider>
  );
};

const SideMenu = ({ onClose }: { onClose: () => void }) => {
  const [showClubSubNav, setShowClubSubNav] = useState(false);
  const rootNav = (
    <nav className={"grid grid-cols-1 gap-6 text-2xl mt-4"}>
      <div className={"col-start-1"}>&nbsp;</div>
      <Link href="/" onClick={onClose}>
        Home
      </Link>
      <Link href="/news" onClick={onClose}>
        News
      </Link>
      <div
        onClick={() => setShowClubSubNav(true)}
        className={"flex items-center justify-between"}
      >
        <span>Verein</span>
        <PiCaretRight size={26} className={"mr-8"}></PiCaretRight>
      </div>
      <Link href="/sponsors" onClick={onClose}>
        Sponsoren
      </Link>
    </nav>
  );

  const clubSubNav = (
    <nav className={"grid grid-cols-1 gap-6 text-2xl mt-4"}>
      <div
        className={"flex content-center items-center"}
        onClick={() => setShowClubSubNav(false)}
      >
        <PiCaretLeft size={26} className={"text-gray-400"}></PiCaretLeft>
        <span className={"text-sm text-gray-400"}>Zurück</span>
      </div>
      <Link href={"/training"} className={"block"} onClick={onClose}>
        Training
      </Link>
      <Link href={"/league"} className={"block"} onClick={onClose}>
        Liga
      </Link>
      <Link href={"/board"} className={"block"} onClick={onClose}>
        Vorstand
      </Link>
      <Link href={"/join"} className={"block"} onClick={onClose}>
        Mitglied werden
      </Link>
    </nav>
  );

  return (
    <div className="fixed top-0 mt-[40px] right-0 bg-transparent z-10 w-full h-full flex overflow-auto">
      <div onClick={onClose} className={"grow backdrop-blur-sm"}></div>
      <div
        className={
          "flex flex-col w-9/12 h-full bg-mtc-black overflow-auto pl-10"
        }
      >
        <PiXLight
          size={40}
          onClick={onClose}
          className={"shrink-0 self-end m-6 cursor-pointer"}
        >
          Close
        </PiXLight>
        {showClubSubNav ? clubSubNav : rootNav}
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
    if (!elementById) {
      throw new Error("navigation not found");
    }

    if (prevScrollpos > currentScrollPos || currentScrollPos <= 96) {
      elementById.style.top = "0px";
    } else {
      elementById.style.top = "-96px";
    }
    prevScrollpos = currentScrollPos;
  };

  return (
    <nav
      className="bg-mtc-black text-white h-24 flex items-center w-full justify-between fixed top-0 z-50"
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
