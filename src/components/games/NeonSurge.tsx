import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../../utils/soundEngine';
import { AdBanner } from '../ads/AdBanner';
import { RewardedAdModal } from '../ads/RewardedAdModal';
import { Play, RotateCcw, Zap, Heart, Shield, Sparkles, Trophy, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import type { PlayerStats } from '../../types';

interface NeonSurgeProps {
  playerStats: PlayerStats;
  onUpdateStats: (newStats: Partial<PlayerStats>) => void;
  onBackToLobby: () => void;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'laser' | 'mine' | 'barrier';
  color: string;
}

interface Item {
  x: number;
  y: number;
  size: number;
  type: 'coin' | 'shield' | 'multiplier' | 'magnet';
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export const NeonSurge: React.FC<NeonSurgeProps> = ({
  playerStats,
  onUpdateStats,
  onBackToLobby,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [hasRevived, setHasRevived] = useState(false);
  const [activeShield, setActiveShield] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Ad Modals
  const [adModalConfig, setAdModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'revive' | 'double_score';
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionType: 'revive',
  });

  // Game Engine Internal Variables
  const stateRef = useRef({
    playerLane: 1, // 0: Left, 1: Center, 2: Right
    playerX: 0,
    targetX: 0,
    playerY: 0,
    speed: 6,
    obstacles: [] as Obstacle[],
    items: [] as Item[],
    particles: [] as Particle[],
    laneWidth: 100,
    gameTime: 0,
    scoreVal: 0,
    coinsVal: 0,
    shieldActive: false,
    invincibleTimer: 0,
    magnetTimer: 0,
    multiplierTimer: 0,
  });

  // Initialize Game
  const startGame = () => {
    sound.playPowerup();
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setCoinsEarned(0);
    setHasRevived(false);
    setActiveShield(false);
    setMultiplier(1);

    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 400;
    const height = canvas ? canvas.height : 600;

    stateRef.current = {
      playerLane: 1,
      playerX: width / 2,
      targetX: width / 2,
      playerY: height - 100,
      speed: 6,
      obstacles: [],
      items: [],
      particles: [],
      laneWidth: width / 3,
      gameTime: 0,
      scoreVal: 0,
      coinsVal: 0,
      shieldActive: false,
      invincibleTimer: 0,
      magnetTimer: 0,
      multiplierTimer: 0,
    };
  };

  const handleLaneChange = useCallback((direction: 'left' | 'right') => {
    if (!isPlaying || isGameOver) return;
    const st = stateRef.current;
    if (direction === 'left' && st.playerLane > 0) {
      st.playerLane -= 1;
      sound.playJump();
    } else if (direction === 'right' && st.playerLane < 2) {
      st.playerLane += 1;
      sound.playJump();
    }
  }, [isPlaying, isGameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleLaneChange('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleLaneChange('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLaneChange]);

  // Main 60FPS Game Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to container
    const updateCanvasSize = () => {
      if (canvas.parentElement) {
        canvas.width = Math.min(canvas.parentElement.clientWidth, 480);
        canvas.height = 620;
        stateRef.current.laneWidth = canvas.width / 3;
        stateRef.current.playerY = canvas.height - 110;
      }
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const render = () => {
      const st = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const laneWidth = width / 3;

      // Clear Screen with Cyberpunk Dark Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#060814');
      bgGrad.addColorStop(0.5, '#0b0f24');
      bgGrad.addColorStop(1, '#050711');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Perspective Grid Lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1.5;
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * laneWidth, 0);
        ctx.lineTo(i * laneWidth, height);
        ctx.stroke();
      }

      // Scrolling Horizontal Road Grid Markers
      const gridOffset = (st.gameTime * st.speed * 2) % 40;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
      for (let y = gridOffset; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (isPlaying && !isGameOver) {
        st.gameTime += 1;
        st.speed = Math.min(6 + st.gameTime / 600, 14);

        // Update Timers
        if (st.invincibleTimer > 0) st.invincibleTimer -= 1;
        if (st.magnetTimer > 0) st.magnetTimer -= 1;
        if (st.multiplierTimer > 0) {
          st.multiplierTimer -= 1;
          if (st.multiplierTimer === 0) setMultiplier(1);
        }

        // Score update
        if (st.gameTime % 4 === 0) {
          const add = (st.multiplierTimer > 0 ? 2 : 1);
          st.scoreVal += add;
          setScore(st.scoreVal);
        }

        // Target X Lerp
        st.targetX = st.playerLane * laneWidth + laneWidth / 2;
        st.playerX += (st.targetX - st.playerX) * 0.25;

        // Spawn Obstacles
        if (st.gameTime % Math.max(35, 75 - Math.floor(st.speed * 3)) === 0) {
          const lane = Math.floor(Math.random() * 3);
          const typeRand = Math.random();
          let type: 'laser' | 'mine' | 'barrier' = 'laser';
          let color = '#ef4444';
          if (typeRand > 0.6) {
            type = 'mine';
            color = '#f59e0b';
          } else if (typeRand > 0.3) {
            type = 'barrier';
            color = '#ec4899';
          }

          st.obstacles.push({
            x: lane * laneWidth + 15,
            y: -50,
            width: laneWidth - 30,
            height: type === 'barrier' ? 24 : 18,
            type,
            color,
          });
        }

        // Spawn Items (Coins, Shields, Multipliers)
        if (st.gameTime % 50 === 0) {
          const lane = Math.floor(Math.random() * 3);
          const rand = Math.random();
          let type: 'coin' | 'shield' | 'multiplier' | 'magnet' = 'coin';
          let color = '#06b6d4';

          if (rand > 0.92) {
            type = 'shield';
            color = '#10b981';
          } else if (rand > 0.82) {
            type = 'multiplier';
            color = '#a855f7';
          } else if (rand > 0.72) {
            type = 'magnet';
            color = '#f59e0b';
          }

          st.items.push({
            x: lane * laneWidth + laneWidth / 2,
            y: -30,
            size: 14,
            type,
            color,
          });
        }

        // Update Obstacles
        for (let i = st.obstacles.length - 1; i >= 0; i--) {
          const obs = st.obstacles[i];
          obs.y += st.speed;

          // Collision Detection with Player
          const playerRadius = 20;
          const hit =
            st.playerX + playerRadius > obs.x &&
            st.playerX - playerRadius < obs.x + obs.width &&
            st.playerY + playerRadius > obs.y &&
            st.playerY - playerRadius < obs.y + obs.height;

          if (hit && st.invincibleTimer <= 0) {
            if (st.shieldActive) {
              // Shield absorbs hit
              st.shieldActive = false;
              setActiveShield(false);
              st.invincibleTimer = 60; // 1s invincibility
              sound.playHit();
              st.obstacles.splice(i, 1);
              continue;
            } else {
              // Game Over
              sound.playGameOver();
              setIsGameOver(true);
              setIsPlaying(false);

              // Update High Score & Coins in storage
              const newHigh = Math.max(playerStats.highScores['neon-surge'], st.scoreVal);
              onUpdateStats({
                coins: playerStats.coins + st.coinsVal,
                highScores: {
                  ...playerStats.highScores,
                  'neon-surge': newHigh,
                },
                xp: playerStats.xp + Math.floor(st.scoreVal / 2),
              });
              break;
            }
          }

          if (obs.y > height + 50) {
            st.obstacles.splice(i, 1);
          }
        }

        // Update Items & Magnet effect
        for (let i = st.items.length - 1; i >= 0; i--) {
          const item = st.items[i];
          item.y += st.speed;

          if (st.magnetTimer > 0) {
            const dx = st.playerX - item.x;
            const dy = st.playerY - item.y;
            item.x += dx * 0.15;
            item.y += dy * 0.15;
          }

          // Pick up collision
          const dist = Math.hypot(st.playerX - item.x, st.playerY - item.y);
          if (dist < 32) {
            if (item.type === 'coin') {
              sound.playCollect();
              st.coinsVal += 5;
              st.scoreVal += 20;
              setCoinsEarned(st.coinsVal);
            } else if (item.type === 'shield') {
              sound.playPowerup();
              st.shieldActive = true;
              setActiveShield(true);
            } else if (item.type === 'multiplier') {
              sound.playPowerup();
              st.multiplierTimer = 360; // 6 seconds
              setMultiplier(2);
            } else if (item.type === 'magnet') {
              sound.playPowerup();
              st.magnetTimer = 360;
            }

            // Spawn Particles
            for (let p = 0; p < 8; p++) {
              st.particles.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: item.color,
                size: Math.random() * 4 + 2,
                life: 20,
              });
            }
            st.items.splice(i, 1);
            continue;
          }

          if (item.y > height + 50) {
            st.items.splice(i, 1);
          }
        }
      }

      // Draw Items
      st.items.forEach((item) => {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = item.color;
        ctx.fillStyle = item.color;

        ctx.beginPath();
        ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Obstacles
      st.obstacles.forEach((obs) => {
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = obs.color;
        ctx.fillStyle = obs.color;

        if (obs.type === 'laser') {
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.fillStyle = '#fff';
          ctx.fillRect(obs.x, obs.y + 4, obs.width, obs.height - 8);
        } else if (obs.type === 'mine') {
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.height, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 8);
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw Particles
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const p = st.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        if (p.life <= 0) st.particles.splice(i, 1);
      }

      // Draw Player Glider
      ctx.save();
      const px = st.playerX;
      const py = st.playerY;

      // Invincible flash
      if (st.invincibleTimer > 0 && Math.floor(st.invincibleTimer / 4) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      // Shield Aura
      if (st.shieldActive) {
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#10b981';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(px, py, 32, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Glider Body (Futuristic Arrowhead)
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#06b6d4';
      ctx.fillStyle = '#06b6d4';

      ctx.beginPath();
      ctx.moveTo(px, py - 24);
      ctx.lineTo(px + 22, py + 18);
      ctx.lineTo(px, py + 10);
      ctx.lineTo(px - 22, py + 18);
      ctx.closePath();
      ctx.fill();

      // Glider Inner Core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(px, py - 14);
      ctx.lineTo(px + 10, py + 12);
      ctx.lineTo(px - 10, py + 12);
      ctx.closePath();
      ctx.fill();

      // Thruster Trail Particles
      if (isPlaying && !isGameOver && Math.random() > 0.3) {
        st.particles.push({
          x: px + (Math.random() - 0.5) * 8,
          y: py + 16,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 4 + 3,
          color: Math.random() > 0.5 ? '#06b6d4' : '#a855f7',
          size: Math.random() * 3 + 2,
          life: 15,
        });
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isPlaying, isGameOver, playerStats, onUpdateStats]);

  // Rewarded Ad Actions
  const triggerReviveAd = () => {
    sound.playClick();
    setAdModalConfig({
      isOpen: true,
      title: 'HỒI SINH CẤP CỨU',
      description: 'Hồi sinh ngay lập tức với 100% khiên bảo vệ 3 giây!',
      actionType: 'revive',
    });
  };

  const triggerDoubleScoreAd = () => {
    sound.playClick();
    setAdModalConfig({
      isOpen: true,
      title: 'NHÂN ĐÔI ĐIỂM THƯỞNG 2X',
      description: `Nhận thêm +${coinsEarned} Coins & gấp đôi điểm xếp hạng!`,
      actionType: 'double_score',
    });
  };

  const handleRewardClaimed = () => {
    if (adModalConfig.actionType === 'revive') {
      setHasRevived(true);
      setIsGameOver(false);
      setIsPlaying(true);
      stateRef.current.invincibleTimer = 180; // 3s bất tử
      stateRef.current.shieldActive = true;
      setActiveShield(true);
    } else if (adModalConfig.actionType === 'double_score') {
      const extraCoins = coinsEarned;
      onUpdateStats({
        coins: playerStats.coins + extraCoins,
        xp: playerStats.xp + 200,
      });
      setCoinsEarned((prev) => prev * 2);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none py-2">
      {/* Top Game Bar */}
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
            <span className="text-[10px] text-slate-400 uppercase font-mono-tech">Điểm số</span>
            <div className="text-lg font-display font-extrabold text-cyan-300">{score}</div>
          </div>
          {multiplier > 1 && (
            <div className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400 text-purple-300 text-xs font-bold animate-pulse">
              2X MULTIPLIER
            </div>
          )}
          {activeShield && (
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>SHIELD</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const m = sound.toggleMute();
              setIsMuted(m);
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full max-w-[480px] h-[620px] rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.2)] bg-[#050710]">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Start Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mb-4 text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              <Zap className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2 text-glow-cyan">
              NEON SURGE
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mb-6">
              Dùng phím <strong className="text-cyan-400">A / D</strong> hoặc <strong className="text-cyan-400">Mũi Tên</strong> (hoặc bấm 2 bên màn hình) để né chướng ngại vật & nhặt Energy Cores!
            </p>

            <button
              onClick={startGame}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-display font-bold text-base shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>BẮT ĐẦU CHƠI</span>
            </button>

            {/* High score badge */}
            <div className="mt-6 flex items-center gap-2 text-xs font-mono-tech text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-full">
              <Trophy className="w-3.5 h-3.5" />
              <span>KỶ LỤC: {playerStats.highScores['neon-surge']} ĐIỂM</span>
            </div>
          </div>
        )}

        {/* Game Over Modal & High-CTR Ads */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center overflow-y-auto">
            <div className="w-full max-w-xs space-y-3">
              <div className="text-red-400 font-display text-2xl font-black tracking-wider animate-bounce">
                SYSTEM CRASH!
              </div>

              <div className="bg-[#0f1426] border border-cyan-500/30 rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-2 text-left mb-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono-tech">Điểm Đạt Được</span>
                    <div className="text-xl font-display font-bold text-white">{score}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono-tech">Coins Nhặt Được</span>
                    <div className="text-xl font-display font-bold text-amber-400">+{coinsEarned} 🪙</div>
                  </div>
                </div>
              </div>

              {/* 🎯 HIGH-CTR REWARDED AD BUTTON 1: REVIVE */}
              {!hasRevived && (
                <button
                  onClick={triggerReviveAd}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wide shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 animate-shimmer"
                >
                  <Heart className="w-4 h-4 fill-current text-white animate-pulse" />
                  <span>🔥 HỒI SINH 100% MÁU (XEM QC)</span>
                </button>
              )}

              {/* 🎯 HIGH-CTR REWARDED AD BUTTON 2: 2X MULTIPLIER */}
              <button
                onClick={triggerDoubleScoreAd}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs uppercase tracking-wide shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>⚡ NHÂN ĐÔI COINS & XP (XEM QC)</span>
              </button>

              {/* Play Again Button */}
              <button
                onClick={startGame}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>CHƠI LẠI NGAY</span>
              </button>

              {/* Embedded In-Game 300x250 Ad Banner */}
              <AdBanner slot="gameOverBanner" className="mt-2" />
            </div>
          </div>
        )}

        {/* Mobile On-Screen Tap Controls */}
        {isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex pointer-events-auto">
            <div
              onClick={() => handleLaneChange('left')}
              className="w-1/2 h-full active:bg-cyan-500/10 transition-colors"
            />
            <div
              onClick={() => handleLaneChange('right')}
              className="w-1/2 h-full active:bg-cyan-500/10 transition-colors"
            />
          </div>
        )}
      </div>

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
