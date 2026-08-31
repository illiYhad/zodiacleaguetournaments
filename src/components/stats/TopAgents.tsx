import React from "react";
import { TopAgent, PlayerRank } from "../../types/player";

interface TopAgentsProps {
  agents: TopAgent[];
  peakRank: PlayerRank;
}

export const TopAgents: React.FC<TopAgentsProps> = ({ agents, peakRank }) => {
  return (
    <div className="space-y-4">
      <div className="bg-[#121722] border border-white/10 rounded-xl p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center justify-between">
          <span>Top Agents</span>
          <span className="text-xs text-slate-400 font-normal">By Winrate</span>
        </h2>
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="flex items-center justify-between p-3 rounded-lg bg-[#0A0D14]/60 border border-white/5 hover:border-slate-600 transition"
            >
              <div>
                <div className="font-bold text-white text-sm">{agent.name}</div>
                <div className="text-xs text-slate-400">{agent.role} • {agent.hours}h played</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-[#10B981]">{agent.winRate}% WR</div>
                <div className="text-xs text-slate-400">{agent.kd} K/D</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Rank Box */}
      <div className="bg-[#121722] border border-white/10 rounded-xl p-5">
        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Peak Rating</div>
        <div className="text-base font-bold text-[#FFB800]">{peakRank.peakTier}</div>
        <div className="text-xs text-slate-400 mt-1">{peakRank.peakDate}</div>
      </div>
    </div>
  );
};