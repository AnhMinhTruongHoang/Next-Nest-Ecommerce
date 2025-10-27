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
    if (orderData) {
      setStatus(orderData.status);
    }
  }, [orderData]);

  const handleUpdateStatus = async () => {
    if (!orderData?._id) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/orders/${orderData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");

      message.success("Cập nhật trạng thái đơn hàng thành công!");
      setOrderData(data.data ?? data);
    } catch (err: any) {
      notification.error({
        message: "Cập nhật thất bại",
        description: err.message,
      });
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <Modal
      open={isViewModalOpen}
      onCancel={() => setIsViewModalOpen(false)}
      footer={null}
      width={850}
      title={<div style={{ textAlign: "center" }}>Chi tiết đơn hàng</div>}
    >
      {orderData && (
        <>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Order ID">
              {orderData._id}
            </Descriptions.Item>

            <Descriptions.Item label="User ID">
              {orderData.userId}
            </Descriptions.Item>
            <Descriptions.Item label="Full name">
              {orderData.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {orderData.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {orderData.shippingAddress}
            </Descriptions.Item>

            <Descriptions.Item label="Status">
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
                  ]}
                />
                <Button
                  type="primary"
                  loading={loading}
                  onClick={handleUpdateStatus}
                >
                  Cập nhật
                </Button>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label="Payment Ref">
              {orderData.paymentRef}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              {orderData.paymentMethod || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Total Price">
              {orderData.totalPrice.toLocaleString("vi-VN")} ₫
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {dayjs(orderData.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {dayjs(orderData.updatedAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
          </Descriptions>

          <Divider>Danh sách sản phẩm</Divider>
          <Table
            dataSource={orderData.items}
            rowKey={(item) => item.productId}
            pagination={false}
            size="small"
            columns={[
              {
                title: "Sản phẩm",
                dataIndex: "productId",
                render: (productId: any) => (
                  <a
                    href={`/product-detail/${productId?._id || productId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1677ff" }}
                  >
                    {productId?.name || productId?._id || productId}
                  </a>
                ),
              },
              {
                title: "Số lượng",
                dataIndex: "quantity",
                align: "center",
              },
              {
                title: "Đơn giá",
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
                title: "Thành tiền",
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
