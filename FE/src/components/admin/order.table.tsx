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
import { deleteOrderAction } from "@/lib/user.actions";
import "../../styles/users.css";
import dayjs from "dayjs";
import ViewOrderModal from "./view.order";

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
  }, []);

  const getData = async (page = 1, pageSize = 50) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/orders?current=${page}&pageSize=${pageSize}`,
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

  const handleDeleteOrder = async (order: IOrder) => {
    setLoading(true);
    try {
      const d = await deleteOrderAction(order, access_token);
      if (d.data) {
        notification.success({ message: "Xóa Order thành công." });
        getData(1, pagination?.pageSize || 999999);
      } else {
        notification.error({ message: JSON.stringify(d.message) });
      }
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
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "ID",
      dataIndex: "_id",
      align: "center",
      render: (value: string | null) =>
        value ? <Text copyable>{value}</Text> : "—",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      align: "center",
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: "descend",
      render: (value: string | null) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "---",
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      align: "center",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (value: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Math.round(value)),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      align: "center",
      filters: [
        { text: "COD", value: "COD" },
        { text: "VNPay", value: "VNPAY" },
        { text: "Momo", value: "MOMO" },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
      render: (method: string) => {
        switch (method) {
          case "COD":
            return <span style={{ color: "#fa541c" }}>COD</span>;
          case "VNPAY":
            return <span style={{ color: "#1890ff" }}>VNPay</span>;
          case "MOMO":
            return <span style={{ color: "#eb2f96" }}>Momo</span>;
          default:
            return <span style={{ color: "#595959" }}>{method || "N/A"}</span>;
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
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
        let style: React.CSSProperties = {};
        switch (status) {
          case "PENDING":
            style = { backgroundColor: "#FFF4E5", color: "#B76E00" };
            break;
          case "PAID":
            style = { backgroundColor: "#E8F5E9", color: "#2E7D32" };
            break;
          case "SHIPPED":
            style = { backgroundColor: "#E3F2FD", color: "#1565C0" };
            break;
          case "COMPLETED":
            style = { backgroundColor: "#E0F7FA", color: "#00838F" };
            break;
          case "REFUNDED":
            style = { backgroundColor: "gray", color: "black" };
            break;
          case "CANCELED":
            style = { backgroundColor: "red", color: "white" };
            break;
          default:
            style = { backgroundColor: "#ECEFF1", color: "#546E7A" };
            break;
        }
        return (
          <span
            style={{
              ...style,
              borderRadius: "9999px",
              padding: "4px 12px",
              fontWeight: 600,
              fontSize: 12,
              textTransform: "uppercase",
              display: "inline-block",
              letterSpacing: 0.5,
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            style={{ backgroundColor: "lightblue" }}
            onClick={() => {
              setOrderData(record);
              setIsViewModalOpen(true);
            }}
          >
            Duyệt đơn
          </Button>
          <Popconfirm
            title="Xóa đơn hàng này?"
            onConfirm={() => handleDeleteOrder(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2>Danh sách đơn hàng</h2>
        <Space>
          <Input.Search
            placeholder="Nhập ID / tên / số điện thoại để tìm..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button
            type="text"
            icon={<ReloadOutlined style={{ color: "green" }} />}
            onClick={() => getData(1, pagination?.pageSize || 999999)}
          >
            Refresh
          </Button>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add new
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey={"_id"}
        pagination={pagination}
      />
      <ViewOrderModal
        orderData={orderData}
        setOrderData={setOrderData}
        isViewModalOpen={isViewModalOpen}
        setIsViewModalOpen={setIsViewModalOpen}
      />
    </Spin>
  );
};

export default OrderTable;
