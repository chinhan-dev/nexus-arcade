import React from 'react';
import { sound } from '../../utils/soundEngine';
import type { GameId, PlayerStats } from '../../types';
import { AdBanner } from '../ads/AdBanner';
import { Zap, Play, Sparkles, Flame, Gift, Gamepad2 } from 'lucide-react';

interface GameHubLobbyProps {
  playerStats: PlayerStats;
  onSelectGame: (gameId: GameId) => void;
  onOpenLuckyWheel: () => void;
  onOpenShop: () => void;
  onTriggerRewardedAd: (title: string, description: string, onClaim: () => void) => void;
  onUpdateStats: (newStats: Partial<PlayerStats>) => void;
}

export const GameHubLobby: React.FC<GameHubLobbyProps> = ({
  playerStats,
  onSelectGame,
  onOpenLuckyWheel,
  onTriggerRewardedAd,
  onUpdateStats,
}) => {
  const gamesList: {
    id: GameId;
    title: string;
    tagline: string;
    badge: string;
    badgeColor: string;
    gradient: string;
    borderColor: string;
    glowColor: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'neon-surge',
      title: 'NEON SURGE',
      tagline: 'Endless Synthwave Cyber Runner • Né Laser & Tăng Tốc 300km/h',
      badge: 'HOT NHẤT 🔥',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      gradient: 'from-cyan-950/60 via-[#101935] to-blue-950/40',
      borderColor: 'border-cyan-500/40 hover:border-cyan-400',
      glowColor: 'rgba(6, 182, 212, 0.3)',
      icon: <Zap className="w-8 h-8 text-cyan-400" />,
    },
    {
      id: 'quantum-2048',
      title: 'QUANTUM 2048',
      tagline: 'Cyber Fusion Puzzle • Hợp Nhất Các Lõi Lượng Tử Lên AI Singularity',
      badge: 'CỰC CUỐN 🧠',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      gradient: 'from-purple-950/60 via-[#191136] to-pink-950/40',
      borderColor: 'border-purple-500/40 hover:border-purple-400',
      glowColor: 'rgba(168, 85, 247, 0.3)',
      icon: <Sparkles className="w-8 h-8 text-purple-400" />,
    },
    {
      id: 'reflex-matrix',
      title: 'REFLEX MATRIX',
      tagline: '360° Bullet Hell Reflex • Thử Thách Phản Xạ Cực Hạn Sống Sót',
      badge: 'HARDCORE ⚡',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      gradient: 'from-amber-950/60 via-[#231518] to-rose-950/40',
      borderColor: 'border-amber-500/40 hover:border-amber-400',
      glowColor: 'rgba(245, 158, 11, 0.3)',
      icon: <Flame className="w-8 h-8 text-amber-400" />,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-8">
      {/* 🎯 HEADER AD LEADERBOARD */}
      <AdBanner slot="headerLeaderboard" />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d1226] via-[#15112f] to-[#0d172e] border border-cyan-500/30 p-6 sm:p-10 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech mb-4">
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>NEXUS ARCADE PROTOCOL V2.0 • 100% FREE TO PLAY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-wide leading-tight mb-4 text-glow-cyan">
            VŨ TRỤ GAME MINI <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 bg-clip-text text-transparent">
              CYBERPUNK TỐC ĐỘ CAO
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed max-w-2xl">
            Trải nghiệm các tựa game arcade 60FPS mượt mà không cần cài đặt. Đua top bảng xếp hạng, quay gacha nhận quà miễn phí và mở khóa những skin chiến cơ tối thượng!
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                sound.playClick();
                onSelectGame('neon-surge');
              }}
              className="py-3.5 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-display font-extrabold text-sm sm:text-base shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
            >
              <Play className="w-5 h-5 fill-current group-hover:translate-x-0.5 transition-transform" />
              <span>CHƠI NGAY: NEON SURGE</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenLuckyWheel();
              }}
              className="py-3.5 px-6 rounded-2xl bg-[#11172e] hover:bg-[#182040] border border-amber-500/40 text-amber-300 font-bold text-sm flex items-center gap-2 transition-all hover:scale-105 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>VÒNG QUAY MAY MẮN</span>
            </button>
          </div>
        </div>
      </section>

      {/* 🎯 HIGH-CTR SPONSORED REWARD CENTER (QUÀ TẶNG TÀI TRỢ) */}
      <section className="bg-[#0b0e1c] border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400 animate-bounce" />
              <h3 className="font-display font-bold text-lg text-white">
                TRẠM QUÀ TẶNG TÀI TRỢ MIỄN PHÍ
              </h3>
            </div>
            <p className="text-xs text-slate-400">Xem video tài trợ 5s để nhận ngay quà thưởng giá trị mỗi ngày!</p>
          </div>
          <span className="text-[11px] font-mono-tech text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-full">
            100% MIỄN PHÍ • KHÔNG GIỚI HẠN
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Ad Reward 1: 300 Coins */}
          <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-white mb-0.5">🪙 Gói 300 Coins</div>
              <p className="text-[11px] text-slate-400">Dùng mua skin & nâng cấp</p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onTriggerRewardedAd('NHẬN 300 COINS MIỄN PHÍ', '300 Cyber Coins vàng', () => {
                  onUpdateStats({ coins: playerStats.coins + 300 });
                });
              }}
              className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition-all shrink-0"
            >
              NHẬN (QC)
            </button>
          </div>

          {/* Ad Reward 2: 10 Diamonds */}
          <div className="bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/40 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-white mb-0.5">💎 10 Kim Cương VIP</div>
              <p className="text-[11px] text-slate-400">Mở khóa skin huyền thoại</p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onTriggerRewardedAd('NHẬN 10 KIM CƯƠNG VIP', '10 Cyber Diamonds quý hiếm', () => {
                  onUpdateStats({ diamonds: playerStats.diamonds + 10 });
                });
              }}
              className="py-2 px-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs shadow-md transition-all shrink-0"
            >
              NHẬN (QC)
            </button>
          </div>

          {/* Ad Reward 3: Mystery Box */}
          <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-white mb-0.5">🎁 Hòm Bí Ẩn Crate</div>
              <p className="text-[11px] text-slate-400">Tỉ lệ rơi 500 Coins + 20 Gem</p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onTriggerRewardedAd('MỞ HÒM BÍ ẨN CYBER CRATE', '500 Coins & 5 Diamonds VIP', () => {
                  onUpdateStats({
                    coins: playerStats.coins + 500,
                    diamonds: playerStats.diamonds + 5,
                  });
                });
              }}
              className="py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition-all shrink-0"
            >
              MỞ HÒM (QC)
            </button>
          </div>
        </div>
      </section>

      {/* Main Games Grid & Sidebar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Games List (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white flex items-center gap-2">
              <span>DANH SÁCH GAME ARCADE</span>
            </h2>
            <span className="text-xs font-mono-tech text-cyan-400">3 TỰA GAME SẴN SÀNG</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gamesList.map((game) => {
              const personalBest = playerStats.highScores[game.id] || 0;

              return (
                <div
                  key={game.id}
                  className={`relative rounded-3xl bg-gradient-to-b ${game.gradient} border ${game.borderColor} p-5 flex flex-col justify-between shadow-lg transition-all hover:scale-[1.02] group`}
                  style={{
                    boxShadow: `0 0 20px ${game.glowColor}`,
                  }}
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase font-mono-tech ${game.badgeColor}`}>
                        {game.badge}
                      </span>
                      <div className="p-2 rounded-2xl bg-black/40 border border-slate-700/50">
                        {game.icon}
                      </div>
                    </div>

                    <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                      {game.tagline}
                    </p>
                  </div>

                  <div>
                    {/* Personal best score */}
                    <div className="flex items-center justify-between bg-black/40 border border-slate-800 rounded-xl p-2.5 mb-4">
                      <span className="text-[10px] font-mono-tech text-slate-400 uppercase">Kỷ Lục Của Bạn:</span>
                      <span className="text-xs font-display font-bold text-amber-400">
                        {personalBest > 0 ? `${personalBest} điểm` : 'Chưa chơi'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        onSelectGame(game.id);
                      }}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs uppercase flex items-center justify-center gap-2 shadow-md group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>CHƠI NGAY</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🎯 SIDEBAR SKYSCRAPER AD (1 Column) */}
        <div className="lg:col-span-1">
          <AdBanner slot="sidebarSkyscraper" className="sticky top-20" />
        </div>
      </div>
    </div>
  );
};
