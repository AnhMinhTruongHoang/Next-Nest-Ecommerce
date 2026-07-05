"use client";

import { Carousel } from "antd";
import Image from "next/image";
import Link from "next/link";

type Slide = {
  id: number;
  title?: string;
  image: string;
  link: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: "Khuyến mãi Razer",
    image: "/images/banners/razerBanner.jpg",
    link: "/exclusivePromo",
  },
  {
    id: 2,
    title: "G2 Esports",
    image: "/images/banners/monesyE.jpg",
    link: "/emagazine/g2",
  },
  {
    id: 3,
    title: "Falcons Esports",
    image: "/images/banners/niko.png",
    link: "/emagazine/falcon",
  },
];

const MainCarousel: React.FC = () => {
  return (
    <section className="gz-main-carousel-section">
      <div className="gz-main-carousel-promo">
        Nhập code <strong>“GamerZone”</strong> giảm 30%
      </div>

      <Carousel
        autoplay
        arrows
        fade
        pauseOnHover
        dotPosition="bottom"
        className="gz-main-carousel"
      >
        {slides.map((slide) => (
          <div key={slide.id}>
            <Link href={slide.link} className="gz-main-carousel-link">
              <div className="gz-main-carousel-slide">
                <Image
                  src={slide.image}
                  alt={slide.title || "Banner GamerZone"}
                  fill
                  priority={slide.id === 1}
                  loading={slide.id === 1 ? "eager" : "lazy"}
                  sizes="100vw"
                  quality={82}
                  className="gz-main-carousel-image"
                />

                <div className="gz-main-carousel-overlay" />
              </div>
            </Link>
          </div>
        ))}
      </Carousel>

      <style jsx global>{`
        .gz-main-carousel-section {
          width: 100%;
          position: relative;
          overflow: hidden;
          background: #0d0d0d;
        }

        .gz-main-carousel-promo {
          width: 100%;
          min-height: 42px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: linear-gradient(135deg, #ff0000, #ff3b00);
          color: #ffffff;
          font-size: 15px;
          font-weight: 850;
          line-height: 1.25;
          text-align: center;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
        }

        .gz-main-carousel-promo strong {
          color: #ffffff;
          font-weight: 950;
        }

        .gz-main-carousel {
          width: 100%;
          background: #000000;
          overflow: hidden;
        }

        .gz-main-carousel-link {
          display: block;
          width: 100%;
          text-decoration: none;
        }

        .gz-main-carousel-slide {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          max-height: 720px;
          min-height: 180px;
          overflow: hidden;
          background: #000000;
        }

        .gz-main-carousel-image {
          object-fit: fill !important;
          object-position: center center !important;
          transform: scale(1.001);
          transition: transform 4s ease;
        }

        .gz-main-carousel-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.22),
              rgba(0, 0, 0, 0.03) 42%,
              rgba(0, 0, 0, 0.18)
            ),
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.08),
              rgba(0, 0, 0, 0.02) 48%,
              rgba(0, 0, 0, 0.22)
            );
        }

        .gz-main-carousel .slick-slider,
        .gz-main-carousel .slick-list,
        .gz-main-carousel .slick-track,
        .gz-main-carousel .slick-slide,
        .gz-main-carousel .slick-slide > div {
          height: auto !important;
        }

        .gz-main-carousel .slick-slide {
          line-height: 0;
        }

        .gz-main-carousel .slick-slide > div {
          display: block;
        }

        /* ===== Mũi tên carousel ===== */
        .gz-main-carousel .slick-prev,
        .gz-main-carousel .slick-next {
          z-index: 8 !important;
          width: 44px !important;
          height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 999px !important;
          background: rgba(0, 0, 0, 0.42) !important;
          border: 1px solid rgba(0, 255, 224, 0.3) !important;
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35) !important;
          transform: translateY(-50%) !important;
          transition: background 0.2s ease, border-color 0.2s ease,
            box-shadow 0.2s ease, opacity 0.2s ease !important;
        }

        .gz-main-carousel .slick-prev {
          left: 18px !important;
        }

        .gz-main-carousel .slick-next {
          right: 18px !important;
        }

        .gz-main-carousel .slick-prev:hover,
        .gz-main-carousel .slick-next:hover {
          background: rgba(0, 255, 224, 0.24) !important;
          border-color: rgba(0, 255, 224, 0.72) !important;
          box-shadow: 0 12px 30px rgba(0, 255, 224, 0.16) !important;
          transform: translateY(-50%) !important;
        }

        .gz-main-carousel .slick-prev::before,
        .gz-main-carousel .slick-next::before {
          display: none !important;
        }

        .gz-main-carousel .slick-prev::after,
        .gz-main-carousel .slick-next::after {
          content: "";
          position: static !important;
          width: 11px !important;
          height: 11px !important;
          margin: 0 !important;
          border: solid #ffffff !important;
          border-width: 2px 2px 0 0 !important;
          opacity: 1 !important;
        }

        .gz-main-carousel .slick-prev::after {
          transform: rotate(-135deg) !important;
          margin-left: 4px !important;
        }

        .gz-main-carousel .slick-next::after {
          transform: rotate(45deg) !important;
          margin-right: 4px !important;
        }

        /* ===== Dots ===== */
        .gz-main-carousel .slick-dots {
          bottom: 18px !important;
          z-index: 6;
          margin: 0 !important;
        }

        .gz-main-carousel .slick-dots li {
          width: 18px !important;
          height: 4px !important;
          margin-inline: 4px !important;
        }

        .gz-main-carousel .slick-dots li button {
          width: 18px !important;
          height: 4px !important;
          padding: 0 !important;
          border-radius: 999px !important;
          background: rgba(255, 255, 255, 0.55) !important;
          opacity: 1 !important;
        }

        .gz-main-carousel .slick-dots li button::after {
          display: none !important;
        }

        .gz-main-carousel .slick-dots li.slick-active {
          width: 34px !important;
        }

        .gz-main-carousel .slick-dots li.slick-active button {
          width: 34px !important;
          background: #00ffe0 !important;
        }

        @media (max-width: 991px) {
          .gz-main-carousel-promo {
            min-height: 38px;
            padding: 9px 12px;
            font-size: 13px;
          }

          .gz-main-carousel-slide {
            min-height: 160px;
          }

          .gz-main-carousel .slick-prev,
          .gz-main-carousel .slick-next {
            width: 38px !important;
            height: 38px !important;
          }

          .gz-main-carousel .slick-prev {
            left: 12px !important;
          }

          .gz-main-carousel .slick-next {
            right: 12px !important;
          }

          .gz-main-carousel .slick-prev::after,
          .gz-main-carousel .slick-next::after {
            width: 9px !important;
            height: 9px !important;
          }
        }

        @media (max-width: 575px) {
          .gz-main-carousel-promo {
            min-height: 34px;
            padding: 8px 10px;
            font-size: 12px;
          }

          .gz-main-carousel-slide {
            min-height: 150px;
          }

          .gz-main-carousel-image {
            object-fit: cover !important;
            object-position: center center !important;
          }

          .gz-main-carousel .slick-prev,
          .gz-main-carousel .slick-next {
            width: 32px !important;
            height: 32px !important;
            background: rgba(0, 0, 0, 0.38) !important;
          }

          .gz-main-carousel .slick-prev {
            left: 8px !important;
          }

          .gz-main-carousel .slick-next {
            right: 8px !important;
          }

          .gz-main-carousel .slick-prev::after,
          .gz-main-carousel .slick-next::after {
            width: 8px !important;
            height: 8px !important;
          }

          .gz-main-carousel .slick-dots {
            bottom: 10px !important;
          }

          .gz-main-carousel .slick-dots li {
            width: 14px !important;
            height: 3px !important;
            margin-inline: 3px !important;
          }

          .gz-main-carousel .slick-dots li button {
            width: 14px !important;
            height: 3px !important;
          }

          .gz-main-carousel .slick-dots li.slick-active,
          .gz-main-carousel .slick-dots li.slick-active button {
            width: 26px !important;
          }
        }

        @media (max-width: 420px) {
          .gz-main-carousel-promo {
            font-size: 11px;
          }

          .gz-main-carousel-slide {
            min-height: 135px;
          }

          .gz-main-carousel .slick-prev,
          .gz-main-carousel .slick-next {
            width: 30px !important;
            height: 30px !important;
          }

          .gz-main-carousel .slick-prev {
            left: 6px !important;
          }

          .gz-main-carousel .slick-next {
            right: 6px !important;
          }
        }

        @media (max-width: 360px) {
          .gz-main-carousel-slide {
            min-height: 125px;
          }

          .gz-main-carousel .slick-prev,
          .gz-main-carousel .slick-next {
            width: 28px !important;
            height: 28px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default MainCarousel;
