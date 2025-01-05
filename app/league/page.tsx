import Image from "next/image";
import { annualResults, TeamRecord } from "@/app/league/league.content";

export default function League() {
  return (
    <div
      className={"first-content text-mtc-black flex flex-col items-center p-8"}
    >
      <div className={"my-8"}>
        <h1 className={"text-center mb-4 text-3xl font-bold uppercase"}>
          Liga
        </h1>
        <div className={"text-center"}>
          Wir starten in der Saison 2025 mit drei Teams - einer Damen und zwei
          Herrenmannschaften.
        </div>
      </div>
      <hr className={"m-8 border-mtc-black w-full"} />
      <AnnualResults />
    </div>
  );
}

function AnnualResults() {
  return (
    <div>
      {annualResults.map((annualResult, index, array) => (
        <div key={index}>
          {annualResult.isCurrentYear ? (
            <div className={"font-bold text-2xl my-4"}>
              Aktuelle Saison {annualResult.year}
            </div>
          ) : (
            <h2 className={"font-bold text-2xl py-4"}>
              Saison {annualResult.year}
            </h2>
          )}
          <div className={"grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8"}>
            {annualResult.teams.map((team, index) => (
              <TeamResult
                key={index}
                team={team}
                year={annualResult.year}
                isCurrentYear={annualResult.isCurrentYear}
              />
            ))}
          </div>
          {index < array.length - 1 && (
            <hr className={"my-8 border-mtc-black"} />
          )}
        </div>
      ))}
    </div>
  );
}

function TeamResult({
  team,
  year,
  isCurrentYear,
}: {
  team: TeamRecord;
  year: string;
  isCurrentYear?: boolean;
}) {
  return (
    <div className={"mb-16 last:mb-0"}>
      <div className={"font-bold text-xl"}>{team.name}</div>
      {team.image && (
        <Image
          src={team.image}
          alt={team.name}
          className={"my-2 w-screen"}
        ></Image>
      )}
      {!isCurrentYear && (
        <>
          <div className={"text-lg font-bold"}>Gesamtergebnis {year}:</div>
          <div>{team.overall}</div>
        </>
      )}
      {!isCurrentYear ? (
        <div className={"text-lg font-bold mt-4"}>Ergebnisse {year}</div>
      ) : (
        <div className={"text-lg font-bold mt-4"}>Termine</div>
      )}
      {team.results.map((result, index) => (
        <div key={index} className={"mb-4"}>
          <div>{result.text}</div>
          {result.date && <div className={"text-sm"}>{result.date}</div>}
          {result.type && <div className={"text-sm"}>{result.type}</div>}
          {result.place && (
            <div className={"text-sm"}>{result.place}. Platz</div>
          )}
        </div>
      ))}
    </div>
  );
}
