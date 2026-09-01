// app/match/[matchId]/page.tsx
import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

// --- Type Definitions for Valorant ---
export type AgentRole = 'Duelist' | 'Initiator' | 'Controller' | 'Sentinel';

export interface ValorantPlayerPerformance {
  playerId: string;
  riotId: string;
  tagLine: string;
  agentName: string;
  agentRole: AgentRole;
  agentIconUrl?: string;
  kills: number;
  deaths: number;
  assists: number;
  score: number; // Combat Score
  acs: number;   // Average Combat Score
  adr: number;   // Average Damage per Round
  firstBloods: number;
  plants: number;
  defuses: number;
  headshotPercentage: number;
  isMvp?: boolean;
}

export interface ValorantMatchData {
  id: string;
  mapName: string;
  mapImageUrl?: string;
  mode: string;
  matchDuration: string;
  playedAt: string;
  teamRed: {
    name: string;
    score: number;
    isWinner: boolean;
    players: ValorantPlayerPerformance[];
  };
  teamBlue: {
    name: string;
    score: number;
    isWinner: boolean;
    players: ValorantPlayerPerformance[];
  };
}

interface RawMatchPlayer {
  player_id?: string;
  riot_id?: string;
  tag_line?: string;
  team_side?: string;
  agent_name?: string;
  agent_role?: string;
  kills?: number;
  deaths?: number;
  assists?: number;
  combat_score?: number;
  acs?: number;
  adr?: number;
  first_bloods?: number;
  plants?: number;
  defuses?: number;
  headshot_rate?: number;
}

interface PageProps {
  params: Promise<{
    matchId: string;
  }>;
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { matchId } = await params;
  const supabase = await createClient();

  // ดึงข้อมูลการแข่งขันจาก Supabase
  const { data: rawMatch } = await supabase
    .from('matches')
    .select(`
      id,
      map_name,
      mode,
      duration,
      created_at,
      team_red_name,
      team_red_score,
      team_blue_name,
      team_blue_score,
      winner_side,
      match_players (
        player_id,
        riot_id,
        tag_line,
        team_side,
        agent_name,
        agent_role,
        kills,
        deaths,
        assists,
        combat_score,
        acs,
        adr,
        first_bloods,
        plants,
        defuses,
        headshot_rate
      )
    `)
    .eq('id', matchId)
    .single();

  // Fallback Mock Data สำหรับพัฒนา UI ก่อนเชื่อม DB จริง
  const match: ValorantMatchData = rawMatch
    ? {
        id: rawMatch.id,
        mapName: rawMatch.map_name || 'ASCENT',
        mode: rawMatch.mode || 'Standard Tournament (5v5)',
        matchDuration: rawMatch.duration || '38:42',
        playedAt: new Date(rawMatch.created_at).toLocaleString('th-TH'),
        teamRed: {
          name: rawMatch.team_red_name || 'TEAM ATTACKERS',
          score: rawMatch.team_red_score ?? 13,
          isWinner: rawMatch.winner_side === 'red',
          players: ((rawMatch.match_players as RawMatchPlayer[]) || [])
            .filter((p) => p.team_side === 'red')
            .map(formatPlayerStats),
        },
        teamBlue: {
          name: rawMatch.team_blue_name || 'TEAM DEFENDERS',
          score: rawMatch.team_blue_score ?? 9,
          isWinner: rawMatch.winner_side === 'blue',
          players: ((rawMatch.match_players as RawMatchPlayer[]) || [])
            .filter((p) => p.team_side === 'blue')
            .map(formatPlayerStats),
        },
      }
    : getMockValorantMatch(matchId);

  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100 font-mono p-4 md:p-8 selection:bg-amber-500 selection:text-black">
      {/* Top Breadcrumb & Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-amber-400 transition-colors uppercase tracking-widest mb-4"
        >
          ← BACK TO TOURNAMENT LOBBY
        </Link>

        {/* Tactical Match Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            {/* Team Red (Attacker) */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center font-black text-rose-400 text-2xl shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                ATK
              </div>
              <div>
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">
                  TEAM ATTACK
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white">{match.teamRed.name}</h2>
              </div>
            </div>

            {/* Score Center HUD */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-400 font-bold uppercase tracking-widest mb-2">
                MAP: <span className="text-amber-400 font-black">{match.mapName}</span> • {match.matchDuration}
              </div>
              <div className="text-4xl md:text-6xl font-black tracking-widest text-white flex items-center justify-center gap-4">
                <span className={match.teamRed.isWinner ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(245,197,66,0.6)]' : 'text-zinc-500'}>
                  {match.teamRed.score}
                </span>
                <span className="text-zinc-700 text-2xl md:text-3xl">:</span>
                <span className={match.teamBlue.isWinner ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(245,197,66,0.6)]' : 'text-zinc-500'}>
                  {match.teamBlue.score}
                </span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500 tracking-wider block mt-1">
                COMPLETED • {match.playedAt}
              </span>
            </div>

            {/* Team Blue (Defender) */}
            <div className="flex items-center gap-4 text-right flex-row-reverse md:flex-row">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                  TEAM DEFENSE
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white">{match.teamBlue.name}</h2>
              </div>
              <div className="w-14 h-14 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center font-black text-cyan-400 text-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                DEF
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roster & Stats Tables */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Team Red Performance Table */}
        <TeamStatsTable
          teamSide="red"
          teamName={match.teamRed.name}
          isWinner={match.teamRed.isWinner}
          players={match.teamRed.players}
        />

        {/* Team Blue Performance Table */}
        <TeamStatsTable
          teamSide="blue"
          teamName={match.teamBlue.name}
          isWinner={match.teamBlue.isWinner}
          players={match.teamBlue.players}
        />
      </div>
    </div>
  );
}

