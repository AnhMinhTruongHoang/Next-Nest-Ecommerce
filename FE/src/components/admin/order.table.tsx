"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Space, Spin, App, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { deleteOrderAction } from "@/lib/user.actions";
import "../../styles/users.css";
import dayjs from "dayjs";
import ViewOrderModal from "./view.order";

const OrderTable = () => {
  const [listOrder, setListOrder] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<null | IOrder>(null);
  const access_token =
    typeof window !== "undefined"
      ? (localStorage.getItem("access_token") as string)
      : "";
  const [orderData, setOrderData] = useState<IOrder | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { RangePicker } = DatePicker;
  const { notification } = App.useApp();

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 50,
    pages: 0,
    total: 0,
  });

  useEffect(() => {
    let mounted = true;
    getData();

    return () => {
      mounted = false;
    };
  }, []);

  const getData = async (page = meta.current, pageSize = meta.pageSize) => {
    setLoading(true);
    let mounted = true;

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
      } else if (mounted) {
        // sắp xếp theo ngày tạo mới nhất
        const sorted = d.data.result.sort(
          (a: IOrder, b: IOrder) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setListOrder(sorted);
        setMeta(d.data.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (mounted) setLoading(false);
    }
  };

  const handleOnChange = (page: number, pageSize?: number) => {
    setMeta((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }));
    getData(page, pageSize || meta.pageSize);
  };

  const handleDeleteOrder = async (order: IOrder) => {
    setLoading(true);
    try {
      const d = await deleteOrderAction(order, access_token);
      if (d.data) {
        notification.success({ message: "Xóa Order thành công." });
        getData();
      } else {
        notification.error({ message: JSON.stringify(d.message) });
      }
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<IOrder> = [
    {
      title: "STT",
      align: "center",
      render: (_: any, __: any, index: number) =>
        index + 1 + (meta.current - 1) * meta.pageSize,
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      align: "center",
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: "descend", // ✅ mới nhất lên đầu
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
          case "CANCELED":
          case "CANCELLED":
            style = { backgroundColor: "red", color: "black" };
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
            Xem
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
          <Button
            type="text"
            icon={<ReloadOutlined style={{ color: "green" }} />}
            onClick={() => getData()}
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
        dataSource={listOrder}
        rowKey={"_id"}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} items`,
          onChange: handleOnChange,
          showSizeChanger: true,
        }}
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
