/**
 * ============================================================================
 * 🎯 NEXUS ARCADE - HỆ THỐNG CẤU HÌNH QUẢNG CÁO (ADS CONFIGURATION)
 * ============================================================================
 * Tích hợp Monetag Multitag & Monetag Direct Link & 3-Click Ad Gate
 */

export interface AdsSystemConfig {
  /** Bật/Tắt toàn bộ hệ thống Ads (true = Bật, false = Tắt) */
  enabled: boolean;

  /** 
   * Chế độ Test Mode:
   * - true: Hiển thị banner mô phỏng đẹp mắt + modal nhận thưởng ngay để test
   * - false: Chạy mã quảng cáo thực tế từ Ad Network (Monetag)
   */
  testMode: boolean;

  /** Số lần người dùng cần click quảng cáo trước khi thực sự mở khóa hành động (Mặc định: 3 lần) */
  requiredAdClicks: number;

  /** Thời gian xem quảng cáo Rewarded (giây) trước khi trả thưởng */
  rewardedWatchDurationSeconds: number;

  /**
   * Direct Link Ad (Link quảng cáo trực tiếp từ Monetag)
   * Khi người chơi bấm vào nút Rewarded (Hồi sinh, Nhân đôi, Nhận coins, Quay gacha), sẽ tự động mở link này!
   */
  directLinkUrl: string;

  /** Google AdSense Publisher ID (Ví dụ: "ca-pub-1234567890123456") */
  adsensePublisherId: string;

  /** Chi tiết từng vị trí Banner Ads trên website */
  slots: {
    /** Banner ngang đầu trang (Responsive 728x90 desktop / 320x50 mobile) */
    headerLeaderboard: {
      enabled: boolean;
      adsenseSlotId: string;
      customHtml: string;
    };
    /** Banner dính đáy màn hình (Sticky Bottom) */
    stickyBottom: {
      enabled: boolean;
      adsenseSlotId: string;
      customHtml: string;
    };
    /** Banner dọc bên phải màn hình (Sidebar Skyscraper 160x600 / 300x600) */
    sidebarSkyscraper: {
      enabled: boolean;
      adsenseSlotId: string;
      customHtml: string;
    };
    /** Banner hiển thị trong bảng Game Over (300x250) */
    gameOverBanner: {
      enabled: boolean;
      adsenseSlotId: string;
      customHtml: string;
    };
    /** Banner trong modal Vòng Quay May Mắn (Lucky Wheel) */
    luckyWheelBanner: {
      enabled: boolean;
      adsenseSlotId: string;
      customHtml: string;
    };
  };
}

export const ADS_CONFIG: AdsSystemConfig = {
  enabled: true,
  testMode: false, // Chạy link thật từ Monetag
  requiredAdClicks: 3, // 👉 Bấm 3 lần quảng cáo mới mở khóa hành động thật!
  rewardedWatchDurationSeconds: 5,
  
  // 👉 Direct URL từ Monetag của bạn:
  directLinkUrl: "https://omg10.com/4/11691306",

  // 👉 Google AdSense ID (nếu có sau này)
  adsensePublisherId: "",

  slots: {
    headerLeaderboard: {
      enabled: true,
      adsenseSlotId: "",
      customHtml: `<!-- Dán code banner mới của bạn ở đây -->`,
    },
    stickyBottom: {
      enabled: true,
      adsenseSlotId: "",
      customHtml: `<!-- Dán code banner mới của bạn ở đây -->`,
    },
    sidebarSkyscraper: {
      enabled: true,
      adsenseSlotId: "",
      customHtml: `<!-- Dán code banner mới của bạn ở đây -->`,
    },
    gameOverBanner: {
      enabled: true,
      adsenseSlotId: "",
      customHtml: `<!-- Dán code banner mới của bạn ở đây -->`,
    },
    luckyWheelBanner: {
      enabled: true,
      adsenseSlotId: "",
      customHtml: `<!-- Dán code banner mới của bạn ở đây -->`,
    },
  },
};
