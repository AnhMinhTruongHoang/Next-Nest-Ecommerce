"use client";

import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

const MAGAZINE_IMAGES = {
  HERO: "/images/banners/home09.webp",
  SUB: "/images/banners/home06.webp",
  SUB01: "/images/banners/home08.jpg",
  SUB02: "/images/banners/home07.jpg",
  CHAIR: "/images/banners/home05.webp",
  HEADSET: "/images/banners/home04.jpg",
  MIC: "/images/banners/home02.webp",
  LAPTOP: "/images/banners/home03.webp",
  PINK: "/images/banners/home01.webp",
};

const productHighlights = [
  {
    tag: "#RAZER_CHAIR",
    title: "Ghế gaming Razer",
    desc: "Ưu đãi lên đến US$200 cho đơn hàng đủ điều kiện, phù hợp để nâng cấp góc chơi game và làm việc dài giờ.",
    image: MAGAZINE_IMAGES.CHAIR,
  },
  {
    tag: "#BLACKSHARK_V3_PRO",
    title: "Quà tặng giới hạn",
    desc: "Sở hữu bộ phụ kiện BlackShark V3 Pro cùng quà tặng số lượng có hạn trong thời gian diễn ra Razer Day.",
    image: MAGAZINE_IMAGES.HEADSET,
  },
  {
    tag: "#SEIREN_V3_PRO",
    title: "Razer Seiren V3 Pro",
    desc: "Micro dành cho streamer, creator và game thủ cần chất âm rõ, setup gọn và hiệu suất ổn định.",
    image: MAGAZINE_IMAGES.MIC,
  },
  {
    tag: "#RAZER_BLADE_16",
    title: "Razer Blade 16",
    desc: "Laptop gaming mỏng, mạnh, màn hình đẹp, phù hợp cho game thủ muốn hiệu năng cao trong thiết kế cao cấp.",
    image: MAGAZINE_IMAGES.LAPTOP,
  },
  {
    tag: "#BLACKPINK_X_RAZER",
    title: "Blackpink x Razer",
    desc: "Bộ sưu tập màu hồng nổi bật dành cho người dùng yêu thích setup cá tính, thời trang và khác biệt.",
    image: MAGAZINE_IMAGES.PINK,
  },
];

