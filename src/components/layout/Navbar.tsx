import React from 'react';
import { sound } from '../../utils/soundEngine';
import { Sparkles, Trophy, ShoppingBag, Target, Volume2, VolumeX, Plus, Flame } from 'lucide-react';
import type { PlayerStats } from '../../types';

interface NavbarProps {
  playerStats: PlayerStats;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenLuckyWheel: () => void;
  onOpenShop: () => void;
  onOpenQuests: () => void;
  onOpenLeaderboard: () => void;
  onOpenGetCoinsAd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  playerStats,
  isMuted,
  onToggleMute,
  onOpenLuckyWheel,
  onOpenShop,
  onOpenQuests,
  onOpenLeaderboard,
  onOpenGetCoinsAd,
}) => {
  const calculatedLevel = Math.floor(playerStats.xp / 500) + 1;
  const currentLevelXP = playerStats.xp % 500;
  const levelProgress = (currentLevelXP / 500) * 100;

  return (
    <header className="sticky top-0 z-30 w-full bg-[#07080f]/90 border-b border-cyan-500/20 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#090b14] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="font-display font-black text-base sm:text-lg tracking-wider text-white flex items-center gap-1.5">
              <span>NEXUS</span>
              <span className="text-cyan-400 text-glow-cyan">ARCADE</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono-tech text-slate-400">
              <span>VŨ TRỤ GAME CYBERPUNK</span>
            </div>
          </div>
        </div>

        {/* Currency & Level Stats */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Level / XP Pill */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 rounded-2xl px-3 py-1.5">
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold font-display text-white">LV.{calculatedLevel}</span>
            </div>
            <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>

          {/* Coins Badge with + Ad Button */}
          <div className="flex items-center bg-[#0d1222] border border-amber-500/30 rounded-2xl pl-2.5 pr-1 py-1 shadow-sm">
            <span className="text-xs sm:text-sm font-mono-tech font-bold text-amber-300">
              🪙 {playerStats.coins}
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onOpenGetCoinsAd();
              }}
              title="Nhận thêm Coins miễn phí (Xem QC)"
              className="ml-1.5 p-1 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Diamonds Badge */}
          <div className="flex items-center bg-[#130f24] border border-purple-500/30 rounded-2xl px-2.5 py-1 shadow-sm">
            <span className="text-xs sm:text-sm font-mono-tech font-bold text-purple-300">
              💎 {playerStats.diamonds}
            </span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Lucky Wheel Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLuckyWheel();
            }}
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">VÒNG QUAY</span>
            {playerStats.spinsLeft > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center justify-center animate-bounce">
                {playerStats.spinsLeft}
              </span>
            )}
          </button>

          {/* Shop Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span className="hidden lg:inline">CỬA HÀNG</span>
          </button>

          {/* Quests Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenQuests();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-amber-950/50 border border-slate-700/80 hover:border-amber-400 text-slate-200 hover:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Target className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">NHIỆM VỤ</span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-purple-950/50 border border-slate-700/80 hover:border-purple-400 text-slate-200 hover:text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="hidden lg:inline">BXH</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
