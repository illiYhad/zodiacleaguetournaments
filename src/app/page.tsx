import React from "react";
import { MOCK_PLAYER_DATA } from "../data/mockData";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { StatBentoGrid } from "../components/stats/StatBentoGrid";
import { TopAgents } from "../components/stats/TopAgents";
import { MatchHistoryFeed } from "../components/matches/MatchHistoryFeed";
import { ChevronDown,} from "lucide-react";

export default function ProfilePage() {
  const { name, tag, platform, avatarUrl, currentRank, stats, topAgents, recentMatches } = MOCK_PLAYER_DATA;

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white pb-16">
      {/* 1. Header Bar ด้านบน */}
      <header className="border-b border-white/10 bg-[#10141D]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#FF1E27] flex items-center justify-center font-extrabold text-sm tracking-wider text-white shadow-[0_0_12px_rgba(255,30,39,0.5)]">
            ZL
          </div>
          <span className="font-extrabold text-lg tracking-wide uppercase text-slate-100">
            Zodiac League <span className="text-[#FF1E27] text-xs font-bold px-2 py-0.5 rounded bg-[#FF1E27]/10 border border-[#FF1E27]/30 ml-1">STATS</span>
          </span>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>Live Sync</span>
        </div>
      </header>

      {/* 2. เนื้อหาหลักของหน้าเว็บ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Profile Hero Banner */}
        <ProfileHeader
          name={name}
          tag={tag}
          platform={platform}
          avatarUrl={avatarUrl}
          currentRank={currentRank}
        />

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg bg-[#121722] border border-[#FF1E27]/50 text-sm font-semibold text-white shadow-sm">
              Overview
            </button>
            <button className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#121722]/60 text-sm font-medium transition">
              Matches
            </button>
            <button className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#121722]/60 text-sm font-medium transition">
              Agents
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121722] border border-white/10 text-xs text-slate-300 font-medium cursor-pointer">
              <span>Competitive</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Core Stats (Bento Grid) */}
        <StatBentoGrid stats={stats} />

        {/* Two-Column Section: Top Agents & Match History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ฝั่งซ้าย: สถิติ Agent และ Peak Rank */}
          <div className="lg:col-span-1">
            <TopAgents agents={topAgents} peakRank={currentRank} />
          </div>

          {/* ฝั่งขวา: ประวัติการแข่งขันล่าสุด */}
          <div className="lg:col-span-2">
            <MatchHistoryFeed matches={recentMatches} />
          </div>
        </div>
      </main>
    </div>
  );
}