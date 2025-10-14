"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Input,
  Space,
  Spin,
  App,
  Tag,
  DatePicker,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import UpdateUserModal from "./update.user";
import CreateUserModal from "./create.user";
import { deleteUserAction } from "@/lib/user.actions";
import "../../styles/users.css";
import dayjs from "dayjs";
import ViewOrderModal from "./view.order";

const OrderTable = () => {
  const [listOrder, setListOrder] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<null | IOrder>(null);
  const access_token = localStorage.getItem("access_token") as string;
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
    getData();
  }, []);

  const getData = async (page = meta.current, pageSize = meta.pageSize) => {
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
        setListOrder(d.data.result);
        setMeta(d.data.meta);
      }
    } finally {
      setLoading(false);
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

  const handleDeleteUser = async (user: any) => {
    setLoading(true);
    try {
      const d = await deleteUserAction(user, access_token);
      if (d.data) {
        notification.success({ message: "Xóa User thành công." });
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
      title: "Thời gian",
      dataIndex: "createdAt",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const raw = (selectedKeys[0] as string) || "";
        const [start, end] = raw.split("|");

        return (
          <div style={{ padding: 8 }}>
            <RangePicker
              value={start && end ? [dayjs(start), dayjs(end)] : null}
              onChange={(dates) => {
                if (dates) {
                  setSelectedKeys([
                    `${dates[0]?.startOf("day").toISOString()}|${dates[1]
                      ?.endOf("day")
                      .toISOString()}`,
                  ]);
                } else {
                  setSelectedKeys([]);
                }
              }}
            />
            <div style={{ marginTop: 8 }}>
              <Button type="primary" onClick={() => confirm()} size="small">
                Lọc
              </Button>
              <Button onClick={() => clearFilters?.()} size="small">
                Reset
              </Button>
            </div>
          </div>
        );
      },
      onFilter: (value, record) => {
        const [start, end] = (value as string).split("|");
        const created = dayjs(record.createdAt);
        if (start && created.isBefore(dayjs(start))) return false;
        if (end && created.isAfter(dayjs(end))) return false;
        return true;
      },
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (value: string | null) => {
        if (!value) return "---";
        return dayjs(value).format("DD/MM/YYYY");
      },
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const raw = (selectedKeys[0] as string) || "";
        const [min, max] = raw
          .split("-")
          .map((v) => (v ? Number(v) : undefined));

        return (
          <div style={{ padding: 8 }}>
            <Space>
              <Input
                placeholder="Min"
                type="number"
                value={min}
                onChange={(e) => {
                  const newMin = e.target.value || "";
                  setSelectedKeys([`${newMin}-${max || ""}`]);
                }}
                style={{ width: 80 }}
              />
              <Input
                placeholder="Max"
                type="number"
                value={max}
                onChange={(e) => {
                  const newMax = e.target.value || "";
                  setSelectedKeys([`${min || ""}-${newMax}`]);
                }}
                style={{ width: 80 }}
              />
            </Space>
            <Space style={{ marginTop: 8 }}>
              <Button type="primary" onClick={() => confirm()} size="small">
                Tìm
              </Button>
              <Button onClick={() => clearFilters?.()} size="small">
                Reset
              </Button>
            </Space>
          </div>
        );
      },
      onFilter: (value, record) => {
        const [min, max] = (value as string)
          .split("-")
          .map((v) => (v ? Number(v) : undefined));

        if (min !== undefined && record.totalPrice < min) return false;
        if (max !== undefined && record.totalPrice > max) return false;
        return true;
      },
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
      title: "Trạng Thái",
      dataIndex: "status",
      align: "center",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Confirmed", value: "confirmed" },
        { text: "Shipped", value: "shipped" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        let color = "default";
        switch (status) {
          case "pending":
            color = "orange";
            break;
          case "confirmed":
            color = "blue";
            break;
          case "shipped":
            color = "green";
            break;
          case "cancelled":
            color = "red";
            break;
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
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
            View/Update
          </Button>
          <Popconfirm
            title="Delete the order"
            onConfirm={() => handleDeleteUser(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
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
        <h2>Table Order</h2>
        <Button
          type="text"
          icon={<ReloadOutlined style={{ color: "green" }} />}
          onClick={() => window.location.reload()}
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
            `${range[0]}-${range[1]} of ${total} items`,
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
