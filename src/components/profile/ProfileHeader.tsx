import React from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { PlayerRank } from "../../types/player";

interface ProfileHeaderProps {
  name: string;
  tag: string;
  platform: string;
  avatarUrl: string;
  currentRank: PlayerRank;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  tag,
  platform,
  avatarUrl,
  currentRank,
}) => {
  return (
    <section className="relative overflow-hidden rounded-xl border border-white/10 bg-linear-to-r from-[#121722] via-[#1A2232] to-[#121722] p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            <Image
              src={avatarUrl}
              alt={name}
              fill
              unoptimized
              className="rounded-xl object-cover border-2 border-[#FF1E27]/80 shadow-lg"
            />
            <span className="absolute -bottom-2 -right-2 bg-[#121722] border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-[#FFB800] z-20">
              {platform}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{name}</h1>
              <span className="text-lg text-slate-400 font-medium">{tag}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>Zodiac League Season</span> • <span className="text-[#10B981] font-semibold">Active Standings</span>
            </p>
          </div>
        </div>

        {/* Current Rating Badge */}
        <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-lg p-3.5 backdrop-blur-sm self-start md:self-auto">
          <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 text-[#FFB800]">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Current Rating</div>
            <div className="text-lg font-black text-white">{currentRank.tier}</div>
            <div className="text-xs text-[#FFB800] font-semibold">
              {currentRank.rr} RR <span className="text-slate-400 font-normal">({currentRank.leaderboard})</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};