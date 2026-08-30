/**
 * ============================================================================
 * 🎯 NEXUS ARCADE - HỆ THỐNG CẤU HÌNH QUẢNG CÁO (ADS CONFIGURATION)
 * ============================================================================
 * Bạn có thể dễ dàng thay đổi mã quảng cáo, chèn Google AdSense, Adsterra,
 * Monetag, PopAds hoặc Direct Link tài trợ tại đây!
 */

export interface AdsSystemConfig {
  /** Bật/Tắt toàn bộ hệ thống Ads (true = Bật, false = Tắt) */
  enabled: boolean;

  /** 
   * Chế độ Test Mode:
   * - true: Hiển thị banner mô phỏng đẹp mắt + modal đếm ngược 5s nhận thưởng ngay để test
   * - false: Chạy mã quảng cáo thực tế từ Ad Network (Google AdSense, Adsterra, script...)
   */
  testMode: boolean;

  /** Thời gian xem quảng cáo Rewarded (giây) trước khi trả thưởng */
  rewardedWatchDurationSeconds: number;

  /**
   * Direct Link Ad (Link rút gọn / link quảng cáo kiếm tiền như Adsterra, Monetag Direct Link)
   * Khi người chơi bấm vào nút Rewarded (hoặc nút tài trợ), sẽ tự động mở tab link này nếu được điền!
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
  testMode: true, // Đổi thành false khi bạn dán code quảng cáo thật vào
  rewardedWatchDurationSeconds: 5,
  
  // 👉 Dán link direct quảng cáo của bạn vào đây (nếu dùng Adsterra / Monetag / PopCash / Shortlink)
  directLinkUrl: "https://freepro.online/sponsor",

  // 👉 Dán mã Google AdSense của bạn vào đây
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
