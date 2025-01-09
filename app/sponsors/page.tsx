"use client";

import "../globals.css";
import pac from "../../public/pac.png";
import runningPoint from "../../public/running_point.png";
import trek from "../../public/trek.png";
import dstr from "../../public/dstr.png";
import hoppe from "../../public/hoppe.jpeg";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";

export default function Sponsors() {
  const sponsors = [
    {
      image: runningPoint,
      header: "Running Point",
      text: "Unterstützt das Triathlon-Team mit einem jährlichen Spendenbeitrag.",
      link: "www.running-point.de",
    },
    {
      image: dstr,
      header: "DSTR",
      text: "Unterstützt das Triathlon-Team mit einem jährlichen Spendenbeitrag.",
      link: "dstr-plan.de",
    },
    {
      image: pac,
      header: "P.A.C.",
      text: "Unterstützt das Triathlon-Team mit einem jährlichen Spendenbeitrag.",
      link: "www.pac-original.de",
    },
    {
      image: trek,
      header: "TREK",
      text: "Unterstützt das Triathlon-Team mit Rabatten und Ausstattung für Wettkämpfe.",
      link: "www.trekbikes.com/de/de_DE",
    },
    {
      image: hoppe,
      header: "Hoppebräu",
      text: "Unterstützt das Triathlon-Team mit hopfigen Getränken.",
      link: "www.hoppebraeu.de",
    },
  ];
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  const [isClient, setIsClient] = useState(false);
  // Set isClient to true, when this component is in client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div
      className={"first-content pt-12 px-24 mb-24 flex-col flex items-center"}
    >
      <div className={"header text-center"}>Sponsoren & Partner</div>
      <div className={"text-center mb-12"}>
        Wir bedanken uns für eure biberstarke Unterstützung!
      </div>
      <div
        className={
          "grid gap-12 grid-cols-1 justify-start text-center md:text-left"
        }
      >
        {sponsors.map((sponsor, index) => (
          <div
            key={index}
            className={
              "flex md:flex-row flex-col gap-12 items-center md:items-center"
            }
          >
            {isDesktop && (
              <Image src={sponsor.image} alt={"Logo"} width={140}></Image>
            )}
            <div className={"flex flex-col items-center md:items-start"}>
              <div className={"font-bold text-xl"}>{sponsor.header}</div>
              {!isDesktop && (
                <Image
                  src={sponsor.image}
                  alt={"Logo"}
                  width={120}
                  className={"my-4"}
                ></Image>
              )}
              <div className={""}>{sponsor.text}</div>
              <a href={sponsor.link}>
                <u>{sponsor.link}</u>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
