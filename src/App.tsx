import React, { useState, useEffect } from 'react';
import type { GameId, PlayerStats, Quest } from './types';
import {
  loadPlayerStats,
  savePlayerStats,
  loadQuests,
  saveQuests,
} from './utils/storage';
import { sound } from './utils/soundEngine';
import { ADS_CONFIG } from './config/ads.config';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GameHubLobby } from './components/layout/GameHubLobby';
import { NeonSurge } from './components/games/NeonSurge';
import { Quantum2048 } from './components/games/Quantum2048';
import { ReflexMatrix } from './components/games/ReflexMatrix';
import { LuckyWheelModal } from './components/gacha/LuckyWheelModal';
import { SkinShopModal } from './components/shop/SkinShopModal';
import { QuestsModal } from './components/quests/QuestsModal';
import { LeaderboardModal } from './components/leaderboard/LeaderboardModal';
import { RewardedAdModal } from './components/ads/RewardedAdModal';

export const App: React.FC = () => {
  // Global States
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(loadPlayerStats);
  const [quests, setQuests] = useState<Quest[]>(loadQuests);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Modal States
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Generic Rewarded Ad Modal State
  const [genericAdConfig, setGenericAdConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onClaim: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onClaim: () => {},
  });

  // 🎯 KÍCH HOẠT QUẢNG CÁO MONETAG TRÊN TOÀN BỘ MÀN HÌNH (MỌI VÙNG CHẠM/CLICK)
  useEffect(() => {
    let globalClickCount = 0;
    const maxDirectPopClicks = 2; // Số lần click đầu tiên trên toàn màn hình sẽ kích hoạt mở ad tab

    const handleGlobalInteraction = (e: MouseEvent | TouchEvent) => {
      // 1. Cho phép sự kiện tương tác tự nhiên lan truyền để Monetag Multitag bắt được 100%
      const target = e.target as HTMLElement | null;

      // Nếu click vào các nút đóng modal hoặc nút không muốn bị cản trở thì vẫn kích hoạt
      if (globalClickCount < maxDirectPopClicks && ADS_CONFIG.directLinkUrl) {
        // Tránh trùng lặp nếu click vào nút đã có 3-click ad gate riêng
        if (!target?.closest('button') && !target?.closest('a')) {
          globalClickCount++;
          try {
            window.open(ADS_CONFIG.directLinkUrl, '_blank', 'noopener,noreferrer');
          } catch (err) {
            console.warn('Monetag screen trigger error', err);
          }
        }
      }
    };

    // Đăng ký capture phase để nhận mọi sự kiện chạm/click trên toàn màn hình (Background, Canvas, Header, Footer...)
    window.addEventListener('click', handleGlobalInteraction, { capture: true, passive: true });
    window.addEventListener('touchstart', handleGlobalInteraction, { capture: true, passive: true });

    return () => {
      window.removeEventListener('click', handleGlobalInteraction, { capture: true });
      window.removeEventListener('touchstart', handleGlobalInteraction, { capture: true });
    };
  }, []);

  // Save changes to localStorage
  const handleUpdateStats = (newStats: Partial<PlayerStats>) => {
    setPlayerStats((prev) => {
      const updated = { ...prev, ...newStats };
      savePlayerStats(updated);
      return updated;
    });
  };

  const handleUpdateQuests = (newQuests: Quest[]) => {
    setQuests(newQuests);
    saveQuests(newQuests);
  };

  const handleToggleMute = () => {
    const m = sound.toggleMute();
    setIsMuted(m);
  };

  const triggerGenericRewardedAd = (
    title: string,
    description: string,
    onClaim: () => void
  ) => {
    setGenericAdConfig({
      isOpen: true,
      title,
      description,
      onClaim,
    });
  };

  return (
    <div className="min-h-screen bg-[#07080f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        playerStats={playerStats}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenLuckyWheel={() => setIsLuckyWheelOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenQuests={() => setIsQuestsOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenGetCoinsAd={() => {
          triggerGenericRewardedAd(
            'NẠP 250 COINS MIỄN PHÍ',
            'Nhận ngay 250 Cyber Coins vàng từ nhà tài trợ!',
            () => {
              handleUpdateStats({ coins: playerStats.coins + 250 });
            }
          );
        }}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeGame === null && (
          <GameHubLobby
            playerStats={playerStats}
            onSelectGame={(gameId) => setActiveGame(gameId)}
            onOpenLuckyWheel={() => setIsLuckyWheelOpen(true)}
            onOpenShop={() => setIsShopOpen(true)}
            onTriggerRewardedAd={triggerGenericRewardedAd}
            onUpdateStats={handleUpdateStats}
          />
        )}

        {activeGame === 'neon-surge' && (
          <div className="max-w-4xl mx-auto px-3 py-4">
            <NeonSurge
              playerStats={playerStats}
              onUpdateStats={handleUpdateStats}
              onBackToLobby={() => setActiveGame(null)}
            />
          </div>
        )}

        {activeGame === 'quantum-2048' && (
          <div className="max-w-4xl mx-auto px-3 py-4">
            <Quantum2048
              playerStats={playerStats}
              onUpdateStats={handleUpdateStats}
              onBackToLobby={() => setActiveGame(null)}
            />
          </div>
        )}

        {activeGame === 'reflex-matrix' && (
          <div className="max-w-4xl mx-auto px-3 py-4">
            <ReflexMatrix
              playerStats={playerStats}
              onUpdateStats={handleUpdateStats}
              onBackToLobby={() => setActiveGame(null)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <LuckyWheelModal
        isOpen={isLuckyWheelOpen}
        playerStats={playerStats}
        onUpdateStats={handleUpdateStats}
        onClose={() => setIsLuckyWheelOpen(false)}
      />

      <SkinShopModal
        isOpen={isShopOpen}
        playerStats={playerStats}
        onUpdateStats={handleUpdateStats}
        onClose={() => setIsShopOpen(false)}
      />

      <QuestsModal
        isOpen={isQuestsOpen}
        quests={quests}
        playerStats={playerStats}
        onUpdateStats={handleUpdateStats}
        onUpdateQuests={handleUpdateQuests}
        onClose={() => setIsQuestsOpen(false)}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        playerStats={playerStats}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* Global Generic Rewarded Ad Modal */}
      <RewardedAdModal
        isOpen={genericAdConfig.isOpen}
        title={genericAdConfig.title}
        rewardDescription={genericAdConfig.description}
        onRewardClaimed={genericAdConfig.onClaim}
        onClose={() =>
          setGenericAdConfig((prev) => ({ ...prev, isOpen: false }))
        }
      />
    </div>
  );
};

export default App;
