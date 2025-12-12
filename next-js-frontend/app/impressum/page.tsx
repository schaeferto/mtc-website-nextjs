import Image from "next/image";
import logo from "../../public/logo-rounded.svg";

export default function Impressum() {
  return (
    <div
      className={"bg-mtc-background flex-col flex first-content items-center"}
    >
      <div className="text-mtc-black flex flex-col items-center">
        <div className={"mt-8 font-bold text-xl"}>Impressum</div>
        <div className={"text-xl"}>Munich Triathlon Club e.V.</div>
        <div className={"mt-8"}>
          <p>
            <span className={"font-bold"}>Email:</span>{" "}
            munichtriathlonclub@gmail.com
          </p>
          <p className={"font-bold mt-8"}>1. Vorsitzender:</p>
          <p>Valentin Müller</p>
          <p className={"font-bold mt-2 mb-1"}>Anschrift:</p>
          <p>Schinkelstraße 43</p>
          <p>80805, München</p>
        </div>
      </div>
      <Image width={120} src={logo} alt="Logo" className={"mt-32"} />
    </div>
  );
}
