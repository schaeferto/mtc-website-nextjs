import Image from "next/image";
import footerImage from "../public/free-footer.webp";
import { PiGithubLogoFill } from "react-icons/pi";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={`bg-mtc-black pt-[80px]`}>
      <div className={"flex w-full bg-mtc-black"} style={{ height: "55vw" }}>
        <Image
          src={footerImage}
          alt={"footer"}
          className={
            "w-full h-full object-cover object-top bg-mtc-black saturate-[0.6]"
          }
        ></Image>
      </div>
      <div className="flex flex-col justify-center items-center text-sm gap-4 py-6">
        <Link href={"/impressum"}>Impressum</Link>
        <div>© 2024 Munich Triathlon Club e.V.</div>
        <div className="flex flex-col items-center justify-center">
          <div>Made with ❤️ by</div>
          <a
            href="https://github.com/schaeferto"
            target="_blank"
            className={""}
          >
            <PiGithubLogoFill
              className={"inline mr-1"}
              size={14}
            ></PiGithubLogoFill>
            <span>schaeferto</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
