import { getPayload } from "payload";
import config from "@payload-config";
import SeasonBlock from "./SeasonBlock";
import type { LeagueSeason, LeagueTeam, LeagueMedia, LeagueEvent } from "@/payload-types";

type PopulatedTeam = Omit<LeagueTeam, "image" | "events"> & {
  image?: LeagueMedia | null;
  events?: { docs?: (LeagueEvent | number)[] };
};

type PopulatedSeason = Omit<LeagueSeason, "teams"> & {
  teams?: { docs?: (PopulatedTeam | number)[] };
};

export default async function LeaguePage() {
  const payload = await getPayload({ config });

  const { docs: seasons } = await payload.find({
    collection: "league-seasons",
    where: { published: { equals: true } },
    sort: "-year",
    depth: 2,
    limit: 50,
  });

  const latestYear = seasons[0]?.year ?? null;

  return (
    <div className="first-content text-mtc-black flex flex-col items-center px-8 pb-8">
      <div className="my-8 text-center">
        <h1 className="text-3xl font-bold uppercase">Liga</h1>
      </div>
      <hr className="mb-8 border-mtc-black w-full" />

      <div className="w-full flex flex-col gap-4">
        {(seasons as PopulatedSeason[]).map((season) => {
          const teams = (season.teams?.docs ?? []).filter(
            (t): t is PopulatedTeam => typeof t !== "number",
          );
          return (
            <SeasonBlock
              key={season.id}
              season={season}
              teams={teams}
              defaultOpen={season.year === latestYear}
            />
          );
        })}
      </div>
    </div>
  );
}
