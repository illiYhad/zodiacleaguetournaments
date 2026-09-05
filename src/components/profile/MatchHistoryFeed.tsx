import React from "react";

export interface ValorantMatchItem {
  id: string;
  matchId?: string;
  map: string;
  mode?: string;
  agent: string;
  agentIcon?: string;
  result: 'VICTORY' | 'DEFEAT' | 'DRAW';
  score: string;
  kills: number;
  deaths: number;
  assists: number;
  acs?: number;
  kd?: number;
  headshotPct?: number;
  playedAt?: string;
  date?: string;
  dateGroup?: string;
  tier?: string;
  badges?: string[];
  placement?: string;
  kdaCounts?: string;
  [key: string]: React.ReactNode | string | number | boolean | undefined | null;
}

export type MatchRecord = ValorantMatchItem & {
  isVictory: boolean;
};

interface Props {
  matches: MatchRecord[];
}

export const MatchHistoryFeed: React.FC<Props> = ({ matches }) => {
  const grouped = matches.reduce((acc, curr) => {
    const key = curr.dateGroup ?? curr.date ?? "Other";
    acc[key] = acc[key] || [];
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, MatchRecord[]>);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-white tracking-wider">LAST 9 MATCHES</h3>
        <button className="text-xs font-bold text-[#ff4655] hover:underline">
          All Matches &rarr;
        </button>
      </div>

      {Object.entries(grouped).map(([date, items]) => {
        const wins = items.filter((m) => m.isVictory).length;
        const losses = items.length - wins;

        return (
          <div key={date} className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#141d2a] border border-[#1f2d3d] text-xs font-bold">
              <span className="text-gray-300">{date}</span>
              <span className={wins > losses ? "text-emerald-400" : "text-red-400"}>
                {wins} W // {losses} L
              </span>
            </div>

            {items.map((match) => (
              <div
                key={match.id}
                className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-4 transition ${
                  match.isVictory
                    ? "bg-[#101b22] border-emerald-500/30 hover:border-emerald-500/60"
                    : "bg-[#1a151b] border-red-500/30 hover:border-red-500/60"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#1e2a3a] border border-white/10 flex items-center justify-center text-sm font-black text-white">
                    {match.agent[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-white">{match.agent}</span>
                      {match.placement && (
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-black/40 text-gray-400">
                          {match.placement}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{match.map}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className={`text-base font-black ${match.isVictory ? "text-emerald-400" : "text-red-400"}`}>
                      {match.score}
                    </span>
                    <span className="text-[10px] text-gray-500 block uppercase font-bold">
                      {match.isVictory ? "Victory" : "Defeat"}
                    </span>
                  </div>

                  {Boolean(match.badges && match.badges.length > 0) && (
                    <div className="flex items-center gap-1.5 md:flex">
                      {match.badges?.map((b: string) => (
                        <span key={b} className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400">
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-5 text-right text-xs">
                  <div>
                    <span className="font-extrabold text-white block">{match.kd} K/D</span>
                    <span className="text-[10px] text-gray-400">{match.kdaCounts}</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-white block">{match.acs} ACS</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{match.headshotPct}% HS</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
