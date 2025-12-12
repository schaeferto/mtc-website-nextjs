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
    <div className="relative w-full h-full">
      <Link href={href} className="block w-full h-full">
        <Image src={src} alt={alt} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="backdrop-blur-sm px-3 md:px-8 py-1 md:py-2 bg-mtc-black bg-opacity-60 md:text-4xl text-2xl font-bold text-white rounded-sm">
            {text}
          </div>
        </div>
      </Link>
    </div>
  );
}
