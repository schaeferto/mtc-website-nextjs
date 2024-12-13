import "../globals.css";
import pac from "../../public/pac.png";
import runningPoint from "../../public/running_point.png";
import trek from "../../public/trek.png";
import Image from "next/image";

export default function Sponsors() {
  const sponsors = [
    {
      image: runningPoint,
      header: "Running Point",
      text: "Unterstützt das Triathlon-Team mit einem jährlichen Spendenbeitrag.",
      link: "www.running-point.de",
    },
    {
      image: pac,
      header: "P.A.C.",
      text: " Unterstützt das Triathlon-Team mit einem jährlichen Spendenbeitrag.",
      link: "www.pac-original.de",
    },
    {
      image: trek,
      header: "TREK",
      text: " Unterstützt das Triathlon-Team mit Rabatten und Mobiliar.",
      link: "www.trekbikes.com/de/de_DE",
    },
  ];

  return (
    <div className={"first-content pt-12 px-24"}>
      <div className={"header text-center"}>Sponsoren & Partner</div>
      <div className={"text-center mb-12"}>
        Wir bedanken uns für eure biberstarke Unterstützung!
      </div>
      <div
        className={
          "grid gap-12 grid-cols-1 justify-start text-center md:text-left mb-24"
        }
      >
        {sponsors.map((sponsor, index) => (
          <div
            key={index}
            className={
              "flex md:flex-row flex-col gap-12 items-center md:items-center"
            }
          >
            <Image src={sponsor.image} alt={"Logo"} width={200}></Image>
            <div>
              <div className={"font-bold text-xl pb-4"}>{sponsor.header}</div>
              <div className={"pb-4"}>{sponsor.text}</div>
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
