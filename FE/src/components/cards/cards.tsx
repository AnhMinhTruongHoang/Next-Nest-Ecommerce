"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "antd";
import Image from "next/image";
import { ProductOutlined, FullscreenOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "antd/dist/reset.css";
import "../../styles/globals.css";

const { Meta } = Card;

type CardList = {
  id: number;
  key: "headset" | "keyboard" | "mouse" | "accessories";
  title: string;
  image: string;
  hoverImage?: string;
};

const CATEGORY_NAME_FROM_KEY: Record<CardList["key"], string> = {
  headset: "Headset",
  keyboard: "Keyboard",
  mouse: "Mouse",
  accessories: "Accessories",
};

const cardList: CardList[] = [
  {
    id: 1,
    key: "headset",
    title: "Tai nghe",
    image: "/images/banners/headsetBanner.jpg",
    hoverImage: "/images/banners/headsetb2.jpg",
  },
  {
    id: 2,
    key: "keyboard",
    title: "Bàn phím",
    image: "/images/banners/KeyboardBanner.jpg",
    hoverImage: "/images/banners/keyboardb2.jpg",
  },
  {
    id: 3,
    key: "mouse",
    title: "Chuột",
    image: "/images/banners/mouseb2.jpg",
    hoverImage: "/images/banners/mouseb1.jpg",
  },
  {
    id: 4,
    key: "accessories",
    title: "Bàn di chuột",
    image: "/images/banners/padb1.jpg",
    hoverImage: "/images/banners/padb2.jpg",
  },
];

const Cards = () => {
  const router = useRouter();
  const [showHover, setShowHover] = useState(false);
  const [catMapByName, setCatMapByName] = useState<Record<string, string>>({});
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // set ref từng card để fullscreen
  const setItemRef = (id: number) => (node: HTMLDivElement | null) => {
    itemRefs.current[id] = node;
  };

  useEffect(() => {
    const cached = localStorage.getItem("catMapByName");
    if (cached) {
      try {
        const { map } = JSON.parse(cached);
        if (map && typeof map === "object") setCatMapByName(map);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowHover((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goCategory = (key: CardList["key"]) => {
    const catName = CATEGORY_NAME_FROM_KEY[key];
    const sp = new URLSearchParams();
    const id = catMapByName[catName.toLowerCase()];
    if (id) sp.set("category", id);
    else sp.set("categoryName", catName);
    sp.set("sort", "-sold");
    router.push(`/productsList?${sp.toString()}`);
  };

  // Fullscreen toggle
  const toggleFullscreen = async (id: number) => {
    const el = itemRefs.current[id];
    if (!el) return;

    const isFs =
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement;

    try {
      if (!isFs) {
        await (
          el.requestFullscreen ||
          (el as any).webkitRequestFullscreen ||
          (el as any).mozRequestFullScreen ||
          (el as any).msRequestFullscreen
        )?.call(el);
      } else {
        await (
          document.exitFullscreen ||
          (document as any).webkitExitFullscreen ||
          (document as any).mozCancelFullScreen ||
          (document as any).msExitFullscreen
        )?.call(document);
      }
    } catch (e) {
      console.error("Fullscreen error:", e);
    }
  };

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          padding: "8px",
          fontWeight: "bold",
          marginTop: 50,
        }}
      >
        <h1>Sản phẩm nổi bật</h1>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginTop: 30,
        }}
      >
        <Link href={`/productsList`}>
          <button
            title="All Products"
            style={{
              textAlign: "center",
              padding: "8px 20px",
              borderRadius: 20,
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              minWidth: 80,
              backgroundColor: "gainsboro",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#d9d9d9")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "gainsboro")
            }
          >
            <ProductOutlined /> <span style={{ marginLeft: 6 }}>Tất cả</span>
          </button>
        </Link>
      </div>

      <div className="cards-grid">
        {cardList.map((card) => (
          <div key={card.id} className="card-wrapper">
            <Card
              hoverable
              className="card-item"
              style={{ cursor: "pointer" }}
              cover={
                <div ref={setItemRef(card.id)} className="image-wrapper">
                  <Image
                    alt={card.title}
                    src={card.image}
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                    className={`main-img ${showHover ? "active" : ""}`}
                  />
                  {card.hoverImage && (
                    <Image
                      alt={`${card.title} hover`}
                      src={card.hoverImage}
                      fill
                      sizes="(max-width: 768px) 100vw, 340px"
                      className={`hover-img ${showHover ? "active" : ""}`}
                    />
                  )}

                  {/* Fullscreen Button */}
                  <button
                    className="fs-btn"
                    aria-label="Xem toàn màn hình"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen(card.id);
                    }}
                  >
                    <FullscreenOutlined />
                  </button>

                  {/* Overlay Title */}
                  <div className="overlay" onClick={() => goCategory(card.key)}>
                    <span className="title">{card.title}</span>
                  </div>
                </div>
              }
            />
          </div>
        ))}

        {/* CSS */}
        <style jsx>{`
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 24px;
            justify-items: center;
            margin: 30px auto 60px;
            padding: 0 16px;
            max-width: 1280px;
          }

          .card-wrapper {
            position: relative;
            width: 100%;
            max-width: 340px;
          }

          .card-item {
            border-radius: 16px;
            overflow: hidden;
            height: 100%;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          :global(.ant-card-hoverable.card-item:hover) {
            transform: translateY(-5px);
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
          }

          .image-wrapper {
            position: relative;
            width: 100%;
            padding-top: 133%;
            overflow: hidden;
            background: #000;
          }

          .main-img,
          .hover-img {
            object-fit: cover;
            transition: transform 0.8s ease, opacity 0.6s ease;
            pointer-events: none;
          }

          .hover-img {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            z-index: 1;
          }

          .image-wrapper:hover .main-img {
            transform: scale(1.08);
            opacity: 0;
          }

          .image-wrapper:hover .hover-img {
            opacity: 1;
            transform: scale(1.05);
          }

          .main-img.active {
            opacity: 0;
            transform: scale(1.08);
          }

          .hover-img.active {
            opacity: 1;
            transform: scale(1.05);
          }

          .overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 12px;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.55),
              rgba(0, 0, 0, 0.1)
            );
            display: flex;
            justify-content: center;
          }

          .title {
            color: white;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
          }

          .fs-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 3;
            width: 36px;
            height: 36px;
            border: 1px solid rgba(255, 255, 255, 0.35);
            border-radius: 999px;
            background: rgba(0, 0, 0, 0.45);
            color: #fff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(6px);
            cursor: pointer;
            transition: transform 0.2s ease, background 0.2s ease;
          }

          .fs-btn:hover {
            transform: scale(1.06);
            background: rgba(0, 0, 0, 0.65);
          }

          @media (max-width: 768px) {
            .title {
              font-size: 14px;
            }
            .fs-btn {
              width: 32px;
              height: 32px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Cards;
