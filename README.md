# 🚀 NEXUS ARCADE - CỔNG GAME CYBERPUNK & ADS MONETIZATION HUB

> **Cổng trò chơi trực tuyến công nghệ cao thuần Frontend (100% Client-Side)**, tích hợp sẵn hệ thống **kiếm tiền quảng cáo đa vị trí (Anti-Slop AI)**, âm thanh synthesizer không độ trễ, và giao diện neon hiện đại chuẩn 60FPS.

---

## 🌐 Đường Dẫn Trực Tuyến

- 🎮 **Trang Web Trực Tuyến (Vercel Live)**: [https://nexus-arcade-six.vercel.app](https://nexus-arcade-six.vercel.app)
- 📦 **Mã Nguồn GitHub**: [https://github.com/chinhan-dev/nexus-arcade](https://github.com/chinhan-dev/nexus-arcade)

---

## 🎮 3 Tựa Game Mini Gây Nghiện Tích Hợp Sẵn

1. **⚡ NEON SURGE (Cyber Synthwave Runner)**:
   - Game né laser tốc độ cao 300km/h trên nền lưới neon 3D.
   - Nhặt Energy Cores, khiên chắn Magnet, x2 Multiplier.
   - **Vị trí Ads**: Nút *Hồi sinh 100% Máu (Xem QC)*, *Nhân đôi điểm thưởng (2X QC)*, Banner Game Over 300x250.

2. **🧠 QUANTUM 2048 (Cyber Fusion Singularity)**:
   - Game giải đố hợp nhất các lõi lượng tử: *Bit -> Byte -> Kilo -> Mega -> Giga -> Tera -> Peta -> Exa -> Zetta -> Yotta -> AI SINGULARITY (2048)*.
   - Hiệu ứng âm thanh hợp âm Synthwave theo từng bậc điểm.
   - **Vị trí Ads**: Nút *Lùi lại 1 nước đi (Xem QC)*, *Kích hoạt Bom EMP phá khối rác (Xem QC)*, *Hồi sinh ma trận*.

3. **🎯 REFLEX MATRIX (360° Bullet Hell Reflex)**:
   - Thử thách phản xạ đỉnh cao: điều khiển drone né bão đạn laser và thu thập pha lê dữ liệu.
   - **Vị trí Ads**: Nút *Bullet-Time Làm chậm đạn 10s (Xem QC)*, *Hồi sinh tức thì (Xem QC)*.

---

## 💰 Hệ Thống Kiếm Tiền & Chèn Ads Tối Ưu (Anti-Slop)

Tất cả cấu hình quảng cáo được tập trung tại một file duy nhất:  
📂 [`src/config/ads.config.ts`](./src/config/ads.config.ts)

### 📌 Các vị trí Ads đã tích hợp sẵn:
- **Header Leaderboard** (728x90 desktop / 320x50 mobile)
- **Sticky Bottom Banner** (dính đáy màn hình, có nút thu nhỏ)
- **Sidebar Skyscraper** (300x600 bên phải giao diện sảnh game)
- **Game Over Rectangle** (300x250 trong modal kết thúc game)
- **Rewarded Ad Simulator & Direct Link**:
  - Modal đếm ngược 5 giây đẹp mắt với thanh tiến trình neon và hiệu ứng pháo hoa khi nhận thưởng.
  - Tự động mở Tab tài trợ khi người chơi bấm nút nhận thưởng (tăng CTR tối đa).

---

## 🛠️ Hướng Dẫn Kết Nối Subdomain Vercel (`game.freepro.online`)

### Cách 1: Thêm Subdomain trong Vercel Dashboard
1. Truy cập Vercel Project: [https://vercel.com/chinhan/nexus-arcade](https://vercel.com/chinhan/nexus-arcade) (hoặc team `chinhan-deploy`).
2. Vào tab **Settings** -> chọn **Domains**.
3. Nhập tên miền phụ bạn muốn: `game.freepro.online` (hoặc `arcade.freepro.online`, hoặc `freepro.online`) -> Nhấn **Add**.
4. Vercel sẽ hiển thị bản ghi DNS bạn cần trỏ.

### Cách 2: Cấu hình DNS tại nhà cung cấp Domain (Cloudflare / Namecheap / PA Vietnam...)
- **Nếu dùng Subdomain (`game.freepro.online`)**:
  - Loại (Type): `CNAME`
  - Tên (Name): `game`
  - Giá trị (Value): `cname.vercel-dns.com.`
  - Proxy status (nếu dùng Cloudflare): Tắt đám mây cam (DNS only) hoặc bật tuỳ nhu cầu.

- **Nếu dùng Root Domain (`freepro.online`)**:
  - Loại (Type): `A`
  - Tên (Name): `@`
  - Giá trị (Value): `76.76.21.21`

---

## 💻 Hướng Dẫn Chạy & Phát Triển Cục Bộ

```bash
# Cài đặt thư viện
bun install # hoặc npm install

# Chạy môi trường phát triển
bun dev     # hoặc npm run dev

# Build sản phẩm
bun run build
```
