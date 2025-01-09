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
            den MTC - gerne kennenlernen? Komm zu unsererm{" "}
            <Link href={"/training"}>
              <span className={"font-bold"}>Probetraining</span>
            </Link>{" "}
            und erlebe, was uns ausmacht! Schreib uns einfach eine E-Mail, und
            wir melden uns schnellstmöglich bei dir zurück. Wir freuen uns
            darauf, dich persönlich kennenzulernen!
          </p>
          <div className={"flex flex-col"}>
            <p>Munich Triathlon Club e.V.</p>
            <p>Schinkelstraße 43</p>
            <p>80805 München</p>
          </div>
          <div>
            <div className={"self-start flex gap-2 items-center"}>
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
