"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Carousel, Skeleton, Empty, Rate, Tag } from "antd";
import { LeftOutlined, RightOutlined, FireOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/utils/getImageUrl";

type TProduct = {
  _id: string;
  thumbnail: string;
  name: string;
  price: number;
  sold: number;
  originalPrice?: number;
  averageRating?: number;
  totalReviews?: number;
  category?: string[] | string;
  hz?: number;
  sizeInch?: number;
  panel?: string;
  resolution?: string;
};

const currencyVN = (n?: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n ?? 0
  );

interface SuggestionListProps {
  currentProduct: TProduct;
}

const chunk = <T,>(arr: T[], size: number) =>
  arr.reduce<T[][]>(
    (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
    []
  );

const Arrow = ({
  className,
  onClick,
  left,
}: {
  className?: string;
  onClick?: () => void;
  left?: boolean;
}) => (
  <div
    className={className}
    onClick={onClick}
    style={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 4px 12px rgba(0,0,0,.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #eee",
      zIndex: 2,
    }}
  >
    {left ? <LeftOutlined /> : <RightOutlined />}
  </div>
);

const SuggestionList = ({ currentProduct }: SuggestionListProps) => {
  const [listProduct, setListProduct] = useState<TProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [cols, setCols] = useState(4);
  useEffect(() => {
    const sync = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(1);
      else if (w < 1024) setCols(2);
      else setCols(4);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const cat = Array.isArray(currentProduct?.category)
        ? currentProduct.category?.[0]
        : (currentProduct?.category as string);

      if (!cat) return;

      setIsLoading(true);
      setErrorMsg("");
      try {
        const query = `current=1&pageSize=10&category=${cat}&sort=-sold`;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?${query}`
        );
        const data = await res.json();
        let result: TProduct[] = data?.data?.result ?? [];

        result = result.filter((p) => p._id !== currentProduct._id);

        // enrich rating
        const enriched = await Promise.all(
          result.map(async (p) => {
            try {
              const r = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews/summary/${p._id}`
              );
              const summary = await r.json();
              return {
                ...p,
                averageRating: summary?.average ?? 0,
                totalReviews: summary?.total ?? 0,
              };
            } catch {
              return { ...p, averageRating: 0, totalReviews: 0 };
            }
          })
        );

        // Chỉ lấy tối đa 4 cho UI gọn như yêu cầu
        setListProduct(enriched.slice(0, 4));
      } catch (e) {
        console.error("Fetch related products error:", e);
        setErrorMsg("Không tải được sản phẩm gợi ý.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentProduct]);

  const slides = useMemo(() => chunk(listProduct, cols), [listProduct, cols]);
  ///
  return (
    <div className="similar-section">
      <h2 className="similar-title">Sản phẩm tương tự</h2>
  
      {/* Loading */}
      {isLoading && (
        <div className="similar-grid">
          {Array.from({ length: cols }).map((_, i) => (
            <Card key={i} className="similar-card loading-card">
              <Skeleton.Image className="similar-skeleton-img" active />
              <Skeleton
                active
                title
                paragraph={{ rows: 2 }}
                style={{ marginTop: 12 }}
              />
            </Card>
          ))}
        </div>
      )}
  
      {/* Error */}
      {!isLoading && errorMsg && (
        <div className="similar-error">{errorMsg}</div>
      )}
  
      {/* Empty */}
      {!isLoading && !errorMsg && listProduct.length === 0 && (
        <div className="similar-empty">
          <Empty
            description={
              <span style={{ color: "#b8b8b8" }}>
                Không có sản phẩm liên quan
              </span>
            }
          />
        </div>
      )}
  
      {/* List */}
      {!isLoading && !errorMsg && listProduct.length > 0 && (
        <div className="similar-carousel-wrap">
        <Carousel
  arrows={slides.length > 1}
  prevArrow={slides.length > 1 ? <Arrow left /> : undefined}
  nextArrow={slides.length > 1 ? <Arrow /> : undefined}
  dots={false}
  draggable={slides.length > 1}
  className="similar-carousel"
>
            {slides.map((group, idx) => (
              <div key={idx}>
                <div className="similar-grid">
                  {group.map((p) => {
                    const imgSrc = getImageUrl(p.thumbnail);
  
                    const original =
                      p.originalPrice && p.originalPrice > p.price
                        ? p.originalPrice
                        : undefined;
  
                    const discountAmount = original
                      ? Math.max(original - p.price, 0)
                      : 0;
  
                    const discountPercent = original
                      ? Math.round((discountAmount / original) * 100)
                      : 0;
  
                    const hotDeal = discountPercent >= 15;
  
                    const chips: string[] = [];
                    if (p.hz) chips.push(`${p.hz} Hz`);
                    if (p.sizeInch) chips.push(`${p.sizeInch} inch`);
                    if (p.panel) chips.push(p.panel.toUpperCase());
                    if (p.resolution) {
                      chips.push(p.resolution.replace("x", " × "));
                    }
  
                    return (
                      <Link
                        key={p._id}
                        href={`/product-detail/${p._id}`}
                        className="similar-link"
                      >
                        <Card
                          hoverable
                          className="similar-card"
                          styles={{
                            body: {
                              padding: 12,
                              backgroundColor: "#111314",
                            },
                          }}
                          cover={
                            <div className="similar-img-box">
                              <Image
                                alt={p.name}
                                src={imgSrc}
                                fill
                                sizes="280px"
                                style={{ objectFit: "contain" }}
                              />
  
                              {hotDeal && (
                                <div className="hot-deal">
                                  <FireOutlined /> HOT DEAL
                                </div>
                              )}
                            </div>
                          }
                        >
                          <div className="similar-product-name" title={p.name}>
                            {p.name}
                          </div>
  
                          {chips.length > 0 && (
                            <div className="spec-chip-box">
                              {chips.slice(0, 4).map((c, i) => (
                                <span key={i} className="spec-chip">
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}
  
                          <div className="rating-row">
                            <Rate
                              disabled
                              allowHalf
                              value={p.averageRating ?? 0}
                              style={{ color: "#faad14", fontSize: 13 }}
                            />
  
                            <Tag color="green" className="sold-tag">
                              {p.sold ?? 0} đã bán
                            </Tag>
                          </div>

                          
                          <span className="review-count">
                              ({p.totalReviews ?? 0})
                            </span>
  
  
                          <div className="price-block">
                            {original && (
                              <div className="original-price">
                                {currencyVN(original)}{" "}
                                {discountPercent ? (
                                  <span className="discount-percent">
                                    -{discountPercent}%
                                  </span>
                                ) : null}
                              </div>
                            )}
  
                            <div className="similar-price">
                              {currencyVN(p.price)}
                            </div>
  
                            {discountAmount > 0 && (
                              <div className="discount-amount">
                                Giảm {currencyVN(discountAmount)}
                              </div>
                            )}
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      )}
  
      <style jsx global>{`
        .similar-section {
          margin-top: 24px;
          padding: 28px 18px 45px;
          background: #1e2021;
          border-radius: 14px;
        }
  
        .similar-title {
          color: #ffffff;
          font-weight: 800;
          margin: 0 0 24px;
          letter-spacing: 0.3px;
          text-align: center;
        }
  
        .similar-carousel-wrap {
          max-width: 980px;
          margin: 0 auto;
          position: relative;
        }
  
        .similar-carousel .slick-list {
          padding: 4px 0 12px;
        }
  
        .similar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 280px));
          gap: 18px;
          justify-content: center;
          align-items: stretch;
          width: 100%;
          margin: 0 auto;
        }
  
        .similar-link {
          text-decoration: none !important;
          display: block;
          width: 100%;
        }
  
        .similar-card {
          width: 100%;
          height: 100%;
          border-radius: 14px !important;
          overflow: hidden;
          background: #111314 !important;
          border: 1px solid #2a2d2e !important;
          transition: transform 0.3s ease, box-shadow 0.3s ease,
            border-color 0.3s ease;
        }
  
        .similar-card .ant-card-body {
          background: #111314 !important;
          min-height: 112px;
        }
  
        .similar-card:hover {
          transform: translateY(-5px);
          border-color: #00ffe0 !important;
          box-shadow: 0 12px 28px rgba(0, 255, 224, 0.12) !important;
        }
  
        .similar-img-box {
          position: relative;
          height: 180px;
          background: #ffffff;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
  
        .similar-img-box img {
          padding: 10px !important;
          transition: transform 0.45s ease;
        }
  
        .similar-card:hover .similar-img-box img {
          transform: scale(1.06);
        }
  
        .hot-deal {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #ff4d4f;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
        }
  
        .similar-product-name {
          color: #ffffff;
          font-weight: 800;
          font-size: 14px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 8px;
        }
  
        .spec-chip-box {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
          background: #181a1b;
          padding: 7px;
          border-radius: 8px;
          margin: 8px 0 10px;
        }
  
        .spec-chip {
          background: #0d0f10;
          border: 1px solid #303435;
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 11px;
          color: #c9d1d9;
        }
  
        .rating-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
  
        .review-count {
          font-size: 12px;
          color: #b8b8b8;
        }
  
        .sold-tag {
          margin-left: 0 !important;
        }
  
        .price-block {
          text-align: center;
        }
  
        .original-price {
          color: #8b949e;
          text-decoration: line-through;
          font-size: 13px;
          margin-bottom: 2px;
        }
  
        .discount-percent {
          color: #ff4d4f;
          font-weight: 700;
          text-decoration: none;
        }
  
        .similar-price {
          color: #ff4d4f;
          font-weight: 900;
          font-size: 18px;
          line-height: 1.4;
        }
  
        .discount-amount {
          color: #00c781;
          font-weight: 600;
          margin-top: 4px;
          font-size: 13px;
        }
  
        .similar-error,
        .similar-empty {
          text-align: center;
          color: #b8b8b8;
          margin: 16px 0 40px;
        }
  
        .similar-error {
          color: #ff4d4f;
        }
  
        .similar-skeleton-img {
          width: 100% !important;
          height: 180px !important;
        }
  
        .similar-carousel .slick-prev,
        .similar-carousel .slick-next {
          width: 38px !important;
          height: 38px !important;
          z-index: 5 !important;
          background: rgba(255, 255, 255, 0.28) !important;
          border-radius: 50% !important;
        }
  
        .similar-carousel .slick-prev {
          left: -48px !important;
        }
  
        .similar-carousel .slick-next {
          right: -48px !important;
        }
  
        .similar-carousel .slick-prev:hover,
        .similar-carousel .slick-next:hover {
          background: rgba(0, 255, 224, 0.45) !important;
        }
  
        @media (max-width: 1100px) {
          .similar-carousel-wrap {
            max-width: 900px;
            padding: 0 42px;
          }
  
          .similar-carousel .slick-prev {
            left: 0 !important;
          }
  
          .similar-carousel .slick-next {
            right: 0 !important;
          }
        }
  
        @media (max-width: 768px) {
          .similar-section {
            padding: 24px 10px 36px;
          }
  
          .similar-title {
            font-size: 24px;
            margin-bottom: 18px;
          }
  
          .similar-carousel-wrap {
            padding: 0 34px;
          }
  
          .similar-grid {
            grid-template-columns: repeat(1, minmax(0, 280px));
            gap: 14px;
          }
  
          .similar-img-box {
            height: 170px;
          }
  
          .similar-card .ant-card-body {
            min-height: auto;
          }
        }
  
        @media (max-width: 420px) {
          .similar-carousel-wrap {
            padding: 0 28px;
          }
  
          .similar-grid {
            grid-template-columns: 1fr;
          }
  
          .similar-img-box {
            height: 155px;
          }
  
          .similar-price {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default SuggestionList;
