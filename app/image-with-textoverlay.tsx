import Image, { StaticImageData } from "next/image";
import Link from "next/link";

export function ImageWithTextAndLink({
  src,
  alt,
  text,
  href,
}: {
  src: StaticImageData;
  alt: string;
  text: string;
  href: string;
}) {
  return (
      <Link href={href} className={"w-full h-full block"}>
        <Image src={src} alt={alt}></Image>
        <div
          className={
            "absolute flex flex-col items-center justify-center w-full h-full top-0 left-0"
          }
        >
          <div
            className={
              "backdrop-blur-sm px-3 md:px-8 py-1 md:py-2 bg-mtc-black bg-opacity-60 md:text-4xl text-2xl font-bold text-white"
            }
          >
            {text}
          </div>
        </div>
      </Link>
  );
}