export default function RazerDayMagazinePage() {
  return (
    <main className="razer-day-page">
      {/* HERO */}
      <section className="razer-hero">
        <div className="razer-hero-overlay" />

        <div className="razer-hero-content">
          <div className="razer-chip-row">
            <span className="razer-chip primary">EMAGAZINE</span>
            <span className="razer-chip">#RAZER_DAY</span>
            <span className="razer-chip">#SUPER_SALE</span>
            <span className="razer-chip">#GAMERZONE</span>
          </div>

          <h1>Razer Day: Siêu sale cho góc gaming đỉnh cao</h1>

          <p>
            Một chiến dịch ưu đãi dành cho game thủ muốn nâng cấp toàn bộ setup:
            ghế gaming, tai nghe, micro, laptop cao cấp và bộ sưu tập Blackpink
            x Razer nổi bật.
          </p>

          <div className="razer-meta">By Minh • GamerZone Feature • 2026</div>

          <div className="razer-hero-actions">
            <Link href="/productsList?brand=Razer&sort=-sold">
              <Button
                className="razer-primary-btn"
                icon={<ArrowRightOutlined />}
              >
                Xem sản phẩm Razer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="razer-text-block">
        <div className="razer-article-container">
          <span className="razer-eyebrow">Opening</span>

          <p>
            Razer Day không chỉ là một đợt giảm giá. Đây là thời điểm lý tưởng
            để game thủ nâng cấp toàn bộ trải nghiệm chơi game, từ chỗ ngồi, âm
            thanh, giọng nói, hiệu năng máy cho đến phong cách setup cá nhân.
          </p>

          <p>
            Với 5 nhóm sản phẩm nổi bật trong chiến dịch lần này, GamerZone tập
            trung vào những nhu cầu thực tế nhất: chơi lâu vẫn thoải mái, nghe
            rõ từng âm thanh, stream chuyên nghiệp hơn, làm việc và giải trí
            mượt hơn, đồng thời tạo ra một góc gaming có dấu ấn riêng.
          </p>
        </div>
      </section>

      {/* FEATURE IMAGE */}
      <section className="razer-wide-media">
        <div className="razer-wide-frame">
          <Image
            src={MAGAZINE_IMAGES.HERO}
            alt="Razer Chair Super Sale"
            fill
            sizes="100vw"
            quality={84}
            className="razer-wide-img"
          />

          <div className="razer-media-tag">#UPGRADE_YOUR_SETUP</div>
        </div>

        <p className="razer-caption">
          #UPGRADE_YOUR_SETUP — nâng cấp góc chơi game bắt đầu từ sự thoải mái
          và độ ổn định trong từng giờ sử dụng.
        </p>
      </section>

      {/* CHAPTER 01 */}
      <section className="razer-text-block">
        <div className="razer-article-container">
          <span className="razer-eyebrow">Chapter 01</span>
          <h2>Không chỉ mua một món gear, mà là nâng cấp cả hệ sinh thái</h2>

          <p>
            Một setup gaming tốt không chỉ phụ thuộc vào một chiếc chuột hay một
            chiếc bàn phím. Trải nghiệm thật sự đến từ sự kết hợp giữa tư thế
            ngồi, âm thanh, khả năng giao tiếp, màn hình, hiệu năng và cảm giác
            sử dụng mỗi ngày.
          </p>

          <p>
            Đó là lý do Razer Day phù hợp với cả người mới xây dựng góc gaming
            lẫn người đã có setup nhưng muốn nâng cấp lên một chuẩn cao hơn. Mỗi
            sản phẩm trong danh sách đều đại diện cho một phần quan trọng của
            trải nghiệm chơi game hiện đại.
          </p>
        </div>
      </section>

      {/* QUOTE */}
      <section className="razer-quote-section">
        <div className="razer-quote">
          <h2>
            “Một góc gaming tốt không chỉ đẹp trên ảnh. Nó phải giúp bạn chơi
            lâu hơn, tập trung hơn và tận hưởng từng trận đấu tốt hơn.”
          </h2>
          <span>GamerZone Magazine Note</span>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="razer-product-section">
        <div className="razer-section-head">
          <span>Razer Day Picks</span>
          <h2>5 điểm nhấn trong chiến dịch siêu sale</h2>
          <p>
            Các ảnh bên dưới bạn có thể thay sau theo đúng 5 ảnh ở Home Promo.
          </p>
        </div>

        <div className="razer-product-grid">
          {productHighlights.map((item) => (
            <article className="razer-product-card" key={item.tag}>
              <div className="razer-product-img-wrap">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  quality={82}
                  className="razer-product-img"
                />

                <div className="razer-product-tag">{item.tag}</div>
              </div>

              <div className="razer-product-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SPLIT SECTION */}
      <section className="razer-split-section">
        <div className="razer-split-media">
          <Image
            src={MAGAZINE_IMAGES.SUB01}
            alt="Razer Blade 16"
            fill
            sizes="(max-width: 900px) 100vw, 560px"
            quality={84}
            className="razer-split-img"
          />
          <div className="razer-media-tag">#RAZER_BLADE_16</div>
        </div>

        <div className="razer-split-content">
          <span>#SLIM_IMMERSIVE_INFINITE</span>
          <h2>Hiệu năng cao trong một thiết kế gọn gàng</h2>
          <p>
            Razer Blade 16 là lựa chọn dành cho người cần một thiết bị vừa đủ
            mạnh để chơi game, vừa đủ cao cấp để làm việc, sáng tạo nội dung và
            di chuyển hằng ngày.
          </p>

          <p>
            Trong chiến dịch Razer Day, nhóm sản phẩm laptop đóng vai trò như
            “trung tâm sức mạnh” của toàn bộ setup, kết nối giữa gaming, công
            việc và giải trí.
          </p>
        </div>
      </section>

      {/* FULL BLEED */}
      <section className="razer-full-bleed">
        <Image
          src={MAGAZINE_IMAGES.SUB}
          alt="Blackpink x Razer"
          fill
          sizes="100vw"
          quality={84}
          className="razer-full-img"
        />

        <div className="razer-full-overlay" />

        <div className="razer-full-content">
          <span>#BLACKPINK_X_RAZER</span>
          <h2>Setup không chỉ mạnh, mà còn phải có cá tính</h2>
          <p>
            Bộ sưu tập Blackpink x Razer mang đến một hướng tiếp cận khác:
            gaming gear không chỉ là hiệu năng, mà còn là phong cách cá nhân.
          </p>
        </div>
      </section>

      {/* CHAPTER 02 */}
      <section className="razer-text-block">
        <div className="razer-article-container">
          <span className="razer-eyebrow">Chapter 02</span>
          <h2>Ai nên săn Razer Day?</h2>

          <p>
            Nếu bạn đang cần một chiếc ghế tốt hơn để ngồi lâu, một tai nghe rõ
            hơn để giao tiếp, một micro ổn định để stream, hoặc một laptop
            gaming đủ mạnh cho nhiều tác vụ, Razer Day là thời điểm đáng cân
            nhắc.
          </p>

          <p>
            Đây cũng là lựa chọn phù hợp với người muốn đồng bộ setup theo một
            hệ sinh thái thương hiệu. Khi các thiết bị có cùng ngôn ngữ thiết
            kế, góc gaming nhìn gọn hơn, đồng nhất hơn và có cảm giác cao cấp
            hơn.
          </p>
        </div>
      </section>

      {/* DOUBLE IMAGE */}
      <section className="razer-double-section">
        <div className="razer-double-grid">
          <div className="razer-double-card">
            <Image
              src={MAGAZINE_IMAGES.HEADSET}
              alt="BlackShark V3 Pro"
              fill
              sizes="(max-width: 900px) 100vw, 600px"
              quality={82}
              className="razer-double-img"
            />
            <span>#LIMITED_TIME_GIFT</span>
          </div>

          <div className="razer-double-card">
            <Image
              src={MAGAZINE_IMAGES.SUB02}
              alt="Razer Seiren V3 Pro"
              fill
              sizes="(max-width: 900px) 100vw, 600px"
              quality={82}
              className="razer-double-img"
            />
            <span>#STUDIO_SOUND</span>
          </div>
        </div>

        <p className="razer-caption">
          #LIMITED_TIME_GIFT và #STUDIO_SOUND — hai lựa chọn dành cho người chơi
          muốn giao tiếp rõ hơn, stream tốt hơn và hoàn thiện setup âm thanh.
        </p>
      </section>

      {/* CLOSING */}
      <section className="razer-text-block">
        <div className="razer-article-container">
          <span className="razer-eyebrow">Closing</span>

          <p>
            Razer Day là một chiến dịch phù hợp để biến góc gaming rời rạc thành
            một setup hoàn chỉnh hơn. Không cần mua tất cả cùng lúc, nhưng mỗi
            món gear được chọn đúng sẽ nâng cấp một phần trải nghiệm.
          </p>

          <p>
            Từ ghế gaming, tai nghe, micro, laptop cho đến bộ sưu tập màu hồng
            nổi bật, 5 điểm nhấn lần này tạo nên một thông điệp chung:
            <strong>
              {" "}
              chơi tốt hơn, làm việc gọn hơn và thể hiện cá tính rõ hơn.
            </strong>
          </p>

          <div className="razer-closing-action">
            <Link href="/productsList?brand=Razer&sort=-sold">
              <Button
                className="razer-primary-btn"
                icon={<ArrowRightOutlined />}
              >
                Săn sale Razer ngay
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CREDIT */}
      <section className="razer-credit">
        <div>
          <span>Credits</span>
          <h3>Minh • Design • Frontend</h3>
          <p>
            Tags: #RAZER_DAY, #SUPER_SALE, #GAMERZONE, #RAZER_BLADE_16,
            #BLACKPINK_X_RAZER, #SEIREN_V3_PRO.
          </p>
        </div>
      </section>

      <style jsx global>{`
        .razer-day-page {
          min-height: 100vh;
          overflow-x: hidden;
          color: #ffffff;
          background: #05070a;
        }

        .razer-hero {
          position: relative;
          min-height: 820px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          background: #05070a;
        }

        .razer-hero-img {
          object-fit: cover;
          object-position: center center;
          opacity: 0.76;
        }

        .razer-hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              circle at 75% 20%,
              rgba(68, 214, 44, 0.18),
              transparent 36%
            ),
            linear-gradient(
              180deg,
              rgba(5, 7, 10, 0.12) 0%,
              rgba(5, 7, 10, 0.52) 48%,
              #05070a 100%
            );
        }

        .razer-hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 140px 20px 96px;
        }

        .razer-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }

        .razer-chip {
          padding: 8px 13px;
          color: #44d62c;
          background: rgba(0, 0, 0, 0.58);
          border: 1px solid rgba(68, 214, 44, 0.35);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .razer-chip.primary {
          color: #061313;
          background: #44d62c;
          border-color: #44d62c;
        }

        .razer-hero h1 {
          max-width: 1020px;
          margin: 0;
          color: #ffffff;
          font-size: clamp(48px, 7vw, 96px);
          line-height: 1.04;
          font-weight: 950;
          letter-spacing: -0.075em;
          text-transform: uppercase;
          text-shadow: 0 24px 80px rgba(0, 0, 0, 0.82);
        }

        .razer-hero p {
          max-width: 760px;
          margin: 28px 0 0;
          color: #c9d1d9;
          font-size: clamp(18px, 2vw, 23px);
          line-height: 1.65;
          font-weight: 650;
        }

        .razer-meta {
          margin-top: 30px;
          color: #8b949e;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .razer-hero-actions {
          margin-top: 34px;
        }

        .razer-primary-btn {
          height: 46px !important;
          padding: 0 24px !important;
          border: none !important;
          border-radius: 999px !important;
          color: #061313 !important;
          background: #44d62c !important;
          font-weight: 950 !important;
          box-shadow: 0 14px 30px rgba(68, 214, 44, 0.22) !important;
        }

        .razer-primary-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        .razer-article-container {
          width: 100%;
          max-width: 820px;
          margin: 0 auto;
          padding: 0 18px;
        }

        .razer-text-block {
          padding: 82px 0 22px;
        }

        .razer-eyebrow {
          display: block;
          margin-bottom: 16px;
          color: #44d62c;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .razer-text-block h2 {
          margin: 0 0 24px;
          color: #ffffff;
          font-size: clamp(32px, 4vw, 46px);
          line-height: 1.18;
          font-weight: 950;
          letter-spacing: -0.045em;
        }

        .razer-text-block p {
          margin: 0 0 24px;
          color: #d8dee9;
          font-size: clamp(17px, 1.5vw, 19px);
          line-height: 1.85;
          font-weight: 520;
        }

        .razer-text-block strong {
          color: #ffffff;
          font-weight: 950;
        }

        .razer-wide-media {
          width: 100%;
          max-width: 1180px;
          margin: 72px auto 28px;
          padding: 0 18px;
        }

        .razer-wide-frame {
          position: relative;
          width: 100%;
          height: clamp(340px, 55vw, 660px);
          overflow: hidden;
          border-radius: 32px;
          background: #111318;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
        }

        .razer-wide-img,
        .razer-product-img,
        .razer-split-img,
        .razer-full-img,
        .razer-double-img {
          object-fit: cover;
          object-position: center center;
        }

        .razer-media-tag,
        .razer-product-tag,
        .razer-double-card span {
          position: absolute;
          left: 16px;
          bottom: 16px;
          z-index: 2;
          padding: 8px 13px;
          border-radius: 999px;
          color: #44d62c;
          background: rgba(0, 0, 0, 0.72);
          border: 1px solid rgba(68, 214, 44, 0.35);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .razer-caption {
          max-width: 900px;
          margin: 12px auto 0;
          color: #8b949e;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.6;
          text-align: center;
        }

        .razer-quote-section {
          max-width: 1180px;
          margin: 78px auto;
          padding: 0 18px;
        }

        .razer-quote {
          position: relative;
          padding: clamp(34px, 5vw, 68px);
          overflow: hidden;
          border-radius: 36px;
          background: linear-gradient(
            135deg,
            rgba(18, 22, 32, 0.98),
            rgba(8, 30, 10, 0.95)
          );
          border: 1px solid rgba(68, 214, 44, 0.28);
          box-shadow: 0 24px 90px rgba(0, 0, 0, 0.45);
        }

        .razer-quote::before {
          content: "";
          position: absolute;
          left: 38px;
          top: 48px;
          bottom: 48px;
          width: 4px;
          border-radius: 999px;
          background: #44d62c;
        }

        .razer-quote h2 {
          margin: 0;
          padding-left: 34px;
          color: #ffffff;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.35;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .razer-quote span {
          display: block;
          margin-top: 24px;
          padding-left: 34px;
          color: #8b949e;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .razer-product-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 36px 18px 84px;
        }

        .razer-section-head {
          max-width: 760px;
          margin: 0 auto 34px;
          text-align: center;
        }

        .razer-section-head span {
          color: #44d62c;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .razer-section-head h2 {
          margin: 12px 0 0;
          color: #ffffff;
          font-size: clamp(32px, 5vw, 54px);
          line-height: 1.12;
          font-weight: 950;
          letter-spacing: -0.055em;
        }

        .razer-section-head p {
          margin: 12px 0 0;
          color: #8b949e;
          font-size: 15px;
          font-weight: 650;
        }

        .razer-product-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 18px;
        }

        .razer-product-card {
          overflow: hidden;
          border-radius: 24px;
          background: #0f1218;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.34);
        }

        .razer-product-img-wrap {
          position: relative;
          height: 320px;
          background: #000000;
          overflow: hidden;
        }

        .razer-product-content {
          padding: 18px;
        }

        .razer-product-content h3 {
          margin: 0;
          color: #ffffff;
          font-size: 20px;
          line-height: 1.25;
          font-weight: 950;
        }

        .razer-product-content p {
          margin: 10px 0 0;
          color: #a7b0c0;
          font-size: 14px;
          line-height: 1.65;
          font-weight: 550;
        }

        .razer-split-section {
          max-width: 1180px;
          margin: 30px auto 100px;
          padding: 0 18px;
          display: grid;
          grid-template-columns: 520px 1fr;
          gap: 48px;
          align-items: center;
        }

        .razer-split-media {
          position: relative;
          height: 660px;
          overflow: hidden;
          border-radius: 32px;
          background: #111318;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
        }

        .razer-split-content {
          padding: 42px;
          border-radius: 32px;
          background: #0f1218;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 18px 70px rgba(0, 0, 0, 0.35);
        }

        .razer-split-content span {
          color: #44d62c;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .razer-split-content h2 {
          margin: 18px 0 20px;
          color: #ffffff;
          font-size: clamp(32px, 4vw, 44px);
          line-height: 1.22;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .razer-split-content p {
          margin: 0 0 18px;
          color: #a7b0c0;
          font-size: 18px;
          line-height: 1.75;
          font-weight: 520;
        }

        .razer-full-bleed {
          position: relative;
          height: 760px;
          margin: 60px 0 94px;
          overflow: hidden;
          background: #000000;
        }

        .razer-full-img {
          opacity: 0.78;
        }

        .razer-full-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
              90deg,
              #05070a 0%,
              rgba(5, 7, 10, 0.34) 50%,
              #05070a 100%
            ),
            linear-gradient(180deg, transparent, #05070a 100%);
        }

        .razer-full-content {
          position: absolute;
          left: 50%;
          bottom: 80px;
          transform: translateX(-50%);
          width: 100%;
          max-width: 1180px;
          padding: 0 20px;
        }

        .razer-full-content span {
          color: #44d62c;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .razer-full-content h2 {
          max-width: 760px;
          margin: 18px 0 0;
          color: #ffffff;
          font-size: clamp(36px, 6vw, 68px);
          line-height: 1.08;
          font-weight: 950;
          letter-spacing: -0.065em;
        }

        .razer-full-content p {
          max-width: 680px;
          margin: 20px 0 0;
          color: #d8dee9;
          font-size: 19px;
          line-height: 1.7;
          font-weight: 600;
        }

        .razer-double-section {
          max-width: 1180px;
          margin: 30px auto 92px;
          padding: 0 18px;
        }

        .razer-double-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 28px;
        }

        .razer-double-card {
          position: relative;
          height: 560px;
          overflow: hidden;
          border-radius: 32px;
          background: #111318;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
        }

        .razer-closing-action {
          margin-top: 30px;
        }

        .razer-credit {
          max-width: 820px;
          margin: 0 auto;
          padding: 28px 18px 96px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .razer-credit span {
          color: #8b949e;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .razer-credit h3 {
          margin: 10px 0 0;
          color: #ffffff;
          font-size: 22px;
          font-weight: 950;
        }

        .razer-credit p {
          margin: 12px 0 0;
          color: #8b949e;
          font-size: 14px;
          line-height: 1.65;
          font-weight: 700;
        }

        @media (max-width: 1180px) {
          .razer-product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .razer-split-section {
            grid-template-columns: 1fr;
          }

          .razer-split-media {
            height: 560px;
          }
        }

        @media (max-width: 768px) {
          .razer-hero {
            min-height: 720px;
          }

          .razer-hero-content {
            padding: 120px 14px 72px;
          }

          .razer-text-block {
            padding: 58px 0 16px;
          }

          .razer-wide-frame,
          .razer-split-media,
          .razer-double-card {
            border-radius: 22px;
          }

          .razer-product-grid,
          .razer-double-grid {
            grid-template-columns: 1fr;
          }

          .razer-product-img-wrap {
            height: 360px;
          }

          .razer-split-content {
            padding: 28px;
            border-radius: 22px;
          }

          .razer-full-bleed {
            height: 600px;
          }

          .razer-full-content {
            bottom: 54px;
          }

          .razer-full-content p {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .razer-chip {
            font-size: 10px;
          }

          .razer-hero h1 {
            font-size: 44px;
          }

          .razer-hero p,
          .razer-text-block p {
            font-size: 16px;
          }

          .razer-primary-btn {
            width: 100%;
          }

          .razer-product-img-wrap {
            height: 300px;
          }

          .razer-double-card {
            height: 430px;
          }

          .razer-quote::before {
            left: 26px;
          }

          .razer-quote h2,
          .razer-quote span {
            padding-left: 24px;
          }
        }
      `}</style>
    </main>
  );
}
