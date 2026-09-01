'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Shield, Zap, Target, Flame, Bomb } from 'lucide-react';

export type ValorantRole = 'Duelist' | 'Initiator' | 'Controller' | 'Sentinel';

export interface ValorantPlayer {
  playerSlot: number;
  agentId: string;
  agentName: string;
  playerName: string;
  role: ValorantRole;
  team: 'attackers' | 'defenders';
  acs: number; // Average Combat Score
  kda: string; // e.g. "21/11/4"
  adr: number; // Average Damage per Round
  econRating?: number;
  primaryWeapon?: string;
  ultimateStatus?: 'READY' | 'CHARGING' | 'USED';
  firstBloods?: number;
}

export interface ValorantMatchData {
  matchId?: string;
  mapName?: string;
  totalRounds?: number;
  attackerScore?: number;
  defenderScore?: number;
  duration?: number;
  roundEconomyAdv?: number[]; // Positive = Attackers advantage, Negative = Defenders
  attackSiteControl?: {
    siteA: number; // Percentage 0-100
    siteB: number;
    siteC?: number;
    plants: number;
    defuses: number;
  };
}

interface DeepAnalyticsProps {
  matchData?: ValorantMatchData;
  players?: ValorantPlayer[];
}

interface AdvantageDataPoint {
  round: number;
  econLead: number;
  combatAdvantage: number;
}

const ROLE_COLORS: Record<ValorantRole, string> = {
  Duelist: '#FF4655',    // Valorant Red
  Initiator: '#00D4FF',  // Tactical Cyan
  Controller: '#9B51E0', // Void Purple
  Sentinel: '#39FF6A',   // Defensive Green
};

const DEFAULT_PLAYERS: ValorantPlayer[] = [
  // ATTACKERS
  { playerSlot: 0, agentId: 'jett', agentName: 'Jett', playerName: 'VIPER_99', role: 'Duelist', team: 'attackers', acs: 285, kda: '24/14/3', adr: 172, primaryWeapon: 'Vandal', ultimateStatus: 'READY', firstBloods: 5 },
  { playerSlot: 1, agentId: 'sova', agentName: 'Sova', playerName: 'SHADOW_K', role: 'Initiator', team: 'attackers', acs: 230, kda: '18/12/9', adr: 145, primaryWeapon: 'Vandal', ultimateStatus: 'CHARGING', firstBloods: 2 },
  { playerSlot: 2, agentId: 'omen', agentName: 'Omen', playerName: 'VALK_01', role: 'Controller', team: 'attackers', acs: 205, kda: '15/13/11', adr: 132, primaryWeapon: 'Phantom', ultimateStatus: 'READY', firstBloods: 1 },
  { playerSlot: 3, agentId: 'killjoy', agentName: 'Killjoy', playerName: 'CYBER_X', role: 'Sentinel', team: 'attackers', acs: 195, kda: '14/11/5', adr: 128, primaryWeapon: 'Guardian', ultimateStatus: 'CHARGING', firstBloods: 1 },
  { playerSlot: 4, agentId: 'reyna', agentName: 'Reyna', playerName: 'PHOENIX_ACE', role: 'Duelist', team: 'attackers', acs: 260, kda: '22/15/2', adr: 164, primaryWeapon: 'Vandal', ultimateStatus: 'USED', firstBloods: 4 },
  
  // DEFENDERS
  { playerSlot: 5, agentId: 'raze', agentName: 'Raze', playerName: 'BLAST_PRO', role: 'Duelist', team: 'defenders', acs: 250, kda: '20/16/4', adr: 158, primaryWeapon: 'Vandal', ultimateStatus: 'READY', firstBloods: 3 },
  { playerSlot: 6, agentId: 'fade', agentName: 'Fade', playerName: 'NIGHT_STALKER', role: 'Initiator', team: 'defenders', acs: 210, kda: '16/14/8', adr: 138, primaryWeapon: 'Phantom', ultimateStatus: 'CHARGING', firstBloods: 1 },
  { playerSlot: 7, agentId: 'viper', agentName: 'Viper', playerName: 'TOXIC_WAVE', role: 'Controller', team: 'defenders', acs: 215, kda: '15/12/12', adr: 140, primaryWeapon: 'Phantom', ultimateStatus: 'READY', firstBloods: 0 },
  { playerSlot: 8, agentId: 'cypher', agentName: 'Cypher', playerName: 'CAMERA_MAN', role: 'Sentinel', team: 'defenders', acs: 180, kda: '12/13/6', adr: 115, primaryWeapon: 'Spectre', ultimateStatus: 'CHARGING', firstBloods: 1 },
  { playerSlot: 9, agentId: 'breach', agentName: 'Breach', playerName: 'QUAKE_HIT', role: 'Initiator', team: 'defenders', acs: 190, kda: '13/15/10', adr: 122, primaryWeapon: 'Odin', ultimateStatus: 'READY', firstBloods: 2 },
];

