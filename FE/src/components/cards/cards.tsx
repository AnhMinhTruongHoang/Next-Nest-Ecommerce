"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ProductOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

type CardItem = {
  id: number;
  key: "headset" | "keyboard" | "mouse" | "accessories";
  title: string;
  subtitle: string;
  image: string;
  hoverImage?: string;
};

const CATEGORY_NAME_FROM_KEY: Record<CardItem["key"], string> = {
  headset: "Headset",
  keyboard: "Keyboard",
  mouse: "Mouse",
  accessories: "Accessories",
};

const cardList: CardItem[] = [
  {
    id: 1,
    key: "headset",
    title: "Tai nghe",
    subtitle: "Âm thanh rõ nét, chiến game cực đã",
    image: "/images/banners/headsetBanner.jpg",
    hoverImage: "/images/banners/headsetb2.jpg",
  },
  {
    id: 2,
    key: "keyboard",
    title: "Bàn phím",
    subtitle: "Phản hồi nhanh, đèn RGB nổi bật",
    image: "/images/banners/KeyboardBanner.jpg",
    hoverImage: "/images/banners/keyboardb2.jpg",
  },
  {
    id: 3,
    key: "mouse",
    title: "Chuột",
    subtitle: "Cảm biến chính xác, thao tác mượt",
    image: "/images/banners/mouseb2.jpg",
    hoverImage: "/images/banners/mouseb1.jpg",
  },
  {
    id: 4,
    key: "accessories",
    title: "Bàn di chuột",
    subtitle: "Bề mặt ổn định, rê chuột thoải mái",
    image: "/images/banners/padb1.jpg",
    hoverImage: "/images/banners/padb2.jpg",
  },
];

