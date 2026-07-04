"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Carousel, Skeleton, Empty, Tag } from "antd";
import { LeftOutlined, RightOutlined, FireOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/utils/getImageUrl";

type TCategory =
  | string
  | {
      _id?: string;
      name?: string;
    };

type TProduct = {
  _id: string;

  name: string;
  brand?: string;
  description?: string;

  price: number;
  originalPrice?: number;

  stock?: number;
  sold?: number;
  quantity?: number;

  thumbnail?: string;
  images?: string[];

  category?: TCategory | TCategory[];

  hz?: number | string;
  sizeInch?: number | string;
  panel?: string;
  resolution?: string;

  averageRating?: number;
  totalReviews?: number;

  createdAt?: string | Date;
  updatedAt?: string | Date;
};

interface SuggestionListProps {
  currentProduct: TProduct | null;
}

const currencyVN = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const chunk = <T,>(arr: T[], size: number) =>
  arr.reduce<T[][]>(
    (acc, _, index) =>
      index % size ? acc : [...acc, arr.slice(index, index + size)],
    []
  );

const getCategoryValue = (category?: TProduct["category"]) => {
  if (!category) return "";

  const firstCategory = Array.isArray(category) ? category[0] : category;

  if (!firstCategory) return "";

  if (typeof firstCategory === "string") return firstCategory;

  return firstCategory._id || firstCategory.name || "";
};

const Arrow = ({
  className,
  onClick,
  left,
}: {
  className?: string;
  onClick?: () => void;
  left?: boolean;
}) => (
  <button
    type="button"
    className={`${className || ""} similar-arrow ${
      left ? "similar-arrow-left" : "similar-arrow-right"
    }`}
    onClick={onClick}
    aria-label={left ? "Previous products" : "Next products"}
  >
    {left ? <LeftOutlined /> : <RightOutlined />}
  </button>
);

const SuggestionList = ({ currentProduct }: SuggestionListProps) => {
  const [listProduct, setListProduct] = useState<TProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [cols, setCols] = useState(4);

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "");

  const categoryValue = useMemo(
    () => getCategoryValue(currentProduct?.category),
    [currentProduct?.category]
  );

  useEffect(() => {
    const syncCols = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setCols(1);
        return;
      }

      if (width < 1024) {
        setCols(2);
        return;
      }

      setCols(4);
    };

    syncCols();

    window.addEventListener("resize", syncCols);
    return () => window.removeEventListener("resize", syncCols);
  }, []);

  useEffect(() => {
    if (!currentProduct?._id || !categoryValue || !backendURL) {
      setListProduct([]);
      return;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      setIsLoading(true);
      setErrorMsg("");

      try {
        const query = new URLSearchParams({
          current: "1",
          pageSize: "12",
          category: categoryValue,
          sort: "-sold",
        });

        const res = await fetch(`${backendURL}/products?${query.toString()}`, {
          signal: controller.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Cannot fetch related products");
        }

        let result: TProduct[] = Array.isArray(data?.data?.result)
          ? data.data.result
          : Array.isArray(data?.data)
          ? data.data
          : [];

        result = result.filter((item) => item._id !== currentProduct._id);

        const enriched = await Promise.all(
          result.slice(0, 8).map(async (product) => {
            try {
              const reviewRes = await fetch(
                `${backendURL}/reviews/summary/${product._id}`,
                { signal: controller.signal }
              );

              const summary = await reviewRes.json();
              const payload = summary?.data ?? summary;

              return {
                ...product,
                averageRating: Number(payload?.average ?? 0),
                totalReviews: Number(payload?.total ?? 0),
              };
            } catch {
              return {
                ...product,
                averageRating: 0,
                totalReviews: 0,
              };
            }
          })
        );

        setListProduct(enriched);
      } catch (error: any) {
        if (error?.name === "AbortError") return;

        console.error("Fetch related products error:", error);
        setErrorMsg("Không tải được sản phẩm gợi ý.");
        setListProduct([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [backendURL, categoryValue, currentProduct?._id]);

  const slides = useMemo(() => chunk(listProduct, cols), [listProduct, cols]);

  return (
    <section className="similar-section">
      <div className="similar-section-head">
        <span>Recommended Products</span>
        <h2>Sản phẩm tương tự</h2>
        <p>Những sản phẩm cùng danh mục có thể phù hợp với bạn.</p>
      </div>

      {isLoading && (
        <div className="similar-grid">
          {Array.from({ length: cols }).map((_, index) => (
            <Card key={index} className="similar-card loading-card">
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

      {!isLoading && errorMsg && (
        <div className="similar-error">{errorMsg}</div>
      )}

      {!isLoading && !errorMsg && listProduct.length === 0 && (
        <div className="similar-empty">
          <Empty
            description={
              <span style={{ color: "#b8c0cc", fontWeight: 700 }}>
                Không có sản phẩm liên quan
              </span>
            }
          />
        </div>
      )}

      {!isLoading && !errorMsg && listProduct.length > 0 && (
        <div className="similar-carousel-wrap">
          <Carousel
            arrows={slides.length > 1}
            prevArrow={slides.length > 1 ? <Arrow left /> : undefined}
            nextArrow={slides.length > 1 ? <Arrow /> : undefined}
            dots={slides.length > 1}
            draggable={slides.length > 1}
            className="similar-carousel"
          >
            {slides.map((group, index) => (
              <div key={index}>
                <div className="similar-grid">
                  {group.map((product) => {
                    const imgSrc =
                      getImageUrl(product.thumbnail) || "/images/noimage.png";

                    const original =
                      product.originalPrice &&
                      product.originalPrice > product.price
                        ? product.originalPrice
                        : undefined;

                    const discountAmount = original
                      ? Math.max(original - product.price, 0)
                      : 0;

                    const discountPercent = original
                      ? Math.round((discountAmount / original) * 100)
                      : 0;

                    const hotDeal = discountPercent >= 15;

                    const chips: string[] = [];

                    if (product.hz) chips.push(`${product.hz} Hz`);
                    if (product.sizeInch)
                      chips.push(`${product.sizeInch} inch`);
                    if (product.panel) chips.push(product.panel.toUpperCase());
                    if (product.resolution) {
                      chips.push(product.resolution.replace("x", " × "));
                    }

                    return (
                      <Link
                        key={product._id}
                        href={`/product-detail/${product._id}`}
                        className="similar-link"
                      >
                        <Card
                          hoverable
                          className="similar-card"
                          cover={
                            <div className="similar-img-box">
                              <Image
                                alt={product.name}
                                src={imgSrc}
                                fill
                                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
                                className="similar-img"
                              />

                              {hotDeal && (
                                <div className="hot-deal">
                                  <FireOutlined /> HOT DEAL
                                </div>
                              )}
                            </div>
                          }
                        >
                          <div
                            className="similar-product-name"
                            title={product.name}
                          >
                            {product.name}
                          </div>

                          {chips.length > 0 && (
                            <div className="spec-chip-box">
                              {chips.slice(0, 4).map((chip) => (
                                <span key={chip} className="spec-chip">
                                  {chip}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="rating-row">
                            <Tag className="sold-tag">
                              {product.sold ?? 0} đã bán
                            </Tag>
                          </div>

                          <div className="price-block">
                            {original && (
                              <div className="original-price">
                                {currencyVN(original)}

                                {discountPercent > 0 && (
                                  <span className="discount-percent">
                                    -{discountPercent}%
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="similar-price">
                              {currencyVN(product.price)}
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
          padding: 26px 18px 40px;
          border-radius: 20px;
          background: radial-gradient(
              circle at top left,
              rgba(0, 255, 224, 0.06),
              transparent 36%
            ),
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.012)
            ),
            #111314;
          border: 1px solid #2a2d2e;
        }

        .similar-section-head {
          margin: 0 auto 22px;
          max-width: 620px;
          text-align: center;
        }

        .similar-section-head span {
          display: block;
          margin-bottom: 7px;
          color: #00ffe0;
          font-size: 11px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .similar-section-head h2 {
          margin: 0;
          color: #ffffff;
          font-size: 28px;
          font-weight: 950;
          line-height: 1.22;
        }

        .similar-section-head p {
          margin: 9px auto 0;
          color: #b8c0cc;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.55;
        }

        .similar-carousel-wrap {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          position: relative;
        }

        .similar-carousel .slick-list {
          padding: 4px 0 18px;
        }

        .similar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          align-items: stretch;
          width: 100%;
          margin: 0 auto;
        }

        .similar-link {
          display: block;
          height: 100%;
          text-decoration: none !important;
        }

        .similar-card {
          height: 100%;
          overflow: hidden;
          border-radius: 18px !important;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.01)
            ),
            #181a1b !important;
          border: 1px solid #2a2d2e !important;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22) !important;
          transition: transform 0.25s ease, border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .similar-card .ant-card-body {
          min-height: 160px;
          padding: 14px !important;
          background: transparent !important;
        }

        .similar-card:hover {
          transform: translateY(-5px);
          border-color: #00ffe0 !important;
          box-shadow: 0 16px 34px rgba(0, 255, 224, 0.12) !important;
        }

        .similar-img-box {
          position: relative;
          height: 190px;
          overflow: hidden;
          background: #0f1112;
          border-bottom: 1px solid #2a2d2e;
        }

        .similar-img {
          padding: 14px !important;
          object-fit: contain !important;
          transition: transform 0.35s ease;
        }

        .similar-card:hover .similar-img {
          transform: scale(1.055);
        }

        .hot-deal {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 2;
          padding: 5px 9px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
          border-radius: 999px;
          background: linear-gradient(135deg, #ff4d00, #ff7a00);
          box-shadow: 0 8px 18px rgba(255, 77, 0, 0.2);
        }

        .similar-product-name {
          min-height: 39px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 900;
          line-height: 1.4;
          text-align: center;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .spec-chip-box {
          margin: 10px 0;
          padding: 8px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 6px;
          border-radius: 12px;
          background: #111314;
          border: 1px solid #303435;
        }

        .spec-chip {
          padding: 3px 8px;
          color: #cbd5e1;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.2;
          border-radius: 999px;
          background: #0d0f10;
          border: 1px solid #303435;
        }

        .rating-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin: 8px 0;
          flex-wrap: wrap;
        }

        .sold-tag {
          margin: 0 !important;
          color: #22c55e !important;
          background: rgba(34, 197, 94, 0.1) !important;
          border: 1px solid rgba(34, 197, 94, 0.28) !important;
          border-radius: 999px !important;
          font-size: 12px !important;
          font-weight: 900 !important;
        }

        .price-block {
          margin-top: 8px;
          text-align: center;
        }

        .original-price {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #8b949e;
          font-size: 12px;
          font-weight: 700;
          text-decoration: line-through;
          margin-bottom: 3px;
        }

        .discount-percent {
          color: #ff4d4f;
          font-weight: 900;
          text-decoration: none;
        }

        .similar-price {
          color: #ff4d4f;
          font-size: 19px;
          font-weight: 950;
          line-height: 1.35;
        }

        .discount-amount {
          margin-top: 4px;
          color: #00c781;
          font-size: 12px;
          font-weight: 800;
        }

        .similar-error,
        .similar-empty {
          margin: 18px 0 20px;
          padding: 24px 12px;
          text-align: center;
          color: #b8c0cc;
          border-radius: 16px;
          background: #181a1b;
          border: 1px dashed #303435;
        }

        .similar-error {
          color: #ff7875;
          font-weight: 800;
        }

        .loading-card {
          padding: 0 !important;
        }

        .similar-skeleton-img {
          width: 100% !important;
          height: 190px !important;
        }

        .similar-carousel .similar-arrow {
          z-index: 8 !important;
          width: 40px !important;
          height: 40px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: none !important;
          border-radius: 999px !important;
          color: #ffffff !important;
          background: rgba(0, 128, 112, 0.82) !important;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28) !important;
          cursor: pointer !important;
          transform: translateY(-50%) !important;
          transition: background 0.2s ease, box-shadow 0.2s ease !important;
        }

        .similar-carousel .similar-arrow:hover {
          color: #061313 !important;
          background: #00ffe0 !important;
          box-shadow: 0 12px 28px rgba(0, 255, 224, 0.18) !important;
          transform: translateY(-50%) !important;
        }

        .similar-carousel .slick-prev {
          left: -50px !important;
        }

        .similar-carousel .slick-next {
          right: -50px !important;
        }

        .similar-carousel .slick-prev::before,
        .similar-carousel .slick-next::before,
        .similar-carousel .slick-prev::after,
        .similar-carousel .slick-next::after {
          display: none !important;
        }

        .similar-carousel .slick-dots {
          bottom: -8px !important;
        }

        .similar-carousel .slick-dots li {
          width: 18px !important;
          height: 4px !important;
        }

        .similar-carousel .slick-dots li button {
          width: 18px !important;
          height: 4px !important;
          border-radius: 999px !important;
          background: rgba(255, 255, 255, 0.35) !important;
          opacity: 1 !important;
        }

        .similar-carousel .slick-dots li.slick-active,
        .similar-carousel .slick-dots li.slick-active button {
          width: 30px !important;
        }

        .similar-carousel .slick-dots li.slick-active button {
          background: #00ffe0 !important;
        }

        @media (max-width: 1180px) {
          .similar-carousel-wrap {
            padding: 0 46px;
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
            margin-top: 18px;
            padding: 22px 12px 34px;
            border-radius: 18px;
          }

          .similar-section-head {
            margin-bottom: 18px;
          }

          .similar-section-head h2 {
            font-size: 24px;
          }

          .similar-section-head p {
            font-size: 13px;
          }

          .similar-carousel-wrap {
            padding: 0 38px;
          }

          .similar-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .similar-img-box {
            height: 170px;
          }

          .similar-card .ant-card-body {
            min-height: 150px;
            padding: 12px !important;
          }

          .similar-price {
            font-size: 17px;
          }

          .similar-carousel .similar-arrow {
            width: 34px !important;
            height: 34px !important;
          }
        }

        @media (max-width: 640px) {
          .similar-grid {
            grid-template-columns: 1fr;
            max-width: 300px;
          }

          .similar-carousel-wrap {
            padding: 0 32px;
          }
        }

        @media (max-width: 420px) {
          .similar-section {
            padding: 20px 10px 30px;
            border-radius: 16px;
          }

          .similar-section-head h2 {
            font-size: 22px;
          }

          .similar-section-head p {
            max-width: 280px;
          }

          .similar-carousel-wrap {
            padding: 0 28px;
          }

          .similar-grid {
            max-width: 100%;
          }

          .similar-img-box {
            height: 155px;
          }

          .similar-product-name {
            font-size: 13px;
          }

          .similar-card .ant-card-body {
            min-height: auto;
          }

          .similar-carousel .similar-arrow {
            width: 31px !important;
            height: 31px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SuggestionList;
