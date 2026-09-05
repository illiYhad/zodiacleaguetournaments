'use client';

import React, { useState } from 'react';

// Interfaces สอดคล้องกับ DB Schema Block 1
export interface MatchHistoryItem {
  id: string;
  map: string;
  result: 'WIN' | 'LOSS';
  score: string;
  kda: string;
  kills: number;
  deaths: number;
  assists: number;
  acs: number;
  adr: number;
  hs: number;
  fb: number;
  date: string;
}

export interface AthletePassportProps {
  player?: {
    athleteId: string;
    displayName: string;
    realName: string;
    location: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
  gameAccount?: {
    rankName: string;
    role: string;
    gameCode: string;
    tierLabel: string;
    subRank: string;
  };
  stats?: {
    kd: number;
    kda: number;
    acs: number;
    adr: number;
    headshotPct: number;
    firstBloods: number;
    radarVals: [number, number, number, number, number]; // [ACS, K/D, ADR, HS%, FB Rate]
  };
  matches?: MatchHistoryItem[];
}

export const AthletePassport: React.FC<AthletePassportProps> = ({
  player = {
    athleteId: 'ZA-0001',
    displayName: 'SHADOW_ZX',
    realName: 'ณัฐวุฒิ สมานใจ',
    location: 'ชลบุรี, ประเทศไทย',
    isVerified: true,
  },
  gameAccount = {
    rankName: 'IMMORTAL 3',
    role: 'DUELIST',
    gameCode: 'VALORANT',
    tierLabel: 'PRO LEAGUE',
    subRank: 'TOP 100 TH',
  },
  stats = {
    kd: 1.87,
    kda: 2.31,
    acs: 274,
    adr: 168,
    headshotPct: 32,
    firstBloods: 142,
    radarVals: [0.78, 0.85, 0.72, 0.80, 0.68],
  },
  matches = [
    { id: '1', map: 'Ascent', result: 'WIN', score: '13-7', kda: '24/11/6', kills: 24, deaths: 11, assists: 6, acs: 312, adr: 182, hs: 38, fb: 4, date: '03 ก.ย.' },
    { id: '2', map: 'Bind', result: 'WIN', score: '13-9', kda: '21/12/5', kills: 21, deaths: 12, assists: 5, acs: 288, adr: 171, hs: 34, fb: 3, date: '02 ก.ย.' },
    { id: '3', map: 'Haven', result: 'LOSS', score: '9-13', kda: '18/15/4', kills: 18, deaths: 15, assists: 4, acs: 241, adr: 154, hs: 29, fb: 2, date: '02 ก.ย.' },
    { id: '4', map: 'Lotus', result: 'WIN', score: '13-5', kda: '26/8/7', kills: 26, deaths: 8, assists: 7, acs: 340, adr: 198, hs: 41, fb: 5, date: '01 ก.ย.' },
    { id: '5', map: 'Pearl', result: 'WIN', score: '13-10', kda: '22/14/3', kills: 22, deaths: 14, assists: 3, acs: 267, adr: 162, hs: 31, fb: 3, date: '31 ส.ค.' },
    { id: '6', map: 'Icebox', result: 'LOSS', score: '11-13', kda: '19/16/6', kills: 19, deaths: 16, assists: 6, acs: 252, adr: 158, hs: 27, fb: 2, date: '30 ส.ค.' },
  ],
}) => {
  const [activeTab, setActiveTab] = useState<'STATS' | 'PROFILE' | 'TEAM'>('STATS');
  const [expandedMatches, setExpandedMatches] = useState<Record<string, boolean>>({});

  const toggleMatch = (id: string) => {
    setExpandedMatches(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- SVG Radar Chart Math Engine (ถอดจาก renderVals ของอลิส) ---
  const cx = 120, cy = 120, r = 90;
  const labels = ['ACS', 'K/D', 'ADR', 'HS%', 'FB Rate'];
  const n = 5;
  const angles = Array.from({ length: n }, (_, i) => i * (360 / n));

  const getPoint = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
  };

  const rings = [0.25, 0.5, 0.75, 1].map(frac => {
    const pts = angles.map(a => getPoint(a, r * frac));
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + 'Z';
    return (
      <path
        key={'ring' + frac}
        d={d}
        fill={frac === 1 ? 'rgba(232,180,41,0.08)' : 'none'}
        stroke={frac === 1 ? 'rgba(232,180,41,0.25)' : 'rgba(255,255,255,0.06)'}
        strokeWidth={frac === 1 ? 1 : 0.8}
      />
    );
  });

  const spokes = angles.map((a, i) => {
    const [x, y] = getPoint(a, r);
    return (
      <line
        key={'spoke' + i}
        x1={cx}
        y1={cy}
        x2={x.toFixed(1)}
        y2={y.toFixed(1)}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={0.8}
      />
    );
  });

  const dataPts = stats.radarVals.map((v, i) => getPoint(angles[i], r * v));
  const dataD = dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + 'Z';

  return (
    <div className="w-full min-h-screen bg-[#0D0E1A] text-[#e9e9ed] font-sans relative select-none">
      {/* Top Scanline Aura */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E8B429]/10 to-transparent pointer-events-none z-50" />

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 h-14 bg-[#0D0E1A]/95 border-b border-[#E8B429]/15 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#E8B429" strokeWidth="1.5" />
            <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="rgba(232,180,41,0.12)" stroke="#E8B429" strokeWidth="1" />
            <circle cx="14" cy="14" r="3" fill="#E8B429" />
          </svg>
          <span className="font-bold tracking-widest text-[#E8B429] text-lg uppercase drop-shadow-[0_0_12px_rgba(232,180,41,0.3)]">
            ZODIAC ARENA
          </span>
        </div>
        <div className="flex items-center gap-5 text-xs font-semibold tracking-wider text-neutral-400">
          <a href="#" className="hover:text-[#E8B429] transition-colors">นักกีฬา</a>
          <a href="#" className="hover:text-[#E8B429] transition-colors">ทีม</a>
          <a href="#" className="hover:text-[#E8B429] transition-colors">ลีก</a>
          <a href="#" className="hover:text-[#E8B429] transition-colors">Rankings</a>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0D0E1A] via-[#131528] to-[#1a1535] border-b border-[#E8B429]/10">
        <div className="relative flex items-end gap-7 px-10 py-8 max-w-[1200px] mx-auto">
          {/* Avatar with Glow & Online Status */}
          <div className="relative shrink-0">
            <div className="w-[120px] h-[120px] rounded-xl bg-gradient-to-br from-[#2b2741] to-[#1a1c2e] border-2 border-[#E8B429] flex items-center justify-center text-5xl shadow-[0_0_20px_rgba(232,180,41,0.25)]">
              🎮
            </div>
            <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#4ade80] border-2 border-[#0D0E1A] shadow-[0_0_8px_#4ade80]" />
          </div>

          {/* Identity Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-4xl font-bold tracking-wider text-white uppercase font-mono">
                {player.displayName}
              </h1>
              {player.isVerified && (
                <div className="flex items-center gap-1 bg-[#E8B429]/12 border border-[#E8B429]/40 rounded-full px-2.5 py-0.5">
                  <span className="text-[10px] text-[#E8B429]">★</span>
                  <span className="text-[10px] font-bold tracking-wider text-[#E8B429] uppercase">VERIFIED</span>
                </div>
              )}
            </div>
            <div className="text-sm text-neutral-400 mb-2.5 font-medium">
              {player.realName} · <span className="text-neutral-500">{player.location}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold tracking-wider">
              <span className="bg-[#9184d9]/15 border border-[#9184d9]/40 text-[#9184d9] px-3 py-1 rounded">⚔ {gameAccount.role}</span>
              <span className="bg-[#1E2035]/80 border border-white/10 text-neutral-300 px-3 py-1 rounded">🎯 {gameAccount.gameCode}</span>
              <span className="bg-[#1E2035]/80 border border-white/10 text-neutral-300 px-3 py-1 rounded">🏆 {gameAccount.tierLabel}</span>
              <span className="bg-[#E8B429]/10 border border-[#E8B429]/30 text-[#FFD166] px-3 py-1 rounded">★ {gameAccount.subRank}</span>
            </div>
          </div>

          {/* Rank Summary */}
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Season 2026</span>
            <span className="text-3xl font-bold text-[#E8B429] tracking-wide drop-shadow-[0_0_15px_rgba(232,180,41,0.3)]">
              {gameAccount.rankName}
            </span>
            <span className="text-[11px] text-neutral-500">ランク / Rank</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-[1200px] mx-auto px-10 py-7">
        {/* TABS */}
        <div className="flex gap-2 border-b border-white/10 mb-6">
          {(['STATS', 'PROFILE', 'TEAM'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-[#E8B429] text-[#E8B429]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab === 'STATS' && 'สถิติ / Stats'}
              {tab === 'PROFILE' && 'โปรไฟล์ / Profile'}
              {tab === 'TEAM' && 'ทีม / Team'}
            </button>
          ))}
        </div>

        {/* STATS OVERVIEW CARDS (6 Blocks) */}
        {activeTab === 'STATS' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-7">
              {[
                { label: 'K/D', val: stats.kd.toFixed(2), sub: 'Kill / Death', gold: true },
                { label: 'K/D/A', val: stats.kda.toFixed(2), sub: 'Kill/Death/Assist' },
                { label: 'ACS', val: stats.acs, sub: 'Avg Combat Score' },
                { label: 'ADR', val: stats.adr, sub: 'Avg Damage/Round' },
                { label: 'HS%', val: `${stats.headshotPct}%`, sub: 'Headshot Rate' },
                { label: 'FIRST BLOODS', val: stats.firstBloods, sub: 'เลือดแรก' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#1A1C2E] border border-white/10 hover:border-[#E8B429]/40 hover:bg-[#E8B429]/5 rounded-xl p-4 text-center transition-all group"
                >
                  <div className={`text-3xl font-bold tracking-tight ${item.gold ? 'text-[#E8B429] drop-shadow-[0_0_10px_rgba(232,180,41,0.2)]' : 'text-white'}`}>
                    {item.val}
                  </div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                    {item.label}
                  </div>
                  <div className="text-[9px] text-neutral-500 mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>

            {/* RADAR CHART & MATCH HISTORY (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Performance Radar (5 cols) */}
              <div className="lg:col-span-5 bg-[#1A1C2E] border border-[#E8B429]/15 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-[#E8B429] uppercase tracking-widest">
                    Performance Radar
                  </div>
                  <div className="text-[11px] text-neutral-500 mb-4">เรดาร์ประสิทธิภาพ</div>
                </div>

                {/* SVG Chart */}
                <div className="flex justify-center my-2">
                  <svg width="240" height="240" viewBox={`0 0 ${cx * 2} ${cy * 2}`}>
                    <defs>
                      <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#E8B429" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#E8B429" stopOpacity="0.03" />
                      </radialGradient>
                    </defs>
                    {rings}
                    {spokes}
                    <path d={dataD} fill="url(#radarGrad)" stroke="#E8B429" strokeWidth="2" strokeLinejoin="round" />
                    {dataPts.map(([x, y], i) => (
                      <circle key={'dot' + i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="4" fill="#E8B429" stroke="#0D0E1A" strokeWidth="1.5" />
                    ))}
                    {angles.map((a, i) => {
                      const [lx, ly] = getPoint(a, r + 22);
                      const anchor = lx < cx - 5 ? 'end' : lx > cx + 5 ? 'start' : 'middle';
                      return (
                        <text
                          key={'lbl' + i}
                          x={lx.toFixed(1)}
                          y={ly.toFixed(1)}
                          textAnchor={anchor}
                          dominantBaseline="middle"
                          fill="#9397ab"
                          fontSize="11"
                          fontWeight="600"
                        >
                          {labels[i]}
                        </text>
                      );
                    })}
                  </svg>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400 mt-4 border-t border-white/5 pt-3">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#E8B429]" /> ACS <span className="text-neutral-500">{stats.acs}</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#E8B429]" /> K/D <span className="text-neutral-500">{stats.kd}</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#E8B429]" /> ADR <span className="text-neutral-500">{stats.adr}</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#E8B429]" /> HS% <span className="text-neutral-500">{stats.headshotPct}%</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#E8B429]" /> FB Rate <span className="text-neutral-500">68%</span></div>
                </div>
              </div>

              {/* Match History Table (7 cols) */}
              <div className="lg:col-span-7 bg-[#1A1C2E] border border-[#9184d9]/15 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs font-bold text-[#9184d9] uppercase tracking-widest">
                      Match History
                    </div>
                    <div className="text-[11px] text-neutral-500">ประวัติการแข่งขัน</div>
                  </div>
                  <div className="flex gap-1.5 text-[10px] font-bold">
                    <span className="bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30 px-2 py-0.5 rounded">W 8</span>
                    <span className="bg-[#f87171]/15 text-[#f87171] border border-[#f87171]/30 px-2 py-0.5 rounded">L 2</span>
                  </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-1 text-[10px] font-bold text-neutral-500 uppercase tracking-wider pb-2 border-b border-white/5 px-2">
                  <span className="col-span-4">MAP</span>
                  <span className="col-span-2 text-center">SCORE</span>
                  <span className="col-span-3 text-center">K/D/A</span>
                  <span className="col-span-2 text-center">ACS</span>
                  <span className="col-span-1 text-center">HS%</span>
                </div>

                {/* Match Rows */}
                <div className="flex flex-col gap-1 mt-2">
                  {matches.map(m => {
                    const isWin = m.result === 'WIN';
                    const isExpanded = !!expandedMatches[m.id];
                    return (
                      <div key={m.id} className="flex flex-col">
                        <div
                          onClick={() => toggleMatch(m.id)}
                          className={`grid grid-cols-12 gap-1 items-center p-2.5 rounded-lg border border-transparent cursor-pointer transition-all relative overflow-hidden ${
                            isExpanded ? 'bg-[#9184d9]/10 border-[#9184d9]/30' : 'hover:bg-[#9184d9]/5'
                          }`}
                        >
                          {/* Indicator stripe */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${isWin ? 'bg-[#4ade80]' : 'bg-[#f87171]'}`} />

                          <div className="col-span-4 pl-2">
                            <div className="text-xs font-bold text-white">{m.map}</div>
                            <div className="text-[10px] text-neutral-500">{m.date}</div>
                          </div>
                          <div className="col-span-2 text-center">
                            <div className={`text-xs font-bold ${isWin ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>{m.result}</div>
                            <div className="text-[10px] text-neutral-400">{m.score}</div>
                          </div>
                          <div className="col-span-3 text-center text-xs font-medium text-neutral-200">{m.kda}</div>
                          <div className={`col-span-2 text-center text-xs font-bold ${m.acs >= 300 ? 'text-[#E8B429]' : 'text-neutral-300'}`}>{m.acs}</div>
                          <div className="col-span-1 text-center text-xs text-neutral-400">{m.hs}%</div>
                        </div>

                        {/* Accordion Detail Breakdown */}
                        {isExpanded && (
                          <div className="bg-[#9184d9]/5 border border-[#9184d9]/20 rounded-b-lg p-3 mx-1 mb-1 flex items-center justify-around text-center text-xs animate-fadeIn">
                            <div><div className="font-bold text-white">{m.kills}</div><div className="text-[9px] text-neutral-500">KILLS</div></div>
                            <div><div className="font-bold text-white">{m.deaths}</div><div className="text-[9px] text-neutral-500">DEATHS</div></div>
                            <div><div className="font-bold text-white">{m.assists}</div><div className="text-[9px] text-neutral-500">ASSISTS</div></div>
                            <div><div className="font-bold text-[#E8B429]">{m.fb}</div><div className="text-[9px] text-neutral-500">FIRST BLOODS</div></div>
                            <div><div className="font-bold text-white">{m.adr}</div><div className="text-[9px] text-neutral-500">ADR</div></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Profile (เชื่อมโยงกับ Block 1) */}
        {activeTab === 'PROFILE' && (
          <div className="bg-[#1A1C2E] border border-white/10 rounded-xl p-8 text-center text-neutral-400 text-sm">
            🛡️ ข้อมูล Identity, สังกัดสังเวียน & Verification Status (สอดคล้องกับตาราง <code className="text-[#E8B429]">players</code> & <code className="text-[#E8B429]">game_accounts</code>)
          </div>
        )}

        {/* Tab 3: Team (เชื่อมโยงกับ Block 1) */}
        {activeTab === 'TEAM' && (
          <div className="bg-[#1A1C2E] border border-white/10 rounded-xl p-8 text-center text-neutral-400 text-sm">
            ⚔️ ข้อมูลทีมแข่งและสถานะโรสเตอร์ (สอดคล้องกับตาราง <code className="text-[#E8B429]">teams</code> & <code className="text-[#E8B429]">team_members</code>)
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-neutral-600 font-mono">
          <div>ZODIAC ARENA · Season 2026</div>
          <div className="flex gap-2">
            <span className="text-[#E8B429]">ATHLETE PASSPORT</span>
            <span>v2.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
