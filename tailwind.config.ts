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
        findel: ['var(--font-findel)'],
        montserrat: ['var(--font-montserrat)'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "mtc-black": "#2A2A2A",
        "mtc-yellow": "#fee581",
      },
    },
  },
  plugins: [],
};
export default config;
