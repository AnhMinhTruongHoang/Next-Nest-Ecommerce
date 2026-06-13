"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Space,
  Spin,
  App,
  Input,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "../../styles/users.css";
import dayjs from "dayjs";
import ViewOrderModal from "./view.order";
import CreateOrderModal from "./create.order.modal";

const OrderTable = () => {
  const [listOrder, setListOrder] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [orderData, setOrderData] = useState<IOrder | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { notification } = App.useApp();

  const access_token =
    typeof window !== "undefined"
      ? (localStorage.getItem("access_token") as string)
      : "";

  const [pagination, setPagination] = useState<any>(false);
  const [searchText, setSearchText] = useState("");
  const { Text } = Typography;

  useEffect(() => {
    getData(1, 999999);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (page = 1, pageSize = 50) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders?current=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const d = await res.json();
      if (!d.data) {
        notification.error({ message: JSON.stringify(d.message) });
      } else {
        const sorted = d.data.result.sort(
          (a: IOrder, b: IOrder) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setListOrder(sorted);
        setFilteredOrders(sorted);

        setPagination({
          current: d.data.meta.current,
          pageSize: d.data.meta.pageSize,
          total: pageSize === 999999 ? sorted.length : d.data.meta.total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100", "0"],
          showTotal: (total: number, range: [number, number]) =>
            `${range[0]}-${range[1]} / ${total} items`,
          onChange: handleOnChange,
          onShowSizeChange: handleOnChange,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (page: number, pageSize?: number) => {
    const realPageSize = pageSize === 0 ? 999999 : pageSize;
    setPagination((prev: any) => ({
      ...prev,
      current: page,
      pageSize: realPageSize,
    }));
    getData(page, realPageSize || 50);
  };

  // ==== DELETE ORDER TRỰC TIẾP TRONG TABLE ====
  const handleDeleteOrder = async (order: IOrder) => {
    if (!order?._id) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${order._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const d = await res.json();

      if (d.data) {
        notification.success({ message: "Xóa order thành công." });
        // load lại dữ liệu với pageSize hiện tại
        getData(1, pagination?.pageSize || 999999);
      } else {
        notification.error({
          message: "Xóa thất bại",
          description: JSON.stringify(d.message),
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi khi xóa đơn hàng",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (!value) {
      setFilteredOrders(listOrder);
    } else {
      const lower = value.toLowerCase();
      setFilteredOrders(
        listOrder.filter(
          (order) =>
            order._id?.toLowerCase().includes(lower) ||
            order.fullName?.toLowerCase().includes(lower) ||
            order.phoneNumber?.toLowerCase().includes(lower)
        )
      );
    }
  };

  const columns: ColumnsType<IOrder> = [
    {
      title: "STT",
      align: "center",
      width: 70,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "ID",
      dataIndex: "_id",
      align: "center",
      width: 220,
      render: (value: string | null) =>
        value ? <Text copyable className="gz-order-id">{value}</Text> : "—",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      align: "center",
      width: 170,
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: "descend",
      render: (value: string | null) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "---",
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      align: "center",
      width: 160,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (value: number) => (
        <span className="gz-order-price">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(Math.round(value || 0))}
        </span>
      ),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      align: "center",
      width: 190,
      filters: [
        { text: "COD", value: "COD" },
        { text: "VNPay", value: "VNPAY" },
        { text: "Momo", value: "MOMO" },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
      render: (method: string) => {
        switch (method) {
          case "COD":
            return <span className="gz-payment cod">COD</span>;
          case "VNPAY":
            return <span className="gz-payment vnpay">VNPay</span>;
          case "MOMO":
            return <span className="gz-payment momo">Momo</span>;
          default:
            return <span className="gz-payment default">{method || "N/A"}</span>;
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      width: 160,
      filters: [
        { text: "PENDING", value: "PENDING" },
        { text: "PAID", value: "PAID" },
        { text: "SHIPPED", value: "SHIPPED" },
        { text: "COMPLETED", value: "COMPLETED" },
        { text: "CANCELED", value: "CANCELED" },
        { text: "REFUNDED", value: "REFUNDED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        const statusClass = String(status || "UNKNOWN").toLowerCase();
  
        return (
          <span className={`gz-order-status ${statusClass}`}>
            {status || "UNKNOWN"}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      align: "center",
      width: 190,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            className="gz-order-approve-btn"
            onClick={() => {
              setOrderData(record);
              setIsViewModalOpen(true);
            }}
          >
            Duyệt đơn
          </Button>
  
          <Popconfirm
  title="Xóa đơn hàng này?"
  description="Bạn có chắc muốn xoá đơn hàng này không?"
  onConfirm={() => handleDeleteOrder(record)}
  okText="Yes"
  cancelText="No"
  overlayClassName="gz-order-popconfirm"
>
  <Button danger className="gz-order-delete-btn">
    Xóa
  </Button>
</Popconfirm>
        </Space>
      ),
    },
  ];
  
  return (
    <div className="gz-order-admin-page">
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <div className="gz-order-admin-header">
          <div>
            <h2 className="gz-order-admin-title">Danh sách đơn hàng</h2>
            <p className="gz-order-admin-subtitle">
              Quản lý, tìm kiếm và xử lý đơn hàng
            </p>
          </div>
  
          <Space className="gz-order-admin-actions" wrap>
            <Input.Search
              className="gz-order-search"
              placeholder="Nhập ID / tên / số điện thoại để tìm..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
            />
  
            <Button
              type="text"
              icon={<ReloadOutlined style={{ color: "#00c781" }} />}
              onClick={() => getData(1, pagination?.pageSize || 999999)}
              className="gz-order-refresh-btn"
            >
              Refresh
            </Button>
  
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="gz-order-add-btn"
            >
              Add new
            </Button>
          </Space>
        </div>
  
        <div className="gz-order-table-card">
          <Table<IOrder>
            className="gz-order-admin-table"
            columns={columns}
            dataSource={filteredOrders}
            rowKey="_id"
            pagination={{
              ...pagination,
              position: ["bottomCenter"],
            }}
            scroll={{ x: 1200 }}
          />
        </div>
  
        <CreateOrderModal
          isOpen={isCreateModalOpen}
          setIsOpen={setIsCreateModalOpen}
          accessToken={access_token}
          reload={() => getData(1, pagination?.pageSize || 999999)}
        />
  
        <ViewOrderModal
          orderData={orderData}
          setOrderData={setOrderData}
          isViewModalOpen={isViewModalOpen}
          setIsViewModalOpen={setIsViewModalOpen}
        />
      </Spin>
  
      <style jsx global>{`
        .gz-order-admin-page {
          width: 100%;
          color: #ffffff;
        }
  
        .gz-order-admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          padding: 16px 18px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }
  
        .gz-order-admin-title {
          margin: 0;
          color: #ffffff;
          font-size: 26px;
          font-weight: 800;
        }
  
        .gz-order-admin-subtitle {
          margin: 5px 0 0;
          color: #8b949e;
          font-size: 13px;
        }
  
        .gz-order-admin-actions {
          justify-content: flex-end;
        }
  
        .gz-order-search {
          width: 330px;
        }
  
        .gz-order-search .ant-input {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
        }
  
        .gz-order-search .ant-input::placeholder {
          color: #6b7280 !important;
        }
  
        .gz-order-search .ant-input:hover,
        .gz-order-search .ant-input:focus {
          border-color: #00ffe0 !important;
          box-shadow: none !important;
        }
  
        .gz-order-search .ant-input-group-addon button {
          background: linear-gradient(135deg, #00d5c0, #00b894) !important;
          border-color: #00d5c0 !important;
          color: #ffffff !important;
        }
  
        .gz-order-refresh-btn {
          color: #e5e7eb !important;
          border-radius: 10px !important;
        }
  
        .gz-order-refresh-btn:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }
  
        .gz-order-add-btn {
          border: none !important;
          border-radius: 10px !important;
          font-weight: 800 !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          box-shadow: 0 8px 18px rgba(255, 77, 0, 0.18) !important;
        }
  
        .gz-order-table-card {
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }
  
        .gz-order-admin-table .ant-table {
          background: #181a1b !important;
          color: #e5e7eb !important;
        }
  
        .gz-order-admin-table .ant-table-container {
          background: #181a1b !important;
        }
  
        .gz-order-admin-table .ant-table-thead > tr > th {
          background: #111314 !important;
          color: #ffffff !important;
          border-bottom: 1px solid #303435 !important;
          font-weight: 800 !important;
          white-space: nowrap;
        }
  
        .gz-order-admin-table .ant-table-tbody > tr > td {
          background: #181a1b !important;
          color: #d1d5db !important;
          border-bottom: 1px solid #2a2d2e !important;
          vertical-align: middle;
        }
  
        .gz-order-admin-table .ant-table-tbody > tr:hover > td {
          background: #202324 !important;
        }
  
        .gz-order-admin-table .ant-table-cell-row-hover {
          background: #202324 !important;
        }
  
        .gz-order-admin-table .ant-typography {
          color: #e5e7eb !important;
        }
  
        .gz-order-admin-table .ant-typography-copy {
          color: #00ffe0 !important;
        }
  
        .gz-order-id {
          color: #00ffe0 !important;
          font-weight: 600;
        }
  
        .gz-order-price {
          color: #ff4d4f;
          font-weight: 800;
        }
  
        .gz-payment {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 12px;
        }
  
        .gz-payment.cod {
          background: rgba(250, 84, 28, 0.12);
          color: #ff7a45;
        }
  
        .gz-payment.vnpay {
          background: rgba(24, 144, 255, 0.12);
          color: #40a9ff;
        }
  
        .gz-payment.momo {
          background: rgba(235, 47, 150, 0.12);
          color: #ff85c0;
        }
  
        .gz-payment.default {
          background: rgba(255, 255, 255, 0.08);
          color: #b8b8b8;
        }
  
        .gz-order-status {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
  
        .gz-order-status.pending {
          background: rgba(250, 173, 20, 0.14);
          color: #facc15;
        }
  
        .gz-order-status.paid {
          background: rgba(0, 199, 129, 0.14);
          color: #00c781;
        }
  
        .gz-order-status.shipped {
          background: rgba(24, 144, 255, 0.14);
          color: #40a9ff;
        }
  
        .gz-order-status.completed {
          background: rgba(0, 255, 224, 0.14);
          color: #00ffe0;
        }
  
        .gz-order-status.refunded {
          background: rgba(148, 163, 184, 0.16);
          color: #cbd5e1;
        }
  
        .gz-order-status.canceled {
          background: rgba(255, 77, 79, 0.16);
          color: #ff4d4f;
        }
  
        .gz-order-approve-btn {
          border: none !important;
          border-radius: 999px !important;
          background: rgba(0, 255, 224, 0.12) !important;
          color: #00ffe0 !important;
          font-weight: 700 !important;
        }
  
        .gz-order-approve-btn:hover {
          background: rgba(0, 255, 224, 0.22) !important;
          color: #ffffff !important;
        }
  
        .gz-order-delete-btn {
          border-radius: 999px !important;
          font-weight: 700 !important;
        }
  
        .gz-order-admin-table .ant-table-column-sorter,
        .gz-order-admin-table .ant-table-filter-trigger {
          color: #8b949e !important;
        }
  
        .gz-order-admin-table .ant-table-filter-trigger:hover {
          color: #00ffe0 !important;
        }
  
        .gz-order-admin-table .ant-empty-description {
          color: #8b949e !important;
        }
  
        .gz-order-admin-table .ant-pagination {
          padding: 12px 16px;
          margin: 0 !important;
          justify-content: center !important;
        }
  
        .gz-order-admin-table .ant-pagination-total-text {
          color: #b8b8b8 !important;
        }
  
        .gz-order-admin-table .ant-pagination-item {
          background: #111314 !important;
          border-color: #303435 !important;
        }
  
        .gz-order-admin-table .ant-pagination-item a {
          color: #e5e7eb !important;
        }
  
        .gz-order-admin-table .ant-pagination-item-active {
          border-color: #00ffe0 !important;
        }
  
        .gz-order-admin-table .ant-pagination-item-active a {
          color: #00ffe0 !important;
        }
  
        .gz-order-admin-table .ant-pagination-prev button,
        .gz-order-admin-table .ant-pagination-next button {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #e5e7eb !important;
        }
  
        .gz-order-admin-table .ant-select-selector {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
        }
  
        .gz-order-admin-page .ant-spin-text {
          color: #00ffe0 !important;
        }
  
        .gz-order-admin-page .ant-spin-dot-item {
          background-color: #00ffe0 !important;
        }
  
        .ant-popconfirm .ant-popover-inner {
          background: #181a1b !important;
          border: 1px solid #2a2d2e !important;
        }
  
        .ant-popconfirm .ant-popover-title,
        .ant-popconfirm .ant-popover-inner-content {
          color: #ffffff !important;
        }
  
        @media (max-width: 992px) {
          .gz-order-admin-header {
            flex-direction: column;
            align-items: stretch;
          }
  
          .gz-order-admin-actions {
            justify-content: flex-start;
          }
  
          .gz-order-search {
            width: 100%;
          }
        }
  
        @media (max-width: 768px) {
          .gz-order-admin-header {
            padding: 14px;
            border-radius: 14px;
          }
  
          .gz-order-admin-title {
            font-size: 22px;
          }
  
          .gz-order-admin-subtitle {
            font-size: 12px;
          }
  
          .gz-order-admin-actions {
            display: grid !important;
            grid-template-columns: 1fr;
            gap: 10px !important;
          }
  
          .gz-order-admin-actions .ant-space-item {
            width: 100%;
          }
  
          .gz-order-refresh-btn,
          .gz-order-add-btn {
            width: 100%;
            height: 40px;
          }
  
          .gz-order-table-card {
            border-radius: 14px;
            overflow-x: auto;
          }
  
          .gz-order-admin-table .ant-table {
            font-size: 13px;
          }
  
          .gz-order-admin-table .ant-table-thead > tr > th,
          .gz-order-admin-table .ant-table-tbody > tr > td {
            padding: 10px 8px !important;
          }
  
          .gz-order-admin-table .ant-pagination-options {
            display: none !important;
          }

          .gz-order-delete-btn {
  border-radius: 999px !important;
  font-weight: 700 !important;
  background: rgba(255, 77, 79, 0.1) !important;
  border-color: rgba(255, 77, 79, 0.55) !important;
  color: #ff4d4f !important;
}

.gz-order-delete-btn:hover {
  background: rgba(255, 77, 79, 0.22) !important;
  border-color: #ff4d4f !important;
  color: #ffffff !important;
}

.gz-order-popconfirm .ant-popover-inner {
  background: #181a1b !important;
  border: 1px solid #2a2d2e !important;
  border-radius: 14px !important;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.35) !important;
}

.gz-order-popconfirm .ant-popover-arrow::before {
  background: #181a1b !important;
}

.gz-order-popconfirm .ant-popconfirm-title {
  color: #ffffff !important;
  font-weight: 800 !important;
}

.gz-order-popconfirm .ant-popconfirm-description {
  color: #b8b8b8 !important;
}

.gz-order-popconfirm .ant-popconfirm-message-icon {
  color: #ff4d4f !important;
}

.gz-order-popconfirm .ant-popconfirm-buttons .ant-btn-default {
  background: #111314 !important;
  border-color: #303435 !important;
  color: #e5e7eb !important;
  border-radius: 8px !important;
}

.gz-order-popconfirm .ant-popconfirm-buttons .ant-btn-default:hover {
  border-color: #00ffe0 !important;
  color: #00ffe0 !important;
}

.gz-order-popconfirm .ant-popconfirm-buttons .ant-btn-primary {
  background: #ff4d4f !important;
  border-color: #ff4d4f !important;
  color: #ffffff !important;
  border-radius: 8px !important;
  font-weight: 700 !important;
}

.gz-order-popconfirm .ant-popconfirm-buttons .ant-btn-primary:hover {
  background: #ff7875 !important;
  border-color: #ff7875 !important;
}
        }
  
        @media (max-width: 420px) {
          .gz-order-admin-title {
            font-size: 20px;
          }
  
          .gz-order-admin-table .ant-table {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderTable;
