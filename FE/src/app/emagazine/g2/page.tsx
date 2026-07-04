"use client";

import { Button, Modal } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

const sections = [
  "/images/inforgrafic/Section1.png",
  "/images/inforgrafic/Section2.png",
  "/images/inforgrafic/Section3.png",
  "/images/inforgrafic/Section4.png",
];

export default function Page() {
  const [loaded, setLoaded] = useState<boolean[]>(
    Array(sections.length).fill(false)
  );
  const [open, setOpen] = useState(false);

  const handleLoaded = (index: number) => {
    setLoaded((current) => {
      const next = [...current];
      next[index] = true;
      return next;
    });
  };

  return (
    <main className="wrapper">
      {sections.map((src, index) => (
        <section key={src} className="section">
          <div className="section__inner">
            <div className="section__frame">
              {!loaded[index] && <div className="skeleton" />}

              <Image
                src={src}
                alt={`Phần nội dung ${index + 1}`}
                width={1280}
                height={720}
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority={index === 0}
                quality={82}
                className={`img ${loaded[index] ? "is-loaded" : ""}`}
                onLoad={() => handleLoaded(index)}
              />
            </div>
          </div>
        </section>
      ))}

      {/* Footer / CTA giữ nguyên */}
      <section className="cta">
        <div className="cta__inner">
          <h2 className="cta__title">CHƠI CHO NGÀY MAI</h2>

          <p className="cta__desc">
            Hãy giúp chúng tôi đảm bảo các thế hệ tương lai có thể TIẾP TỤC CHƠI
            nữa. Chúng tôi tự hào thiết kế sản phẩm của mình theo hướng bền
            vững, mang đến cho bạn những đột phá mới nhất mà không bao giờ ảnh
            hưởng đến chất lượng hoặc hiệu suất.
          </p>

          <div className="cta__actions">
            <Link href="/productsList?brand=Logitech&sort=-sold">
              <Button type="primary" size="large" className="btnPrimary">
                TÌM HIỂU THÊM
              </Button>
            </Link>

            <Button
              size="large"
              className="btnGhost"
              icon={<PlayCircleOutlined className="btnIcon" />}
              onClick={() => setOpen(true)}
            >
              XEM PHIM
            </Button>
          </div>
        </div>
      </section>

      <Modal
        open={open}
        footer={null}
        centered
        onCancel={() => setOpen(false)}
        width={900}
        className="video-modal"
      >
        <video autoPlay controls playsInline className="video-player">
          <source src="/audio/LogitechPlay.mp4" type="video/mp4" />
        </video>
      </Modal>

      <style jsx global>{`
        .wrapper {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: #000000;
          color: #ffffff;
          scroll-snap-type: y proximity;
        }

        .section {
          width: 100%;
          min-height: auto;
          display: block;
          padding: 0;
          margin: 0;
          background: #000000;
          scroll-snap-align: start;
        }

        .section__inner {
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 0;
        }

        .section__frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 0;
          background: #000000;
          border: none;
          box-shadow: none;
        }
        .img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center center;
          opacity: 0;
          transform: scale(1.002);
          transition: opacity 420ms ease, transform 520ms ease;
          background: #000000;
        }

        .img.is-loaded {
          opacity: 1;
        }

        .section__frame:hover .img {
          transform: scale(1.018);
        }

        .skeleton {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.05) 25%,
              rgba(255, 255, 255, 0.12) 37%,
              rgba(255, 255, 255, 0.05) 63%
            ),
            #111111;
          background-size: 400% 100%;
          animation: shimmer 1.15s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }

          100% {
            background-position: 200% 0;
          }
        }

        /* ===== CTA giữ layout cũ ===== */
        .cta {
          background: radial-gradient(
              circle at center top,
              rgba(0, 194, 255, 0.09),
              transparent 38%
            ),
            #000000;
          color: #ffffff;
          padding: 80px 16px 120px;
          display: flex;
          justify-content: center;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
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
          font-weight: 700 !important;
          border-radius: 8px !important;
          background: #00c2ff !important;
          border: none !important;
        }

        .btnPrimary:hover {
          background: #22d0ff !important;
        }

        .btnGhost {
          height: 44px !important;
          padding: 0 22px !important;
          font-weight: 700 !important;
          border-radius: 8px !important;
          background: transparent !important;
          border: 2px solid #00c2ff !important;
          color: #00c2ff !important;
        }

        .btnGhost:hover {
          border-color: #22d0ff !important;
          color: #22d0ff !important;
          background: rgba(0, 194, 255, 0.06) !important;
        }

        .btnIcon {
          font-size: 18px;
          margin-right: 6px;
        }

        .video-modal .ant-modal-content {
          padding: 0 !important;
          overflow: hidden;
          border-radius: 16px !important;
          background: #000000 !important;
        }

        .video-modal .ant-modal-close {
          color: #ffffff !important;
        }

        .video-player {
          width: 100%;
          display: block;
          background: #000000;
        }

        @media (max-width: 1024px) {
          .section {
            min-height: auto;
            padding: 0;
            scroll-snap-align: none;
          }

          .section__frame {
            border-radius: 0;
          }
        }

        @media (max-width: 768px) {
          .wrapper {
            scroll-snap-type: none;
          }

          .section {
            padding: 0;
          }

          .section__frame {
            border-radius: 0;
            box-shadow: none;
          }

          .cta {
            padding: 64px 14px 88px;
          }

          .cta__title {
            font-size: 34px;
          }

          .cta__desc {
            font-size: 14px;
          }
        }

        @media (max-width: 640px) {
          .section {
            padding: 0;
          }

          .section__frame {
            border-radius: 0;
          }

          .cta__title {
            font-size: 32px;
          }

          .cta__actions {
            flex-direction: column;
            width: 100%;
          }

          .cta__actions a,
          .btnPrimary,
          .btnGhost {
            width: 100% !important;
          }
        }

        @media (max-width: 380px) {
          .section {
            padding: 0;
          }

          .section__frame {
            border-radius: 0;
          }

          .cta {
            padding-inline: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .img,
          .section__frame,
          .skeleton {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
