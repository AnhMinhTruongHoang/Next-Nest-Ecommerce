"use client";

import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";

const HASHTAGS = [
  "#FALCONS",
  "#NIKO",
  "#KEEPPLAYING",
  "#RAZER",
  "#DEATHADDER_V4_PRO",
];

export default function FalconMagazinePage() {
  return (
    <main className="falcon-page">
      {/* HERO */}
      <section className="falcon-hero">
        <Image
          src="/images/banners/niko.png"
          alt="Falcons Esports"
          fill
          priority
          sizes="100vw"
          quality={86}
          className="falcon-hero-img"
        />

        <div className="falcon-hero-overlay" />

        <div className="falcon-hero-tag">#FALCONS_ESPORTS</div>

        <div className="falcon-hero-content">
          <div className="falcon-label">eMagazine</div>

          <h1>Falcons: Khi bản lĩnh gặp tốc độ</h1>

          <p>
            Một lát cắt về tinh thần thi đấu, di sản của NiKo và cách thiết bị
            gaming hiệu năng cao trở thành một phần của chiến thắng.
          </p>

          <div className="falcon-hashtags">
            {HASHTAGS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* META */}
      <section className="falcon-meta">
        <div className="falcon-article-container">
          <div className="falcon-meta-inner">
            <span>Thực hiện bởi Minh</span>
            <span>8 phút đọc • 2026</span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="falcon-article">
        <div className="falcon-article-container">
          <p className="dropcap">
            Falcons không chỉ là một cái tên trên bảng đấu. Đó là hình ảnh của
            tham vọng, áp lực sân khấu và những khoảnh khắc mà một pha xử lý có
            thể thay đổi toàn bộ cục diện trận đấu.
          </p>

          <p>
            Trong thế giới Esports, chiến thắng không đến từ một yếu tố duy
            nhất. Nó là sự kết hợp giữa kỹ năng cá nhân, tư duy chiến thuật,
            phản xạ, tâm lý thi đấu và cả những công cụ mà tuyển thủ sử dụng mỗi
            ngày.
          </p>

          <p>
            Với những ngôi sao như NiKo, mỗi chuyển động đều cần độ chính xác
            gần như tuyệt đối. Chuột, bàn phím, tai nghe hay bề mặt rê chuột
            không còn là phụ kiện. Chúng trở thành phần mở rộng của người chơi.
          </p>
        </div>
      </section>

      {/* VIDEO */}
      <section className="falcon-video-section">
        <video autoPlay muted playsInline loop className="falcon-video">
          <source src="/audio/RazerPromo.mp4" type="video/mp4" />
        </video>
      </section>

      {/* IMAGE SECTION 1 */}
      <section className="falcon-image-section">
        <div className="falcon-article-container">
          <div className="falcon-image-card">
            <Image
              src="/images/inforgrafic/Section5.png"
              alt="Win Frame Win Game"
              width={1280}
              height={720}
              sizes="(max-width: 900px) 100vw, 900px"
              quality={82}
              className="falcon-section-img"
            />

            <div className="falcon-image-shade" />
            <div className="falcon-image-tag">#WIN_FRAME_WIN_GAME</div>
          </div>

          <div className="falcon-caption">
            #WIN_FRAME_WIN_GAME — chiến thắng bắt đầu từ từng khung hình, từng
            pha lia chuột và từng quyết định trong tích tắc.
          </div>
        </div>
      </section>

      {/* BODY 1 */}
      <section className="falcon-article">
        <div className="falcon-article-container">
          <p>
            Với người chơi phổ thông, một cú click có thể chỉ là thao tác đơn
            giản. Với tuyển thủ chuyên nghiệp, nó là kết quả của hàng nghìn giờ
            luyện tập và yêu cầu thiết bị phải phản hồi đúng khoảnh khắc.
          </p>

          <p>
            Đó là lý do các thương hiệu gaming luôn nói nhiều về độ trễ, cảm
            biến, trọng lượng và kết nối. Những con số này không chỉ để quảng
            cáo. Khi trận đấu bước vào thời điểm quyết định, từng mili-giây đều
            có giá trị.
          </p>
        </div>
      </section>

      {/* QUOTE */}
      <section className="falcon-quote-section">
        <div className="falcon-article-container">
          <div className="falcon-quote">
            <h2>
              “Trong thi đấu đỉnh cao, thiết bị tốt không thay thế kỹ năng. Nó
              giúp kỹ năng được thể hiện đúng tốc độ.”
            </h2>

            <span>Falcon Magazine Note</span>
          </div>
        </div>
      </section>

      {/* IMAGE SECTION 2 */}
      <section className="falcon-image-section">
        <div className="falcon-article-container">
          <div className="falcon-image-card falcon-image-card-tall">
            <Image
              src="/images/inforgrafic/Section6.png"
              alt="NiKo Legacy"
              width={1280}
              height={720}
              sizes="(max-width: 900px) 100vw, 900px"
              quality={82}
              className="falcon-section-img"
            />

            <div className="falcon-image-shade" />
            <div className="falcon-image-tag">#NIKO_LEGACY</div>
          </div>

          <div className="falcon-caption">
            #NIKO_LEGACY — danh hiệu, kinh nghiệm và áp lực của một trong những
            tay súng nổi bật nhất thế hệ.
          </div>
        </div>
      </section>

      {/* BODY 2 */}
      <section className="falcon-article">
        <div className="falcon-article-container">
          <p>
            NiKo đại diện cho kiểu tuyển thủ mà người xem nhớ bằng cảm giác.
            Những pha xử lý của anh thường mang lại sự chắc chắn, lạnh lùng và
            có phần không khoan nhượng.
          </p>

          <p>
            Nhưng đằng sau những highlight là một hệ thống rất kỷ luật: luyện
            tập, thói quen, thiết lập cá nhân, cảm giác tay và khả năng lặp lại
            độ chính xác trong nhiều giờ thi đấu.
          </p>

          <p>
            Đó cũng là nơi câu chuyện về thiết bị trở nên quan trọng. Một con
            chuột nhẹ hơn, cảm biến ổn định hơn, kết nối nhanh hơn hay form cầm
            phù hợp hơn có thể giúp tuyển thủ giữ được nhịp độ trong những pha
            giao tranh áp lực cao.
          </p>
        </div>
      </section>

      {/* DOUBLE IMAGE */}
      <section className="falcon-double-section">
        <div className="falcon-article-container">
          <div className="falcon-double-grid">
            <div className="falcon-double-card">
              <Image
                src="/images/inforgrafic/niko01.jpg"
                alt="Precision"
                fill
                sizes="(max-width: 900px) 100vw, 440px"
                quality={82}
                className="falcon-double-img"
              />
              <span>#PRECISION</span>
            </div>

            <div className="falcon-double-card">
              <Image
                src="/images/inforgrafic/niko02.jpg"
                alt="Legend"
                fill
                sizes="(max-width: 900px) 100vw, 440px"
                quality={82}
                className="falcon-double-img"
              />
              <span>#LEGEND</span>
            </div>
          </div>

          <div className="falcon-caption">
            #PRECISION và #LEGEND — hai góc nhìn khác nhau của cùng một hành
            trình: hiệu năng thiết bị và bản lĩnh tuyển thủ.
          </div>
        </div>
      </section>

      {/* FINAL */}
      <section className="falcon-article">
        <div className="falcon-article-container">
          <p>
            Falcon, NiKo và những thiết bị thi đấu hiệu năng cao cùng tạo nên
            một câu chuyện quen thuộc của Esports hiện đại: chiến thắng là kết
            quả của cả con người lẫn công cụ.
          </p>

          <p>
            Khi trận đấu bước vào giây phút căng thẳng nhất, người xem thường
            nhớ đến cú bắn cuối cùng. Nhưng để có được cú bắn đó, mọi thứ phía
            sau đều phải vận hành chính xác.
          </p>
        </div>
      </section>

      {/* FOOTER CŨ GIỮ NGUYÊN */}
      <section className="cta">
        <div className="cta__inner">
          <h2 className="cta__title">
            Chơi như tay súng trường vĩ đại nhất mọi thời đại.
          </h2>

          <p className="cta__desc">
            "Được tiếp sức bởi thế hệ công nghệ mới, DeathAdder V4 Pro chính là
            thành quả của hơn hai thập kỷ tinh hoa kỹ thuật — một bước nhảy táo
            bạo, một lần nữa thiết lập chuẩn mực mới cho những gì một chiếc
            chuột gaming có thể và nên đạt tới".
          </p>

          <div className="cta__actions">
            <Link href="/productsList?brand=Razer&sort=-sold">
              <Button
                style={{ background: "#44D62C" }}
                type="primary"
                size="large"
                className="btnPrimary"
              >
                TÌM HIỂU THÊM
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .falcon-page {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: #f5f1e8;
          color: #111111;
        }

        .falcon-hero {
          position: relative;
          width: 100%;
          min-height: 850px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          background: #050505;
        }

        .falcon-hero-img {
          object-fit: cover;
          object-position: center center;
          opacity: 0.92;
        }

        .falcon-hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.18) 0%,
            rgba(0, 0, 0, 0.34) 42%,
            rgba(0, 0, 0, 0.9) 100%
          );
        }

        .falcon-hero-tag {
          position: absolute;
          top: 110px;
          left: 28px;
          z-index: 2;
          padding: 8px 14px;
          color: #44d62c;
          background: rgba(0, 0, 0, 0.78);
          border: 1px solid rgba(68, 214, 44, 0.45);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.1em;
        }

        .falcon-hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 110px;
        }

        .falcon-label {
          margin-bottom: 16px;
          color: #44d62c;
          font-size: 15px;
          font-weight: 950;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .falcon-hero h1 {
          max-width: 1080px;
          margin: 0;
          color: #ffffff;
          font-size: 104px;
          line-height: 104px;
          font-weight: 950;
          letter-spacing: -0.075em;
          text-transform: uppercase;
          text-shadow: 0 24px 90px rgba(0, 0, 0, 0.9);
        }

        .falcon-hero p {
          max-width: 780px;
          margin: 28px 0 0;
          color: #d1d5db;
          font-size: 23px;
          line-height: 38px;
          font-weight: 600;
        }

        .falcon-hashtags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 34px;
        }

        .falcon-hashtags span {
          padding: 8px 14px;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.24);
          font-size: 13px;
          font-weight: 850;
          letter-spacing: 0.04em;
        }

        .falcon-article-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 18px;
        }

        .falcon-meta-inner {
          padding: 40px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.16);
          display: flex;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .falcon-meta-inner span:first-child {
          color: #111111;
          font-size: 14px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .falcon-meta-inner span:last-child {
          color: #555555;
          font-size: 14px;
          font-weight: 750;
        }

        .falcon-article {
          padding-top: 48px;
        }

        .falcon-article p {
          margin: 0 0 24px;
          color: #1f2933;
          font-size: 20px;
          line-height: 38px;
          font-weight: 500;
          text-align: justify;
        }

        .falcon-article p.dropcap {
          font-size: 22px;
          line-height: 42px;
        }

        .falcon-article p.dropcap::first-letter {
          float: left;
          padding-right: 10px;
          color: #111111;
          font-size: 96px;
          line-height: 72px;
          font-weight: 950;
        }

        .falcon-video-section {
          width: 100%;
          margin: 58px 0;
          background: #000000;
        }

        .falcon-video {
          width: 100%;
          display: block;
          background: #000000;
        }

        .falcon-image-section {
          padding: 20px 0;
        }

        .falcon-image-card {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #050505;
        }

        .falcon-image-card-tall {
          aspect-ratio: 16 / 10;
        }

        .falcon-section-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center center;
        }

        .falcon-image-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.04) 0%,
            rgba(0, 0, 0, 0.1) 45%,
            rgba(0, 0, 0, 0.72) 100%
          );
        }

        .falcon-image-tag {
          position: absolute;
          left: 18px;
          bottom: 18px;
          padding: 8px 13px;
          color: #44d62c;
          background: rgba(0, 0, 0, 0.78);
          border: 1px solid rgba(68, 214, 44, 0.45);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .falcon-caption {
          margin-top: 10px;
          color: #777777;
          font-size: 13px;
          font-style: italic;
          line-height: 1.5;
        }

        .falcon-quote-section {
          padding: 18px 0;
        }

        .falcon-quote {
          margin: 42px 0 54px;
          padding: 48px;
          color: #ffffff;
          background: #111111;
          border-left: 8px solid #44d62c;
        }

        .falcon-quote h2 {
          margin: 0;
          color: #ffffff;
          font-size: 44px;
          line-height: 58px;
          font-weight: 950;
          letter-spacing: -0.045em;
        }

        .falcon-quote span {
          display: block;
          margin-top: 18px;
          color: #9ca3af;
          font-size: 14px;
          font-weight: 850;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .falcon-double-section {
          padding: 30px 0;
        }

        .falcon-double-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .falcon-double-card {
          position: relative;
          height: 520px;
          overflow: hidden;
          background: #111111;
        }

        .falcon-double-img {
          object-fit: cover;
          object-position: center center;
        }

        .falcon-double-card span {
          position: absolute;
          left: 14px;
          bottom: 14px;
          padding: 7px 12px;
          color: #44d62c;
          background: rgba(0, 0, 0, 0.78);
          border: 1px solid rgba(68, 214, 44, 0.45);
          font-size: 12px;
          font-weight: 950;
        }

        /* FOOTER CŨ */
        .cta {
          background: #000;
          color: #fff;
          padding: 80px 16px 120px;
          display: flex;
          justify-content: center;
        }

        .cta__inner {
          max-width: 880px;
          text-align: center;
        }

        .cta__title {
          font-size: 44px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0 0 20px;
        }

        .cta__desc {
          max-width: 760px;
          margin: 0 auto 28px;
          color: #bfeaff;
          font-size: 16px;
          line-height: 1.6;
        }

        .cta__actions {
          display: inline-flex;
          gap: 16px;
          margin-top: 8px;
        }

        .btnPrimary {
          height: 44px !important;
          padding: 0 22px !important;
          font-weight: 800 !important;
          border-radius: 8px !important;
          border: none !important;
          color: #061313 !important;
        }

        .btnPrimary:hover {
          background: #62ec49 !important;
          color: #061313 !important;
        }

        @media (max-width: 900px) {
          .falcon-hero {
            min-height: 720px;
          }

          .falcon-hero-tag {
            top: 88px;
            left: 16px;
          }

          .falcon-hero-content {
            padding: 0 18px 76px;
          }

          .falcon-hero h1 {
            font-size: 72px;
            line-height: 78px;
          }

          .falcon-hero p {
            font-size: 19px;
            line-height: 32px;
          }

          .falcon-double-grid {
            grid-template-columns: 1fr;
          }

          .falcon-double-card {
            height: 420px;
          }
        }

        @media (max-width: 640px) {
          .falcon-hero {
            min-height: 680px;
          }

          .falcon-hero h1 {
            font-size: 48px;
            line-height: 54px;
          }

          .falcon-hero p {
            font-size: 18px;
            line-height: 30px;
          }

          .falcon-label {
            font-size: 13px;
          }

          .falcon-article {
            padding-top: 38px;
          }

          .falcon-article p {
            font-size: 18px;
            line-height: 34px;
          }

          .falcon-article p.dropcap {
            font-size: 19px;
            line-height: 36px;
          }

          .falcon-article p.dropcap::first-letter {
            font-size: 72px;
            line-height: 60px;
          }

          .falcon-quote {
            padding: 32px 24px;
          }

          .falcon-quote h2 {
            font-size: 28px;
            line-height: 40px;
          }

          .falcon-double-card {
            height: 320px;
          }

          .cta__title {
            font-size: 32px;
          }

          .cta__actions {
            flex-direction: column;
            width: 100%;
          }

          .cta__actions a,
          .btnPrimary {
            width: 100% !important;
          }
        }

        @media (max-width: 380px) {
          .falcon-hero h1 {
            font-size: 42px;
            line-height: 48px;
          }

          .falcon-article-container {
            padding: 0 14px;
          }

          .falcon-double-card {
            height: 280px;
          }
        }
      `}</style>
    </main>
  );
}
