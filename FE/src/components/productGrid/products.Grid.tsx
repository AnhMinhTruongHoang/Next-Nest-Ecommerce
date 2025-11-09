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
          `http://localhost:8000/api/v1/products?${query}`
        );
        const data = await res.json();
        const result: TProduct[] = data?.data?.result ?? [];

        const enriched = await Promise.all(
          result.map(async (p) => {
            try {
              const r = await fetch(
                `http://localhost:8000/api/v1/reviews/summary/${p._id}`
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
    <div>
      <div
        style={{
          textAlign: "center",
          padding: "8px",
          fontWeight: "bold",
          marginTop: 30,
        }}
      >
        <h1>Best Sellers</h1>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
            maxWidth: 1400,
            margin: "16px auto 40px",
            padding: "0 16px",
          }}
        >
          {Array.from({ length: itemsPerSlide }).map((_, i) => (
            <Card key={`sk-${i}`} hoverable style={{ borderRadius: 12 }}>
              <Skeleton.Image
                style={{ width: "100%", height: 180, borderRadius: 8 }}
                active
              />
              <div style={{ marginTop: 12 }}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && errorMsg && (
        <div style={{ textAlign: "center", margin: "16px 0 40px" }}>
          {errorMsg}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !errorMsg && listProduct.length === 0 && (
        <div style={{ textAlign: "center", margin: "16px 0 40px" }}>
          <Empty description="Chưa có sản phẩm phù hợp" />
        </div>
      )}

      {/* Carousel */}
      {!isLoading && !errorMsg && listProduct.length > 0 && (
        <Carousel arrows dots autoplay>
          {slides.map((group, index) => (
            <div key={index}>
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginTop: 16,
                  marginBottom: 30,
                }}
              >
                {group.map((p) => {
                  const imgSrc = getImageUrl(p.thumbnail);
                  return (
                    <Card
                      key={p._id}
                      hoverable
                      style={{
                        width: 300,
                        borderRadius: 12,
                        overflow: "hidden",
                      }}
                      cover={
                        <div
                          className="group overflow-hidden"
                          style={{ position: "relative", height: 200 }}
                        >
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
                          <div
                            title={p.name}
                            style={{
                              textAlign: "center",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {p.name}
                          </div>
                        }
                        description={
                          <div style={{ marginTop: 8 }}>
                            <div
                              style={{
                                justifyContent: "center",
                                textAlign: "center",
                              }}
                            >
                              <Rate
                                disabled
                                allowHalf
                                value={p.averageRating ?? 0}
                                style={{ color: "#faad14" }}
                              />
                              <div style={{ fontSize: 12, color: "#888" }}>
                                ({p.totalReviews ?? 0} đánh giá)
                              </div>
                            </div>

                            <div
                              style={{
                                textAlign: "center",
                                fontWeight: 700,
                                color: "#d0021b",
                                marginTop: 4,
                              }}
                            >
                              {currencyVN(p.price)}
                            </div>

                            <div style={{ textAlign: "center", marginTop: 6 }}>
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
        .ant-card-hoverable:hover {
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
};

export default ProductsGrid;
