import React from "react";
import { Flame, Crosshair, Target, Percent } from "lucide-react";
import { PlayerStats } from "../../types/player";

interface StatBentoGridProps {
  stats: PlayerStats;
}

export const StatBentoGrid: React.FC<StatBentoGridProps> = ({ stats }) => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* 1. Damage / Round */}
      <div className="bg-[#121722] border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Damage / Round</span>
          <Flame className="w-4 h-4 text-orange-400" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-black text-white">{stats.damagePerRound}</span>
        </div>
        <div className="text-[11px] text-[#10B981] font-medium">Top 2.5% in League</div>
      </div>

      {/* 2. K/D Ratio */}
      <div className="bg-[#121722] border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">K/D Ratio</span>
          <Crosshair className="w-4 h-4 text-[#FF1E27]" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-black text-white">{stats.kdRatio}</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Total Kills: <span className="text-slate-200 font-bold">{stats.totalKills.toLocaleString()}</span>
        </div>
      </div>

      {/* 3. Headshot % */}
      <div className="bg-[#121722] border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Headshot %</span>
          <Target className="w-4 h-4 text-[#FFB800]" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-black text-white">{stats.headshotPct}%</span>
        </div>
        <div className="text-[11px] text-[#10B981] font-medium">Top 5% Precision</div>
      </div>

      {/* 4. Win Rate */}
      <div className="bg-[#121722] border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Win Rate</span>
          <Percent className="w-4 h-4 text-[#00E599]" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-black text-[#10B981]">{stats.winRate}%</span>
        </div>
        <div className="text-[11px] text-slate-400">
          <span className="text-[#10B981] font-semibold">{stats.matchesWon}W</span> -{" "}
          <span className="text-[#EF4444] font-semibold">{stats.matchesLost}L</span>
        </div>
      </div>
    </section>
  );
};