import React, { useEffect, useState } from 'react';
import { ADS_CONFIG } from '../../config/ads.config';
import { sound } from '../../utils/soundEngine';
import { Gift, CheckCircle2, X, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RewardedAdModalProps {
  isOpen: boolean;
  title: string;
  rewardDescription: string;
  onRewardClaimed: () => void;
  onClose: () => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  title,
  rewardDescription,
  onRewardClaimed,
  onClose,
}) => {
  const requiredClicks = ADS_CONFIG.requiredAdClicks || 3;
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setClickCount(0);
      return;
    }
    setClickCount(0);
    sound.playPowerup();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdStepClick = () => {
    const next = clickCount + 1;
    setClickCount(next);

    // Mở Direct Link Ads sang tab mới
    if (ADS_CONFIG.directLinkUrl) {
      try {
        window.open(ADS_CONFIG.directLinkUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.error('Popup blocked', e);
      }
    }

    if (next >= requiredClicks) {
      sound.playVictory();
    } else {
      sound.playClick();
    }
  };

  const handleClaimFinalReward = () => {
    sound.playVictory();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#a855f7', '#f59e0b', '#10b981'],
    });
    onRewardClaimed();
    onClose();
  };

  const isCompleted = clickCount >= requiredClicks;
  const progressPercent = Math.min(100, (clickCount / requiredClicks) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#101426] to-[#0a0d18] border border-cyan-500/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-center overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

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

        {/* Sponsor Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>XÁC THỰC NHÀ TÀI TRỢ ({clickCount}/{requiredClicks})</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-cyan-300 font-medium mb-5">
          🎁 Phần thưởng: <span className="text-amber-400 font-bold">{rewardDescription}</span>
        </p>

        {/* Step Progress Container */}
        <div className="relative rounded-2xl bg-gradient-to-tr from-slate-950 via-[#151930] to-slate-900 border border-slate-700/60 p-5 mb-6 overflow-hidden">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-purple-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-amber-500/30">
            {isCompleted ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-300 animate-bounce" />
            ) : (
              <Sparkles className="w-7 h-7 animate-pulse text-white" />
            )}
          </div>

          <h4 className="text-base font-bold text-white mb-1">
            {isCompleted ? '🎉 ĐÃ HOÀN THÀNH XÁC MINH!' : `Bước xác thực: ${clickCount}/${requiredClicks}`}
          </h4>
          <p className="text-xs text-slate-400 mb-4">
            {isCompleted
              ? 'Bấm nút "Nhận Thưởng Ngay" bên dưới để kích hoạt quyền lợi!'
              : `Bấm nút bên dưới để mở trang tài trợ (Cần hoàn tất ${requiredClicks} lần xem quảng cáo).`}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Steps badge */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {Array.from({ length: requiredClicks }).map((_, idx) => (
              <div
                key={idx}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono-tech font-black border transition-all ${
                  idx < clickCount
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                    : idx === clickCount
                    ? 'bg-amber-500 text-black border-amber-300 animate-pulse'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {isCompleted ? (
          <button
            onClick={handleClaimFinalReward}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-black font-extrabold text-base tracking-wide shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 animate-bounce"
          >
            <Gift className="w-5 h-5" />
            <span>NHẬN THƯỞNG NGAY</span>
          </button>
        ) : (
          <button
            onClick={handleAdStepClick}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 text-black font-extrabold text-sm uppercase tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 animate-shimmer"
          >
            <ExternalLink className="w-4 h-4 text-black" />
            <span>XÁC NHẬN TÀI TRỢ (BƯỚC {clickCount + 1}/{requiredClicks})</span>
          </button>
        )}

        {/* Sponsor link footer */}
        <div className="mt-4 text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <span>Quảng cáo đối tác bởi</span>
          <span className="text-cyan-400 font-bold">Nexus Sponsor Network</span>
        </div>
      </div>
    </div>
  );
};
