"use client";

import { useState, useRef } from "react";
import type { SeasonWithTeams } from "./page";
import { TeamCard } from "./TeamCard";

export default function SeasonView({ seasonsWithTeams }: { seasonsWithTeams: SeasonWithTeams[] }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const current = seasonsWithTeams[selectedIdx];

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0 && selectedIdx < seasonsWithTeams.length - 1) {
        setSelectedIdx(selectedIdx + 1);
      } else if (delta > 0 && selectedIdx > 0) {
        setSelectedIdx(selectedIdx - 1);
      }
    }
    touchStartX.current = null;
  }

  if (!current) return null;

  return (
    <div className="w-full" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Segmented year switcher */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="inline-flex bg-gray-100 p-1 border border-black/10">
          {seasonsWithTeams.map((sw, i) => (
            <button
              key={sw.season.id}
              type="button"
              onClick={() => setSelectedIdx(i)}
              className={[
                "px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all",
                i === selectedIdx
                  ? "bg-mtc-yellow text-mtc-black shadow-sm"
                  : "text-mtc-black/40 hover:text-mtc-black",
              ].join(" ")}
            >
              {sw.season.year}
            </button>
          ))}
        </div>
        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {seasonsWithTeams.map((sw, i) => (
            <button
              key={sw.season.id}
              type="button"
              onClick={() => setSelectedIdx(i)}
              aria-label={String(sw.season.year)}
              className={[
                "w-2 h-2 rounded-full transition-all",
                i === selectedIdx ? "bg-mtc-yellow w-4" : "bg-black/20 hover:bg-black/40",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {/* Season heading + caption */}
      {current.season.heading && (
        <h2 className="font-bold text-2xl mb-2">{current.season.heading}</h2>
      )}
      {current.season.caption && (
        <p className="text-mtc-black/70 mb-6 max-w-2xl">{current.season.caption}</p>
      )}

      {/* Teams grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {current.teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            season={current.season}
            isCurrentSeason={selectedIdx === 0}
          />
        ))}
      </div>
    </div>
  );
}
