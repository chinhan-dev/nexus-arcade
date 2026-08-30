import React, { useState } from 'react';
import { sound } from '../../utils/soundEngine';
import { RewardedAdModal } from '../ads/RewardedAdModal';
import { AdBanner } from '../ads/AdBanner';
import { X, Sparkles, Trophy, Play, Gift } from 'lucide-react';
import type { PlayerStats } from '../../types';
import confetti from 'canvas-confetti';

interface LuckyWheelModalProps {
  isOpen: boolean;
  playerStats: PlayerStats;
  onUpdateStats: (newStats: Partial<PlayerStats>) => void;
  onClose: () => void;
}

interface WheelSegment {
  label: string;
  type: 'coins' | 'diamonds';
  amount: number;
  color: string;
  textColor: string;
}

const SEGMENTS: WheelSegment[] = [
  { label: '+100 Coins', type: 'coins', amount: 100, color: '#06b6d4', textColor: '#000' },
  { label: '+5 Diamonds', type: 'diamonds', amount: 5, color: '#a855f7', textColor: '#fff' },
  { label: '+250 Coins', type: 'coins', amount: 250, color: '#3b82f6', textColor: '#fff' },
  { label: '+10 Diamonds', type: 'diamonds', amount: 10, color: '#ec4899', textColor: '#fff' },
  { label: '+500 Coins', type: 'coins', amount: 500, color: '#f59e0b', textColor: '#000' },
  { label: 'JACKPOT 1000', type: 'coins', amount: 1000, color: '#10b981', textColor: '#000' },
  { label: '+15 Diamonds', type: 'diamonds', amount: 15, color: '#8b5cf6', textColor: '#fff' },
  { label: 'VIP 50 GEMS', type: 'diamonds', amount: 50, color: '#f43f5e', textColor: '#fff' },
];

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  isOpen,
  playerStats,
  onUpdateStats,
  onClose,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<WheelSegment | null>(null);
  const [showRewardedAd, setShowRewardedAd] = useState(false);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning || playerStats.spinsLeft <= 0) return;

    setIsSpinning(true);
    setWonPrize(null);
    sound.playPowerup();

    // Deduct 1 spin
    onUpdateStats({ spinsLeft: playerStats.spinsLeft - 1 });

    const totalSegments = SEGMENTS.length;
    const winningIndex = Math.floor(Math.random() * totalSegments);
    const degreesPerSegment = 360 / totalSegments;

    // Extra full spins (5 to 8 rotations) + target segment offset
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));
    const targetDeg = extraSpins + (360 - (winningIndex * degreesPerSegment + degreesPerSegment / 2));

    const finalRotation = rotation + targetDeg;
    setRotation(finalRotation);

    // Audio ticks during spin
    const tickInterval = setInterval(() => {
      sound.playSpinTick();
    }, 150);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      const prize = SEGMENTS[winningIndex];
      setWonPrize(prize);
      sound.playVictory();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Credit reward
      if (prize.type === 'coins') {
        onUpdateStats({ coins: playerStats.coins + prize.amount });
      } else {
        onUpdateStats({ diamonds: playerStats.diamonds + prize.amount });
      }
    }, 4000);
  };

  const handleClaimAdSpins = () => {
    setShowRewardedAd(false);
    onUpdateStats({ spinsLeft: playerStats.spinsLeft + 3 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#11162a] via-[#0d1020] to-[#080a14] border border-cyan-500/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-center overflow-hidden">
        
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

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>CYBER FORTUNE WHEEL</span>
        </div>
        <h3 className="text-2xl font-display font-extrabold text-white mb-1">
          VÒNG QUAY MAY MẮN
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Lượt quay còn lại: <strong className="text-amber-400 text-sm font-mono-tech">{playerStats.spinsLeft} lượt</strong>
        </p>

        {/* Wheel Graphic Container */}
        <div className="relative w-64 h-64 mx-auto my-4 flex items-center justify-center">
          {/* Wheel Pointer Pin */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-6 h-8 text-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
            ▼
          </div>

          {/* Glowing Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.5)] pointer-events-none z-10" />

          {/* Rotating Wheel */}
          <div
            className="w-full h-full rounded-full relative overflow-hidden border-2 border-slate-700 transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {SEGMENTS.map((seg, idx) => {
              const rotate = idx * (360 / SEGMENTS.length);
              return (
                <div
                  key={idx}
                  className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left flex items-center justify-center p-2 text-[11px] font-bold"
                  style={{
                    backgroundColor: seg.color,
                    color: seg.textColor,
                    transform: `rotate(${rotate}deg) skewY(-45deg)`,
                  }}
                >
                  <span
                    className="transform skewY(45deg) rotate-45 translate-x-3 translate-y-3 font-mono-tech font-extrabold"
                  >
                    {seg.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center Hub Button */}
          <div className="absolute z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-cyan-400 shadow-xl flex items-center justify-center text-cyan-300">
            <Trophy className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Won Prize Banner */}
        {wonPrize && (
          <div className="my-3 py-2 px-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold animate-fadeIn">
            🎉 Chúc mừng! Bạn nhận được <span className="text-amber-300 text-sm">{wonPrize.label}</span>!
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 mt-4">
          <button
            onClick={handleSpin}
            disabled={isSpinning || playerStats.spinsLeft <= 0}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-display font-extrabold text-sm shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isSpinning ? 'ĐANG QUAY...' : 'QUAY NGAY (1 LƯỢT)'}</span>
          </button>

          {/* 🎯 HIGH-CTR REWARDED AD BUTTON: GET +3 SPINS */}
          <button
            onClick={() => {
              sound.playClick();
              setShowRewardedAd(true);
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs uppercase shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 animate-shimmer"
          >
            <Gift className="w-4 h-4 fill-current" />
            <span>⚡ NHẬN THÊM +3 LƯỢT QUAY MIỄN PHÍ (XEM QC)</span>
          </button>
        </div>

        {/* Embedded Ad Banner */}
        <AdBanner slot="luckyWheelBanner" className="mt-4" />
      </div>

      {/* Rewarded Ad Submodal */}
      <RewardedAdModal
        isOpen={showRewardedAd}
        title="NHẬN THÊM LƯỢT QUAY VIP"
        rewardDescription="+3 Lượt Quay May Mắn Miễn Phí!"
        onRewardClaimed={handleClaimAdSpins}
        onClose={() => setShowRewardedAd(false)}
      />
    </div>
  );
};
