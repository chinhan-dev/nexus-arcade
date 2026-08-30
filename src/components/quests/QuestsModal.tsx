import React from 'react';
import { sound } from '../../utils/soundEngine';
import { X, CheckCircle2, Gift, Target } from 'lucide-react';
import type { Quest, PlayerStats } from '../../types';
import confetti from 'canvas-confetti';

interface QuestsModalProps {
  isOpen: boolean;
  quests: Quest[];
  playerStats: PlayerStats;
  onUpdateStats: (newStats: Partial<PlayerStats>) => void;
  onUpdateQuests: (newQuests: Quest[]) => void;
  onClose: () => void;
}

export const QuestsModal: React.FC<QuestsModalProps> = ({
  isOpen,
  quests,
  playerStats,
  onUpdateStats,
  onUpdateQuests,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleClaimQuest = (quest: Quest) => {
    sound.playVictory();
    confetti({ particleCount: 70, spread: 60 });

    const updated = quests.map((q) => (q.id === quest.id ? { ...q, completed: true } : q));
    onUpdateQuests(updated);

    onUpdateStats({
      coins: playerStats.coins + quest.rewardCoins,
      xp: playerStats.xp + quest.rewardXP,
    });
  };

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
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-display font-extrabold text-white">
              NHIỆM VỤ HÀNG NGÀY
            </h3>
            <p className="text-xs text-slate-400">Hoàn thành nhiệm vụ để nhận Cyber Coins & XP thăng cấp</p>
          </div>
        </div>

        {/* Quest List */}
        <div className="space-y-3 my-3">
          {quests.map((quest) => {
            // Check progress against player stats
            let currentVal = 0;
            if (quest.gameId) {
              currentVal = playerStats.highScores[quest.gameId] || 0;
            } else {
              currentVal = quest.current;
            }
            const isReadyToClaim = !quest.completed && currentVal >= quest.target;
            const progressPercent = Math.min(100, (currentVal / quest.target) * 100);

            return (
              <div
                key={quest.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-sm text-white">{quest.title}</h4>
                    <span className="text-[10px] font-mono-tech text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/30">
                      +{quest.rewardCoins} 🪙 | +{quest.rewardXP} XP
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{quest.description}</p>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Claim Button */}
                <div className="shrink-0">
                  {quest.completed ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ĐÃ NHẬN</span>
                    </span>
                  ) : isReadyToClaim ? (
                    <button
                      onClick={() => handleClaimQuest(quest)}
                      className="inline-flex items-center gap-1 text-xs text-black font-extrabold px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 shadow-md hover:scale-105 transition-all animate-bounce"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>NHẬN QUÀ</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono-tech text-slate-500 px-3 py-1.5">
                      {currentVal}/{quest.target}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
