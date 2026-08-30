import React from 'react';
import { AdBanner } from '../ads/AdBanner';
import { Sparkles, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#05060b] border-t border-cyan-500/20 pt-10 pb-24 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-display font-black text-white text-base tracking-wider">
                NEXUS ARCADE
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Cổng trò chơi trực tuyến công nghệ cao thuần Frontend. Tốc độ khung hình 60FPS mượt mà trên mọi thiết bị máy tính và điện thoại.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono-tech">
              <Shield className="w-3.5 h-3.5" />
              <span>BẢO MẬT & TỐI ƯU HÓA HOÀN TOÀN 2026</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Trò Chơi Nổi Bật
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-cyan-300 cursor-pointer">⚡ Neon Surge Runner</li>
              <li className="hover:text-purple-300 cursor-pointer">🧠 Quantum 2048 Fusion</li>
              <li className="hover:text-amber-300 cursor-pointer">🎯 Reflex Matrix Laser</li>
              <li className="hover:text-emerald-300 cursor-pointer">🎰 Vòng Quay May Mắn</li>
            </ul>
          </div>

          {/* Monetization & Domain Info */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Hệ Thống & Tên Miền
            </h4>
            <p className="text-xs text-slate-400 mb-2 leading-relaxed">
              Trang web tích hợp sẵn hệ thống Ads Monetization, hỗ trợ kết nối đa mạng lưới quảng cáo.
            </p>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono-tech text-cyan-300">
              <span>Domain: freepro.online</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 NEXUS ARCADE • Phát triển bởi Chinhan Dev • Mọi quyền được bảo lưu.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Chính Sách Bảo Mật</span>
            <span className="hover:text-slate-300 cursor-pointer">Điều Khoản Sử Dụng</span>
            <span className="hover:text-slate-300 cursor-pointer">Liên Hệ Quảng Cáo</span>
          </div>
        </div>
      </div>

      {/* 🎯 STICKY BOTTOM AD BANNER */}
      <AdBanner slot="stickyBottom" />
    </footer>
  );
};
