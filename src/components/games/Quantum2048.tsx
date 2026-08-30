import React, { useState, useEffect, useCallback, useRef } from 'react';
import { sound } from '../../utils/soundEngine';
import { AdBanner } from '../ads/AdBanner';
import { RewardedAdModal } from '../ads/RewardedAdModal';
import { RotateCcw, Undo2, Bomb, ArrowLeft, Zap } from 'lucide-react';
import type { PlayerStats } from '../../types';
import confetti from 'canvas-confetti';

interface Quantum2048Props {
  playerStats: PlayerStats;
  onUpdateStats: (newStats: Partial<PlayerStats>) => void;
  onBackToLobby: () => void;
}

type Board = number[][];

const CORE_LABELS: Record<number, { label: string; bg: string; text: string; glow: string }> = {
  2: { label: 'BIT', bg: 'from-sky-500/20 to-sky-600/30', text: 'text-sky-300', glow: 'rgba(56, 189, 248, 0.4)' },
  4: { label: 'BYTE', bg: 'from-cyan-500/30 to-cyan-600/40', text: 'text-cyan-200', glow: 'rgba(6, 182, 212, 0.5)' },
  8: { label: 'KILO', bg: 'from-blue-600/40 to-indigo-600/50', text: 'text-blue-200', glow: 'rgba(59, 130, 246, 0.6)' },
  16: { label: 'MEGA', bg: 'from-indigo-600/50 to-purple-600/60', text: 'text-indigo-200', glow: 'rgba(99, 102, 241, 0.6)' },
  32: { label: 'GIGA', bg: 'from-purple-600/60 to-violet-600/70', text: 'text-purple-200', glow: 'rgba(168, 85, 247, 0.7)' },
  64: { label: 'TERA', bg: 'from-violet-600/70 to-fuchsia-600/80', text: 'text-fuchsia-200', glow: 'rgba(217, 70, 239, 0.75)' },
  128: { label: 'PETA', bg: 'from-fuchsia-600/80 to-pink-600/90', text: 'text-white', glow: 'rgba(236, 72, 153, 0.8)' },
  256: { label: 'EXA', bg: 'from-pink-600 to-rose-600', text: 'text-white', glow: 'rgba(244, 63, 94, 0.85)' },
  512: { label: 'ZETTA', bg: 'from-rose-600 to-amber-600', text: 'text-white', glow: 'rgba(245, 158, 11, 0.9)' },
  1024: { label: 'YOTTA', bg: 'from-amber-500 to-yellow-400', text: 'text-black', glow: 'rgba(234, 179, 8, 0.95)' },
  2048: { label: 'AI SINGULARITY', bg: 'from-emerald-400 via-teal-300 to-cyan-400', text: 'text-black font-black', glow: 'rgba(16, 185, 129, 1)' },
  4096: { label: 'QUANTUM GOD', bg: 'from-purple-400 via-pink-400 to-amber-400', text: 'text-black font-black', glow: 'rgba(255, 215, 0, 1)' },
};

