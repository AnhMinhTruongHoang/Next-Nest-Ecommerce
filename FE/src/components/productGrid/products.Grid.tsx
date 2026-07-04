"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Carousel, Skeleton, Empty, Tag, Rate } from "antd";
import { LeftOutlined, RightOutlined, FireOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/utils/getImageUrl";

type TProduct = {
  _id: string;
  thumbnail?: string;
  name: string;
  price: number;
  sold?: number;
  averageRating?: number;
  totalReviews?: number;
};

const chunkArray = <T,>(arr: T[], size: number) => {
  const result: T[][] = [];

  for (let index = 0; index < arr.length; index += size) {
    result.push(arr.slice(index, index + size));
  }

  return result;
};

const currencyVN = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

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
    className={`${className || ""} gz-best-arrow ${
      left ? "gz-best-arrow-left" : "gz-best-arrow-right"
    }`}
    onClick={onClick}
    aria-label={left ? "Previous products" : "Next products"}
  >
    {left ? <LeftOutlined /> : <RightOutlined />}
  </button>
);

const ProductsGrid = () => {
  const [listProduct, setListProduct] = useState<TProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [itemsPerSlide, setItemsPerSlide] = useState(5);

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "");

  useEffect(() => {
    const updateItemsPerSlide = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setItemsPerSlide(1);
        return;
      }

      if (width < 1024) {
        setItemsPerSlide(3);
        return;
      }

      setItemsPerSlide(5);
    };

    updateItemsPerSlide();

    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  useEffect(() => {
    if (!backendURL) {
      setErrorMsg("Thiếu cấu hình API.");
      return;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      setIsLoading(true);
      setErrorMsg("");

      try {
        const query = new URLSearchParams({
          current: "1",
          pageSize: "20",
          sort: "-sold",
        });

        const res = await fetch(`${backendURL}/products?${query.toString()}`, {
          signal: controller.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Cannot fetch products");
        }

        const result: TProduct[] = Array.isArray(data?.data?.result)
          ? data.data.result
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const enriched = await Promise.all(
          result.map(async (product) => {
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

        console.error("Fetch products error:", error);
        setErrorMsg("Không tải được danh sách sản phẩm. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [backendURL]);

  const slides = useMemo(
    () => chunkArray(listProduct, itemsPerSlide),
    [listProduct, itemsPerSlide]
  );

  return (
    <section className="gz-best-sellers-section">
      <div className="gz-best-section-head">
        <span>Top Products</span>
        <h2>Best Sellers</h2>
        <p>Những sản phẩm gaming đang được mua nhiều nhất tại GamerZone.</p>
      </div>

      {isLoading && (
        <div className="gz-best-loading-grid">
          {Array.from({ length: itemsPerSlide }).map((_, index) => (
            <Card key={index} className="gz-best-card">
              <Skeleton.Image className="gz-best-skeleton-img" active />

              <div style={{ marginTop: 12 }}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && errorMsg && (
        <div className="gz-best-message error">{errorMsg}</div>
      )}

      {!isLoading && !errorMsg && listProduct.length === 0 && (
        <div className="gz-best-message">
          <Empty
            description={
              <span style={{ color: "#b8c0cc", fontWeight: 700 }}>
                Chưa có sản phẩm phù hợp
              </span>
            }
          />
        </div>
      )}

      {!isLoading && !errorMsg && listProduct.length > 0 && (
        <div className="gz-best-carousel-wrap">
          <Carousel
            arrows={slides.length > 1}
            prevArrow={slides.length > 1 ? <Arrow left /> : undefined}
            nextArrow={slides.length > 1 ? <Arrow /> : undefined}
            dots={slides.length > 1}
            autoplay
            draggable={slides.length > 1}
            className="gz-best-carousel"
          >
            {slides.map((group, index) => (
              <div key={index}>
                <div className="gz-best-products-slide">
                  {group.map((product, productIndex) => {
                    const imgSrc =
                      getImageUrl(product.thumbnail) || "/images/noimage.png";

                    return (
                      <Link
                        href={`/product-detail/${product._id}`}
                        key={product._id}
                        className="gz-best-link"
                      >
                        <Card
                          hoverable
                          className="gz-best-card"
                          cover={
                            <div className="gz-best-img-wrapper">
                              <Image
                                alt={product.name}
                                src={imgSrc}
                                fill
                                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 32vw, 260px"
                                className="gz-best-img"
                              />

                              {productIndex < 3 && (
                                <div className="gz-best-hot">
                                  <FireOutlined /> HOT
                                </div>
                              )}
                            </div>
                          }
                        >
                          <div className="gz-best-name" title={product.name}>
                            {product.name}
                          </div>

                          <div className="gz-best-rating-box">
                            <Rate
                              disabled
                              allowHalf
                              value={product.averageRating ?? 0}
                              style={{ color: "#faad14", fontSize: 13 }}
                            />

                            <div className="gz-best-review-text">
                              {product.totalReviews ?? 0} đánh giá
                            </div>
                          </div>

                          <div className="gz-best-price">
                            {currencyVN(product.price)}
                          </div>

                          <div className="gz-best-sold-box">
                            <Tag className="gz-best-sold-tag">
                              {product.sold ?? 0} đã bán
                            </Tag>
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
        .gz-best-sellers-section {
          padding: 34px 16px 54px;
          background: radial-gradient(
              circle at top left,
              rgba(0, 255, 224, 0.055),
              transparent 34%
            ),
            radial-gradient(
              circle at top right,
              rgba(255, 77, 0, 0.06),
              transparent 34%
            ),
            #1e2021;
        }

        .gz-best-section-head {
          max-width: 640px;
          margin: 0 auto 26px;
          text-align: center;
        }

        .gz-best-section-head span {
          display: block;
          margin-bottom: 7px;
          color: #00ffe0;
          font-size: 11px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .gz-best-section-head h2 {
          margin: 0;
          color: #ffffff;
          font-size: 34px;
          font-weight: 950;
          line-height: 1.2;
        }

        .gz-best-section-head p {
          margin: 10px auto 0;
          color: #b8c0cc;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.55;
        }

        .gz-best-carousel-wrap {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          position: relative;
        }

        .gz-best-carousel .slick-list {
          padding: 6px 0 22px;
        }

        .gz-best-products-slide,
        .gz-best-loading-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 18px;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .gz-best-link {
          display: block;
          height: 100%;
          text-decoration: none !important;
        }

        .gz-best-card {
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

        .gz-best-card:hover {
          transform: translateY(-5px);
          border-color: #00ffe0 !important;
          box-shadow: 0 16px 34px rgba(0, 255, 224, 0.12) !important;
        }

        .gz-best-card .ant-card-body {
          min-height: 174px;
          padding: 14px !important;
          background: transparent !important;
        }

        .gz-best-img-wrapper {
          position: relative;
          height: 190px;
          overflow: hidden;
          background: #0f1112;
          border-bottom: 1px solid #2a2d2e;
        }

        .gz-best-img {
          padding: 14px !important;
          object-fit: contain !important;
          transition: transform 0.35s ease;
        }

        .gz-best-card:hover .gz-best-img {
          transform: scale(1.055);
        }

        .gz-best-hot {
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

        .gz-best-name {
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

        .gz-best-rating-box {
          margin-top: 10px;
          display: grid;
          justify-items: center;
          gap: 3px;
        }

        .gz-best-review-text {
          color: #9ca3af;
          font-size: 12px;
          font-weight: 700;
        }

        .gz-best-price {
          margin-top: 8px;
          color: #ff4d4f;
          font-size: 18px;
          font-weight: 950;
          line-height: 1.35;
          text-align: center;
        }

        .gz-best-sold-box {
          margin-top: 8px;
          text-align: center;
        }

        .gz-best-sold-tag {
          margin: 0 !important;
          color: #22c55e !important;
          background: rgba(34, 197, 94, 0.1) !important;
          border: 1px solid rgba(34, 197, 94, 0.28) !important;
          border-radius: 999px !important;
          font-size: 12px !important;
          font-weight: 900 !important;
        }

        .gz-best-message {
          max-width: 560px;
          margin: 18px auto 0;
          padding: 24px 12px;
          text-align: center;
          color: #b8c0cc;
          border-radius: 16px;
          background: #181a1b;
          border: 1px dashed #303435;
        }

        .gz-best-message.error {
          color: #ff7875;
          font-weight: 800;
        }

        .gz-best-skeleton-img {
          width: 100% !important;
          height: 190px !important;
        }

        .gz-best-card .ant-skeleton-title,
        .gz-best-card .ant-skeleton-paragraph > li {
          background: linear-gradient(
            90deg,
            #252829 25%,
            #333738 37%,
            #252829 63%
          ) !important;
        }

        .gz-best-carousel .gz-best-arrow {
          z-index: 8 !important;
          width: 42px !important;
          height: 42px !important;
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

        .gz-best-carousel .gz-best-arrow:hover {
          color: #061313 !important;
          background: #00ffe0 !important;
          box-shadow: 0 12px 28px rgba(0, 255, 224, 0.18) !important;
          transform: translateY(-50%) !important;
        }

        .gz-best-carousel .slick-prev {
          left: -54px !important;
        }

        .gz-best-carousel .slick-next {
          right: -54px !important;
        }

        .gz-best-carousel .slick-prev::before,
        .gz-best-carousel .slick-next::before,
        .gz-best-carousel .slick-prev::after,
        .gz-best-carousel .slick-next::after {
          display: none !important;
        }

        .gz-best-carousel .slick-dots {
          bottom: -8px !important;
        }

        .gz-best-carousel .slick-dots li {
          width: 18px !important;
          height: 4px !important;
        }

        .gz-best-carousel .slick-dots li button {
          width: 18px !important;
          height: 4px !important;
          border-radius: 999px !important;
          background: rgba(255, 255, 255, 0.35) !important;
          opacity: 1 !important;
        }

        .gz-best-carousel .slick-dots li.slick-active,
        .gz-best-carousel .slick-dots li.slick-active button {
          width: 30px !important;
        }

        .gz-best-carousel .slick-dots li.slick-active button {
          background: #00ffe0 !important;
        }

        @media (max-width: 1500px) {
          .gz-best-carousel-wrap {
            padding: 0 52px;
          }

          .gz-best-carousel .slick-prev {
            left: 0 !important;
          }

          .gz-best-carousel .slick-next {
            right: 0 !important;
          }
        }

        @media (max-width: 1024px) {
          .gz-best-products-slide,
          .gz-best-loading-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .gz-best-sellers-section {
            padding: 28px 12px 46px;
          }

          .gz-best-section-head h2 {
            font-size: 28px;
          }

          .gz-best-section-head p {
            font-size: 13px;
          }

          .gz-best-carousel-wrap {
            padding: 0 38px;
          }

          .gz-best-img-wrapper {
            height: 175px;
          }

          .gz-best-card .ant-card-body {
            min-height: 160px;
            padding: 12px !important;
          }

          .gz-best-carousel .gz-best-arrow {
            width: 34px !important;
            height: 34px !important;
          }
        }

        @media (max-width: 640px) {
          .gz-best-products-slide,
          .gz-best-loading-grid {
            grid-template-columns: 1fr;
            max-width: 310px;
          }

          .gz-best-carousel-wrap {
            padding: 0 32px;
          }
        }

        @media (max-width: 420px) {
          .gz-best-sellers-section {
            padding: 24px 10px 40px;
          }

          .gz-best-section-head h2 {
            font-size: 24px;
          }

          .gz-best-section-head p {
            max-width: 280px;
          }

          .gz-best-carousel-wrap {
            padding: 0 28px;
          }

          .gz-best-img-wrapper {
            height: 160px;
          }

          .gz-best-card .ant-card-body {
            min-height: auto;
          }

          .gz-best-carousel .gz-best-arrow {
            width: 31px !important;
            height: 31px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ProductsGrid;
