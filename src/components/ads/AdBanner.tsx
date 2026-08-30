import React, { useState } from 'react';
import { ADS_CONFIG } from '../../config/ads.config';
import { ExternalLink, Sparkles, X, ChevronUp } from 'lucide-react';
import { sound } from '../../utils/soundEngine';

interface AdBannerProps {
  slot: 'headerLeaderboard' | 'stickyBottom' | 'sidebarSkyscraper' | 'gameOverBanner' | 'luckyWheelBanner';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const slotConfig = ADS_CONFIG.slots[slot];

  if (!ADS_CONFIG.enabled || !slotConfig || !slotConfig.enabled) {
    return null;
  }

  const handleMockClick = () => {
    sound.playClick();
    if (ADS_CONFIG.directLinkUrl) {
      window.open(ADS_CONFIG.directLinkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Nếu ở chế độ Real Ads và có custom HTML
  if (!ADS_CONFIG.testMode && slotConfig.customHtml && !slotConfig.customHtml.includes('<!--')) {
    return (
      <div 
        className={`ad-container relative flex flex-col items-center justify-center overflow-hidden my-2 ${className}`}
        dangerouslySetInnerHTML={{ __html: slotConfig.customHtml }}
      />
    );
  }

  // Chế độ Sticky Bottom đặc biệt có nút thu nhỏ
  if (slot === 'stickyBottom') {
    if (isCollapsed) {
      return (
        <button
          onClick={() => {
            sound.playClick();
            setIsCollapsed(false);
          }}
          className="fixed bottom-3 right-4 z-40 bg-cyan-950/90 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 px-3 py-1.5 rounded-full text-xs font-mono-tech flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all hover:scale-105"
        >
          <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>QC TÀI TRỢ</span>
        </button>
      );
    }

    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e18]/95 border-t border-cyan-500/30 backdrop-blur-lg px-3 py-2 shadow-2xl transition-all">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div 
            onClick={handleMockClick}
            className="flex-1 flex items-center justify-between bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-amber-950/30 border border-slate-700/50 hover:border-cyan-400/80 rounded-xl p-2 sm:px-4 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">Tài Trợ</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    🎁 Nhận Ngay 500 Cyber Coins & Giftcode Free VIP!
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">Khám phá vũ trụ game đỉnh cao & quà tặng hấp dẫn mỗi ngày.</p>
              </div>
            </div>
            <button className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-cyan-500 text-black group-hover:bg-cyan-400 transition-all shadow-md group-hover:shadow-cyan-500/50">
              <span>NHẬN NGAY</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <button 
            onClick={() => {
              sound.playClick();
              setIsCollapsed(true);
            }}
            aria-label="Đóng quảng cáo"
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Header Banner (728x90 / Mobile 320x50)
  if (slot === 'headerLeaderboard') {
    return (
      <div className={`w-full max-w-5xl mx-auto my-3 px-3 ${className}`}>
        <div 
          onClick={handleMockClick}
          className="relative overflow-hidden bg-gradient-to-r from-[#0d1222] via-[#16132b] to-[#0e1628] border border-cyan-500/30 hover:border-cyan-400 rounded-xl p-3 sm:py-3.5 sm:px-6 cursor-pointer group transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] animate-shimmer"
        >
          <div className="absolute top-1 right-2 text-[9px] font-mono-tech text-slate-500 tracking-wider">ADVERTISEMENT • 728x90</div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded">Hot Event</span>
                  <h4 className="text-xs sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    🚀 Server Game Siêu Mượt - Không Lag, 100% Free To Play
                  </h4>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  Đăng ký nhận ngay gói quà tân thủ trị giá 200k & miễn phí quay gacha!
                </p>
              </div>
            </div>
            <div className="shrink-0 hidden md:block">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg group-hover:scale-105 transition-all">
                <span>Khám Phá</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar Skyscraper (160x600 / 300x600)
  if (slot === 'sidebarSkyscraper') {
    return (
      <div 
        onClick={handleMockClick}
        className={`w-full bg-gradient-to-b from-[#0e1222] via-[#141029] to-[#0b0e1a] border border-purple-500/30 hover:border-purple-400 rounded-2xl p-4 text-center cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] group relative overflow-hidden ${className}`}
      >
        <div className="text-[9px] font-mono-tech text-slate-500 mb-3 tracking-widest uppercase">Sponsored • 300x600</div>
        
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4 shadow-xl group-hover:scale-110 transition-transform">
          <Sparkles className="w-8 h-8" />
        </div>

        <h4 className="font-display text-sm font-bold text-white group-hover:text-purple-300 mb-2 transition-colors">
          ⚡ TỐI ƯU HÓA GAME 120 FPS
        </h4>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Tăng tốc độ duyệt web, giảm giật lag 0ms & nhận skin chiến cơ Neon độc quyền!
        </p>

        <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-3 mb-4">
          <div className="text-[11px] text-purple-300 font-bold">MÃ KHUYẾN MÃI:</div>
          <div className="text-sm font-mono-tech font-bold text-amber-400 tracking-wider">NEXUS2026</div>
        </div>

        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs flex items-center justify-center gap-2 group-hover:brightness-110 transition-all shadow-lg">
          <span>NHẬN ƯU ĐÃI</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Game Over / Modal Banner (300x250)
  return (
    <div 
      onClick={handleMockClick}
      className={`w-full max-w-sm mx-auto bg-gradient-to-br from-[#0e1628] to-[#17112c] border border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-4 text-center cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] group ${className}`}
    >
      <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-500 mb-2">
        <span className="text-cyan-400 font-bold uppercase">Quảng Cáo Tài Trợ</span>
        <span>300 x 250</span>
      </div>
      <div className="py-2">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white mb-2 group-hover:rotate-6 transition-transform shadow-lg">
          <Sparkles className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-white group-hover:text-cyan-300 text-sm mb-1 transition-colors">
          🔥 Tải Game & Nhận 1000 Kim Cương
        </h4>
        <p className="text-xs text-slate-400 mb-3">Tham gia giải đấu Nexus Cup tuần này với tổng giải thưởng cực khủng!</p>
        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs group-hover:bg-cyan-400 transition-all">
          <span>XEM CHI TIẾT</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
