"use client";

import React, { useMemo, useRef } from "react";
import ChatBot from "react-chatbotify";

type Product = {
  _id?: string;
  name: string;
  brand?: string;
  price: number;
  stock?: number;
  thumbnail?: string;
};

type Props = {
  apiBase?: string; // VD: "http://localhost:8000/api/v1"
  pageSize?: number; // số item / trang backend, mặc định 200
  adminMessengerUrl?: string; // link Messenger admin
};

const InternalChatBot: React.FC<Props> = ({
  apiBase = process.env.NEXT_PUBLIC_BACKEND_URL,
  pageSize = 200,
  adminMessengerUrl = "https://m.me/878137915379497",
}) => {
  const cacheRef = useRef<{ products?: Product[] }>({});

  // Gọi API public, tự gom nhiều trang
  const fetchAllProducts = async (): Promise<Product[]> => {
    if (cacheRef.current.products) return cacheRef.current.products;

    let page = 1;
    const all: Product[] = [];
    for (let i = 0; i < 200; i++) {
      const url = `${apiBase}/products?current=${page}&pageSize=${pageSize}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API ${res.status} ở trang ${page}`);
      const json = await res.json();

      const list: Product[] =
        json?.data?.result ?? json?.result ?? json?.items ?? json?.data ?? [];

      if (!Array.isArray(list) || list.length === 0) break;

      all.push(
        ...list.map((p: any) => ({
          _id: p?._id ?? p?.id,
          name: p?.name,
          brand: p?.brand,
          price: Number(p?.price ?? 0),
          stock: Number(p?.stock ?? 0),
          thumbnail: p?.thumbnail,
        }))
      );

      if (list.length < pageSize) break;
      page += 1;
    }

    cacheRef.current.products = all;
    return all;
  };

  const vnd = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(Number(n || 0)) + "₫";

  const renderProductsNode = (products: Product[]) => {
    const showMax = 50; // tránh nặng UI
    const slice = products.slice(0, showMax);
    return (
      <div style={{ maxWidth: 320 }}>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>
          🛍️ Tổng sản phẩm: {products.length}
        </div>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.35 }}>
          {slice.map((p, idx) => (
            <div key={p._id ?? idx} style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 600 }}>
                {idx + 1}. {p.name}
              </div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>
                {p.brand ? `Thương hiệu: ${p.brand} • ` : ""}
                Giá: {vnd(p.price)} • Tồn: {p.stock ?? 0}
              </div>
            </div>
          ))}
          {products.length > showMax && (
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
              … Hiển thị {showMax}/{products.length}. Có thể thêm phân trang nếu
              cần.
            </div>
          )}
        </div>
        <div style={{ marginTop: 10, fontSize: 12 }}>
          💬 Cần hỗ trợ? Nhắn admin:&nbsp;
          <a
            href={adminMessengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4f46e5", fontWeight: 600 }}
          >
            Messenger
          </a>
        </div>
      </div>
    );
  };

  const flow = useMemo(
    () => ({
      start: {
        message: "Xin chào 👋! Mình là trợ lý nội bộ. Bạn muốn xem gì hôm nay?",
        options: [
          "Danh sách sản phẩm",
          "Xem thống kê",
          "Trạng thái hệ thống",
          "Liên hệ admin",
        ],
        path: "handleOption",
      },
      handleOption: {
        message: async ({ userInput }: { userInput: string }) => {
          switch (userInput) {
            case "Danh sách sản phẩm": {
              try {
                const products = await fetchAllProducts();
                return products.length
                  ? renderProductsNode(products)
                  : "⚠️ Không có sản phẩm nào.";
              } catch (e: any) {
                return `❌ Lỗi tải sản phẩm: ${e?.message ?? "Unknown error"}`;
              }
            }
            case "Xem thống kê": {
              try {
                const products = await fetchAllProducts();
                const total = products.length;
                const inStock = products.reduce(
                  (s, p) => s + (Number.isFinite(p.stock!) ? p.stock! : 0),
                  0
                );
                const sumList = products.reduce(
                  (s, p) => s + (p.price || 0),
                  0
                );
                return `📊 Thống kê nhanh: ${total} sản phẩm • Tồn kho tổng: ${inStock} • Tổng giá niêm yết: ${vnd(
                  sumList
                )}`;
              } catch (e: any) {
                return `❌ Lỗi tải thống kê: ${e?.message ?? "Unknown error"}`;
              }
            }
            case "Trạng thái hệ thống":
              return "🟢 Tất cả dịch vụ đang hoạt động ổn định.";
            case "Liên hệ admin":
              return (
                <span>
                  📧 Nhắn trực tiếp qua{" "}
                  <a
                    href={adminMessengerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#4f46e5", fontWeight: 600 }}
                  >
                    Messenger
                  </a>{" "}
                  để được hỗ trợ nhanh hơn 💬
                </span>
              );
            default:
              return "❓ Mình chưa hiểu ý bạn, thử lại nhé!";
          }
        },
        next: "start",
      },
    }),
    [apiBase, pageSize, adminMessengerUrl]
  );

  return (
    <ChatBot
      flow={flow}
      settings={{
        general: {
          showHeader: true,
          showFooter: true,
          embedded: false,
          primaryColor: "#4f46e5",
          secondaryColor: "#06b6d4",
          fontFamily: "Inter, system-ui, sans-serif",
        },
        header: {
          title: "Hỗ trợ nội bộ 💬",
          showAvatar: false,
        },
        chatButton: { icon: "💬" },
      }}
    />
  );
};

export default InternalChatBot;
