export type GameId = 'neon-surge' | 'quantum-2048' | 'reflex-matrix';

export interface PlayerStats {
  coins: number;
  diamonds: number;
  xp: number;
  level: number;
  unlockedSkins: string[];
  activeSkin: string;
  spinsLeft: number;
  lastDailyClaim: string | null;
  highScores: {
    'neon-surge': number;
    'quantum-2048': number;
    'reflex-matrix': number;
  };
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'skin' | 'trail' | 'booster';
  description: string;
  price: number;
  currency: 'coins' | 'diamonds';
  color: string;
  glowColor: string;
  canUnlockWithAd?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardXP: number;
  current: number;
  target: number;
  completed: boolean;
  gameId?: GameId;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  badge: string;
  isUser?: boolean;
}

export type AdSlotType = 
  | 'header-leaderboard' 
  | 'sticky-bottom' 
  | 'sidebar-skyscraper' 
  | 'game-over-banner' 
  | 'modal-rectangle';

export interface AdSlotConfig {
  id: string;
  name: string;
  format: string;
  enabled: boolean;
  htmlContent?: string;
  customScript?: string;
}
