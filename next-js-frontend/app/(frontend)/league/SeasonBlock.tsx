import type { LeagueSeason } from "@/payload-types";
import type { PopulatedTeam } from "./page";
import { TeamCard } from "./TeamCard";

interface SeasonBlockProps {
  season: LeagueSeason;
  teams: PopulatedTeam[];
  defaultOpen: boolean;
}

export default function SeasonBlock({ season, teams, defaultOpen }: SeasonBlockProps) {
  return (
    <details
      open={defaultOpen || undefined}
      className="group bg-gray-100 border border-mtc-black/20 rounded-lg overflow-hidden"
    >
      <summary className="cursor-pointer list-none flex items-center gap-3 px-5 py-4 select-none">
        <h2 className="font-bold text-2xl">{season.heading}</h2>
        <span className="text-sm text-mtc-black/60">({teams.length} Teams)</span>
        <span className="ml-auto text-xl transition-transform duration-200 group-open:rotate-180">▾</span>
      </summary>

      <div className="px-5 pt-4 pb-6">
        {season.caption && (
          <p className="text-mtc-black/70 mb-4">{season.caption}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              season={season}
              isCurrentSeason={defaultOpen}
            />
          ))}
        </div>
      </div>
    </details>
  );
}
