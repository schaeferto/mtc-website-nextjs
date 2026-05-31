import Image from "next/image";
import type { LeagueSeason, LeagueEvent } from "@/payload-types";
import type { PopulatedTeam } from "./page";

interface SeasonBlockProps {
  season: LeagueSeason;
  teams: PopulatedTeam[];
  defaultOpen: boolean;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  }).format(new Date(dateStr));
}

export default function SeasonBlock({ season, teams, defaultOpen }: SeasonBlockProps) {
  return (
    <details open={defaultOpen || undefined} className="group bg-gray-100 border border-mtc-black/20 rounded-lg overflow-hidden">
      <summary className="cursor-pointer list-none flex items-center gap-3 px-5 py-4 select-none">
        <h2 className="font-bold text-2xl">{season.heading}</h2>
        <span className="text-sm text-mtc-black/60">({teams.length} Teams)</span>
        <span className="ml-auto text-xl transition-transform duration-200 group-open:rotate-180">▾</span>
      </summary>

      <div className="px-5 pt-4 pb-6">
        {season.caption && (
          <p className="text-mtc-black/70 mb-4">{season.caption}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} season={season} defaultOpen={defaultOpen} />
          ))}
        </div>
      </div>
    </details>
  );
}

function TeamCard({
  team,
  season,
  defaultOpen,
}: {
  team: PopulatedTeam;
  season: LeagueSeason;
  defaultOpen: boolean;
}) {
  const events: LeagueEvent[] = team.events?.docs ?? [];

  return (
    <div className="bg-white rounded-lg p-4 flex flex-col">
      <div className="font-bold text-xl mb-2">{team.name}</div>

      {team.image?.url && (
        <Image
          src={team.image.url}
          alt={team.image.alt ?? team.name}
          width={team.image.width ?? 800}
          height={team.image.height ?? 600}
          className="rounded my-2 w-full aspect-[4/3] object-cover"
        />
      )}

      {!defaultOpen && team.overallPlacement && (
        <div className="mt-2">
          <div className="text-base font-bold">Gesamtergebnis {season.year}:</div>
          <div>{team.overallPlacement}</div>
        </div>
      )}

      <div className="text-base font-bold mt-4 mb-2">
        {defaultOpen ? "Termine" : `Ergebnisse ${season.year}`}
      </div>

      <div className="flex flex-col gap-3">
        {events.map((event) => (
          <div key={event.id} className="border-l-2 border-mtc-yellow pl-3">
            <div className="font-medium">{event.eventName}</div>
            {event.eventDate && (
              <div className="text-sm text-mtc-black/70">{formatDate(event.eventDate)}</div>
            )}
            {event.eventType && (
              <div className="text-sm text-mtc-black/70">{event.eventType}</div>
            )}
            {event.place && (
              <div className="text-sm font-semibold">{event.place}. Platz</div>
            )}
            {event.participants && event.participants.length > 0 && (
              <div className="text-sm text-mtc-black/60">
                {event.participants.map((p) => p.name).join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
