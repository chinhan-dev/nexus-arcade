import React, { useState } from 'react';
import { sound } from '../../utils/soundEngine';
import { X, Trophy, Crown } from 'lucide-react';
import type { GameId, PlayerStats } from '../../types';

interface LeaderboardModalProps {
  isOpen: boolean;
  playerStats: PlayerStats;
  onClose: () => void;
}

const MOCK_LEADERBOARDS: Record<GameId, { name: string; score: number; avatar: string; tag: string }[]> = {
  'neon-surge': [
    { name: 'CyberShadow', score: 3840, avatar: '⚡', tag: 'VÔ ĐỊCH' },
    { name: 'NeonSamurai_99', score: 3210, avatar: '🔥', tag: 'TOP 2' },
    { name: 'Vortex_Master', score: 2850, avatar: '🌌', tag: 'TOP 3' },
    { name: 'PixelGhost', score: 2190, avatar: '👾', tag: 'CAO THỦ' },
    { name: 'ZeroGrav_VN', score: 1840, avatar: '🚀', tag: 'TINH ANH' },
  ],
  'quantum-2048': [
    { name: 'QuantumGod_AI', score: 36800, avatar: '👑', tag: 'VÔ ĐỊCH' },
    { name: 'ByteMaster_VN', score: 28400, avatar: '🔮', tag: 'TOP 2' },
    { name: 'Singularity_9', score: 21200, avatar: '🧠', tag: 'TOP 3' },
    { name: 'LogicMatrix', score: 16800, avatar: '💠', tag: 'CAO THỦ' },
    { name: 'CyberNode', score: 12400, avatar: '🤖', tag: 'TINH ANH' },
  ],
  'reflex-matrix': [
    { name: 'MatrixReflex_Pro', score: 86, avatar: '👁️', tag: '86 Giây' },
    { name: 'BulletDodger_VN', score: 72, avatar: '⚡', tag: '72 Giây' },
    { name: 'LaserStorm_X', score: 61, avatar: '🎯', tag: '61 Giây' },
    { name: 'FlashBoy', score: 49, avatar: '💨', tag: '49 Giây' },
    { name: 'Neo_Hacker', score: 41, avatar: '🕶️', tag: '41 Giây' },
  ],
};

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  playerStats,
  onClose,
}) => {
  const [selectedGame, setSelectedGame] = useState<GameId>('neon-surge');

  if (!isOpen) return null;

  const currentList = MOCK_LEADERBOARDS[selectedGame];
  const userScore = playerStats.highScores[selectedGame];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#11162a] via-[#0d1020] to-[#080a14] border border-cyan-500/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-left overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-display font-extrabold text-white">
              BẢNG XẾP HẠNG TOÀN CẦU
            </h3>
            <p className="text-xs text-slate-400">Đua top cao thủ nhận thưởng phần quà mùa giải</p>
          </div>
        </div>

        {/* Game Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 rounded-2xl border border-slate-800 mb-4">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedGame('neon-surge');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              selectedGame === 'neon-surge'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Neon Surge
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setSelectedGame('quantum-2048');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              selectedGame === 'quantum-2048'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quantum 2048
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setSelectedGame('reflex-matrix');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              selectedGame === 'reflex-matrix'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Reflex Matrix
          </button>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center items-end">
          {/* Top 2 */}
          <div className="bg-slate-900/60 border border-slate-700/80 rounded-2xl p-2.5 flex flex-col items-center">
            <span className="text-xl">{currentList[1].avatar}</span>
            <span className="text-[10px] font-bold text-slate-300 truncate w-full mt-1">
              {currentList[1].name}
            </span>
            <span className="text-xs font-mono-tech text-slate-400 font-bold">
              {currentList[1].score}
            </span>
            <span className="text-[9px] font-bold text-slate-400 mt-1">🥈 HẠNG 2</span>
          </div>

          {/* Top 1 */}
          <div className="bg-gradient-to-b from-amber-950/60 to-yellow-950/40 border-2 border-amber-400 rounded-2xl p-3 flex flex-col items-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Crown className="w-5 h-5 text-amber-400 animate-bounce mb-1" />
            <span className="text-2xl">{currentList[0].avatar}</span>
            <span className="text-xs font-bold text-amber-300 truncate w-full mt-1">
              {currentList[0].name}
            </span>
            <span className="text-sm font-mono-tech text-amber-400 font-black">
              {currentList[0].score}
            </span>
            <span className="text-[10px] font-extrabold text-amber-400 mt-1">🥇 QUÁN QUÂN</span>
          </div>

          {/* Top 3 */}
          <div className="bg-slate-900/60 border border-amber-800/40 rounded-2xl p-2.5 flex flex-col items-center">
            <span className="text-xl">{currentList[2].avatar}</span>
            <span className="text-[10px] font-bold text-slate-300 truncate w-full mt-1">
              {currentList[2].name}
            </span>
            <span className="text-xs font-mono-tech text-slate-400 font-bold">
              {currentList[2].score}
            </span>
            <span className="text-[9px] font-bold text-amber-600 mt-1">🥉 HẠNG 3</span>
          </div>
        </div>

        {/* User's current rank card */}
        <div className="bg-cyan-950/50 border border-cyan-500/50 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500 text-black flex items-center justify-center font-bold text-sm">
              YOU
            </div>
            <div>
              <div className="text-xs font-bold text-white">Bạn (Cyber Player)</div>
              <div className="text-[10px] text-cyan-300">Thứ hạng: #{userScore > 0 ? '42' : 'Chưa xếp hạng'}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono-tech font-bold text-amber-400">{userScore} điểm</div>
            <div className="text-[10px] text-slate-400">Kỷ lục cá nhân</div>
          </div>
        </div>
      </div>
    </div>
  );
};
