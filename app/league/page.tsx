import Image, { StaticImageData } from "next/image";
import women_1_2024 from "../../public/bayernliga_damen_2024.jpg";
import men_1_2024 from "../../public/bayernliga_herren_2024.jpg";
import men_2_2024 from "../../public/landesliga_sued_herren_2024.jpg";

export default function League() {
  const annualResults: {
    year: string;
    teams: {
      image?: StaticImageData;
      name: string;
      overall: string;
      results: string[];
    }[];
  }[] = [
    {
      year: "2024",
      teams: [
        {
          image: women_1_2024,
          name: "Bayernliga Damen",
          overall: "8. Platz",
          results: [
            "04. Mai 2024 - Weiden: 9. Platz",
            "13/14. Juli 2024 - Hof: 8. Platz",
            "21. Juli 2024 - Schongau: 6 Platz",
          ],
        },
        {
          image: men_2_2024,
          name: "Langesliga Süd Herren",
          overall: "1. Platz",
          results: [
            "12. Mai 2024 - Oberschleißheim: 2. Platz",
            "09. Juni 2024 - Bad Tölz: 3. Platz",
            "16. Juni 2024 - Erding: 2. Platz",
            "13. Juli 2024 - Ammersee: 2 Platz",
          ],
        },
        {
          image: men_1_2024,
          name: "Bayernliga Herren",
          overall: "-",
          results: ["-"],
        },
      ],
    },
  ];

  return (
    <div
      className={"first-content text-mtc-black flex flex-col items-center p-8"}
    >
      <h1 className={"text-center mb-4 text-3xl font-bold uppercase"}>Liga</h1>
      <div className={"text-center"}>
        Wir starten in der Saison 2025 mit drei Teams - einer Damen und zwei Herrenmannschaften.
      </div>
      {annualResults.map((annualResult, index) => (
        <div key={index}>
          <h2 className={"font-bold text-2xl py-4"}>{annualResult.year}</h2>
          <div className={"grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8"}>
            {annualResult.teams.map((team, index) => (
              <div key={index} className={"mb-16"}>
                <div className={"font-bold text-xl"}>{team.name}</div>
                {team.image && (
                  <Image
                    src={team.image}
                    alt={team.name}
                    className={"my-2 w-screen"}
                  ></Image>
                )}
                <div className={"text-lg font-bold"}>
                  Gesamtergebnis {annualResult.year}:
                </div>
                <div>{team.overall}</div>
                <div className={"text-lg font-bold mt-4"}>
                  Ergebnisse {annualResult.year}
                </div>
                {team.results.map((result, index) => (
                  <div key={index}>{result}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
