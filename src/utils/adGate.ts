import { ADS_CONFIG } from '../config/ads.config';
import { sound } from './soundEngine';

// Lưu trữ số lần click cho từng nút/hành động
const clickCounterMap: Record<string, number> = {};

export interface AdGateResult {
  isUnlocked: boolean;
  currentClicks: number;
  requiredClicks: number;
  remainingClicks: number;
}

/**
 * Hàm kiểm tra và kích hoạt Ad Gate (Yêu cầu > 3 lần click mở quảng cáo mới thực thi)
 * @param actionId Định danh duy nhất cho nút/hành động (ví dụ: 'revive_neon', 'spin_wheel', 'claim_coins')
 * @param onSuccess Callback được gọi khi đã click đủ > 3 lần
 * @param requiredClicks Số lần click xem quảng cáo yêu cầu (mặc định 3 lần)
 */
export const executeAdGatedAction = (
  actionId: string,
  onSuccess: () => void,
  requiredClicks: number = 3
): AdGateResult => {
  const current = clickCounterMap[actionId] || 0;

  // Nếu chưa đủ số lần click yêu cầu (< requiredClicks)
  if (current < requiredClicks) {
    const nextCount = current + 1;
    clickCounterMap[actionId] = nextCount;

    // 1. Mở Direct Link Ads sang tab mới
    if (ADS_CONFIG.directLinkUrl) {
      try {
        window.open(ADS_CONFIG.directLinkUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.error('Popup blocked', e);
      }
    }

    // 2. Phát âm thanh phản hồi
    sound.playClick();

    // 3. Hiển thị thông báo Toast góc màn hình cho người chơi
    showAdGateToast(nextCount, requiredClicks);

    return {
      isUnlocked: false,
      currentClicks: nextCount,
      requiredClicks,
      remainingClicks: requiredClicks - nextCount,
    };
  }

  // Khi đã click đủ >= requiredClicks:
  // Reset lại bộ đếm cho lần sau
  clickCounterMap[actionId] = 0;
  sound.playVictory();
  onSuccess();

  return {
    isUnlocked: true,
    currentClicks: requiredClicks,
    requiredClicks,
    remainingClicks: 0,
  };
};

/**
 * Lấy số lần click hiện tại của 1 hành động
 */
export const getAdGateProgress = (actionId: string, requiredClicks: number = 3) => {
  const current = clickCounterMap[actionId] || 0;
  return {
    current,
    required: requiredClicks,
    remaining: Math.max(0, requiredClicks - current),
    percent: Math.min(100, (current / requiredClicks) * 100),
  };
};

/**
 * Hiển thị Toast thông báo số bước mở khóa quảng cáo
 */
let toastTimeout: ReturnType<typeof setTimeout> | null = null;
const showAdGateToast = (current: number, total: number) => {
  const existingToast = document.getElementById('ad-gate-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.id = 'ad-gate-toast';
  toast.className = `fixed top-16 right-4 z-50 flex items-center gap-3 bg-[#0d1226]/95 border-2 border-amber-400 text-white px-4 py-3 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.5)] backdrop-blur-xl animate-bounce text-xs sm:text-sm font-bold`;

  const remaining = total - current;
  toast.innerHTML = `
    <div class="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-sm shrink-0">
      ${current}/${total}
    </div>
    <div>
      <div class="text-amber-300 font-extrabold uppercase">⚡ XÁC NHẬN TÀI TRỢ (${current}/${total})</div>
      <div class="text-[11px] text-slate-300">
        ${remaining > 0 ? `Bấm lại nút thêm <strong class="text-amber-400 font-bold">${remaining} lần</strong> nữa để mở khóa!` : '🎉 Đã hoàn tất! Bấm lần này để nhận quà!'}
      </div>
    </div>
  `;

  document.body.appendChild(toast);

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.remove();
  }, 4500);
};
