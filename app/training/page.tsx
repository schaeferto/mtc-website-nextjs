"use client";

import Image from "next/image";
import training1 from "../../public/training_1.jpg";
import training2 from "../../public/training_2.jpg";
import training3 from "../../public/training_3.jpg";
import travel from "../../public/travel.jpg";
import swim from "../../public/swim.jpg";

export default function Training() {
  return (
    <div className={"first-content text-mtc-black flex justify-center"}>
      <div className={"flex flex-col items-center px-8 md:max-w-3xl"}>
        <h1 className={"text-center mt-8 mb-4 text-3xl font-bold uppercase"}>
          Training
        </h1>
        <div className={"text-center mb-4"}>
          <p>Triathlon macht gemeinsam mehr Spaß - wir glauben an Teamgeist!</p>
          <p>
            Bei uns steht nicht nur das individuelle Training im Fokus, sondern
            vor allem das gemeinsame Erleben.
          </p>
          <p>Denn zusammen erreichen wir mehr!</p>
        </div>
        <div className={"grid grid-cols-3 gap-2 items-center my-12"}>
          <Image src={training1} alt={"Swim"}></Image>
          <Image src={training2} alt={"Bike"}></Image>
          <Image src={training3} alt={"Run"} className={""}></Image>
        </div>

        <h1 className={"mt-8 mb-4 text-3xl font-bold uppercase text-center"}>
          Gemeinsame Traininszeiten
        </h1>
        <div className={"text-center mb-4"}>
          Wir treffen uns jede Woche zu abwechslungsreichen Trainingseinheiten,
          bei denen wir gemeinsam an unserer Fitness und Performance arbeiten -
          motivierend, fordernd und gemeinsam!
        </div>

        <div className={"grid grid-cols-1 gap-4 mb-8"}>
          <div>
            <h2 className={"text-xl font-medium"}>Schwimmtraining</h2>
            <div>Dienstags 20:30 - 22:00</div>
            <div>Sonntags 19:30 - 21:00</div>
          </div>
          <div>
            <h2 className={"text-xl font-medium"}>Lauftraining</h2>
            <div>Donnerstags 18:30 - 20:00</div>
          </div>
          <div>
            <h2 className={"text-xl font-medium"}>Radtraining</h2>
            <div>Montags 19:30 - 20:30 (Zwift)</div>
          </div>
        </div>

        {/*{calender}*/}

        <div className={"w-full"}>
          <hr className={"m-8 border-mtc-black"} />
        </div>

        <div className={"mb-8"}>
          <h1 className={"mt-8 mb-4 text-3xl font-bold uppercase text-center"}>
            Probetraining
          </h1>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
            purus velit. Sed euismod, nunc ut lacinia cursus, nisi erat
            tincidunt nunc, non tincidunt arcu nisi non eros. Integer nec libero
            nec nulla malesuada tincidunt. Curabitur ac felis nec erat tincidunt
            malesuada. Donec vel sapien nec nulla tincidunt tincidunt.
            Suspendisse potenti. Nullam nec purus velit. Sed euismod, nunc ut
            lacinia cursus, nisi erat tincidunt nunc.
          </div>
        </div>

        <div className={"w-full"}>
          <hr className={"m-8 border-mtc-black"} />
        </div>

        <h1 className={"mt-8 mb-4 text-3xl font-bold uppercase text-center"}>
          Trainingslager
        </h1>
        <div className={"text-center mb-8"}>
          2025 finden gemeinsame MTC Trainingslager statt, um uns gemeinsam auf
          die anstehende Saison vorzubereiten.
        </div>
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-4 mb-24"}>
          <Image src={travel} alt={"Travel"}></Image>
          <div className={"md:mt-4"}>
            <h2 className={"text-xl font-medium mb-4"}>
              Triathlon-Trainingslager in der Toskana
            </h2>
            <div>
              Der Auftakt wird im Früjhahr 2025 in der Toskana in Italien
              stattfinden. Gemeinsames Radeln, Laufen und Schwimmen - wir machen
              uns zusammen fit für die neue Saison!
            </div>
          </div>
        </div>
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"}>
          <Image src={swim} alt={"Swim"}></Image>
          <div className={"md:mt-4"}>
            <h2 className={"text-xl font-medium mb-4"}>
              Schwimm-Trainingslager in München
            </h2>
            <div>
              Das oft leidigste Thema der Triathleten: Schwimmen. Im Winter 2025
              veranstalten wir im Raum München ein gemeinsames
              Schwimm-Trainingslager. Ein Wochenende lang wird geschwommen, bis
              uns die Arme abfallen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
