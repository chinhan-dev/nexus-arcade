/**
 * ============================================================================
 * 🎯 NEXUS ARCADE - HỆ THỐNG CẤU HÌNH QUẢNG CÁO (ADS CONFIGURATION)
 * ============================================================================
 * Tích hợp HilltopAds Direct URL & Popunder & Banner
 */

export interface AdsSystemConfig {
  /** Bật/Tắt toàn bộ hệ thống Ads (true = Bật, false = Tắt) */
  enabled: boolean;

  /** 
   * Chế độ Test Mode:
   * - true: Hiển thị banner mô phỏng đẹp mắt + modal đếm ngược 5s nhận thưởng ngay để test
   * - false: Chạy mã quảng cáo thực tế từ Ad Network (Google AdSense, HilltopAds, Adsterra...)
   */
  testMode: boolean;

  /** Thời gian xem quảng cáo Rewarded (giây) trước khi trả thưởng */
  rewardedWatchDurationSeconds: number;

  /**
   * Direct Link Ad (Link quảng cáo trực tiếp từ HilltopAds / Adsterra / Monetag)
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
  testMode: false, // Chạy link thật từ HilltopAds
  rewardedWatchDurationSeconds: 5,
  
  // 👉 Direct URL từ HilltopAds của bạn:
  directLinkUrl: "https://massive-hall.com/bI3yV_0NP.3UpmVCbtmPVCJNZ/Dy0z3wM/zlYJ2FMoz/UF3-LfTvc/ztNnjEYoz/NYjKEk",

  // 👉 Google AdSense ID (nếu có sau này)
  adsensePublisherId: "ca-pub-XXXXXXXXXXXXXXXX",

  slots: {
    headerLeaderboard: {
      enabled: true,
      adsenseSlotId: "1234567890",
      customHtml: `<!-- Dán code HTML/Script banner 728x90 của bạn ở đây -->`,
    },
    stickyBottom: {
      enabled: true,
      adsenseSlotId: "1234567891",
      customHtml: `<!-- Dán code HTML/Script banner Sticky Bottom ở đây -->`,
    },
    sidebarSkyscraper: {
      enabled: true,
      adsenseSlotId: "1234567892",
      customHtml: `<!-- Dán code HTML/Script banner dọc 300x600 ở đây -->`,
    },
    gameOverBanner: {
      enabled: true,
      adsenseSlotId: "1234567893",
      customHtml: `<!-- Dán code HTML/Script banner 300x250 Game Over ở đây -->`,
    },
    luckyWheelBanner: {
      enabled: true,
      adsenseSlotId: "1234567894",
      customHtml: `<!-- Dán code HTML/Script banner Lucky Wheel ở đây -->`,
    },
  },
};
