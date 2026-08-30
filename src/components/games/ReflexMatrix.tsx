import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../../utils/soundEngine';
import { AdBanner } from '../ads/AdBanner';
import { RewardedAdModal } from '../ads/RewardedAdModal';
import { Play, RotateCcw, Zap, Heart, Trophy, ArrowLeft, Clock } from 'lucide-react';
import type { PlayerStats } from '../../types';

interface ReflexMatrixProps {
  playerStats: PlayerStats;
  onUpdateStats: (newStats: Partial<PlayerStats>) => void;
  onBackToLobby: () => void;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface Crystal {
  x: number;
  y: number;
  radius: number;
  color: string;
}

export const ReflexMatrix: React.FC<ReflexMatrixProps> = ({
  playerStats,
  onUpdateStats,
  onBackToLobby,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [dataFragments, setDataFragments] = useState(0);
  const [hasRevived, setHasRevived] = useState(false);

  // Rewarded Ad states
  const [adModalConfig, setAdModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'revive' | 'slow_mo' | 'triple_xp';
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionType: 'revive',
  });

  const stateRef = useRef({
    px: 200,
    py: 200,
    targetPx: 200,
    targetPy: 200,
    bullets: [] as Bullet[],
    crystals: [] as Crystal[],
    gameTime: 0,
    survivalVal: 0,
    fragmentsVal: 0,
    invincibleTimer: 0,
    slowMoTimer: 0,
  });

  const startGame = () => {
    sound.playPowerup();
    setIsPlaying(true);
    setIsGameOver(false);
    setSurvivalTime(0);
    setDataFragments(0);
    setHasRevived(false);

    const canvas = canvasRef.current;
    const w = canvas ? canvas.width : 400;
    const h = canvas ? canvas.height : 400;

    stateRef.current = {
      px: w / 2,
      py: h / 2,
      targetPx: w / 2,
      targetPy: h / 2,
      bullets: [],
      crystals: [],
      gameTime: 0,
      survivalVal: 0,
      fragmentsVal: 0,
      invincibleTimer: 60,
      slowMoTimer: 0,
    };
  };

  // Touch & Mouse Event Handling for movement
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    stateRef.current.targetPx = x;
    stateRef.current.targetPy = y;
  }, []);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      if (canvas.parentElement) {
        const size = Math.min(canvas.parentElement.clientWidth, 480);
        canvas.width = size;
        canvas.height = size;
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const render = () => {
      const st = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Dark Matrix Arena Background
      ctx.fillStyle = '#060812';
      ctx.fillRect(0, 0, w, h);

      // Draw Concentric Radar Rings
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      const center = w / 2;
      for (let r = 40; r < center; r += 45) {
        ctx.beginPath();
        ctx.arc(center, center, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(center, 0);
      ctx.lineTo(center, h);
      ctx.moveTo(0, center);
      ctx.lineTo(w, center);
      ctx.stroke();

      if (isPlaying && !isGameOver) {
        st.gameTime += 1;
        if (st.slowMoTimer > 0) st.slowMoTimer -= 1;
        if (st.invincibleTimer > 0) st.invincibleTimer -= 1;

        if (st.gameTime % 60 === 0) {
          st.survivalVal += 1;
          setSurvivalTime(st.survivalVal);
        }

        // Smooth Lerp player position
        st.px += (st.targetPx - st.px) * 0.3;
        st.py += (st.targetPy - st.py) * 0.3;

        // Keep inside bounds
        st.px = Math.max(16, Math.min(w - 16, st.px));
        st.py = Math.max(16, Math.min(h - 16, st.py));

        // Spawn Bullets from 4 Edges
        const speedScale = st.slowMoTimer > 0 ? 0.5 : 1;
        const spawnInterval = Math.max(12, 35 - Math.floor(st.survivalVal / 2));

        if (st.gameTime % spawnInterval === 0) {
          const side = Math.floor(Math.random() * 4); // 0: Top, 1: Right, 2: Bottom, 3: Left
          let bx = 0, by = 0;
          if (side === 0) { bx = Math.random() * w; by = 0; }
          else if (side === 1) { bx = w; by = Math.random() * h; }
          else if (side === 2) { bx = Math.random() * w; by = h; }
          else { bx = 0; by = Math.random() * h; }

          // Aim roughly towards player with slight jitter
          const angle = Math.atan2(st.py - by, st.px - bx) + (Math.random() - 0.5) * 0.3;
          const bulletSpeed = (3.5 + Math.min(st.survivalVal * 0.1, 5)) * speedScale;

          st.bullets.push({
            x: bx,
            y: by,
            vx: Math.cos(angle) * bulletSpeed,
            vy: Math.sin(angle) * bulletSpeed,
            radius: Math.random() > 0.8 ? 8 : 5,
            color: Math.random() > 0.6 ? '#f43f5e' : '#ec4899',
          });
        }

        // Spawn Crystals
        if (st.gameTime % 70 === 0 && st.crystals.length < 5) {
          st.crystals.push({
            x: Math.random() * (w - 60) + 30,
            y: Math.random() * (h - 60) + 30,
            radius: 8,
            color: '#06b6d4',
          });
        }

        // Update Bullets
        for (let i = st.bullets.length - 1; i >= 0; i--) {
          const b = st.bullets[i];
          b.x += b.vx * speedScale;
          b.y += b.vy * speedScale;

          // Check Player Hit
          const dist = Math.hypot(st.px - b.x, st.py - b.y);
          if (dist < b.radius + 10 && st.invincibleTimer <= 0) {
            sound.playGameOver();
            setIsGameOver(true);
            setIsPlaying(false);

            const newHigh = Math.max(playerStats.highScores['reflex-matrix'], st.survivalVal);
            onUpdateStats({
              coins: playerStats.coins + st.fragmentsVal * 5 + st.survivalVal * 2,
              highScores: {
                ...playerStats.highScores,
                'reflex-matrix': newHigh,
              },
              xp: playerStats.xp + st.survivalVal * 10,
            });
            break;
          }

          if (b.x < -20 || b.x > w + 20 || b.y < -20 || b.y > h + 20) {
            st.bullets.splice(i, 1);
          }
        }

        // Update Crystals
        for (let i = st.crystals.length - 1; i >= 0; i--) {
          const c = st.crystals[i];
          const dist = Math.hypot(st.px - c.x, st.py - c.y);
          if (dist < c.radius + 14) {
            sound.playCollect();
            st.fragmentsVal += 1;
            setDataFragments(st.fragmentsVal);
            st.crystals.splice(i, 1);
          }
        }
      }

      // Draw Crystals
      st.crystals.forEach((c) => {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = c.color;
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Bullets
      st.bullets.forEach((b) => {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = b.color;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Player Core
      ctx.save();
      if (st.invincibleTimer > 0 && Math.floor(st.invincibleTimer / 4) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      // Pulsing Neon Shield
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#06b6d4';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(st.px, st.py, 16, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(st.px, st.py, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(st.px, st.py, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
    };
  }, [isPlaying, isGameOver, playerStats, onUpdateStats]);

  // Rewarded Ad Triggers
  const handleTriggerRevive = () => {
    sound.playClick();
    setAdModalConfig({
      isOpen: true,
      title: 'HỒI SINH MA TRẬN 100%',
      description: 'Hồi sinh ngay lập tức với khiên bảo hộ 3s!',
      actionType: 'revive',
    });
  };

  const handleTriggerSlowMo = () => {
    sound.playClick();
    setAdModalConfig({
      isOpen: true,
      title: 'KÍCH HOẠT BULLET-TIME',
      description: 'Làm chậm toàn bộ đạn 50% trong 10 giây!',
      actionType: 'slow_mo',
    });
  };

  const handleRewardClaimed = () => {
    if (adModalConfig.actionType === 'revive') {
      setHasRevived(true);
      setIsGameOver(false);
      setIsPlaying(true);
      stateRef.current.invincibleTimer = 180;
      stateRef.current.bullets = []; // Clear current bullets
    } else if (adModalConfig.actionType === 'slow_mo') {
      stateRef.current.slowMoTimer = 600; // 10 seconds
      sound.playPowerup();
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center select-none py-2">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between bg-[#0e1224]/90 border border-cyan-500/30 rounded-2xl px-4 py-2.5 mb-3 backdrop-blur-md">
        <button
          onClick={() => {
            sound.playClick();
            onBackToLobby();
          }}
          className="flex items-center gap-1.5 text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>SẢNH GAME</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono-tech">Sống Sót</span>
            <div className="text-lg font-display font-extrabold text-cyan-300">{survivalTime}s</div>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono-tech">Mảnh Dữ Liệu</span>
            <div className="text-base font-display font-bold text-amber-400">+{dataFragments} 💎</div>
          </div>
        </div>

        <div className="text-xs font-mono-tech text-amber-400 flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5" />
          <span>TOP: {playerStats.highScores['reflex-matrix']}s</span>
        </div>
      </div>

      {/* Bullet-Time Booster (Rewarded Ad) */}
      <div className="w-full mb-3">
        <button
          onClick={handleTriggerSlowMo}
          disabled={!isPlaying || isGameOver}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-950/70 to-blue-950/70 border border-cyan-500/40 hover:border-cyan-300 text-cyan-200 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 disabled:cursor-not-allowed group transition-all"
        >
          <Clock className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>⚡ KÍCH HOẠT LÀM CHẬM ĐẠN 10S (XEM QC)</span>
        </button>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full max-w-[480px] aspect-square rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.2)] bg-[#050710] touch-none">
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerMove}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Start Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mb-4 text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              <Zap className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="font-display text-2xl font-extrabold text-white mb-2 text-glow-cyan">
              REFLEX MATRIX
            </h2>
            <p className="text-xs text-slate-300 max-w-xs mb-6">
              Di chuyển chuột hoặc vuốt ngón tay để né bão đạn laser 360° & thu thập pha lê dữ liệu!
            </p>

            <button
              onClick={startGame}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-display font-bold text-base shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>BẮT ĐẦU NÉ ĐẠN</span>
            </button>
          </div>
        )}

        {/* Game Over Modal */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
            <div className="w-full max-w-xs space-y-3">
              <div className="text-red-400 font-display text-2xl font-black tracking-wider">
                CORE TRUY CẬP BỊ HỦY!
              </div>

              <div className="bg-[#0f1426] border border-cyan-500/30 rounded-2xl p-4">
                <div className="text-xs text-slate-400 mb-1">Thời Gian Sống Sót</div>
                <div className="text-3xl font-display font-bold text-cyan-300 mb-2">{survivalTime} Giây</div>
                <div className="text-xs text-amber-400 font-mono-tech">+{dataFragments * 5 + survivalTime * 2} Coins nhận được</div>
              </div>

              {!hasRevived && (
                <button
                  onClick={handleTriggerRevive}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs uppercase shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-current text-white animate-pulse" />
                  <span>🔥 HỒI SINH TIẾP TỤC (XEM QC)</span>
                </button>
              )}

              <button
                onClick={startGame}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>CHƠI LẠI</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <AdBanner slot="gameOverBanner" className="mt-4" />

      {/* Rewarded Ad Modal */}
      <RewardedAdModal
        isOpen={adModalConfig.isOpen}
        title={adModalConfig.title}
        rewardDescription={adModalConfig.description}
        onRewardClaimed={handleRewardClaimed}
        onClose={() => setAdModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
