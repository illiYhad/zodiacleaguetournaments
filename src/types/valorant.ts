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
  acs: number;
  kd?: number;
  headshotPct?: number;
  playedAt: string;
  tier?: string;
}

export interface MatchHistoryProps {
  items?: ValorantMatchItem[];
  userId?: string;
}