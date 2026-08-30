import React, { useState } from 'react';
import { sound } from '../../utils/soundEngine';
import { SHOP_CATALOG } from '../../utils/storage';
import { RewardedAdModal } from '../ads/RewardedAdModal';
import { X, Sparkles, Check, Lock, Play, ShoppingBag } from 'lucide-react';
import type { PlayerStats, ShopItem } from '../../types';
import confetti from 'canvas-confetti';

interface SkinShopModalProps {
  isOpen: boolean;
  playerStats: PlayerStats;
  onUpdateStats: (newStats: Partial<PlayerStats>) => void;
  onClose: () => void;
}

export const SkinShopModal: React.FC<SkinShopModalProps> = ({
  isOpen,
  playerStats,
  onUpdateStats,
  onClose,
}) => {
  const [selectedAdSkin, setSelectedAdSkin] = useState<ShopItem | null>(null);

  if (!isOpen) return null;

  const handleBuyItem = (item: ShopItem) => {
    sound.playClick();
    if (item.currency === 'coins') {
      if (playerStats.coins < item.price) return;
      onUpdateStats({
        coins: playerStats.coins - item.price,
        unlockedSkins: [...playerStats.unlockedSkins, item.id],
        activeSkin: item.id,
      });
    } else {
      if (playerStats.diamonds < item.price) return;
      onUpdateStats({
        diamonds: playerStats.diamonds - item.price,
        unlockedSkins: [...playerStats.unlockedSkins, item.id],
        activeSkin: item.id,
      });
    }

    sound.playVictory();
    confetti({ particleCount: 60, spread: 60 });
  };

  const handleEquip = (itemId: string) => {
    sound.playClick();
    onUpdateStats({ activeSkin: itemId });
  };

  const handleTriggerAdUnlock = (item: ShopItem) => {
    sound.playClick();
    setSelectedAdSkin(item);
  };

  const handleClaimAdSkin = () => {
    if (!selectedAdSkin) return;
    onUpdateStats({
      unlockedSkins: [...playerStats.unlockedSkins, selectedAdSkin.id],
      activeSkin: selectedAdSkin.id,
    });
    setSelectedAdSkin(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-[#11162a] via-[#0d1020] to-[#080a14] border border-cyan-500/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-left overflow-y-auto">
        
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
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              KHO VŨ KHÍ & SKIN
            </h3>
            <p className="text-xs text-slate-400">Tùy biến chiến cơ Neon và hiệu ứng tia sáng độc quyền</p>
          </div>
        </div>

        {/* Currency balances */}
        <div className="flex items-center gap-4 my-4 p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <span>🪙 {playerStats.coins} Coins</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
            <span>💎 {playerStats.diamonds} Diamonds</span>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-2">
          {SHOP_CATALOG.map((item) => {
            const isUnlocked = playerStats.unlockedSkins.includes(item.id);
            const isEquipped = playerStats.activeSkin === item.id;
            const canAfford =
              item.currency === 'coins'
                ? playerStats.coins >= item.price
                : playerStats.diamonds >= item.price;

            return (
              <div
                key={item.id}
                className={`relative rounded-2xl p-4 border transition-all ${
                  isEquipped
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : isUnlocked
                    ? 'bg-slate-900/60 border-slate-700'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                {/* Item Preview Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-md shrink-0"
                    style={{
                      backgroundColor: `${item.color}22`,
                      borderColor: item.color,
                      boxShadow: `0 0 15px ${item.glowColor}`,
                    }}
                  >
                    <Sparkles className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <span className="text-[10px] uppercase font-mono-tech tracking-wider text-slate-400">
                      {item.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-4 min-h-[32px] line-clamp-2">
                  {item.description}
                </p>

                {/* Actions */}
                {isEquipped ? (
                  <div className="w-full py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>ĐANG TRANG BỊ</span>
                  </div>
                ) : isUnlocked ? (
                  <button
                    onClick={() => handleEquip(item.id)}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-black text-white text-xs font-bold transition-colors"
                  >
                    TRANG BỊ
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleBuyItem(item)}
                      disabled={!canAfford}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all shadow-md"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        MUA ({item.price} {item.currency === 'coins' ? 'Coins 🪙' : 'Gems 💎'})
                      </span>
                    </button>

                    {/* 🎯 HIGH-CTR REWARDED AD BUTTON: UNLOCK SKIN FREE WITH AD */}
                    {item.canUnlockWithAd && (
                      <button
                        onClick={() => handleTriggerAdUnlock(item)}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-[11px] uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.01] transition-transform animate-shimmer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>MỞ KHÓA FREE (XEM QC)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewarded Ad Submodal */}
      <RewardedAdModal
        isOpen={Boolean(selectedAdSkin)}
        title={`MỞ KHÓA SKIN ${selectedAdSkin?.name.toUpperCase()}`}
        rewardDescription={`Sở hữu vĩnh viễn ${selectedAdSkin?.name}!`}
        onRewardClaimed={handleClaimAdSkin}
        onClose={() => setSelectedAdSkin(null)}
      />
    </div>
  );
};
