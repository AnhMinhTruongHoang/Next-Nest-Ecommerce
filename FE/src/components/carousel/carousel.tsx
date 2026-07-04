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
    title: "",
    image: "/images/banners/banner6.png",
    link: "/product-detail/692190c152b600997c5407a9",
  },
  {
    id: 2,
    title: "",
    image: "/images/banners/EdraBanner.jpg",
    link: "/product-detail/692190c152b600997c5407ae",
  },
  {
    id: 3,
    title: "",
    image: "/images/banners/banner5.jpg",
    link: "/product-detail/692190c152b600997c5407a3",
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
                  alt={slide.title || "GamerZone banner"}
                  fill
                  priority={slide.id === 1}
                  sizes="100vw"
                  className="gz-main-carousel-image"
                />

                <div className="gz-main-carousel-overlay" />

                {slide.title && (
                  <div className="gz-main-carousel-title">{slide.title}</div>
                )}
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
          border-radius: 0;
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
          font-weight: 800;
          line-height: 1.25;
          text-align: center;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
        }

        .gz-main-carousel-promo strong {
          color: #ffffff;
          font-weight: 900;
        }

        .gz-main-carousel {
          width: 100%;
          background: #000000;
        }

        .gz-main-carousel-link {
          display: block;
          width: 100%;
          text-decoration: none;
        }

        .gz-main-carousel-slide {
          width: 100%;
          height: clamp(360px, 46vw, 640px);
          position: relative;
          overflow: hidden;
          background: #000000;
        }

        .gz-main-carousel-image {
          object-fit: cover !important;
          object-position: center center !important;
          transform: scale(1.002);
        }

        .gz-main-carousel-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.14),
            rgba(0, 0, 0, 0.02) 45%,
            rgba(0, 0, 0, 0.26)
          );
        }

        .gz-main-carousel-title {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          color: #ffffff;
          font-size: clamp(24px, 4vw, 48px);
          font-weight: 900;
          line-height: 1.15;
          text-align: center;
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.75);
        }

        .gz-main-carousel .slick-slider,
        .gz-main-carousel .slick-list,
        .gz-main-carousel .slick-track,
        .gz-main-carousel .slick-slide,
        .gz-main-carousel .slick-slide > div {
          height: 100%;
        }

        /* ===== Carousel arrows fixed ===== */
        .gz-main-carousel .slick-prev,
        .gz-main-carousel .slick-next {
          z-index: 8 !important;
          width: 42px !important;
          height: 42px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 999px !important;
          background: rgba(0, 128, 112, 0.82) !important;
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.28) !important;
          transform: translateY(-50%) !important;
          transition: background 0.2s ease, box-shadow 0.2s ease,
            opacity 0.2s ease !important;
        }

        .gz-main-carousel .slick-prev {
          left: 16px !important;
        }

        .gz-main-carousel .slick-next {
          right: 16px !important;
        }

        .gz-main-carousel .slick-prev:hover,
        .gz-main-carousel .slick-next:hover {
          background: rgba(0, 255, 224, 0.75) !important;
          box-shadow: 0 10px 26px rgba(0, 255, 224, 0.18) !important;
          transform: translateY(-50%) !important;
        }

        .gz-main-carousel .slick-prev::before,
        .gz-main-carousel .slick-next::before {
          display: none !important;
        }

        .gz-main-carousel .slick-prev::after,
        .gz-main-carousel .slick-next::after {
          position: static !important;
          width: 10px !important;
          height: 10px !important;
          margin: 0 !important;
          border-color: #ffffff !important;
          opacity: 1 !important;
          transform: rotate(45deg) !important;
        }

        .gz-main-carousel .slick-prev::after {
          border-top: 0 !important;
          border-right: 0 !important;
          margin-left: 4px !important;
        }

        .gz-main-carousel .slick-next::after {
          border-bottom: 0 !important;
          border-left: 0 !important;
          margin-right: 4px !important;
        }

        /* ===== Dots ===== */
        .gz-main-carousel .slick-dots {
          bottom: 18px !important;
          z-index: 6;
        }

        .gz-main-carousel .slick-dots li {
          width: 18px !important;
          height: 4px !important;
          margin-inline: 4px !important;
        }

        .gz-main-carousel .slick-dots li button {
          width: 18px !important;
          height: 4px !important;
          border-radius: 999px !important;
          background: rgba(255, 255, 255, 0.55) !important;
          opacity: 1 !important;
        }

        .gz-main-carousel .slick-dots li.slick-active {
          width: 32px !important;
        }

        .gz-main-carousel .slick-dots li.slick-active button {
          width: 32px !important;
          background: #00ffe0 !important;
        }

        @media (max-width: 991px) {
          .gz-main-carousel-slide {
            height: clamp(320px, 58vw, 520px);
          }

          .gz-main-carousel-promo {
            min-height: 38px;
            padding: 9px 12px;
            font-size: 13px;
          }

          .gz-main-carousel .slick-prev,
          .gz-main-carousel .slick-next {
            width: 36px !important;
            height: 36px !important;
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
            height: 430px;
          }

          .gz-main-carousel-image {
            object-fit: cover !important;
            object-position: center center !important;
          }

          .gz-main-carousel .slick-prev,
          .gz-main-carousel .slick-next {
            width: 34px !important;
            height: 34px !important;
            background: rgba(0, 128, 112, 0.78) !important;
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
            bottom: 12px !important;
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
          .gz-main-carousel-slide {
            height: 400px;
          }

          .gz-main-carousel-promo {
            font-size: 11px;
          }

          .gz-main-carousel .slick-prev,
          .gz-main-carousel .slick-next {
            width: 32px !important;
            height: 32px !important;
          }

          .gz-main-carousel .slick-prev {
            left: 7px !important;
          }

          .gz-main-carousel .slick-next {
            right: 7px !important;
          }
        }

        @media (max-width: 360px) {
          .gz-main-carousel-slide {
            height: 370px;
          }

          .gz-main-carousel .slick-prev,
          .gz-main-carousel .slick-next {
            width: 30px !important;
            height: 30px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default MainCarousel;
