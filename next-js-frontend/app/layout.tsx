import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "@/app/navigation";
import Footer from "@/app/footer";
import { Montserrat, Caveat } from "next/font/google";

const findel = localFont({
  src: "./fonts/Findel-Display-Regular.otf",
  variable: "--font-findel",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "MTC Munich",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${findel.variable} ${montserrat.variable} ${caveat.variable} antialiased`}
    >
      <body className={"font-montserrat"}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
