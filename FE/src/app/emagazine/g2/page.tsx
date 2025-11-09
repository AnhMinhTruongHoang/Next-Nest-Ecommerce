"use client";
import Image from "next/image";

const HEADER_H = 80;

export default function Page() {
  const sections = [
    "/images/inforgrafic/Section1.png",
    "/images/inforgrafic/Section2.jpg",
  ];

  return (
    <div className="wrapper">
      {sections.map((src, i) => (
        <section
          key={i}
          className="section"
          style={{ minHeight: `calc(100vh - ${HEADER_H}px)` }}
        >
          {/* Ảnh nền */}
          <Image
            src={src}
            alt={`Section ${i + 1}`}
            fill
            sizes="100vw"
            className={`img ${i === 1 ? "contain" : "cover"}`}
            priority={i === 0}
          />
        </section>
      ))}

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

        .img {
          position: absolute !important;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .img.cover {
          object-fit: cover;
        }

        .img.contain {
          object-fit: contain;
          background: #000; /* tránh vùng trắng khi contain */
        }

        /* ✅ Center video theo flexbox */
        .overlay-center {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none; /* không chặn scroll */
        }

        .player {
          pointer-events: auto;
          width: min(720px, 90vw);
          max-height: 60vh;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          background: #000;
        }
      `}</style>
    </div>
  );
}
