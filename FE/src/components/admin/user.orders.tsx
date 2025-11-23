"use client";
import { useEffect, useMemo, useState } from "react";
import { Modal, Table, message, Spin, Empty, Image, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { getImageUrl } from "@/utils/getImageUrl";

interface Product {
  _id: string;
  name: string;
  price: number;
  thumbnail?: string;
}
interface OrderItem {
  productId: Product;
  quantity: number;
  price: number;
}
export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
}

interface Props {
  openOrderHistory: boolean;
  setOpenOrderHistory: (open: boolean) => void;
  userId?: string;
}

const OrderHistoryModal: React.FC<Props> = ({
  openOrderHistory,
  setOpenOrderHistory,
  userId,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchOrders = async () => {
    if (!userId) {
      setOrders([]);
      return;
    }
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/user/${userId}`;
      const res = await axios.get(url, {
        params: { _ts: Date.now() },
        headers: { "Cache-Control": "no-cache" },
      });

      const payload = res?.data;
      const arr: Order[] = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.data)
        ? payload.data.data
        : [];

      // sắp xếp: đơn mới nhất lên đầu
      arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(arr);
    } catch (err) {
      console.error("[orders] fetch error:", err);
      message.error("Không thể tải danh sách đơn hàng!");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openOrderHistory && userId) fetchOrders();
  }, [openOrderHistory, userId]);

  useEffect(() => {
    if (openOrderHistory) fetchOrders();
  }, [refreshKey]);

  useEffect(() => {
    const onCreated = () => setRefreshKey((k) => k + 1);
    window.addEventListener("order:created", onCreated);
    return () => window.removeEventListener("order:created", onCreated);
  }, []);

  const columns: ColumnsType<Order> = useMemo(
    () => [
      {
        title: "Mã đơn",
        dataIndex: "_id",
        key: "_id",
        align: "center",
        width: 110,
        render: (id: string) => (
          <span
            style={{
              fontFamily: "monospace",
              fontWeight: 500,
              cursor: "pointer",
              color: "#1677ff",
            }}
            onClick={() => navigator.clipboard.writeText(id)}
            title="Nhấn để sao chép mã đơn"
          >
            #{id?.slice(-6)?.toUpperCase()}
          </span>
        ),
      },
      {
        title: "Sản phẩm",
        align: "center",
        key: "items",
        render: (_, record) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "stretch",
            }}
          >
            {record.items?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: idx % 2 === 0 ? "#fafafa" : "#fff",
                  border: "1px solid #f0f0f0",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                <Image
                  width={50}
                  height={50}
                  src={getImageUrl(item.productId?.thumbnail)}
                  alt={item.productId?.name}
                  fallback="/no-image.png"
                  style={{
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "1px solid #eee",
                  }}
                  preview={false}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    borderLeft: "1px solid #e5e5e5",
                    paddingLeft: 10,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#222",
                      fontSize: 14,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 220,
                    }}
                    title={item.productId?.name}
                  >
                    {item.productId?.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                    x{item.quantity} —{" "}
                    <span style={{ color: "#d0021b", fontWeight: 500 }}>
                      {item.price?.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        title: "Tổng tiền",
        align: "center",
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 140,
        render: (price: number) => `${price?.toLocaleString("vi-VN")}₫`,
      },
      {
        title: "Thanh toán",
        align: "center",
        key: "payment",
        width: 180,
        render: (_, r) => (
          <span>
            {r.paymentMethod} –{" "}
            <b style={{ color: r.paymentStatus === "PAID" ? "green" : "red" }}>
              {r.paymentStatus}
            </b>
          </span>
        ),
      },
      {
        title: "Trạng thái",
        align: "center",
        dataIndex: "status",
        key: "status",
        width: 140,
        render: (s: string) => {
          const color =
            s === "COMPLETED"
              ? "green"
              : s === "CANCELED"
              ? "red"
              : s === "PAID"
              ? "blue"
              : "orange";
          return <span style={{ color, fontWeight: 500 }}>{s}</span>;
        },
      },
      {
        title: "Ngày đặt",
        align: "center",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: (date: string) =>
          new Date(date).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        sorter: (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        defaultSortOrder: "descend",
      },
    ],
    []
  );

  return (
    <Modal
      open={openOrderHistory}
      onCancel={() => setOpenOrderHistory(false)}
      footer={null}
      width={900}
      destroyOnHidden
      title={
        <Space style={{ width: "100%", justifyContent: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>
            📦 Lịch sử đơn hàng
          </span>
          <ReloadOutlined
            style={{ color: "green" }}
            onClick={() => setRefreshKey((k) => k + 1)}
          >
            Refresh
          </ReloadOutlined>
        </Space>
      }
    >
      {loading ? (
        <Spin tip="Đang tải...">
          <div style={{ height: 120 }} />
        </Spin>
      ) : (
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          locale={{
            emptyText: (
              <Empty
                description="Không có đơn hàng nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          bordered
        />
      )}
    </Modal>
  );
};

export default OrderHistoryModal;
