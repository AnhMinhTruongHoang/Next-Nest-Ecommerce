"use client";

import Link from "next/link";

type PromoItem = {
  title: string;
  subtitle: string;
  image: string;
  href: string;
};

const promos: PromoItem[] = [
  {
    title: "UP TO US$200 OFF YOUR NEXT CHAIR",
    subtitle: "WITH ORDERS ABOVE US$150",
    image: "/images/banners/home05.webp",
    href: "/emagazine/razor",
  },
  {
    title: "LIMITED-TIME GIFT",
    subtitle: "SNAG AN OPTIC GAMING FACEPLATE WITH BLACKSHARK V3 PRO PURCHASE",
    image: "/images/banners/home04.webp",
    href: "/emagazine/razor",
  },
  {
    title: "RAZER SEIREN V3 PRO",
    subtitle: "STUDIO SOUND. SIMPLY EFFORTLESS.",
    image: "/images/banners/home02.webp",
    href: "/emagazine/razor",
  },
  {
    title: "MEET THE ALL-NEW RAZER BLADE 16",
    subtitle: "SLIM. IMMERSIVE. INFINITE.",
    image: "/images/banners/home03.webp",
    href: "/emagazine/razor",
  },
  {
    title: "BLACKPINK X RAZER",
    subtitle: "PLAY IN PINK",
    image: "/images/banners/home01.webp",
    href: "/emagazine/razor",
  },
];

export default function HomePromoSection() {
  return (
    <section className="gz-razer-promo-section">
      <div className="gz-razer-promo-grid">
        {promos.map((item) => (
          <Link
            href={item.href}
            className="gz-razer-promo-card"
            key={item.title}
          >
            <div className="gz-razer-promo-content">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>

            <div
              className="gz-razer-promo-image"
              style={{
                backgroundImage: `url(${item.image})`,
              }}
            />

            <div className="gz-razer-promo-overlay" />
          </Link>
        ))}
      </div>

      <style jsx global>{`
        .gz-razer-promo-section {
          width: 100%;
          padding: 0 12px 44px;
          background: #000000;
          border-top: 1px solid #44d62c;
        }

        .gz-razer-promo-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 24px;
          margin: 0 auto;
        }

        .gz-razer-promo-card {
          position: relative;
          min-height: 635px;
          display: block;
          overflow: hidden;
          text-decoration: none !important;
          background: #000000;
          border-radius: 0 0 10px 10px;
          isolation: isolate;
        }

        .gz-razer-promo-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.04) 0%,
            rgba(0, 0, 0, 0.08) 34%,
            rgba(0, 0, 0, 0.16) 100%
          );
        }

        .gz-razer-promo-content {
          position: relative;
          z-index: 3;
          min-height: 150px;
          padding: 28px 18px 10px;
          text-align: center;
          background: #000000;
        }

        .gz-razer-promo-content h3 {
          max-width: 330px;
          margin: 0 auto;
          color: #ffffff;
          font-size: clamp(19px, 1.45vw, 28px);
          font-weight: 950;
          line-height: 1.08;
          letter-spacing: -0.04em;
          text-transform: uppercase;
        }

        .gz-razer-promo-content p {
          max-width: 330px;
          margin: 13px auto 0;
          color: #d6d6d6;
          font-size: clamp(12px, 0.95vw, 17px);
          font-weight: 850;
          line-height: 1.22;
          text-transform: uppercase;
        }

        .gz-razer-promo-image {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          height: calc(100% - 125px);
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center bottom;
          transform: scale(1.002);
          transition: transform 0.35s ease, filter 0.35s ease;
        }

        .gz-razer-promo-overlay {
          position: absolute;
          inset: auto 0 0;
          z-index: 2;
          height: 38%;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(0, 0, 0, 0.08) 45%,
            rgba(0, 0, 0, 0.18)
          );
        }

        .gz-razer-promo-card:hover .gz-razer-promo-image {
          transform: scale(1.045);
          filter: brightness(1.08);
        }

        .gz-razer-promo-card:hover h3 {
          color: #44d62c;
        }

        @media (max-width: 1400px) {
          .gz-razer-promo-grid {
            gap: 14px;
          }

          .gz-razer-promo-card {
            min-height: 560px;
          }

          .gz-razer-promo-content {
            min-height: 140px;
            padding-inline: 12px;
          }
        }

        @media (max-width: 1180px) {
          .gz-razer-promo-section {
            padding-inline: 10px;
            overflow-x: auto;
            scrollbar-width: thin;
            scrollbar-color: #44d62c #000000;
          }

          .gz-razer-promo-grid {
            width: max-content;
            min-width: 100%;
            grid-template-columns: repeat(5, 280px);
          }

          .gz-razer-promo-card {
            min-height: 520px;
          }

          .gz-razer-promo-content h3 {
            font-size: 22px;
          }

          .gz-razer-promo-content p {
            font-size: 13px;
          }
        }

        @media (max-width: 768px) {
          .gz-razer-promo-section {
            padding: 0 10px 34px;
            border-top: 1px solid #44d62c;
          }

          .gz-razer-promo-grid {
            grid-template-columns: repeat(5, 250px);
            gap: 12px;
          }

          .gz-razer-promo-card {
            min-height: 470px;
            border-radius: 0 0 12px 12px;
          }

          .gz-razer-promo-content {
            min-height: 128px;
            padding: 22px 12px 8px;
          }

          .gz-razer-promo-content h3 {
            font-size: 20px;
          }

          .gz-razer-promo-content p {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .gz-razer-promo-section {
            padding: 0 10px 30px;
          }

          .gz-razer-promo-grid {
            grid-template-columns: repeat(5, 225px);
            gap: 10px;
          }

          .gz-razer-promo-card {
            min-height: 420px;
          }

          .gz-razer-promo-content {
            min-height: 118px;
            padding: 18px 10px 6px;
          }

          .gz-razer-promo-content h3 {
            font-size: 18px;
          }

          .gz-razer-promo-content p {
            font-size: 11px;
          }
        }
      `}</style>
    </section>
  );
}