type GraphMode = 'economy' | 'acs' | 'adr';

export default function DeepAnalyticsBoard({
  matchData = {},
  players = DEFAULT_PLAYERS,
}: DeepAnalyticsProps) {
  const [graphMode, setGraphMode] = useState<GraphMode>('economy');
  const [teamFilter, setTeamFilter] = useState<'all' | 'attackers' | 'defenders'>('all');

  const totalRounds = matchData.totalRounds || 24;
  const attackerScore = matchData.attackerScore ?? 13;
  const defenderScore = matchData.defenderScore ?? 11;
  const mapName = matchData.mapName || 'ASCENT';

  const attackers = players.filter((p) => p.team === 'attackers');
  const defenders = players.filter((p) => p.team === 'defenders');

  // ข้อมูล Economy & Combat Timeline ตามรอบ (1 to totalRounds)
  const roundAdvantageData: AdvantageDataPoint[] = Array.from({ length: totalRounds }, (_, i) => {
    const roundNum = i + 1;
    const wave = Math.sin(roundNum / 2) * 2500 + (roundNum % 4 === 0 ? 3000 : -1500);
    return {
      round: roundNum,
      econLead: Math.round(wave),
      combatAdvantage: Math.round(wave * 0.8),
    };
  });

  const maxEcon = Math.max(...roundAdvantageData.map((d) => Math.abs(d.econLead)), 4000);
  const dataMax = Math.max(...roundAdvantageData.map((i) => i.econLead));
  const dataMin = Math.min(...roundAdvantageData.map((i) => i.econLead));
  const off = dataMax <= 0 ? 0 : dataMin >= 0 ? 1 : dataMax / (dataMax - dataMin);

  // ข้อมูล Round-by-Round Trajectory ของผู้เล่น
  const playerProgressionData = Array.from({ length: totalRounds }, (_, r) => {
    const row: Record<string, number> = { round: r + 1 };
    players.forEach((p) => {
      const baseStat = graphMode === 'acs' ? p.acs : p.adr;
      const progression = Math.min(1, (r + 1) / totalRounds);
      const variance = Math.sin((r + p.playerSlot) * 1.2) * 25;
      row[`player_${p.playerSlot}`] = Math.max(50, Math.round(baseStat * (0.8 + progression * 0.3) + variance));
    });
    return row;
  });

  const displayedPlayers = players.filter((p) => {
    if (teamFilter === 'attackers') return p.team === 'attackers';
    if (teamFilter === 'defenders') return p.team === 'defenders';
    return true;
  });

  return (
    <div className="space-y-8 pb-12 font-mono selection:bg-[#FF4655] selection:text-white">
      {/* SECTION 1: MATCH TELEMETRY & TACTICAL MAP CONTROL */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ECONOMY / COMBAT GRAPH (7 Cols) */}
        <div className="lg:col-span-7 border border-[#00D4FF]/30 bg-[#0E1017]/90 p-5 rounded-2xl shadow-[0_0_25px_rgba(0,212,255,0.05)] flex flex-col justify-between backdrop-blur-md">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-black text-white">
                <Zap className="w-4 h-4 text-[#00D4FF] animate-pulse" />
                <span className="text-[#00D4FF] uppercase tracking-wider">
                  {graphMode === 'economy' && 'ROUND ECONOMY BUY DELTA (CREDITS)'}
                  {graphMode === 'acs' && 'AVERAGE COMBAT SCORE (ACS) TRAJECTORY'}
                  {graphMode === 'adr' && 'AVERAGE DAMAGE PER ROUND (ADR) FLOW'}
                </span>
              </div>

              {/* Mode Selectors */}
              <div className="flex items-center rounded-lg bg-black/60 p-1 border border-neutral-800 text-[10px]">
                <button
                  onClick={() => setGraphMode('economy')}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    graphMode === 'economy'
                      ? 'bg-[#00D4FF] text-black font-bold shadow-[0_0_10px_rgba(0,212,255,0.5)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ECON BUY
                </button>
                <button
                  onClick={() => setGraphMode('acs')}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    graphMode === 'acs'
                      ? 'bg-[#FF4655] text-white font-bold shadow-[0_0_10px_rgba(255,70,85,0.5)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ACS
                </button>
                <button
                  onClick={() => setGraphMode('adr')}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    graphMode === 'adr'
                      ? 'bg-[#39FF6A] text-black font-bold shadow-[0_0_10px_rgba(57,255,106,0.5)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ADR
                </button>
              </div>
            </div>

            {/* Team Filter for ACS/ADR */}
            {graphMode !== 'economy' && (
              <div className="flex items-center justify-between mb-3 text-[10px]">
                <span className="text-neutral-400 font-bold">TACTICAL ROSTER FILTER:</span>
                <div className="flex gap-2">
                  {(['all', 'attackers', 'defenders'] as const).map((team) => (
                    <button
                      key={team}
                      onClick={() => setTeamFilter(team)}
                      className={`px-2 py-0.5 uppercase rounded border transition-all cursor-pointer ${
                        teamFilter === team
                          ? team === 'attackers'
                            ? 'border-[#FF4655] bg-[#FF4655]/20 text-[#FF4655]'
                            : team === 'defenders'
                            ? 'border-[#00D4FF] bg-[#00D4FF]/20 text-[#00D4FF]'
                            : 'border-white bg-white/20 text-white'
                          : 'border-neutral-800 text-neutral-500 hover:border-neutral-700'
                      }`}
                    >
                      {team}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Economy Area Chart */}
            {graphMode === 'economy' && (
              <div className="h-64 w-full text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={roundAdvantageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="splitValEcon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset={off} stopColor="#FF4655" stopOpacity={0.7} />
                        <stop offset={off} stopColor="#00D4FF" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#22222E" vertical={false} />
                    <XAxis dataKey="round" stroke="#555" tick={{ fill: '#888' }} tickFormatter={(val) => `R${val}`} />
                    <YAxis
                      stroke="#555"
                      tick={{ fill: '#888' }}
                      domain={[-maxEcon, maxEcon]}
                      tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#07090E', borderColor: '#333', borderRadius: '8px' }}
                      itemStyle={{ color: '#E0E0E0' }}
                      labelStyle={{ color: '#00D4FF', fontWeight: 'bold' }}
                      formatter={(value: unknown) => [
                        `${Math.abs(Number(value || 0)).toLocaleString()} Credits`,
                        Number(value || 0) >= 0 ? 'Attackers Econ Lead' : 'Defenders Econ Lead',
                      ]}
                      labelFormatter={(label) => `Round ${label}`}
                    />
                    <ReferenceLine y={0} stroke="#666" />
                    <Area
                      type="monotone"
                      dataKey="econLead"
                      stroke={dataMax > 0 ? '#FF4655' : '#00D4FF'}
                      strokeWidth={2}
                      fill="url(#splitValEcon)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ACS / ADR Line Chart */}
            {graphMode !== 'economy' && (
              <div className="h-64 w-full text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={playerProgressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#22222E" vertical={false} />
                    <XAxis dataKey="round" stroke="#555" tick={{ fill: '#888' }} tickFormatter={(val) => `R${val}`} />
                    <YAxis stroke="#555" tick={{ fill: '#888' }} domain={[0, 'auto']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#07090E', borderColor: '#333', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '11px' }}
                      labelFormatter={(label) => `Round ${label}`}
                    />
                    {displayedPlayers.map((p) => {
                      const color = ROLE_COLORS[p.role] || '#C8CDD4';
                      return (
                        <Line
                          key={p.playerSlot}
                          type="monotone"
                          dataKey={`player_${p.playerSlot}`}
                          name={`${p.playerName} (${p.agentName})`}
                          stroke={color}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between border-t border-neutral-800/80 pt-2 text-[10px]">
            <span className="text-neutral-500">AGENT CLASS ROLE:</span>
            <div className="flex flex-wrap gap-3 font-bold">
              {Object.entries(ROLE_COLORS).map(([role, color]) => (
                <span key={role} className="flex items-center gap-1.5" style={{ color }}>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }}></span>
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* VALORANT TACTICAL SITE CONTROL & MAP OVERVIEW (5 Cols - แทนที่ TowerMap เดิม) */}
        <div className="lg:col-span-5 border border-[#FF4655]/30 bg-[#0E1017]/90 p-5 rounded-2xl shadow-[0_0_25px_rgba(255,70,85,0.05)] flex flex-col justify-between backdrop-blur-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#FF4655]" />
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  MAP CONTROL & SITE TELEMETRY
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF4655]/20 text-[#FF4655] border border-[#FF4655]/40">
                MAP: {mapName}
              </span>
            </div>

            {/* Match Score Banner */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-800 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] font-bold text-[#FF4655] block">ATTACKERS</span>
                <span className="text-2xl font-black text-white">{attackerScore}</span>
              </div>
              <div className="text-xs text-neutral-500 font-bold px-2">VS</div>
              <div>
                <span className="text-[10px] font-bold text-[#00D4FF] block">DEFENDERS</span>
                <span className="text-2xl font-black text-white">{defenderScore}</span>
              </div>
            </div>

            {/* Site Execution Control */}
            <div className="space-y-2.5">
              <div className="text-[11px] text-neutral-400 font-bold flex items-center justify-between">
                <span>SITE A CONTROL RATE</span>
                <span className="text-[#FF4655] font-bold">58% ATTACK SUCCESS</span>
              </div>
              <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden flex">
                <div className="bg-[#FF4655] h-full" style={{ width: '58%' }} />
                <div className="bg-[#00D4FF] h-full" style={{ width: '42%' }} />
              </div>

              <div className="text-[11px] text-neutral-400 font-bold flex items-center justify-between pt-1">
                <span>SITE B CONTROL RATE</span>
                <span className="text-[#00D4FF] font-bold">64% DEFENSE RETAKE</span>
              </div>
              <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden flex">
                <div className="bg-[#FF4655] h-full" style={{ width: '36%' }} />
                <div className="bg-[#00D4FF] h-full" style={{ width: '64%' }} />
              </div>
            </div>

            {/* Spike Telemetry Metric */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 flex items-center gap-3">
                <Bomb className="w-5 h-5 text-[#FF4655]" />
                <div>
                  <div className="text-[9px] text-neutral-400">SPIKE PLANTS</div>
                  <div className="text-sm font-black text-white">16 TOTAL</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#00D4FF]" />
                <div>
                  <div className="text-[9px] text-neutral-400">DEFUSES / RETAKES</div>
                  <div className="text-sm font-black text-white">7 DEFUSED</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-neutral-500 text-center pt-3 border-t border-neutral-800/80">
            RECORDED ON VALORANT COMPETITIVE RULES (MR12)
          </div>
        </div>
      </div>

      {/* SECTION 2: VALORANT ROSTER LOADOUT & COMBAT STATS */}
      <div className="border border-neutral-800 bg-[#0E1017]/90 p-5 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        <div className="border-b border-neutral-800 pb-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FF4655]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              TACTICAL ROSTER PERFORMANCE & WEAPON LOADOUTS
            </h3>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">10 ATHLETES ENGAGED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ATTACKERS ROSTER */}
          <div className="space-y-3">
            <div className="text-xs font-black text-[#FF4655] border-l-2 border-[#FF4655] pl-2 flex items-center justify-between">
              <span>ATTACKERS SQUAD</span>
              <span className="text-[10px] text-neutral-400 font-mono">SCORE: {attackerScore}</span>
            </div>
            <div className="space-y-2">
              {attackers.map((p) => renderPlayerValorantCard(p))}
            </div>
          </div>

          {/* DEFENDERS ROSTER */}
          <div className="space-y-3">
            <div className="text-xs font-black text-[#00D4FF] border-l-2 border-[#00D4FF] pl-2 flex items-center justify-between">
              <span>DEFENDERS SQUAD</span>
              <span className="text-[10px] text-neutral-400 font-mono">SCORE: {defenderScore}</span>
            </div>
            <div className="space-y-2">
              {defenders.map((p) => renderPlayerValorantCard(p))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-Component: การ์ดผู้เล่น Valorant แต่ละคน
function renderPlayerValorantCard(p: ValorantPlayer) {
  const roleColor = ROLE_COLORS[p.role] || '#C8CDD4';

  return (
    <div
      key={p.playerSlot}
      className="p-3 rounded-xl bg-black/60 border border-neutral-800 hover:border-neutral-700 transition-colors flex items-center justify-between gap-3 text-xs"
    >
      <div className="flex items-center gap-3">
        {/* Agent Badge */}
        <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 flex flex-col items-center justify-center font-black text-[10px] text-white shrink-0">
          <span className="text-[9px] text-[#FF4655] font-black">{p.agentName.substring(0, 3).toUpperCase()}</span>
          <span className="text-[8px] text-neutral-400 font-normal">{p.agentName}</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-xs">{p.playerName}</span>
            <span
              className="text-[9px] font-bold px-1.5 py-0.2 rounded"
              style={{ color: roleColor, border: `1px solid ${roleColor}40`, background: `${roleColor}15` }}
            >
              {p.role}
            </span>
          </div>
          <div className="text-[10px] text-neutral-400 font-mono mt-0.5 flex items-center gap-2">
            <span>Gun: <b className="text-zinc-200">{p.primaryWeapon || 'Vandal'}</b></span>
            <span>•</span>
            <span>FB: <b className="text-[#FF4655]">{p.firstBloods ?? 0}</b></span>
          </div>
        </div>
      </div>

      {/* Combat Metrics */}
      <div className="text-right font-mono">
        <div className="text-xs font-black text-white">{p.kda}</div>
        <div className="text-[10px] text-neutral-400">
          ACS: <span className="text-[#00D4FF] font-bold">{p.acs}</span> | ADR: <span className="text-amber-400">{p.adr}</span>
        </div>
      </div>
    </div>
  );
}