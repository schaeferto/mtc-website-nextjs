import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        findel: ["var(--font-findel)"],
        montserrat: ["var(--font-montserrat)"],
        handwritten: ["var(--font-caveat)"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "mtc-black": "#464646",
        "mtc-yellow": "#FDE480",
        "mtc-background": "#ECECEC",
        // Hummel-Design
        "hummel-pelz": "#231C12",
        "hummel-pollen": "#F7C948",
        "hummel-honig": "#D98E04",
        "hummel-klee": "#8E6AA8",
      },
    },
  },
  plugins: [],
};
export default config;
