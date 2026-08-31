// ข้อมูลโปรไฟล์ผู้เล่นและแรงก์
export interface PlayerRank {
  tier: string;          // เช่น "Immortal 3"
  rr: number;            // คะแนนแรงก์ เช่น 452
  leaderboard: string;   // อันดับ เช่น "#1,240"
  peakTier: string;      // แรงก์สูงสุดที่เคยแตะ
  peakDate: string;      // ซีซั่นที่แตะแรงก์สูงสุด
}

// ข้อมูลสถิติหลัก (Bento Grid)
export interface PlayerStats {
  damagePerRound: number; // ดาเมจเฉลี่ยต่อรอบ
  kdRatio: number;        // อัตราส่วน Kill / Death
  headshotPct: number;    // % ยิงโดนหัว
  winRate: number;        // % การชนะ
  matchesWon: number;     // จำนวนแมตช์ที่ชนะ
  matchesLost: number;    // จำนวนแมตช์ที่แพ้
  totalKills: number;     // จำนวนคิลรวม
}

// ข้อมูล Agent / ตัวละครที่เล่นบ่อย
export interface TopAgent {
  name: string;
  role: string;
  hours: number;
  winRate: number;
  kd: number;
}

// ข้อมูลประวัติการแข่งรายแมตช์
export interface MatchHistory {
  id: string;
  map: string;
  agent: string;
  isVictory: boolean;
  score: string;
  kda: string;
  combatScore: number;
  badge?: string;
  timeAgo: string;
}

// ก้อนข้อมูลรวมทั้งหน้า Dashboard
export interface PlayerProfileData {
  name: string;
  tag: string;
  platform: string;
  avatarUrl: string;
  currentRank: PlayerRank;
  stats: PlayerStats;
  topAgents: TopAgent[];
  recentMatches: MatchHistory[];
}