import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { newsShort } from "@/app/news/news";

export function NewsContent({ isShortVersion = false }) {
  const [isClient, setIsClient] = useState(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 768px)" });
  // Set isClient to true, when this component is in client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className={"flex flex-col mb-8 items-center"}>
      <div
        className={`bg-mtc-background text-mtc-black px-0 md:px-20 max-w-4xl flex flex-col mb-16 items-center`}
      >
        <div className={"text-3xl font-bold text-center mb-8"}>UNSERE NEWS</div>
        <hr className={"border-mtc-black pb-4 mx-4 md:mx-0 w-5/6"} />
        {newsShort.map((news, index) => (
          <div key={index} className={"flex flex-col items-center"}>
            {isBigScreen ? (
              <div className={"flex"}>
                <Image
                  src={news.image}
                  alt={"News Image"}
                  className={"mb-8 object-cover w-1/4 grow-2"}
                ></Image>
                <div className={"flex flex-col p-8 shrink"}>
                  <h3 className={"text-xl font-bold mb-8"}>{news.header}</h3>
                  <p className={"mb-8"}>{news.text}</p>
                </div>
              </div>
            ) : (
              <div className={"flex flex-col"}>
                <h3 className={"text-xl font-bold mb-8 mx-4 text-center"}>
                  {news.header}
                </h3>
                <Image
                  src={news.image}
                  alt={"News Image"}
                  className={"mb-8"}
                ></Image>
                <p className={"text-center mb-8 mx-4"}>{news.text}</p>
              </div>
            )}
            <hr className={"border-mtc-black mb-8 mx-4 md:mx-0 w-5/6"} />
          </div>
        ))}
        {isShortVersion ? (
          <Link href={"/news"} className={"self-center"}>
            <button
              className={
                "bg-mtc-yellow py-3 px-8 text-xl rounded-full text-black w-[300px] font-medium"
              }
            >
              MEHR BERICHTE
            </button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
