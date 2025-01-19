import { StaticImageData } from "next/image";
import women_1_2025 from "@/public/bayernliga_damen_2025.jpg";
import men_2_2025 from "@/public/landesliga_sued_herren_2025.jpg";
import men_1_2025 from "@/public/bayernliga_herren_2025.jpg";
import women_1_2024 from "@/public/bayernliga_damen_2024.jpg";
import men_1_2024 from "@/public/bayernliga_herren_2024.jpg";

export type ResultRecord = {
  text: string;
  date?: string;
  type?: string;
  place?: string;
};

export type TeamRecord = {
  image?: StaticImageData;
  name: string;
  overall?: string;
  results: ResultRecord[];
};

export type AnnualResult = {
  year: string;
  isCurrentYear?: boolean;
  teams: TeamRecord[];
};

export const annualResults: AnnualResult[] = [
  {
    isCurrentYear: true,
    year: "2025",
    teams: [
      {
        image: women_1_2025,
        name: "Bayernliga Damen",
        results: [
          {
            text: "Triathlon Weiden",
            date: "10. Mai 2025",
            type: "Supersprint mit Mannschaftsverfolgung",
          },
          {
            text: "GEALAN Triathlon der IfL Hof",
            date: "12. und 13. Juli 2025",
            type: "Team Relay mit Wertung zur Bayrischen Meisterschaft und Kurzdistanz mit Windschatten",
          },
          {
            text: "Schongau Triathlon",
            date: "27. Juli 2025",
            type: "Mannschaftssprint",
          },
        ],
      },
      {
        image: men_2_2025,
        name: "Bayernliga Herren",
        results: [
          {
            text: "Triathlon Weiden",
            date: "10. Mai 2025",
            type: "Supersprint mit Mannschaftsverfolgung",
          },
          {
            text: "GEALAN Triathlon der IfL Hof",
            date: "12. und 13. Juli 2025",
            type: "Team Relay mit Wertung zur Bayrischen Meisterschaft und Kurzdistanz mit Windschattenfreigabe",
          },
          {
            text: "Schongau Triathlon",
            date: "27. Juli 2025",
            type: "Mannschaftssprint",
          },
        ],
      },
      {
        image: men_1_2025,
        name: "Landesliga Süd Herren",
        results: [
          {
            text: "triathlon.de CUP München/Oberschleißheim",
            date: "25. Mai 2025",
            type: "Mannschaftswettkampf",
          },
          {
            text: "Stadttriathlon Erding",
            date: "01. Juni 2025",
            type: "Kurzdistanz mit Windschattenverbot",
          },
          {
            text: "triathlon.de CUP Landshut",
            date: "22. Juni 2025",
            type: "Sprintdistanz mit Windschattenverbot",
          },
          {
            text: "Ammersee Triathlon",
            date: "12. Juli 2025",
            type: "Sprintdistanz mit Windschattenfreigabe",
          },
        ],
      },
    ],
  },
  {
    year: "2024",
    teams: [
      {
        image: women_1_2024,
        name: "Bayernliga Damen",
        overall: "8. Platz",
        results: [
          {
            text: "Weiden",
            date: "04. Mai 2024",
            place: "9",
          },
          {
            text: "Hof",
            date: "13. und 14. Juli 2024",
            place: "8",
          },
          {
            text: "Schongau",
            date: "21. Juli 2024",
            place: "6",
          },
        ],
      },
      {
        image: men_1_2024,
        name: "Landesliga Süd Herren",
        overall: "1. Platz",
        results: [
          {
            text: "Oberschleißheim",
            date: "12. Mai 2024",
            place: "2",
          },
          {
            text: "Bad Tölz",
            date: "09. Juni 2024",
            place: "3",
          },
          {
            text: "Erding",
            date: "16. Juni 2024",
            place: "2",
          },
          {
            text: "Ammersee",
            date: "13. Juli 2024",
            place: "2",
          },
        ],
      },
    ],
  },
];
