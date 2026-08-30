import React, { useEffect, useState } from 'react';
import { ADS_CONFIG } from '../../config/ads.config';
import { sound } from '../../utils/soundEngine';
import { PlayCircle, Gift, CheckCircle2, X, ExternalLink, ShieldCheck } from 'lucide-react';
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
  const duration = ADS_CONFIG.rewardedWatchDurationSeconds || 5;
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(duration);
      setIsCompleted(false);
      return;
    }

    setSecondsLeft(duration);
    setIsCompleted(false);

    // Bật âm thanh mở
    sound.playPowerup();

    // Mở direct link tài trợ nếu có (tùy chọn)
    if (ADS_CONFIG.directLinkUrl && !ADS_CONFIG.testMode) {
      try {
        window.open(ADS_CONFIG.directLinkUrl, '_blank', 'noopener,noreferrer');
      } catch {
        // Safe fallback
      }
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCompleted(true);
          sound.playVictory();
          return 0;
        }
        sound.playClick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, duration]);

  if (!isOpen) return null;

  const handleClaim = () => {
    sound.playVictory();
    // Bắn pháo hoa ăn mừng
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#a855f7', '#f59e0b', '#10b981'],
    });
    onRewardClaimed();
    onClose();
  };

  const progressPercent = ((duration - secondsLeft) / duration) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#101426] to-[#0a0d18] border border-cyan-500/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-center overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button (Disabled until finished if strict, or allowed with warning) */}
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
          <span>SPONSORED REWARD • QUẢNG CÁO TÀI TRỢ</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-cyan-300 font-medium mb-6">
          🎁 Phần thưởng: <span className="text-amber-400 font-bold">{rewardDescription}</span>
        </p>

        {/* Simulated Video Ad Container */}
        <div className="relative rounded-2xl bg-gradient-to-tr from-slate-950 via-[#151930] to-slate-900 border border-slate-700/60 p-6 mb-6 overflow-hidden">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-cyan-500/30">
            {isCompleted ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-300 animate-bounce" />
            ) : (
              <PlayCircle className="w-8 h-8 animate-pulse text-white" />
            )}
          </div>

          <h4 className="text-base font-bold text-white mb-1">
            {isCompleted ? '🎉 Quảng Cáo Hoàn Tất!' : 'Đang Tải Quảng Cáo Nhà Tài Trợ...'}
          </h4>
          <p className="text-xs text-slate-400 mb-4">
            {isCompleted
              ? 'Bạn đã hoàn thành yêu cầu! Bấm nút bên dưới để nhận ngay phần thưởng.'
              : `Vui lòng đợi ${secondsLeft}s để mở khóa quyền lợi miễn phí.`}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Countdown badge */}
          <div className="mt-3 font-mono-tech text-xs text-slate-400">
            {isCompleted ? (
              <span className="text-emerald-400 font-bold">100% Verified</span>
            ) : (
              <span>Thời gian còn lại: <strong className="text-cyan-400 text-sm">{secondsLeft}s</strong></span>
            )}
          </div>
        </div>

        {/* Action Button */}
        {isCompleted ? (
          <button
            onClick={handleClaim}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-black font-extrabold text-base tracking-wide shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            <span>NHẬN THƯỞNG NGAY</span>
          </button>
        ) : (
          <button
            disabled
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 text-slate-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2 border border-slate-700"
          >
            <span>ĐANG XEM QUẢNG CÁO ({secondsLeft}S)...</span>
          </button>
        )}

        {/* Sponsor link footer */}
        <div className="mt-4 text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <span>Hệ thống quảng cáo bởi</span>
          <a
            href={ADS_CONFIG.directLinkUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline flex items-center gap-0.5"
          >
            <span>Nexus Sponsor Network</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
