"use client";

import "../globals.css";
import pac from "../../public/pac.png";
import runningPoint from "../../public/running_point.png";
import dstr from "../../public/dstr.png";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";

export default function Sponsors() {
  const sponsors = [
    {
      image: runningPoint,
      header: "Running Point",
    },
    {
      image: dstr,
      header: "DSTR",
    },
    {
      image: pac,
      header: "P.A.C.",
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
