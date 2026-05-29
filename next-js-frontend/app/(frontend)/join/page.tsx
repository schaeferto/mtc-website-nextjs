import "../globals.css";
import { PiEnvelopeLight } from "react-icons/pi";
import Link from "next/link";

export default function Join() {
  return (
    <div className={"first-content px-12 pt-12 flex justify-center mb-16"}>
      <div className={"flex flex-col md:max-w-3xl text-center md:text-left"}>
        <h1 className={"text-2xl font-bold text-center mb-8"}>
          MITGLIED WERDEN
        </h1>
        <div className={"flex flex-col gap-8"}>
          <p>
            Du bist auf der Suche nach einem Triathlonverein und möchtest uns -
            den MTC - gerne kennenlernen? Komm zu unserem{" "}
            <span className={"font-bold"}>Probetraining</span> und erlebe, was
            uns ausmacht! Nutze hierfür einfach den Button weiter unten, um dich
            für ein Probetraining anzumelden. Wir freuen uns darauf, dich
            kennenzulernen!
          </p>

          {/* training section */}
          <h1 className={"my-8 text-3xl font-bold uppercase text-center"}>
            Gemeinsame Trainingszeiten
          </h1>
          <div className={"text-center"}>
            Wir treffen uns jede Woche zu abwechslungsreichen
            Trainingseinheiten, bei denen wir gemeinsam an unserer Fitness und
            Performance arbeiten - motivierend, fordernd und gemeinsam!
          </div>

          <div className={"my-8 grid grid-cols-1 gap-4 text-center"}>
            <div>
              <h2 className={"text-xl font-medium"}>Schwimmtraining</h2>
              <div>Dienstags 20:30 - 22:00</div>
              <div>Sonntags 19:30 - 21:00</div>
            </div>
            <div>
              <h2 className={"text-xl font-medium"}>Lauftraining</h2>
              <div>Donnerstags 18:30 - 20:00</div>
            </div>
          </div>

          {/* button for applying to test training */}
          <div className="flex flex-col items-center py-8">
            <Link href="/apply-training">
              <button className="bg-mtc-yellow py-3 px-8 text-xl rounded-full text-black max-w-[500px] font-medium">
                ANMELDUNG ZUM PROBETRAINING
              </button>
            </Link>
            <p className="text-sm text-gray-400 mt-4 text-center max-w-lg">
              Falls die automatische Anmeldung nicht funktioniert, schreib uns
              einfach eine E-Mail, und wir melden uns schnellstmöglich bei dir
              zurück.
            </p>
          </div>
          <div
            className={
              "flex flex-col md:flex-row gap-12 items-center justify-center"
            }
          >
            <div className={"flex flex-col"}>
              <p>Munich Triathlon Club e.V.</p>
              <p>Schinkelstraße 43</p>
              <p>80805 München</p>
            </div>
            <div className={"flex gap-2 items-center"}>
              <PiEnvelopeLight size={25}></PiEnvelopeLight>
              <Link href={"mailto:munichtriathlonclub@gmail.com"}>
                <div>munichtriathlonclub@gmail.com</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
