"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Descriptions,
  Divider,
  Table,
  Select,
  Button,
  App,
  Space,
  Tag,
} from "antd";
import dayjs from "dayjs";

interface ViewOrderModalProps {
  orderData: IOrder | null;
  isViewModalOpen: boolean;
  setOrderData: any;
  setIsViewModalOpen: (open: boolean) => void;
  accessToken?: string;
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({
  orderData,
  setOrderData,
  isViewModalOpen,
  setIsViewModalOpen,
  accessToken,
}) => {
  const { message, notification } = App.useApp();
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderData) setStatus(orderData.status);
  }, [orderData]);

  const handleUpdateStatus = async () => {
    if (!orderData?._id) return;
    setLoading(true);
    try {
      const body: any = { status };
      if (status === "PAID") body.paymentStatus = "PAID";
      if (status === "REFUNDED") body.paymentStatus = "REFUNDED";
      if (status === "CANCELED") body.paymentStatus = "UNPAID";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${orderData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");

      message.success("Cập nhật trạng thái đơn hàng thành công!");
      setOrderData(data.data ?? data);
      window.location.reload();
    } catch (err: any) {
      notification.error({
        message: "Cập nhật thất bại",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isViewModalOpen}
      onCancel={() => setIsViewModalOpen(false)}
      footer={null}
      width={900}
      title={
        <div style={{ textAlign: "center", fontWeight: 600, fontSize: 18 }}>
          CHI TIẾT ĐƠN HÀNG
        </div>
      }
    >
      {orderData && (
        <>
          <Descriptions
            bordered
            column={1}
            size="small"
            styles={{ label: { width: "30%" } }}
          >
            <Descriptions.Item label="Mã Đơn Hàng">
              <strong>{orderData._id}</strong>
            </Descriptions.Item>

            <Descriptions.Item label="Người Dùng">
              {orderData.userId || "Không xác định"}
            </Descriptions.Item>

            <Descriptions.Item label="Họ Và Tên">
              {orderData.fullName}
            </Descriptions.Item>

            <Descriptions.Item label="Số Điện Thoại">
              {orderData.phoneNumber}
            </Descriptions.Item>

            <Descriptions.Item label="Địa Chỉ Giao Hàng">
              {orderData.shippingAddress}
            </Descriptions.Item>

            <Descriptions.Item label="Trạng Thái">
              <Space>
                <Select
                  value={status}
                  style={{ width: 180 }}
                  onChange={setStatus}
                  options={[
                    { value: "PENDING", label: "⏳ PENDING" },
                    { value: "PAID", label: "💰 PAID" },
                    { value: "SHIPPED", label: "🚚 SHIPPED" },
                    { value: "COMPLETED", label: "✅ COMPLETED" },
                    { value: "CANCELED", label: "❌ CANCELED" },
                    { value: "REFUNDED", label: "↩ REFUNDED" },
                  ]}
                />
                <Button
                  type="primary"
                  loading={loading}
                  onClick={handleUpdateStatus}
                >
                  Cập Nhật
                </Button>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label="Mã Thanh Toán">
              {orderData.paymentRef || "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Phương Thức Thanh Toán">
              {orderData.paymentMethod || "Không xác định"}
            </Descriptions.Item>

            <Descriptions.Item label="Mã Giảm Giá">
              {orderData.voucherCode ? (
                <Tag color="blue">{orderData.voucherCode}</Tag>
              ) : (
                "—"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Giảm Giá">
              {orderData.discount
                ? `-${orderData.discount.toLocaleString("vi-VN")} ₫`
                : "0 ₫"}
            </Descriptions.Item>

            <Descriptions.Item label="Tổng Sau Giảm">
              <strong style={{ color: "#52c41a" }}>
                {(orderData.finalTotal ?? orderData.totalPrice).toLocaleString(
                  "vi-VN"
                )}{" "}
                ₫
              </strong>
            </Descriptions.Item>

            <Descriptions.Item label="Tổng Gốc">
              {orderData.totalPrice.toLocaleString("vi-VN")} ₫
            </Descriptions.Item>

            <Descriptions.Item label="Ngày Tạo">
              {dayjs(orderData.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>

            <Descriptions.Item label="Cập Nhật Lúc">
              {dayjs(orderData.updatedAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ fontWeight: 600 }}>DANH SÁCH SẢN PHẨM</Divider>

          <Table
            dataSource={orderData.items}
            rowKey={(item) => item.productId}
            pagination={false}
            size="small"
            columns={[
              {
                title: "SẢN PHẨM",
                dataIndex: "productId",
                render: (productId: any) => (
                  <a
                    href={`/product-detail/${productId?._id || productId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1677ff", fontWeight: 500 }}
                  >
                    {productId?.name || productId?._id || productId}
                  </a>
                ),
              },
              {
                title: "SỐ LƯỢNG",
                dataIndex: "quantity",
                align: "center",
              },
              {
                title: "ĐƠN GIÁ",
                dataIndex: "price",
                align: "right",
                render: (val: number) =>
                  val.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  }),
              },
              {
                title: "THÀNH TIỀN",
                align: "right",
                render: (_, record) =>
                  (record.price * record.quantity).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  }),
              },
            ]}
          />
        </>
      )}
    </Modal>
  );
};

export default ViewOrderModal;
