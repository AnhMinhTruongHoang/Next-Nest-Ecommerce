"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  Card,
  Empty,
  Grid,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

interface ViewOrderModalProps {
  orderData: IOrder | null;
  isViewModalOpen: boolean;
  setOrderData: any;
  setIsViewModalOpen: (open: boolean) => void;
  accessToken?: string;
}

const { useBreakpoint } = Grid;
const { Text } = Typography;

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

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    if (orderData) setStatus(orderData.status);
  }, [orderData]);

  const getToken = (): string => {
    if (accessToken) return accessToken;

    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token") || "";
    }

    return "";
  };

  const buildHeaders = (): HeadersInit => {
    const token = getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }

    return headers;
  };

  const buildAuthHeader = () => {
    const token = getToken();

    if (!token) return {};

    return {
      Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
    };
  };

  const formatVND = (value?: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(Number(value) || 0));

  const formatDate = (value?: string) =>
    value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—";

  const getProductId = (item: any) => {
    const productId = item?.productId;
    if (!productId) return "unknown";
    if (typeof productId === "string") return productId;
    return productId?._id || "unknown";
  };

  const getProductName = (item: any) => {
    const productId = item?.productId;
    if (!productId) return "Không xác định";
    if (typeof productId === "string") return productId;
    return productId?.name || productId?._id || "Không xác định";
  };

  const renderStatusTag = (value?: string) => {
    const className = String(value || "UNKNOWN").toLowerCase();

    return (
      <span className={`gz-view-order-status ${className}`}>
        {value || "UNKNOWN"}
      </span>
    );
  };

  const renderPaymentMethod = (value?: string) => {
    const className = String(value || "unknown").toLowerCase();

    return (
      <span className={`gz-view-order-payment ${className}`}>
        {value || "Không xác định"}
      </span>
    );
  };

  const handleClose = () => {
    setIsViewModalOpen(false);
  };

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
          headers: buildHeaders(),
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Update failed");

      message.success("Cập nhật trạng thái đơn hàng thành công!");
      setOrderData(data.data ?? data);

      // Giữ lại hành vi cũ: refresh để table bên ngoài cập nhật.
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

  const productColumns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "SẢN PHẨM",
        dataIndex: "productId",
        render: (_productId: any, record: any) => {
          const productId = getProductId(record);
          const productName = getProductName(record);

          return (
            <a
              href={`/product-detail/${productId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gz-view-order-product-link"
            >
              {productName}
            </a>
          );
        },
      },
      {
        title: "SỐ LƯỢNG",
        dataIndex: "quantity",
        align: "center",
        width: 110,
      },
      {
        title: "ĐƠN GIÁ",
        dataIndex: "price",
        align: "right",
        width: 150,
        render: (val: number) => (
          <span className="gz-view-order-money">{formatVND(val)}</span>
        ),
      },
      {
        title: "THÀNH TIỀN",
        align: "right",
        width: 160,
        render: (_, record) => (
          <span className="gz-view-order-money total">
            {formatVND(record.price * record.quantity)}
          </span>
        ),
      },
    ],
    []
  );

  const orderItems = useMemo(() => {
    const items = Array.isArray(orderData?.items) ? orderData.items : [];

    return items.map((item: any, idx: number) => {
      const productId = getProductId(item);

      return {
        ...item,
        __rowKey:
          item?._id ||
          item?.id ||
          item?.orderItemId ||
          `${productId}-${item?.price ?? 0}-${item?.quantity ?? 0}-${idx}`,
      };
    });
  }, [orderData]);

  return (
    <>
      <Modal
        open={isViewModalOpen}
        onCancel={handleClose}
        footer={null}
        centered
        width={900}
        rootClassName="gz-view-order-modal-root"
        className="gz-view-order-modal"
        title={
          <div className="gz-view-order-title-wrap">
            <span className="gz-view-order-eyebrow">Order Details</span>
            <h3>Chi tiết đơn hàng</h3>
            <p>
              {orderData?._id
                ? `Mã đơn: ${orderData._id}`
                : "Thông tin chi tiết đơn hàng"}
            </p>
          </div>
        }
      >
        {!orderData ? (
          <div className="gz-view-order-empty">
            <Empty description="Không có dữ liệu đơn hàng" />
          </div>
        ) : (
          <>
            {isMobile ? (
              <div className="gz-view-order-mobile">
                <Card className="gz-view-order-mobile-card">
                  <div className="gz-view-order-mobile-card-head">
                    <span>Thông tin đơn hàng</span>
                    {renderStatusTag(orderData.status)}
                  </div>

                  <div className="gz-view-order-mobile-info">
                    <div className="gz-view-order-mobile-row">
                      <span>Mã đơn</span>
                      <Text copyable className="gz-view-order-copy-text">
                        {orderData._id}
                      </Text>
                    </div>

                    <div className="gz-view-order-mobile-row">
                      <span>Người dùng</span>
                      <b>{orderData.userId || "Không xác định"}</b>
                    </div>

                    <div className="gz-view-order-mobile-row">
                      <span>Họ và tên</span>
                      <b>{orderData.fullName || "—"}</b>
                    </div>

                    <div className="gz-view-order-mobile-row">
                      <span>Số điện thoại</span>
                      <b>{orderData.phoneNumber || "—"}</b>
                    </div>

                    <div className="gz-view-order-mobile-row full">
                      <span>Địa chỉ</span>
                      <b>{orderData.shippingAddress || "—"}</b>
                    </div>
                  </div>
                </Card>

                <Card className="gz-view-order-mobile-card">
                  <div className="gz-view-order-mobile-card-head">
                    <span>Trạng thái</span>
                  </div>

                  <div className="gz-view-order-status-control">
                    <Select
                      value={status}
                      onChange={setStatus}
                      className="gz-view-order-status-select"
                      classNames={{
                        popup: {
                          root: "gz-view-order-select-dropdown",
                        },
                      }}
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
                      className="gz-view-order-update-btn"
                    >
                      Cập Nhật
                    </Button>
                  </div>
                </Card>

                <Card className="gz-view-order-mobile-card">
                  <div className="gz-view-order-mobile-card-head">
                    <span>Thanh toán</span>
                    {renderPaymentMethod(orderData.paymentMethod)}
                  </div>

                  <div className="gz-view-order-mobile-info">
                    <div className="gz-view-order-mobile-row">
                      <span>Mã thanh toán</span>
                      <b>{orderData.paymentRef || "—"}</b>
                    </div>

                    <div className="gz-view-order-mobile-row">
                      <span>Mã giảm giá</span>
                      <b>{orderData.voucherCode || "—"}</b>
                    </div>

                    <div className="gz-view-order-mobile-row">
                      <span>Giảm giá</span>
                      <b className="danger">
                        {orderData.discount
                          ? `-${formatVND(orderData.discount)}`
                          : formatVND(0)}
                      </b>
                    </div>

                    <div className="gz-view-order-mobile-row">
                      <span>Tổng gốc</span>
                      <b>{formatVND(orderData.totalPrice)}</b>
                    </div>

                    <div className="gz-view-order-mobile-row">
                      <span>Tổng sau giảm</span>
                      <b className="success">
                        {formatVND(
                          orderData.finalTotal ?? orderData.totalPrice
                        )}
                      </b>
                    </div>

                    <div className="gz-view-order-mobile-row">
                      <span>Ngày tạo</span>
                      <b>{formatDate(orderData.createdAt)}</b>
                    </div>

                    <div className="gz-view-order-mobile-row">
                      <span>Cập nhật lúc</span>
                      <b>{formatDate(orderData.updatedAt)}</b>
                    </div>
                  </div>
                </Card>

                <Divider className="gz-view-order-divider">
                  Danh sách sản phẩm
                </Divider>

                <div className="gz-view-order-product-mobile-list">
                  {orderItems.length > 0 ? (
                    orderItems.map((item: any, index: number) => (
                      <Card
                        key={item.__rowKey}
                        className="gz-view-order-product-mobile-card"
                      >
                        <div className="gz-view-order-product-mobile-top">
                          <span>Sản phẩm #{index + 1}</span>
                          <b>{formatVND(item.price * item.quantity)}</b>
                        </div>

                        <a
                          href={`/product-detail/${getProductId(item)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gz-view-order-product-mobile-name"
                        >
                          {getProductName(item)}
                        </a>

                        <div className="gz-view-order-product-mobile-info">
                          <div>
                            <span>Số lượng</span>
                            <b>{item.quantity}</b>
                          </div>

                          <div>
                            <span>Đơn giá</span>
                            <b>{formatVND(item.price)}</b>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="gz-view-order-empty">
                      <Empty description="Không có sản phẩm" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  className="gz-view-order-descriptions"
                  styles={{ label: { width: "30%" } }}
                >
                  <Descriptions.Item label="Mã Đơn Hàng">
                    <Text copyable className="gz-view-order-copy-text">
                      {orderData._id}
                    </Text>
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
                    <Space wrap>
                      <Select
                        value={status}
                        style={{ width: 180 }}
                        onChange={setStatus}
                        classNames={{
                          popup: {
                            root: "gz-view-order-select-dropdown",
                          },
                        }}
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
                        className="gz-view-order-update-btn"
                      >
                        Cập Nhật
                      </Button>
                    </Space>
                  </Descriptions.Item>

                  <Descriptions.Item label="Mã Thanh Toán">
                    {orderData.paymentRef || "—"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Phương Thức Thanh Toán">
                    {renderPaymentMethod(orderData.paymentMethod)}
                  </Descriptions.Item>

                  <Descriptions.Item label="Mã Giảm Giá">
                    {orderData.voucherCode ? (
                      <Tag className="gz-view-order-voucher-tag">
                        {orderData.voucherCode}
                      </Tag>
                    ) : (
                      "—"
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="Giảm Giá">
                    <span className="gz-view-order-money danger">
                      {orderData.discount
                        ? `-${formatVND(orderData.discount)}`
                        : formatVND(0)}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Tổng Sau Giảm">
                    <strong className="gz-view-order-money success">
                      {formatVND(orderData.finalTotal ?? orderData.totalPrice)}
                    </strong>
                  </Descriptions.Item>

                  <Descriptions.Item label="Tổng Gốc">
                    <span className="gz-view-order-money">
                      {formatVND(orderData.totalPrice)}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày Tạo">
                    {formatDate(orderData.createdAt)}
                  </Descriptions.Item>

                  <Descriptions.Item label="Cập Nhật Lúc">
                    {formatDate(orderData.updatedAt)}
                  </Descriptions.Item>
                </Descriptions>

                <Divider className="gz-view-order-divider">
                  DANH SÁCH SẢN PHẨM
                </Divider>

                <div className="gz-view-order-table-card">
                  <Table
                    dataSource={orderItems}
                    rowKey="__rowKey"
                    pagination={false}
                    size="small"
                    columns={productColumns}
                    scroll={{ x: "max-content" }}
                    className="gz-view-order-product-table"
                  />
                </div>
              </>
            )}
          </>
        )}
      </Modal>

      <style jsx global>{`
        .gz-view-order-modal-root .ant-modal {
          max-width: calc(100vw - 28px) !important;
        }

        .gz-view-order-modal-root .ant-modal-content {
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.012)
            ),
            #181a1b !important;
          border: 1px solid rgba(0, 255, 224, 0.12) !important;
          border-radius: 20px !important;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55) !important;
          overflow: hidden;
        }

        .gz-view-order-modal-root .ant-modal-header {
          padding: 20px 24px 16px !important;
          margin: 0 !important;
          background: transparent !important;
          border-bottom: 1px solid #2a2d2e !important;
        }

        .gz-view-order-modal-root .ant-modal-body {
          padding: 18px 24px 20px !important;
          max-height: 72vh;
          overflow-y: auto;
        }

        .gz-view-order-modal-root .ant-modal-close {
          color: #e5e7eb !important;
        }

        .gz-view-order-modal-root .ant-modal-close:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .gz-view-order-modal-root .ant-modal-title {
          width: 100%;
        }

        .gz-view-order-title-wrap {
          width: 100%;
          padding: 0 34px;
          text-align: center;
        }

        .gz-view-order-eyebrow {
          display: block;
          margin: 0 0 6px;
          color: #00ffe0;
          font-size: 10px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: 0.9px;
          text-transform: uppercase;
          text-align: center;
        }

        .gz-view-order-title-wrap h3 {
          margin: 0;
          color: #ffffff;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.25;
          text-align: center;
        }

        .gz-view-order-title-wrap p {
          margin: 7px auto 0;
          max-width: 520px;
          color: #a3aab5;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.4;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .gz-view-order-title-wrap {
            padding: 0 30px;
          }

          .gz-view-order-title-wrap h3 {
            font-size: 20px;
          }

          .gz-view-order-title-wrap p {
            max-width: 260px;
            font-size: 12px;
          }
        }

        @media (max-width: 420px) {
          .gz-view-order-title-wrap {
            padding: 0 26px;
          }

          .gz-view-order-eyebrow {
            font-size: 10px;
          }

          .gz-view-order-title-wrap h3 {
            font-size: 18px;
          }

          .gz-view-order-title-wrap p {
            max-width: 210px;
            font-size: 12px;
          }
        }

        .gz-view-order-title-content h3 {
          margin: 0;
          color: #ffffff;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.2;
        }

        .gz-view-order-title-content p {
          margin: 5px 0 0;
          max-width: 520px;
          color: #a3aab5;
          font-size: 13px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .gz-view-order-descriptions {
          background: #181a1b !important;
          border-radius: 16px;
          overflow: hidden;
        }

        .gz-view-order-descriptions .ant-descriptions-view {
          border-color: #2a2d2e !important;
        }

        .gz-view-order-descriptions .ant-descriptions-item-label {
          background: #111314 !important;
          color: #8b949e !important;
          border-color: #2a2d2e !important;
          font-weight: 800 !important;
        }

        .gz-view-order-descriptions .ant-descriptions-item-content {
          background: #181a1b !important;
          color: #e5e7eb !important;
          border-color: #2a2d2e !important;
        }

        .gz-view-order-copy-text,
        .gz-view-order-copy-text .ant-typography-copy {
          color: #00ffe0 !important;
          font-weight: 800;
        }

        .gz-view-order-modal-root .ant-select-selector {
          background: #202324 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
          border-radius: 12px !important;
        }

        .gz-view-order-modal-root .ant-select-selection-item {
          color: #ffffff !important;
        }

        .gz-view-order-modal-root .ant-select-arrow {
          color: #8b949e !important;
        }

        .gz-view-order-modal-root .ant-select-focused .ant-select-selector {
          border-color: #00ffe0 !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.08) !important;
        }

        .gz-view-order-select-dropdown {
          background: #181a1b !important;
          border: 1px solid #2a2d2e !important;
          border-radius: 12px !important;
        }

        .gz-view-order-select-dropdown .ant-select-item {
          color: #e5e7eb !important;
        }

        .gz-view-order-select-dropdown .ant-select-item-option-active,
        .gz-view-order-select-dropdown .ant-select-item-option-selected {
          background: rgba(0, 255, 224, 0.1) !important;
          color: #00ffe0 !important;
        }

        .gz-view-order-update-btn {
          border: none !important;
          border-radius: 12px !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          color: #ffffff !important;
          font-weight: 900 !important;
          box-shadow: 0 8px 20px rgba(255, 77, 0, 0.22) !important;
        }

        .gz-view-order-update-btn:hover {
          background: linear-gradient(135deg, #ff6a00, #ff9a00) !important;
          color: #ffffff !important;
        }

        .gz-view-order-payment,
        .gz-view-order-status {
          display: inline-block;
          padding: 5px 11px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .gz-view-order-payment.cod {
          background: rgba(250, 84, 28, 0.12);
          color: #ff7a45;
        }

        .gz-view-order-payment.vnpay {
          background: rgba(24, 144, 255, 0.12);
          color: #40a9ff;
        }

        .gz-view-order-payment.momo {
          background: rgba(235, 47, 150, 0.12);
          color: #ff85c0;
        }

        .gz-view-order-payment.bank {
          background: rgba(0, 255, 224, 0.12);
          color: #00ffe0;
        }

        .gz-view-order-payment.unknown {
          background: rgba(255, 255, 255, 0.08);
          color: #b8b8b8;
        }

        .gz-view-order-status.pending {
          background: rgba(250, 173, 20, 0.14);
          color: #facc15;
        }

        .gz-view-order-status.paid {
          background: rgba(0, 199, 129, 0.14);
          color: #00c781;
        }

        .gz-view-order-status.shipped {
          background: rgba(24, 144, 255, 0.14);
          color: #40a9ff;
        }

        .gz-view-order-status.completed {
          background: rgba(0, 255, 224, 0.14);
          color: #00ffe0;
        }

        .gz-view-order-status.canceled {
          background: rgba(255, 77, 79, 0.16);
          color: #ff4d4f;
        }

        .gz-view-order-status.refunded {
          background: rgba(148, 163, 184, 0.16);
          color: #cbd5e1;
        }

        .gz-view-order-voucher-tag {
          border: none !important;
          border-radius: 999px !important;
          background: rgba(24, 144, 255, 0.14) !important;
          color: #40a9ff !important;
          font-weight: 900;
        }

        .gz-view-order-money {
          color: #e5e7eb;
          font-weight: 900;
        }

        .gz-view-order-money.success,
        .gz-view-order-mobile-row .success {
          color: #00c781 !important;
        }

        .gz-view-order-money.danger,
        .gz-view-order-mobile-row .danger {
          color: #ff4d4f !important;
        }

        .gz-view-order-divider {
          margin: 18px 0 14px !important;
          color: #00ffe0 !important;
          border-color: #303435 !important;
          font-weight: 900 !important;
        }

        .gz-view-order-divider .ant-divider-inner-text {
          color: #00ffe0 !important;
          font-weight: 900;
        }

        .gz-view-order-table-card {
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
          overflow: hidden;
        }

        .gz-view-order-product-table .ant-table {
          background: #181a1b !important;
          color: #e5e7eb !important;
        }

        .gz-view-order-product-table .ant-table-container {
          background: #181a1b !important;
        }

        .gz-view-order-product-table .ant-table-thead > tr > th {
          background: #111314 !important;
          color: #ffffff !important;
          border-bottom: 1px solid #303435 !important;
          font-weight: 900 !important;
          white-space: nowrap;
        }

        .gz-view-order-product-table .ant-table-tbody > tr > td {
          background: #181a1b !important;
          color: #d1d5db !important;
          border-bottom: 1px solid #2a2d2e !important;
        }

        .gz-view-order-product-table .ant-table-tbody > tr:hover > td {
          background: #202324 !important;
        }

        .gz-view-order-product-link {
          color: #00ffe0 !important;
          font-weight: 800;
        }

        .gz-view-order-product-link:hover {
          color: #ff7a00 !important;
        }

        .gz-view-order-mobile {
          display: grid;
          gap: 12px;
        }

        .gz-view-order-mobile-card,
        .gz-view-order-product-mobile-card {
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.01)
            ),
            #181a1b !important;
          border: 1px solid #2a2d2e !important;
          border-radius: 16px !important;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
          color: #e5e7eb !important;
        }

        .gz-view-order-mobile-card .ant-card-body,
        .gz-view-order-product-mobile-card .ant-card-body {
          padding: 14px !important;
        }

        .gz-view-order-mobile-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          color: #00ffe0;
          font-weight: 900;
        }

        .gz-view-order-mobile-info {
          display: grid;
          gap: 8px;
          padding: 10px;
          background: #111314;
          border: 1px solid #2a2d2e;
          border-radius: 12px;
        }

        .gz-view-order-mobile-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          color: #d1d5db;
          font-size: 13px;
        }

        .gz-view-order-mobile-row.full {
          align-items: flex-start;
          flex-direction: column;
          gap: 5px;
        }

        .gz-view-order-mobile-row span {
          color: #8b949e;
          font-weight: 800;
          flex-shrink: 0;
        }

        .gz-view-order-mobile-row b {
          min-width: 0;
          color: #ffffff;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .gz-view-order-mobile-row.full b {
          text-align: left;
          white-space: normal;
          word-break: break-word;
        }

        .gz-view-order-status-control {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
        }

        .gz-view-order-status-select {
          width: 100%;
        }

        .gz-view-order-product-mobile-list {
          display: grid;
          gap: 12px;
        }

        .gz-view-order-product-mobile-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .gz-view-order-product-mobile-top span {
          color: #8b949e;
          font-weight: 800;
          font-size: 12px;
        }

        .gz-view-order-product-mobile-top b {
          color: #00c781;
          font-weight: 900;
        }

        .gz-view-order-product-mobile-name {
          display: block;
          color: #00ffe0 !important;
          font-size: 14px;
          font-weight: 900;
          line-height: 1.4;
          margin-bottom: 10px;
        }

        .gz-view-order-product-mobile-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .gz-view-order-product-mobile-info div {
          padding: 10px;
          background: #111314;
          border: 1px solid #2a2d2e;
          border-radius: 12px;
        }

        .gz-view-order-product-mobile-info span {
          display: block;
          margin-bottom: 4px;
          color: #8b949e;
          font-size: 12px;
          font-weight: 800;
        }

        .gz-view-order-product-mobile-info b {
          color: #ffffff;
          font-weight: 900;
        }

        .gz-view-order-empty {
          padding: 24px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
        }

        .gz-view-order-empty .ant-empty-description {
          color: #8b949e !important;
        }

        @media (max-width: 768px) {
          .gz-view-order-modal-root .ant-modal {
            top: 12px !important;
            max-width: calc(100vw - 20px) !important;
          }

          .gz-view-order-modal-root .ant-modal-header {
            padding: 18px 16px 14px !important;
          }

          .gz-view-order-modal-root .ant-modal-body {
            padding: 14px 16px 16px !important;
            max-height: 72vh;
          }

          .gz-view-order-title-wrap {
            align-items: flex-start;
            gap: 10px;
            padding-right: 24px;
          }

          .gz-view-order-title-icon {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            font-size: 17px;
          }

          .gz-view-order-title-content h3 {
            font-size: 19px;
          }

          .gz-view-order-title-content p {
            max-width: 210px;
            font-size: 12px;
          }

          .gz-view-order-status-control {
            grid-template-columns: 1fr;
          }

          .gz-view-order-update-btn {
            width: 100%;
            height: 40px;
          }
        }

        @media (max-width: 420px) {
          .gz-view-order-title-content h3 {
            font-size: 18px;
          }

          .gz-view-order-eyebrow {
            font-size: 10px;
          }

          .gz-view-order-product-mobile-info {
            grid-template-columns: 1fr;
          }

          .gz-view-order-mobile-row {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default ViewOrderModal;
