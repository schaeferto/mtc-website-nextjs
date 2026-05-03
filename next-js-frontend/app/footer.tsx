import Image from "next/image";
import footerImage from "../public/orig-free-footer.webp";
import { PiGithubLogoFill } from "react-icons/pi";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className={`bg-mtc-black pt-[80px] text-mtc-background flex flex-col items-center`}
    >
      <FooterImage></FooterImage>
      <FooterText></FooterText>
    </footer>
  );
}

const FooterImage = () => {
  return (
    <div className={"flex w-full bg-mtc-black justify-center"}>
      <Image
        src={footerImage}
        width={2478}
        height={1394}
        alt={"footer"}
        loading="eager"
        className={"md:max-w-3xl object-cover object-top saturate-[0.7]"}
      ></Image>
    </div>
  );
};

const FooterText = () => {
  return (
    <div className="flex flex-col justify-center items-center text-sm gap-4 py-6">
      <div className="flex gap-4">
        <Link href={"/impressum"}>Impressum</Link>
        <span>|</span>
        <Link href={"/datenschutz"}>Datenschutz</Link>
      </div>
      <div>© 2024 Munich Triathlon Club e.V.</div>
      <div className="flex flex-col items-center justify-center">
        <div>Made with ❤️ by</div>
        <a href="https://github.com/schaeferto" target="_blank" className={""}>
          <PiGithubLogoFill
            className={"inline mr-1"}
            size={14}
          ></PiGithubLogoFill>
          <span>schaeferto</span>
        </a>
      </div>
    </div>
  );
};
