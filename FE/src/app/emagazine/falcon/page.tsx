"use client";
import { Button, Modal } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRef, useState } from "react";
import Link from "next/link";

const HEADER_H = 80;

export default function Page() {
  const sections = [
    "/images/inforgrafic/Section5.png",
    "/images/inforgrafic/Section6.png",
  ];
  const [loaded, setLoaded] = useState<boolean[]>(
    Array(sections.length).fill(false)
  );

  return (
    <div className="wrapper">
      <div>
        <video
          autoPlay
          muted
          playsInline
          loop
          style={{ width: "100%", display: "block" }}
        >
          <source src="/audio/RazerPromo.mp4" type="video/mp4" />
        </video>
      </div>
      {sections.map((src, i) => (
        <section
          key={i}
          className="section"
          style={{ minHeight: `calc(100vh - ${HEADER_H}px)` }}
        >
          {!loaded[i] && <div className="skeleton" />}
          <Image
            src={src}
            alt={`Section ${i + 1}`}
            fill
            sizes="100vw"
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={i === 0 ? "high" : "auto"}
            quality={85}
            className={`img ${i === 1 ? "contain" : "cover"} ${
              loaded[i] ? "is-loaded" : ""
            }`}
            onLoadingComplete={() =>
              setLoaded((arr) => {
                const next = [...arr];
                next[i] = true;
                return next;
              })
            }
          />
        </section>
      ))}

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
            <Link href={"/productsList?brand=Razer&sort=-sold"}>
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

      <style jsx>{`
        .wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100vw;
          overflow-x: hidden;
          background: #000;
          scroll-snap-type: y mandatory;
        }
        .section {
          position: relative;
          width: 100vw;
          overflow: hidden;
          isolation: isolate;
          scroll-snap-align: start;
        }
        .skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.06) 25%,
              rgba(255, 255, 255, 0.12) 37%,
              rgba(255, 255, 255, 0.06) 63%
            ),
            #111;
          background-size: 400% 100%;
          animation: shimmer 1.2s ease-in-out infinite;
          z-index: 0;
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .img {
          position: absolute !important;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 500ms ease;
          z-index: 1;
          pointer-events: none;
          background: #000;
        }
        .img.is-loaded {
          opacity: 1;
        }
        .img.cover {
          object-fit: cover;
        }
        .img.contain {
          object-fit: contain;
        }

        /* ===== CTA styles (giống ảnh) ===== */
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
          color: #bfeaff; /* xanh nhạt nhẹ giống ảnh */
          font-size: 16px;
          line-height: 1.6;
        }
        .cta__actions {
          display: inline-flex;
          gap: 16px;
          margin-top: 8px;
        }

        /* Nút primary */
        :global(.btnPrimary) {
          height: 44px;
          padding: 0 22px;
          font-weight: 700;
          border-radius: 8px;
          background: #00c2ff;
          border: none;
        }
        :global(.btnPrimary:hover) {
          background: #22d0ff !important;
        }

        /* Nút viền (outline) có icon */
        :global(.btnGhost) {
          height: 44px;
          padding: 0 22px;
          font-weight: 700;
          border-radius: 8px;
          background: transparent;
          border: 2px solid #00c2ff;
          color: #00c2ff;
        }
        :global(.btnGhost:hover) {
          border-color: #22d0ff !important;
          color: #22d0ff !important;
        }
        :global(.btnIcon) {
          font-size: 18px;
          margin-right: 6px;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .cta__title {
            font-size: 32px;
          }
          .cta__actions {
            flex-direction: column;
            width: 100%;
          }
          :global(.btnPrimary),
          :global(.btnGhost) {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
