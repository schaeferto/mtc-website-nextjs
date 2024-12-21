"use client";

import Image from "next/image";
import training1 from "../../public/training_1.jpg";
import training2 from "../../public/training_2.jpg";
import training3 from "../../public/training_3.jpg";
import travel from "../../public/travel.jpg";
import swim from "../../public/swim.jpg";

export default function Training() {
  return (
    <div
      className={"first-content text-mtc-black flex flex-col items-center px-8"}
    >
      <h1 className={"text-center mt-8 mb-4 text-3xl font-bold uppercase"}>
        Training
      </h1>
      <div className={"text-center mb-4"}>
        Wir wollen nicht nur alleine trainieren - Triathlon ist ein Teamsport!
      </div>
      <div className={"grid grid-cols-3 gap-2 items-center"}>
        <Image src={training1} alt={"Swim"}></Image>
        <Image src={training2} alt={"Bike"}></Image>
        <Image src={training3} alt={"Run"} className={""}></Image>
      </div>

      <h1 className={"mt-8 mb-4 text-3xl font-bold uppercase text-center"}>
        Gemeinsame Traininszeiten
      </h1>
      <div className={"text-center mb-4"}>
        Wir treffen uns jede Woche zu unterschiedlichen Trainingseinheiten, um
        gemeinsam an unserer Performance zu arbeiten.
      </div>

      <div className={"grid grid-cols-1 gap-4"}>
        <div>
          <h2 className={"text-xl font-medium"}>Schwimmtraining</h2>
          <div>Dienstag 20:30 - 22:00</div>
          <div>Sonntag 19:30 - 21:00</div>
        </div>
        <div>
          <h2 className={"text-xl font-medium"}>Lauftraining</h2>
          <div>Donnerstag 18:30 - 20:00</div>
        </div>
        <div>
          <h2 className={"text-xl font-medium"}>Radtraining</h2>
          <div>Zwift</div>
          <div>Montag 19:30 - 20:30</div>
        </div>
      </div>

      {/*{calender}*/}

      <h1 className={"mt-8 mb-4 text-3xl font-bold uppercase text-center"}>
        Trainingslager
      </h1>
      <div className={"text-center mb-8"}>
        In 2025 wollen wir gemeinsame Trainingslager organisieren, um uns
        optimal auf die Saison vorzubereiten.
      </div>
      <div className={"grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"}>
        <Image src={travel} alt={"Travel"}></Image>
        <div className={"md:mt-4"}>
          <h2 className={"text-xl font-medium mb-4"}>Kroatien</h2>
          <div>
            Der Auftakt soll voraussichtlich im Frühjahr 2025 in Kroatien sein.
            Gemeinsames Radeln, Laufen und Schwimmen - wir machen uns zusammen
            fit für die neue Saison!
          </div>
        </div>
      </div>
      <div className={"grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"}>
        <Image src={swim} alt={"Swim"}></Image>
        <div className={"md:mt-4"}>
          <h2 className={"text-xl font-medium mb-4"}>
            Schwimm-Trainingslager München
          </h2>
          <div>
            Das oft leidigste Thema der Triathleten. Das Schwimmen. Im Winter
            2025 veranstalten wir im Raum München ein gemeinsames
            Schwimm-Trainingslager. Ein Wochenende lang wird geschwommen, bis
            uns die Arme abfallen.
          </div>
        </div>
      </div>
    </div>
  );
}
