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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?${query}`
        );
        const data = await res.json();
        let result: TProduct[] = data?.data?.result ?? [];

        result = result.filter((p) => p._id !== currentProduct._id);

        // enrich rating
        const enriched = await Promise.all(
          result.map(async (p) => {
            try {
              const r = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/summary/${p._id}`
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

  return (
    <div style={{ marginTop: 24 }}>
      <h2
        style={{
          fontWeight: 800,
          marginBottom: 15,
          letterSpacing: 0.2,
          textAlign: "center",
        }}
      >
        Sản phẩm tương tự
      </h2>

      {/* Loading */}
      {isLoading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 16,
          }}
        >
          {Array.from({ length: cols }).map((_, i) => (
            <Card key={i} style={{ borderRadius: 12 }}>
              <Skeleton.Image
                style={{ width: "100%", height: 180, borderRadius: 10 }}
                active
              />
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

      {/* Error / Empty */}
      {!isLoading && errorMsg && (
        <div style={{ textAlign: "center", color: "#ff4d4f" }}>{errorMsg}</div>
      )}
      {!isLoading && !errorMsg && listProduct.length === 0 && (
        <Empty description="Không có sản phẩm liên quan" />
      )}

      {/* List */}
      {!isLoading && !errorMsg && listProduct.length > 0 && (
        <Carousel
          arrows
          prevArrow={<Arrow left />}
          nextArrow={<Arrow />}
          dots={false}
          draggable
        >
          {slides.map((group, idx) => (
            <div key={idx}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gap: 16,
                }}
              >
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
                  const hotDeal = discountPercent >= 15; // tuỳ chỉnh ngưỡng

                  // dải chip specs (nếu có)
                  const chips: string[] = [];
                  if (p.hz) chips.push(`${p.hz} Hz`);
                  if (p.sizeInch) chips.push(`${p.sizeInch} inch`);
                  if (p.panel) chips.push(p.panel.toUpperCase());
                  if (p.resolution)
                    chips.push(p.resolution.replace("x", " × "));

                  return (
                    <Link
                      key={p._id}
                      href={`/product-detail/${p._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Card
                        hoverable
                        style={{
                          borderRadius: 12,
                          overflow: "hidden",
                          height: "100%",
                          border: "1px solid #eee",
                        }}
                        styles={{
                          body: { padding: 12 },
                        }}
                        cover={
                          <div
                            style={{
                              position: "relative",
                              height: 180,
                              background: "#fff",
                            }}
                          >
                            <Image
                              alt={p.name}
                              src={imgSrc}
                              fill
                              sizes="280px"
                              style={{ objectFit: "contain" }}
                            />
                            {hotDeal && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: 10,
                                  left: 10,
                                  background: "#ff4d4f",
                                  color: "#fff",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  padding: "4px 8px",
                                  borderRadius: 999,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  boxShadow: "0 2px 8px rgba(0,0,0,.12)",
                                }}
                              >
                                <FireOutlined /> HOT DEAL
                              </div>
                            )}
                          </div>
                        }
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginBottom: 4,
                            minHeight: 22,
                            textAlign: "center",
                          }}
                          title={p.name}
                        >
                          {p.name}
                        </div>

                        {/* Chip specs */}
                        {chips.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              flexWrap: "wrap",
                              background: "#f5f5f5",
                              padding: 8,
                              borderRadius: 8,
                              margin: "6px 0 10px",
                            }}
                          >
                            {chips.slice(0, 4).map((c, i) => (
                              <span
                                key={i}
                                style={{
                                  background: "#fff",
                                  border: "1px solid #eaeaea",
                                  padding: "2px 8px",
                                  borderRadius: 6,
                                  fontSize: 12,
                                  color: "#666",
                                }}
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Rating + sold */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 6,
                            textAlign: "center",
                          }}
                        >
                          <Rate
                            disabled
                            allowHalf
                            value={p.averageRating ?? 0}
                          />
                          <span style={{ fontSize: 12, color: "#888" }}>
                            ({p.totalReviews ?? 0})
                          </span>
                          <Tag color="green" style={{ marginLeft: "auto" }}>
                            {p.sold ?? 0} đã bán
                          </Tag>
                        </div>

                        {/* Price block */}
                        <div>
                          {original && (
                            <div
                              style={{
                                color: "#999",
                                textDecoration: "line-through",
                                fontSize: 13,
                                marginBottom: 2,
                                textAlign: "center",
                              }}
                            >
                              {currencyVN(original)}{" "}
                              {discountPercent ? (
                                <span
                                  style={{
                                    color: "#ff4d4f",
                                    textAlign: "center",
                                  }}
                                >
                                  -{discountPercent}%
                                </span>
                              ) : null}
                            </div>
                          )}

                          <div
                            style={{
                              color: "#d0021b",
                              fontWeight: 800,
                              fontSize: 18,
                              textAlign: "center",
                            }}
                          >
                            {currencyVN(p.price)}
                          </div>

                          {discountAmount > 0 && (
                            <div
                              style={{
                                color: "#00a76f",
                                fontWeight: 600,
                                marginTop: 2,
                                fontSize: 13,
                              }}
                            >
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
      )}
    </div>
  );
};

export default SuggestionList;
