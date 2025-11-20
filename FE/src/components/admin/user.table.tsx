"use client";

import React, { useEffect, useState } from "react";
import "../../styles/users.css";
import { Table, Button, Popconfirm, Input, Space, Spin, App } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import UpdateUserModal from "./update.user";
import CreateUserModal from "./create.user";
import { deleteUserAction } from "@/lib/user.actions";
import ViewUserModal from "./view.User.Modal";

const UsersTable = () => {
  const [listUsers, setListUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<null | IUser>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const [viewUser, setViewUser] = useState<IUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { notification } = App.useApp();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 20,
    pages: 0,
    total: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        const formattedToken = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
        setAccessToken(formattedToken);
      }
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      getData();
    }
  }, [accessToken]);

  const getData = async () => {
    setLoading(true);
    try {
      const headers: any = { "Content-Type": "application/json" };
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?current=${meta.current}&pageSize=${meta.pageSize}`,
        { headers }
      );
      const d = await res.json();

      if (d.data && d.data.result) {
        setListUsers(d.data.result);
        setMeta(d.data.meta);
      } else {
        notification.error({ message: "Dữ liệu không hợp lệ hoặc Token lỗi" });
      }
    } catch (error) {
      notification.error({ message: "Lỗi khi gọi API" });
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?current=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const d = await res.json();
      if (!d.data) {
        notification.error({ message: JSON.stringify(d.message) });
      } else {
        setListUsers(d.data.result);
        setMeta(d.data.meta);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: IUser) => {
    setLoading(true);
    try {
      const d = await deleteUserAction(user, accessToken);
      if (d.data) {
        notification.success({ message: "Xóa người dùng thành công." });
        getData();
      } else {
        notification.error({ message: JSON.stringify(d.message) });
      }
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<IUser> = [
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      render: (value, record) => (
        <Button
          type="link"
          onClick={() => {
            setViewUser(record);
            setIsViewModalOpen(true);
          }}
        >
          {record.email}
        </Button>
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm theo tên"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button type="primary" onClick={() => confirm()} size="small">
              Tìm kiếm
            </Button>
            <Button onClick={() => clearFilters && clearFilters()} size="small">
              Đặt lại
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      align: "center",
      render: (isActive: boolean) =>
        isActive ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        ),
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setDataUpdate(record);
              setIsUpdateModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa người dùng"
            description={`Bạn có chắc muốn xóa ${record.name}?`}
            onConfirm={() => handleDeleteUser(record)}
            okText="Có"
            cancelText="Không"
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
        <h2>Danh sách người dùng</h2>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Thêm mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={listUsers}
        rowKey={"_id"}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên tổng ${total} người dùng`,
          onChange: handleOnChange,
          showSizeChanger: true,
        }}
      />
      <ViewUserModal
        isOpen={isViewModalOpen}
        setViewUser={setViewUser}
        setIsViewModalOpen={setIsViewModalOpen}
        userData={viewUser}
      />
      <CreateUserModal
        access_token={accessToken}
        getData={getData}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />
      <UpdateUserModal
        access_token={accessToken}
        getData={getData}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </Spin>
  );
};

export default UsersTable;
