import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { MatchHistory } from "../../types/player";

interface MatchHistoryFeedProps {
  matches: MatchHistory[];
}

export const MatchHistoryFeed: React.FC<MatchHistoryFeedProps> = ({ matches }) => {
  return (
    <div className="bg-[#121722] border border-white/10 rounded-xl p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center justify-between">
        <span>Recent Matches</span>
        <span className="text-xs text-slate-400 font-normal">Last 20 Matches</span>
      </h2>

      <div className="space-y-3">
        {matches.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition ${
              m.isVictory
                ? "bg-emerald-950/10 border-[#10B981]/30 hover:bg-emerald-950/20"
                : "bg-rose-950/10 border-[#EF4444]/30 hover:bg-rose-950/20"
            }`}
          >
            <div className="flex items-center gap-4">
              {m.isVictory ? (
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white">{m.map}</span>
                  <span className="text-xs text-slate-400">• {m.agent}</span>
                  {m.badge && (
                    <span className="px-1.5 py-0.5 rounded bg-[#FFB800]/20 text-[#FFB800] text-[10px] font-bold border border-[#FFB800]/30">
                      {m.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{m.timeAgo}</div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 mt-3 sm:mt-0">
              <div className="text-center">
                <div className="text-xs text-slate-400 uppercase">Score</div>
                <div className={`font-black text-sm ${m.isVictory ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  {m.score}
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-slate-400 uppercase">K / D / A</div>
                <div className="font-bold text-xs text-slate-200">{m.kda}</div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase">Rating</div>
                <div className="font-bold text-xs text-[#00E599]">{m.combatScore} ACS</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};