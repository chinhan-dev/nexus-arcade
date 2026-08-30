import type { PlayerStats, Quest, ShopItem } from '../types';

const STORAGE_KEY = 'NEXUS_ARCADE_USER_DATA_V1';
const QUESTS_KEY = 'NEXUS_ARCADE_QUESTS_V1';

export const DEFAULT_PLAYER_STATS: PlayerStats = {
  coins: 350,
  diamonds: 10,
  xp: 0,
  level: 1,
  unlockedSkins: ['default_glider', 'neon_cyan'],
  activeSkin: 'default_glider',
  spinsLeft: 2,
  lastDailyClaim: null,
  highScores: {
    'neon-surge': 0,
    'quantum-2048': 0,
    'reflex-matrix': 0,
  },
};

export const SHOP_CATALOG: ShopItem[] = [
  {
    id: 'default_glider',
    name: 'Cyber Glider V1',
    category: 'skin',
    description: 'Chiến cơ nguyên bản tiêu chuẩn hệ thống Nexus.',
    price: 0,
    currency: 'coins',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
  },
  {
    id: 'neon_cyan',
    name: 'Neon Horizon',
    category: 'skin',
    description: 'Vệt sáng Cyber Cyan tốc độ siêu thanh.',
    price: 300,
    currency: 'coins',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.7)',
    canUnlockWithAd: true,
  },
  {
    id: 'phantom_violet',
    name: 'Phantom Void',
    category: 'skin',
    description: 'Bóng ma lượng tử với luồng bức xạ tím ma mị.',
    price: 750,
    currency: 'coins',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    canUnlockWithAd: true,
  },
  {
    id: 'solar_flare',
    name: 'Solar Phoenix',
    category: 'skin',
    description: 'Bão lửa plasma hoàng kim, tăng độ ngầu 200%.',
    price: 1500,
    currency: 'coins',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.8)',
    canUnlockWithAd: true,
  },
  {
    id: 'matrix_matrix',
    name: 'Matrix Overlord',
    category: 'skin',
    description: 'Mã nguồn nguyên thủy xanh lục cổ điển.',
    price: 30,
    currency: 'diamonds',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.8)',
    canUnlockWithAd: true,
  },
  {
    id: 'dark_matter',
    name: 'Dark Matter X',
    category: 'skin',
    description: 'Hạt phản vật chất tối thượng dành cho cao thủ.',
    price: 60,
    currency: 'diamonds',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.8)',
  },
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q_neon_1',
    title: 'Tia Chớp Neon',
    description: 'Đạt 500 điểm trong Neon Surge',
    rewardCoins: 200,
    rewardXP: 150,
    current: 0,
    target: 500,
    completed: false,
    gameId: 'neon-surge',
  },
  {
    id: 'q_quantum_1',
    title: 'Hợp Nhất Lượng Tử',
    description: 'Tạo ra khối Giga Byte (128) trong Quantum 2048',
    rewardCoins: 250,
    rewardXP: 200,
    current: 0,
    target: 128,
    completed: false,
    gameId: 'quantum-2048',
  },
  {
    id: 'q_reflex_1',
    title: 'Phản Xạ Thần Thánh',
    description: 'Sống sót 25 giây trong Reflex Matrix',
    rewardCoins: 300,
    rewardXP: 250,
    current: 0,
    target: 25,
    completed: false,
    gameId: 'reflex-matrix',
  },
  {
    id: 'q_daily_spin',
    title: 'Vòng Quay May Mắn',
    description: 'Quay vòng quay Cyber 1 lần hôm nay',
    rewardCoins: 150,
    rewardXP: 100,
    current: 0,
    target: 1,
    completed: false,
  },
];

export const loadPlayerStats = (): PlayerStats => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_PLAYER_STATS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load player stats', e);
  }
  return DEFAULT_PLAYER_STATS;
};

export const savePlayerStats = (stats: PlayerStats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save player stats', e);
  }
};

export const loadQuests = (): Quest[] => {
  try {
    const saved = localStorage.getItem(QUESTS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load quests', e);
  }
  return INITIAL_QUESTS;
};

export const saveQuests = (quests: Quest[]) => {
  try {
    localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
  } catch (e) {
    console.error('Failed to save quests', e);
  }
};
