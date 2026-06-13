export const dynamic = "force-dynamic";

import { getPayload } from "payload";
import config from "@payload-config";
import SeasonView from "./SeasonView";
import type { LeagueSeason, LeagueTeam, LeagueMedia, LeagueEvent } from "@/payload-types";

export type PopulatedTeam = Omit<LeagueTeam, "image" | "events"> & {
  image?: LeagueMedia | null;
  events?: { docs?: LeagueEvent[] };
};

export type SeasonWithTeams = {
  season: LeagueSeason;
  teams: PopulatedTeam[];
};

export default async function LeaguePage() {
  const payload = await getPayload({ config });

  const { docs: seasons } = await payload.find({
    collection: "league-seasons",
    where: { published: { equals: true } },
    sort: "-year",
    depth: 0,
    limit: 50,
  });

  const seasonIds = seasons.map((s) => s.id);

  const { docs: allTeams } = await payload.find({
    collection: "league-teams",
    where: { season: { in: seasonIds } },
    sort: "displayOrder",
    depth: 2,
    limit: 200,
  }) as { docs: PopulatedTeam[] };

  const teamsBySeason = new Map<number, PopulatedTeam[]>();
  for (const team of allTeams) {
    const sid = typeof team.season === "number" ? team.season : (team.season as LeagueSeason).id;
    if (!teamsBySeason.has(sid)) teamsBySeason.set(sid, []);
    teamsBySeason.get(sid)!.push(team);
  }

  const seasonsWithTeams: SeasonWithTeams[] = seasons.map((season) => ({
    season,
    teams: teamsBySeason.get(season.id) ?? [],
  }));

  return (
    <div className="first-content text-mtc-black flex flex-col items-center px-8 pb-8">
      <div className="my-8 text-center">
        <h1 className="text-3xl font-bold uppercase">Liga</h1>
      </div>
      <hr className="mb-8 border-mtc-black w-full" />
      <SeasonView seasonsWithTeams={seasonsWithTeams} />
    </div>
  );
}
