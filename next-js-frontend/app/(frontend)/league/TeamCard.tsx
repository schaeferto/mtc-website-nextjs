"use client";

import Image from "next/image";
import type { LeagueSeason, LeagueEvent } from "@/payload-types";
import type { PopulatedTeam } from "./page";

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  }).format(new Date(dateStr));
}

type EventStatus = "past" | "next" | "future";

function getEventStatuses(
  events: LeagueEvent[]
): Array<{ event: LeagueEvent; status: EventStatus }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let nextFound = false;
  return events.map((event) => {
    if (!event.eventDate) return { event, status: "future" };
    const d = new Date(event.eventDate);
    if (d < today) return { event, status: "past" };
    if (!nextFound) {
      nextFound = true;
      return { event, status: "next" };
    }
    return { event, status: "future" };
  });
}

export function TeamCard({
  team,
  season,
  isCurrentSeason,
}: {
  team: PopulatedTeam;
  season: LeagueSeason;
  isCurrentSeason: boolean;
}) {
  const events: LeagueEvent[] = (team.events?.docs ?? [])
    .slice()
    .sort((a, b) => {
      if (!a.eventDate) return 1;
      if (!b.eventDate) return -1;
      return a.eventDate < b.eventDate ? -1 : a.eventDate > b.eventDate ? 1 : 0;
    });

  const eventsWithStatus = isCurrentSeason
    ? getEventStatuses(events)
    : events.map((e) => ({ event: e, status: "past" as EventStatus }));

  return (
    <div className="bg-white overflow-hidden border border-black/10 flex flex-col">
      {/* Header */}
      <div className="px-5 py-3 border-b border-black/5 flex items-baseline gap-3">
        <h3 className="font-bold text-lg text-mtc-black uppercase tracking-tight">{team.name}</h3>
        {!isCurrentSeason && team.overallPlacement && (
          <span className="text-sm font-bold text-mtc-black/40">{team.overallPlacement}</span>
        )}
      </div>

      {/* Photo */}
      {team.image?.url && (
        <div className="relative w-full aspect-video">
          <Image
            src={team.image.url}
            alt={team.image.alt ?? team.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Events */}
      <div className="flex flex-col flex-1 p-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-mtc-black/40 mb-4">
          {isCurrentSeason ? "Termine" : `Ergebnisse ${season.year}`}
        </div>

        {/* Timeline */}
        <div className="relative space-y-4">
          {/* Vertical connecting line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-black/10 z-0" />

          {eventsWithStatus.map(({ event, status }) => (
            <EventRow key={event.id} event={event} status={status} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EventRow({ event, status }: { event: LeagueEvent; status: EventStatus }) {
  if (status === "past") {
    return (
      <div className="relative pl-9">
        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center z-10 border-2 border-white">
          <svg className="w-3 h-3 text-black/40" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="border border-black/10 px-3 py-3 opacity-60">
          {event.eventDate && (
            <p className="text-[10px] font-bold uppercase tracking-wide text-mtc-black/50 mb-0.5">
              {formatDate(event.eventDate)}
            </p>
          )}
          <p className="text-sm font-bold text-mtc-black leading-tight">{event.eventName}</p>
          {event.eventType && (
            <p className="text-xs text-mtc-black/40 mt-0.5">{event.eventType}</p>
          )}
          {event.place && (
            <p className="text-xs font-bold text-mtc-black/60 mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 1h8v5a4 4 0 0 1-8 0V1zm-1 1H1.5A1.5 1.5 0 0 0 0 3.5v.5A3 3 0 0 0 3 7V2zm10 0v5a3 3 0 0 0 3-3v-.5A1.5 1.5 0 0 0 14.5 2H13zM6 10.185A4.015 4.015 0 0 1 4.1 9H3v1a5 5 0 0 0 4 4.9V16h2v-1.1A5 5 0 0 0 13 10V9h-1.1A4.015 4.015 0 0 1 10 10.185V12H6v-1.815z"/>
              </svg>
              {event.place}. Platz
            </p>
          )}
          {event.participants && event.participants.length > 0 && (
            <p className="text-xs text-mtc-black/40 mt-0.5">
              {event.participants.map((p) => p.name).join(", ")}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (status === "next") {
    return (
      <div className="relative pl-9">
        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-mtc-yellow flex items-center justify-center z-10 border-2 border-white shadow-[0_0_10px_rgba(253,228,128,0.7)]">
          {/* bolt icon */}
          <svg className="w-3 h-3 text-mtc-black" viewBox="0 0 12 12" fill="currentColor">
            <path d="M7 1L2 7h4l-1 4 5-6H6l1-4z" />
          </svg>
        </div>
        <div className="border border-mtc-yellow border-l-4 bg-mtc-yellow/10 px-4 py-4">
          <div className="flex justify-between items-start gap-2 mb-1.5">
            {event.eventDate && (
              <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
                {formatDate(event.eventDate)}
              </p>
            )}
            <span className="text-[9px] font-bold uppercase tracking-widest bg-mtc-yellow text-mtc-black px-2 py-0.5 whitespace-nowrap animate-pulse">
              Next Race
            </span>
          </div>
          <p className="text-base font-bold text-mtc-black uppercase leading-tight">{event.eventName}</p>
          {event.eventType && (
            <p className="text-xs text-mtc-black/60 mt-1">{event.eventType}</p>
          )}
          {event.participants && event.participants.length > 0 && (
            <p className="text-xs text-mtc-black/40 mt-1.5">
              {event.participants.map((p) => p.name).join(", ")}
            </p>
          )}
        </div>
      </div>
    );
  }

  // future
  return (
    <div className="relative pl-9">
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-black/20 z-10" />
      <div className="border border-black/10 hover:border-mtc-yellow/50 transition-colors px-3 py-3">
        {event.eventDate && (
          <p className="text-[10px] font-bold uppercase tracking-wide text-mtc-black/50 mb-0.5">
            {formatDate(event.eventDate)}
          </p>
        )}
        <p className="text-sm font-bold text-mtc-black leading-tight">{event.eventName}</p>
        {event.eventType && (
          <p className="text-xs text-mtc-black/40 mt-0.5">{event.eventType}</p>
        )}
      </div>
    </div>
  );
}