const Cards = () => {
  const router = useRouter();

  const [showHover, setShowHover] = useState(false);
  const [catMapByName, setCatMapByName] = useState<Record<string, string>>({});

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const loadCategories = async () => {
      const cached = localStorage.getItem("catMapByName");

      if (cached) {
        try {
          const { at, map } = JSON.parse(cached);

          if (
            map &&
            typeof map === "object" &&
            Date.now() - Number(at || 0) < 24 * 60 * 60 * 1000
          ) {
            setCatMapByName(map);
            return;
          }
        } catch {}
      }

      if (!backendURL) return;

      try {
        const res = await fetch(`${backendURL}/categories`);
        const json = await res.json();
        const categories: Array<{ _id: string; name: string }> =
          json?.data ?? [];

        const nextMap: Record<string, string> = {};

        categories.forEach((item) => {
          if (item?.name && item?._id) {
            nextMap[item.name.toLowerCase()] = item._id;
          }
        });

        setCatMapByName(nextMap);
        localStorage.setItem(
          "catMapByName",
          JSON.stringify({
            at: Date.now(),
            map: nextMap,
          })
        );
      } catch (error) {
        console.error("Không thể tải danh mục:", error);
      }
    };

    loadCategories();
  }, [backendURL]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setShowHover((prev) => !prev);
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  const goCategory = (key: CardItem["key"]) => {
    const catName = CATEGORY_NAME_FROM_KEY[key];
    const params = new URLSearchParams();

    const categoryId = catMapByName[catName.toLowerCase()];

    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.set("categoryName", catName);
    }

    params.set("sort", "-sold");

    router.push(`/productsList?${params.toString()}`);
  };

  return (
    <section className="gz-category-section">
      <div className="gz-category-container">
        <div className="gz-category-head">
          <span>Danh mục nổi bật</span>
          <h2>Sản phẩm nổi bật</h2>
          <p>
            Chọn nhanh nhóm sản phẩm gaming bạn cần và khám phá những mẫu bán
            chạy tại GamerZone.
          </p>

          <button
            type="button"
            className="gz-all-products-btn"
            onClick={() => router.push("/productsList")}
            aria-label="Xem tất cả sản phẩm"
          >
            <ProductOutlined />
            <span>Tất cả sản phẩm</span>
          </button>
        </div>

        <div className="gz-category-grid">
          {cardList.map((card, index) => (
            <button
              key={card.id}
              type="button"
              className="gz-category-card"
              onClick={() => goCategory(card.key)}
              aria-label={`Xem danh mục ${card.title}`}
              style={
                {
                  "--delay": `${index * 80}ms`,
                } as React.CSSProperties
              }
            >
              <div className="gz-category-image-wrap">
                <Image
                  alt={card.title}
                  src={card.image}
                  fill
                  sizes="(max-width: 520px) 100vw, (max-width: 992px) 50vw, 25vw"
                  className={`gz-category-img gz-main-img ${
                    showHover ? "is-hidden" : ""
                  }`}
                  priority={index < 2}
                />

                {card.hoverImage && (
                  <Image
                    alt={`${card.title} hover`}
                    src={card.hoverImage}
                    fill
                    sizes="(max-width: 520px) 100vw, (max-width: 992px) 50vw, 25vw"
                    className={`gz-category-img gz-hover-img ${
                      showHover ? "is-visible" : ""
                    }`}
                    priority={false}
                  />
                )}

                <div className="gz-category-glow" />

                <div className="gz-category-overlay">
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.subtitle}</p>
                  </div>

                  <span className="gz-category-action">Xem ngay</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .gz-category-section {
          width: 100%;
          padding: 46px 16px 64px;
          background: radial-gradient(
              circle at top left,
              rgba(0, 255, 224, 0.06),
              transparent 34%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(255, 77, 0, 0.055),
              transparent 34%
            ),
            #1e2021;
        }

        .gz-category-container {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
        }

        .gz-category-head {
          max-width: 720px;
          margin: 0 auto 30px;
          text-align: center;
        }

        .gz-category-head > span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 9px;
          padding: 6px 12px;
          border-radius: 999px;
          color: #00ffe0;
          background: rgba(0, 255, 224, 0.08);
          border: 1px solid rgba(0, 255, 224, 0.18);
          font-size: 11px;
          font-weight: 950;
          line-height: 1;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .gz-category-head h2 {
          margin: 0;
          color: #ffffff;
          font-size: 36px;
          font-weight: 950;
          line-height: 1.16;
          letter-spacing: 0.2px;
        }

        .gz-category-head p {
          max-width: 580px;
          margin: 10px auto 0;
          color: #b8c0cc;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.65;
        }

        .gz-all-products-btn {
          height: 42px;
          margin-top: 18px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 999px;
          color: #061313;
          background: linear-gradient(135deg, #00ffe0, #00b894);
          box-shadow: 0 12px 28px rgba(0, 255, 224, 0.13);
          font-size: 13px;
          font-weight: 950;
          cursor: pointer;
          transition: transform 0.22s ease, box-shadow 0.22s ease,
            filter 0.22s ease;
        }

        .gz-all-products-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
          box-shadow: 0 16px 34px rgba(0, 255, 224, 0.2);
        }

        .gz-category-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .gz-category-card {
          width: 100%;
          min-width: 0;
          padding: 0;
          border: none;
          border-radius: 22px;
          background: transparent;
          cursor: pointer;
          text-align: left;
          animation: gzCategoryFadeUp 0.55s ease both;
          animation-delay: var(--delay);
        }

        .gz-category-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          border-radius: 22px;
          background: #111314;
          border: 1px solid #2a2d2e;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.25);
          transition: transform 0.28s ease, border-color 0.28s ease,
            box-shadow 0.28s ease;
        }

        .gz-category-card:hover .gz-category-image-wrap {
          transform: translateY(-6px);
          border-color: rgba(0, 255, 224, 0.5);
          box-shadow: 0 18px 40px rgba(0, 255, 224, 0.13);
        }

        .gz-category-img {
          object-fit: cover;
          transform: scale(1.01);
          transition: opacity 0.65s ease, transform 0.75s ease;
          pointer-events: none;
        }

        .gz-hover-img {
          opacity: 0;
          z-index: 1;
        }

        .gz-main-img {
          opacity: 1;
          z-index: 0;
        }

        .gz-main-img.is-hidden,
        .gz-category-card:hover .gz-main-img {
          opacity: 0;
          transform: scale(1.08);
        }

        .gz-hover-img.is-visible,
        .gz-category-card:hover .gz-hover-img {
          opacity: 1;
          transform: scale(1.06);
        }

        .gz-category-glow {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.02) 0%,
              rgba(0, 0, 0, 0.16) 42%,
              rgba(0, 0, 0, 0.86) 100%
            ),
            radial-gradient(
              circle at 50% 92%,
              rgba(0, 255, 224, 0.15),
              transparent 42%
            );
          pointer-events: none;
        }

        .gz-category-overlay {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 3;
          padding: 18px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
        }

        .gz-category-overlay h3 {
          margin: 0;
          color: #ffffff;
          font-size: 19px;
          font-weight: 950;
          line-height: 1.2;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.65);
        }

        .gz-category-overlay p {
          margin: 6px 0 0;
          max-width: 210px;
          color: #d1d5db;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.45;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.65);
        }

        .gz-category-action {
          flex-shrink: 0;
          padding: 7px 10px;
          border-radius: 999px;
          color: #061313;
          background: #00ffe0;
          font-size: 11px;
          font-weight: 950;
          white-space: nowrap;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.24s ease, transform 0.24s ease;
        }

        .gz-category-card:hover .gz-category-action {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes gzCategoryFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1180px) {
          .gz-category-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
          }

          .gz-category-overlay {
            padding: 15px;
          }

          .gz-category-overlay h3 {
            font-size: 17px;
          }

          .gz-category-overlay p {
            font-size: 11.5px;
          }
        }

        @media (max-width: 900px) {
          .gz-category-section {
            padding: 38px 12px 54px;
          }

          .gz-category-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .gz-category-head {
            margin-bottom: 24px;
          }

          .gz-category-head h2 {
            font-size: 30px;
          }
        }

        @media (max-width: 520px) {
          .gz-category-section {
            padding: 32px 10px 44px;
          }

          .gz-category-head {
            margin-bottom: 20px;
          }

          .gz-category-head h2 {
            font-size: 25px;
          }

          .gz-category-head p {
            font-size: 13px;
          }

          .gz-all-products-btn {
            width: 100%;
            max-width: 240px;
          }

          .gz-category-grid {
            gap: 12px;
          }

          .gz-category-image-wrap {
            border-radius: 18px;
          }

          .gz-category-overlay {
            padding: 12px;
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }

          .gz-category-overlay h3 {
            font-size: 15px;
          }

          .gz-category-overlay p {
            display: none;
          }

          .gz-category-action {
            opacity: 1;
            transform: none;
            padding: 6px 9px;
            font-size: 10px;
          }
        }

        @media (max-width: 360px) {
          .gz-category-grid {
            grid-template-columns: 1fr;
          }

          .gz-category-image-wrap {
            aspect-ratio: 16 / 10;
          }

          .gz-category-overlay p {
            display: block;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gz-category-card,
          .gz-category-img,
          .gz-category-image-wrap,
          .gz-all-products-btn,
          .gz-category-action {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Cards;