// --- Team Scoreboard Table Component ---
function TeamStatsTable({
  teamSide,
  teamName,
  isWinner,
  players,
}: {
  teamSide: 'red' | 'blue';
  teamName: string;
  isWinner: boolean;
  players: ValorantPlayerPerformance[];
}) {
  const isRed = teamSide === 'red';
  const themeBorder = isRed ? 'border-rose-500/30' : 'border-cyan-500/30';
  const themeHeader = isRed ? 'bg-rose-950/40 text-rose-300' : 'bg-cyan-950/40 text-cyan-300';
  const badgeColor = isRed ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';

  return (
    <div className={`rounded-2xl border ${themeBorder} bg-zinc-950/90 overflow-hidden shadow-xl`}>
      {/* Header Bar */}
      <div className={`px-6 py-4 flex items-center justify-between border-b border-white/5 ${themeHeader}`}>
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${badgeColor}`}>
            {isRed ? 'ATTACKERS' : 'DEFENDERS'}
          </span>
          <h3 className="text-base font-bold text-white">{teamName}</h3>
        </div>
        {isWinner && (
          <span className="text-xs font-black text-amber-400 tracking-widest flex items-center gap-1">
            🏆 VICTORY
          </span>
        )}
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/5 text-zinc-500 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">AGENT / ATHLETE</th>
              <th className="py-3 px-4">ROLE</th>
              <th className="py-3 px-4 text-center">ACS</th>
              <th className="py-3 px-4 text-center">K / D / A</th>
              <th className="py-3 px-4 text-center">KD DIFF</th>
              <th className="py-3 px-4 text-center">ADR</th>
              <th className="py-3 px-4 text-center">HS %</th>
              <th className="py-3 px-4 text-center">FIRST BLOOD</th>
              <th className="py-3 px-4 text-right">PLANT / DEF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {players.map((p) => {
              const kdDiff = p.kills - p.deaths;
              return (
                <tr key={p.playerId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-[11px] text-amber-400">
                      {p.agentName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-zinc-100">
                        <span>{p.riotId}</span>
                        <span className="text-zinc-500 font-normal">#{p.tagLine}</span>
                        {p.isMvp && (
                          <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1 rounded">
                            MVP
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400">{p.agentName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] text-zinc-400 border border-white/10 px-1.5 py-0.5 rounded">
                      {p.agentRole}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-amber-300">{p.acs}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-zinc-200">{p.kills}</span> /{' '}
                    <span className="text-red-400">{p.deaths}</span> /{' '}
                    <span className="text-zinc-400">{p.assists}</span>
                  </td>
                  <td className={`py-3 px-4 text-center font-bold ${kdDiff > 0 ? 'text-emerald-400' : kdDiff < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                    {kdDiff > 0 ? `+${kdDiff}` : kdDiff}
                  </td>
                  <td className="py-3 px-4 text-center text-zinc-300">{p.adr}</td>
                  <td className="py-3 px-4 text-center text-zinc-300">{p.headshotPercentage}%</td>
                  <td className="py-3 px-4 text-center text-amber-400 font-bold">{p.firstBloods}</td>
                  <td className="py-3 px-4 text-right text-zinc-400">
                    {p.plants} / {p.defuses}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper สำหรับ format Raw Data
function formatPlayerStats(raw: RawMatchPlayer): ValorantPlayerPerformance {
  return {
    playerId: raw.player_id || Math.random().toString(),
    riotId: raw.riot_id || 'Player',
    tagLine: raw.tag_line || 'TH1',
    agentName: raw.agent_name || 'Jett',
    agentRole: (raw.agent_role as AgentRole) || 'Duelist',
    kills: raw.kills || 0,
    deaths: raw.deaths || 0,
    assists: raw.assists || 0,
    score: raw.combat_score || 0,
    acs: raw.acs || 0,
    adr: raw.adr || 0,
    firstBloods: raw.first_bloods || 0,
    plants: raw.plants || 0,
    defuses: raw.defuses || 0,
    headshotPercentage: raw.headshot_rate || 0,
  };
}

// Mock Data สำรองให้ระบบรันแสดงผลได้ทันที
function getMockValorantMatch(matchId: string): ValorantMatchData {
  return {
    id: matchId,
    mapName: 'ASCENT',
    mode: 'Standard Tournament (5v5)',
    matchDuration: '34:15',
    playedAt: '2026-09-01 19:30',
    teamRed: {
      name: 'SOLARIS VANGUARD',
      score: 13,
      isWinner: true,
      players: [
        {
          playerId: 'p1',
          riotId: 'VIPER_ACE',
          tagLine: 'TH1',
          agentName: 'Jett',
          agentRole: 'Duelist',
          kills: 24,
          deaths: 12,
          assists: 4,
          score: 6420,
          acs: 312,
          adr: 188,
          firstBloods: 6,
          plants: 2,
          defuses: 1,
          headshotPercentage: 38,
          isMvp: true,
        },
        {
          playerId: 'p2',
          riotId: 'CYBER_OMEN',
          tagLine: 'BKK',
          agentName: 'Omen',
          agentRole: 'Controller',
          kills: 18,
          deaths: 14,
          assists: 9,
          score: 4890,
          acs: 230,
          adr: 142,
          firstBloods: 2,
          plants: 5,
          defuses: 0,
          headshotPercentage: 24,
        },
        {
          playerId: 'p3',
          riotId: 'SOVA_KING',
          tagLine: 'SEA',
          agentName: 'Sova',
          agentRole: 'Initiator',
          kills: 16,
          deaths: 11,
          assists: 14,
          score: 4320,
          acs: 210,
          adr: 135,
          firstBloods: 1,
          plants: 3,
          defuses: 0,
          headshotPercentage: 28,
        },
        {
          playerId: 'p4',
          riotId: 'KILLJOY_MAIN',
          tagLine: 'LOCK',
          agentName: 'Killjoy',
          agentRole: 'Sentinel',
          kills: 14,
          deaths: 13,
          assists: 6,
          score: 3950,
          acs: 190,
          adr: 120,
          firstBloods: 0,
          plants: 4,
          defuses: 2,
          headshotPercentage: 22,
        },
        {
          playerId: 'p5',
          riotId: 'FLASH_BREACH',
          tagLine: 'BANG',
          agentName: 'Breach',
          agentRole: 'Initiator',
          kills: 12,
          deaths: 15,
          assists: 16,
          score: 3600,
          acs: 175,
          adr: 115,
          firstBloods: 2,
          plants: 1,
          defuses: 1,
          headshotPercentage: 19,
        },
      ],
    },
    teamBlue: {
      name: 'LUNAR ECLIPSE',
      score: 9,
      isWinner: false,
      players: [
        {
          playerId: 'p6',
          riotId: 'RENA_DUEL',
          tagLine: 'TOP',
          agentName: 'Reyna',
          agentRole: 'Duelist',
          kills: 21,
          deaths: 17,
          assists: 3,
          score: 5540,
          acs: 275,
          adr: 165,
          firstBloods: 5,
          plants: 1,
          defuses: 1,
          headshotPercentage: 42,
        },
        {
          playerId: 'p7',
          riotId: 'VIPER_SNAKE',
          tagLine: 'TOX',
          agentName: 'Viper',
          agentRole: 'Controller',
          kills: 15,
          deaths: 16,
          assists: 7,
          score: 4120,
          acs: 205,
          adr: 130,
          firstBloods: 1,
          plants: 2,
          defuses: 2,
          headshotPercentage: 26,
        },
        {
          playerId: 'p8',
          riotId: 'FADE_NIGHT',
          tagLine: 'DARK',
          agentName: 'Fade',
          agentRole: 'Initiator',
          kills: 11,
          deaths: 17,
          assists: 11,
          score: 3410,
          acs: 168,
          adr: 112,
          firstBloods: 1,
          plants: 0,
          defuses: 1,
          headshotPercentage: 20,
        },
        {
          playerId: 'p9',
          riotId: 'CYPHER_NET',
          tagLine: 'SPY',
          agentName: 'Cypher',
          agentRole: 'Sentinel',
          kills: 10,
          deaths: 16,
          assists: 5,
          score: 3100,
          acs: 152,
          adr: 98,
          firstBloods: 0,
          plants: 1,
          defuses: 2,
          headshotPercentage: 18,
        },
        {
          playerId: 'p10',
          riotId: 'SKYE_HEAL',
          tagLine: 'WOLF',
          agentName: 'Skye',
          agentRole: 'Initiator',
          kills: 8,
          deaths: 18,
          assists: 13,
          score: 2890,
          acs: 140,
          adr: 95,
          firstBloods: 0,
          plants: 0,
          defuses: 1,
          headshotPercentage: 16,
        },
      ],
    },
  };
}