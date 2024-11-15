import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "@/app/navigation";
import Footer from "@/app/footer";
import Header from "@/app/header";

const findel = localFont({
  src: "./fonts/Findel-Display-Regular.otf",
  variable: "--font-findel",
  display: "swap",
});

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
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
      className={`${findel.variable} ${montserrat.variable} antialiased`}
    >
      <body className={"font-montserrat"}>
        <Header />
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