export const Quantum2048: React.FC<Quantum2048Props> = ({
  playerStats,
  onUpdateStats,
  onBackToLobby,
}) => {
  const [board, setBoard] = useState<Board>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [previousBoard, setPreviousBoard] = useState<Board | null>(null);
  const [score, setScore] = useState(0);
  const [previousScore, setPreviousScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  // Touch Swipe tracking
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Rewarded Ad states
  const [adModalConfig, setAdModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'undo' | 'bomb' | 'revive';
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionType: 'undo',
  });

  const getEmptyCells = (b: Board) => {
    const empty: [number, number][] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) empty.push([r, c]);
      }
    }
    return empty;
  };

  const spawnRandomTile = (b: Board): Board => {
    const empty = getEmptyCells(b);
    if (empty.length === 0) return b;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    const newBoard = b.map((row) => [...row]);
    newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  };

  const initGame = () => {
    sound.playPowerup();
    let b: Board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    b = spawnRandomTile(b);
    b = spawnRandomTile(b);
    setBoard(b);
    setPreviousBoard(null);
    setScore(0);
    setIsGameOver(false);
    setHasWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const checkGameOver = (b: Board): boolean => {
    if (getEmptyCells(b).length > 0) return false;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = b[r][c];
        if (r < 3 && b[r + 1][c] === val) return false;
        if (c < 3 && b[r][c + 1] === val) return false;
      }
    }
    return true;
  };

  const move = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (isGameOver) return;

      let moved = false;
      let addedScore = 0;
      const newBoard = board.map((row) => [...row]);

      const slideAndMerge = (row: number[]): number[] => {
        let arr = row.filter((v) => v !== 0);
        for (let i = 0; i < arr.length - 1; i++) {
          if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            addedScore += arr[i];
            arr[i + 1] = 0;

            // Âm thanh hợp nhất lượng tử
            const tier = Math.log2(arr[i]);
            sound.playMerge(tier);

            if (arr[i] === 2048 && !hasWon) {
              setHasWon(true);
              sound.playVictory();
              confetti({ particleCount: 100, spread: 80 });
            }
          }
        }
        arr = arr.filter((v) => v !== 0);
        while (arr.length < 4) arr.push(0);
        return arr;
      };

      if (direction === 'left') {
        for (let r = 0; r < 4; r++) {
          const original = [...newBoard[r]];
          newBoard[r] = slideAndMerge(newBoard[r]);
          if (original.some((v, idx) => v !== newBoard[r][idx])) moved = true;
        }
      } else if (direction === 'right') {
        for (let r = 0; r < 4; r++) {
          const original = [...newBoard[r]];
          const reversed = [...newBoard[r]].reverse();
          newBoard[r] = slideAndMerge(reversed).reverse();
          if (original.some((v, idx) => v !== newBoard[r][idx])) moved = true;
        }
      } else if (direction === 'up') {
        for (let c = 0; c < 4; c++) {
          const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
          const merged = slideAndMerge(col);
          for (let r = 0; r < 4; r++) {
            if (newBoard[r][c] !== merged[r]) moved = true;
            newBoard[r][c] = merged[r];
          }
        }
      } else if (direction === 'down') {
        for (let c = 0; c < 4; c++) {
          const col = [newBoard[3][c], newBoard[2][c], newBoard[1][c], newBoard[0][c]];
          const merged = slideAndMerge(col);
          for (let r = 0; r < 4; r++) {
            if (newBoard[3 - r][c] !== merged[r]) moved = true;
            newBoard[3 - r][c] = merged[r];
          }
        }
      }

      if (moved) {
        setPreviousBoard(board);
        setPreviousScore(score);

        const spawned = spawnRandomTile(newBoard);
        const newTotalScore = score + addedScore;
        setBoard(spawned);
        setScore(newTotalScore);

        if (addedScore > 0) {
          onUpdateStats({
            coins: playerStats.coins + Math.floor(addedScore / 10),
            highScores: {
              ...playerStats.highScores,
              'quantum-2048': Math.max(playerStats.highScores['quantum-2048'], newTotalScore),
            },
          });
        }

        if (checkGameOver(spawned)) {
          sound.playGameOver();
          setIsGameOver(true);
        }
      }
    },
    [board, isGameOver, score, hasWon, playerStats, onUpdateStats]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        move('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        move('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        move('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        move('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // Touch gesture handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 30) {
      if (absX > absY) {
        move(dx > 0 ? 'right' : 'left');
      } else {
        move(dy > 0 ? 'down' : 'up');
      }
    }
    touchStartRef.current = null;
  };

  // Rewarded Ad handlers
  const handleTriggerUndoAd = () => {
    if (!previousBoard) return;
    sound.playClick();
    setAdModalConfig({
      isOpen: true,
      title: 'ĐẢO NGƯỢC THỜI GIAN',
      description: 'Khôi phục lại bước đi trước đó và tiếp tục trận đấu!',
      actionType: 'undo',
    });
  };

  const handleTriggerBombAd = () => {
    sound.playClick();
    setAdModalConfig({
      isOpen: true,
      title: 'KÍCH HOẠT BOM EMP',
      description: 'Quét sạch tất cả các khối rác cấp 2 & 4 trên bàn cờ!',
      actionType: 'bomb',
    });
  };

  const handleTriggerReviveAd = () => {
    sound.playClick();
    setAdModalConfig({
      isOpen: true,
      title: 'HỒI SINH MA TRẬN',
      description: 'Phá hủy 4 khối ngẫu nhiên để giải phóng không gian!',
      actionType: 'revive',
    });
  };

  const handleRewardClaimed = () => {
    if (adModalConfig.actionType === 'undo' && previousBoard) {
      setBoard(previousBoard);
      setScore(previousScore);
    } else if (adModalConfig.actionType === 'bomb') {
      const cleared = board.map((row) => row.map((v) => (v === 2 || v === 4 ? 0 : v)));
      setBoard(spawnRandomTile(cleared));
      sound.playHit();
    } else if (adModalConfig.actionType === 'revive') {
      // Clear 4 random tiles
      const cleared = board.map((row) => [...row]);
      let removed = 0;
      for (let r = 0; r < 4 && removed < 4; r++) {
        for (let c = 0; c < 4 && removed < 4; c++) {
          if (cleared[r][c] > 0 && cleared[r][c] < 64) {
            cleared[r][c] = 0;
            removed++;
          }
        }
      }
      setBoard(cleared);
      setIsGameOver(false);
      sound.playPowerup();
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center select-none py-2">
      {/* Top Header Bar */}
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
            <div className="text-xl font-display font-extrabold text-cyan-300">{score}</div>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono-tech">Kỷ lục</span>
            <div className="text-base font-display font-bold text-amber-400">
              {playerStats.highScores['quantum-2048']}
            </div>
          </div>
        </div>

        <button
          onClick={initGame}
          aria-label="Chơi lại"
          className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Monetization Boosters Bar */}
      <div className="w-full grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={handleTriggerUndoAd}
          disabled={!previousBoard}
          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-cyan-500/40 hover:border-cyan-300 text-cyan-200 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 disabled:cursor-not-allowed group transition-all"
        >
          <Undo2 className="w-4 h-4 text-cyan-400 group-hover:-rotate-45 transition-transform" />
          <span>LÙI 1 BƯỚC (XEM QC)</span>
        </button>

        <button
          onClick={handleTriggerBombAd}
          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-950/60 to-rose-950/60 border border-amber-500/40 hover:border-amber-300 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md group transition-all"
        >
          <Bomb className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
          <span>BOM EMP PHÁ RÁC (QC)</span>
        </button>
      </div>

      {/* 4x4 Grid Board */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-[420px] aspect-square bg-[#0a0d1a] border-2 border-cyan-500/40 rounded-3xl p-3 sm:p-4 shadow-[0_0_40px_rgba(6,182,212,0.2)] grid grid-cols-4 grid-rows-4 gap-2 sm:gap-3"
      >
        {board.map((row, r) =>
          row.map((val, c) => {
            const info = val > 0 ? CORE_LABELS[val] || CORE_LABELS[4096] : null;

            return (
              <div
                key={`${r}-${c}`}
                className={`relative rounded-2xl flex flex-col items-center justify-center transition-all duration-150 ${
                  val === 0
                    ? 'bg-slate-900/60 border border-slate-800/80'
                    : `bg-gradient-to-br ${info?.bg} border border-cyan-400/50 shadow-lg scale-100 animate-fadeIn`
                }`}
                style={{
                  boxShadow: info ? `0 0 15px ${info.glow}` : undefined,
                }}
              >
                {val > 0 && (
                  <>
                    <span className={`text-xl sm:text-2xl font-display font-extrabold ${info?.text}`}>
                      {val}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-mono-tech tracking-wider text-slate-300/80 font-bold uppercase mt-0.5">
                      {info?.label}
                    </span>
                  </>
                )}
              </div>
            );
          })
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-4 text-center z-20">
            <h3 className="text-2xl font-display font-black text-red-400 mb-1">MA TRẬN QUÁ TẢI!</h3>
            <p className="text-xs text-slate-300 mb-4">Điểm số của bạn: <strong className="text-cyan-300">{score}</strong></p>

            <div className="w-full max-w-xs space-y-2.5">
              <button
                onClick={handleTriggerReviveAd}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold text-xs uppercase shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>🔥 HỒI SINH TIẾP TỤC (XEM QC)</span>
              </button>

              <button
                onClick={initGame}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>CHƠI LẠI TỪ ĐẦU</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions & Game Over Banner */}
      <div className="mt-3 text-center text-xs text-slate-400">
        Vuốt trên màn hình hoặc dùng phím <strong className="text-cyan-400">W A S D / Mũi tên</strong> để hợp nhất các lõi lượng tử lên <span className="text-emerald-400 font-bold">2048</span>!
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
