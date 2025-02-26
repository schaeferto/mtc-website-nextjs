import Image from "next/image";
import footerImage from "../public/orig-free-footer.webp";
import { PiGithubLogoFill } from "react-icons/pi";
import Link from "next/link";
import pac from "../public/pac.png";
import runningPoint from "../public/running_point.png";
import dstr from "../public/dstr.png";

export default function Footer() {
  return (
    <footer
      className={`bg-mtc-black pt-[80px] text-mtc-background flex flex-col items-center`}
    >
      <FooterImage></FooterImage>
      <FooterSponsors></FooterSponsors>
      <FooterText></FooterText>
    </footer>
  );
}

function FooterSponsors() {
  return (
    <div className={"flex flex-col items-center text-sm my-12 md:max-w-3xl"}>
      <div className={"mb-8"}>Wir bedanken uns bei unseren Sponsoren:</div>
      <div className={"flex justify-center items-center gap-8"}>
        <Image
          src={pac}
          alt={"Logo"}
          width={760}
          height={306}
          className={"w-3/12"}
        ></Image>
        <Image
          src={runningPoint}
          alt={"Logo"}
          width={14747}
          height={1346}
          className={"w-3/12"}
        ></Image>
        <Image
          src={dstr}
          alt={"Logo"}
          width={329}
          height={329}
          className={"w-2/12"}
        ></Image>
      </div>
    </div>
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
        className={"md:max-w-3xl object-cover object-top saturate-[0.7]"}
      ></Image>
    </div>
  );
};

const FooterText = () => {
  return (
    <div className="flex flex-col justify-center items-center text-sm gap-4 py-6">
      <Link href={"/impressum"}>Impressum</Link>
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
