"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Carousel, Skeleton, Empty, Tag, Rate } from "antd";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";

const { Meta } = Card;

type TProduct = {
  _id: string;
  thumbnail: string;
  name: string;
  price: number;
  sold: number;
  averageRating?: number;
  totalReviews?: number;
};

const chunkArray = <T,>(arr: T[], size: number) => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size)
    result.push(arr.slice(i, i + size));
  return result;
};

const currencyVN = (n?: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n ?? 0
  );

const ProductsGrid = () => {
  const [listProduct, setListProduct] = useState<TProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [itemsPerSlide, setItemsPerSlide] = useState<number>(5);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      const w = window.innerWidth;
      if (w < 640) setItemsPerSlide(1);
      else if (w < 1024) setItemsPerSlide(3);
      else setItemsPerSlide(5);
    };
    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  // fetch products + ratings
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const query = `current=1&pageSize=20&sort=-sold`;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?${query}`
        );
        const data = await res.json();
        const result: TProduct[] = data?.data?.result ?? [];

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

        setListProduct(enriched);
      } catch (e) {
        console.error("Fetch products error:", e);
        setErrorMsg("Không tải được danh sách sản phẩm. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const slides = useMemo(
    () => chunkArray(listProduct, itemsPerSlide),
    [listProduct, itemsPerSlide]
  );
  return (
    <div className="best-sellers-section">
      <div className="section-title">
        <h1>Best Sellers</h1>
      </div>
  
      {/* Loading */}
      {isLoading && (
        <div className="loading-grid">
          {Array.from({ length: itemsPerSlide }).map((_, i) => (
            <Card key={`sk-${i}`} hoverable className="product-card">
              <Skeleton.Image className="skeleton-img" active />
              <div style={{ marginTop: 12 }}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </Card>
          ))}
        </div>
      )}
  
      {/* Error */}
      {!isLoading && errorMsg && (
        <div className="message-text">
          {errorMsg}
        </div>
      )}
  
      {/* Empty */}
      {!isLoading && !errorMsg && listProduct.length === 0 && (
        <div className="empty-box">
          <Empty description={<span style={{ color: "#b8b8b8" }}>Chưa có sản phẩm phù hợp</span>} />
        </div>
      )}
  
      {/* Carousel */}
      {!isLoading && !errorMsg && listProduct.length > 0 && (
        <Carousel arrows dots autoplay className="best-seller-carousel">
          {slides.map((group, index) => (
            <div key={index}>
              <div className="products-slide">
                {group.map((p) => {
                  const imgSrc = getImageUrl(p.thumbnail);
  
                  return (
                    <Card
                      key={p._id}
                      hoverable
                      className="product-card"
                      cover={
                        <div className="product-img-wrapper">
                          <Image
                            alt={p.name}
                            src={imgSrc}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      }
                      onClick={() =>
                        (window.location.href = `/product-detail/${p._id}`)
                      }
                    >
                      <Meta
                        title={
                          <div title={p.name} className="product-name">
                            {p.name}
                          </div>
                        }
                        description={
                          <div className="product-info">
                            <div className="rating-box">
                              <Rate
                                disabled
                                allowHalf
                                value={p.averageRating ?? 0}
                                style={{ color: "#faad14" }}
                              />
                              <div className="review-text">
                                ({p.totalReviews ?? 0} đánh giá)
                              </div>
                            </div>
  
                            <div className="product-price">
                              {currencyVN(p.price)}
                            </div>
  
                            <div className="sold-box">
                              <Tag color="green">{p.sold ?? 0} đã bán</Tag>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </Carousel>
      )}
  
      <style jsx global>{`
        .best-sellers-section {
          background-color: #1e2021;
          padding: 10px 0 50px;
        }
  
        .section-title {
          text-align: center;
          padding: 8px;
          font-weight: bold;
          margin-top: 30px;
        }
  
        .section-title h1 {
          color: #ffffff;
          margin: 0;
          font-size: 32px;
          letter-spacing: 0.5px;
        }
  
        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          max-width: 1400px;
          margin: 16px auto 40px;
          padding: 0 16px;
        }
  
        .products-slide {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 16px;
          margin-bottom: 35px;
        }
  
        .product-card {
          width: 300px;
          border-radius: 14px;
          overflow: hidden;
          background-color: #181a1b !important;
          border: 1px solid #2a2d2e !important;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease,
            border-color 0.3s ease;
        }
  
        .product-card .ant-card-body {
          background-color: #181a1b;
          padding: 16px;
        }
  
        .product-card:hover {
          transform: translateY(-6px);
          border-color: #00ffe0 !important;
          box-shadow: 0 12px 30px rgba(0, 255, 224, 0.12) !important;
        }
  
        .product-img-wrapper {
          position: relative;
          height: 200px;
          overflow: hidden;
          background-color: #111;
        }
  
        .product-img-wrapper img {
          transition: transform 0.45s ease;
        }
  
        .product-card:hover .product-img-wrapper img {
          transform: scale(1.08);
        }
  
        .product-name {
          text-align: center;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
  
        .product-info {
          margin-top: 8px;
        }
  
        .rating-box {
          text-align: center;
        }
  
        .review-text {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 2px;
        }
  
        .product-price {
          text-align: center;
          font-weight: 800;
          color: #ff4d4f;
          margin-top: 6px;
          font-size: 16px;
        }
  
        .sold-box {
          text-align: center;
          margin-top: 8px;
        }
  
        .message-text,
        .empty-box {
          text-align: center;
          margin: 16px 0 40px;
          color: #b8b8b8;
        }
  
        .skeleton-img {
          width: 100% !important;
          height: 180px !important;
          border-radius: 8px !important;
        }
  
        .product-card .ant-skeleton-title,
        .product-card .ant-skeleton-paragraph > li {
          background: linear-gradient(
            90deg,
            #252829 25%,
            #333738 37%,
            #252829 63%
          ) !important;
        }
  
        .best-seller-carousel .slick-dots li button {
          background: rgba(255, 255, 255, 0.45) !important;
        }
  
        .best-seller-carousel .slick-dots li.slick-active button {
          background: #00ffe0 !important;
        }
  
        .best-seller-carousel .slick-prev,
        .best-seller-carousel .slick-next {
          color: #ffffff !important;
        }
  
        .best-seller-carousel .slick-prev::after,
        .best-seller-carousel .slick-next::after {
          border-color: #ffffff !important;
        }
  
        @media (max-width: 768px) {
          .section-title h1 {
            font-size: 26px;
          }
  
          .product-card {
            width: 90%;
            max-width: 320px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsGrid;
