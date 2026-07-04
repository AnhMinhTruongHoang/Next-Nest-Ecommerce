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

  // Lấy token từ localStorage, luôn chuẩn hoá thành "raw token" (không có Bearer)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("access_token");
      if (stored) {
        const pureToken = stored.startsWith("Bearer ")
          ? stored.slice(7)
          : stored;
        setAccessToken(pureToken);
      }
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?current=${meta.current}&pageSize=${meta.pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const d = await res.json();

      if (d.data && d.data.result) {
        setListUsers(d.data.result);
        setMeta(d.data.meta);
      } else {
        notification.error({
          message: "Dữ liệu không hợp lệ hoặc Token lỗi",
          description: JSON.stringify(d.message),
        });
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
    } catch (e) {
      notification.error({ message: "Lỗi khi phân trang" });
    } finally {
      setLoading(false);
    }
  };

  // ===== DELETE USER: viết trực tiếp trong table, không dùng deleteUserAction nữa =====
  const handleDeleteUser = async (user: IUser) => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const d = await res.json();

      if (d.data) {
        notification.success({ message: "Xóa người dùng thành công." });
        getData();
      } else {
        notification.error({
          message: "Không thể xóa người dùng",
          description: JSON.stringify(d.message),
        });
      }
    } catch (error) {
      notification.error({ message: "Lỗi khi xóa người dùng" });
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
          <Space wrap>
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
        record.name
          ?.toLowerCase()
          .includes((value as string).toLowerCase() ?? ""),
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
        <Space wrap>
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
    <div className="gz-user-admin-page">
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <div className="gz-user-admin-header">
          <div>
            <h2 className="gz-user-admin-title">Danh sách người dùng</h2>
            <p className="gz-user-admin-subtitle">
              Quản lý tài khoản và thông tin người dùng
            </p>
          </div>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!accessToken}
            className="gz-user-add-btn"
          >
            Thêm mới
          </Button>
        </div>

        <div className="gz-user-table-card">
          <Table
            className="gz-user-admin-table"
            columns={columns}
            dataSource={listUsers}
            rowKey="_id"
            scroll={{ x: "max-content" }}
            pagination={{
              position: ["bottomCenter"],
              current: meta.current,
              pageSize: meta.pageSize,
              total: meta.total,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} trên tổng ${total} người dùng`,
              onChange: handleOnChange,
              showSizeChanger: true,
            }}
          />
        </div>

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

      <style jsx global>{`
        .gz-user-admin-page {
          width: 100%;
          color: #ffffff;
        }

        .gz-user-admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          padding: 16px 18px;
          background: radial-gradient(
              circle at top right,
              rgba(0, 255, 224, 0.13),
              transparent 34%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(255, 77, 0, 0.11),
              transparent 36%
            );
          border: 1px solid #2a2d2e;
          border-radius: 16px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }

        .gz-user-admin-title {
          margin: 0;
          color: #ffffff;
          font-size: 26px;
          font-weight: 800;
          text-align: center;
        }

        .gz-user-admin-subtitle {
          margin: 5px 0 0;
          color: #8b949e;
          font-size: 13px;
          text-align: center;
        }

        .gz-user-add-btn {
          border: none !important;
          border-radius: 10px !important;
          font-weight: 800 !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          box-shadow: 0 8px 18px rgba(255, 77, 0, 0.18) !important;
        }

        .gz-user-add-btn:disabled {
          background: #303435 !important;
          color: #8b949e !important;
          box-shadow: none !important;
        }

        .gz-user-table-card {
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }

        .gz-user-admin-table .ant-table {
          background: #181a1b !important;
          color: #e5e7eb !important;
        }

        .gz-user-admin-table .ant-table-container {
          background: #181a1b !important;
        }

        .gz-user-admin-table .ant-table-thead > tr > th {
          background: #111314 !important;
          color: #ffffff !important;
          border-bottom: 1px solid #303435 !important;
          font-weight: 800 !important;
          white-space: nowrap;
        }

        .gz-user-admin-table .ant-table-tbody > tr > td {
          background: #181a1b !important;
          color: #d1d5db !important;
          border-bottom: 1px solid #2a2d2e !important;
          vertical-align: middle;
        }

        .gz-user-admin-table .ant-table-tbody > tr:hover > td {
          background: #202324 !important;
        }

        .gz-user-admin-table .ant-table-cell-row-hover {
          background: #202324 !important;
        }

        .gz-user-admin-table .ant-btn-link {
          color: #00ffe0 !important;
          font-weight: 700 !important;
        }

        .gz-user-admin-table .ant-btn-link:hover {
          color: #ff7a00 !important;
        }

        .gz-user-admin-table .ant-table-column-sorter,
        .gz-user-admin-table .ant-table-filter-trigger {
          color: #8b949e !important;
        }

        .gz-user-admin-table .ant-table-filter-trigger:hover {
          color: #00ffe0 !important;
        }

        .gz-user-admin-table .ant-empty-description {
          color: #8b949e !important;
        }

        .gz-user-admin-table .ant-pagination {
          padding: 12px 16px;
          margin: 0 !important;
          justify-content: center !important;
        }

        .gz-user-admin-table .ant-pagination-total-text {
          color: #b8b8b8 !important;
        }

        .gz-user-admin-table .ant-pagination-item {
          background: #111314 !important;
          border-color: #303435 !important;
        }

        .gz-user-admin-table .ant-pagination-item a {
          color: #e5e7eb !important;
        }

        .gz-user-admin-table .ant-pagination-item-active {
          border-color: #00ffe0 !important;
        }

        .gz-user-admin-table .ant-pagination-item-active a {
          color: #00ffe0 !important;
        }

        .gz-user-admin-table .ant-pagination-prev button,
        .gz-user-admin-table .ant-pagination-next button {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #e5e7eb !important;
        }

        .gz-user-admin-table .ant-select-selector {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
        }

        .gz-user-admin-page .ant-spin-text {
          color: #00ffe0 !important;
        }

        .gz-user-admin-page .ant-spin-dot-item {
          background-color: #00ffe0 !important;
        }

        @media (max-width: 992px) {
          .gz-user-admin-header {
            flex-direction: column;
            align-items: stretch;
          }

          .gz-user-add-btn {
            width: fit-content;
          }
        }

        @media (max-width: 768px) {
          .gz-user-admin-header {
            padding: 14px;
            border-radius: 14px;
          }

          .gz-user-admin-title {
            font-size: 22px;
          }

          .gz-user-admin-subtitle {
            font-size: 12px;
          }

          .gz-user-add-btn {
            width: 100%;
            height: 40px;
          }

          .gz-user-table-card {
            border-radius: 14px;
            overflow-x: auto;
          }

          .gz-user-admin-table .ant-table {
            font-size: 13px;
          }

          .gz-user-admin-table .ant-table-thead > tr > th,
          .gz-user-admin-table .ant-table-tbody > tr > td {
            padding: 10px 8px !important;
          }

          .gz-user-admin-table .ant-pagination-options {
            display: none !important;
          }
        }

        @media (max-width: 420px) {
          .gz-user-admin-title {
            font-size: 20px;
          }

          .gz-user-admin-table .ant-table {
            font-size: 12px;
          }
        }
        @media (max-width: 768px) {
          .gz-user-admin-header {
            position: relative;
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 14px !important;
            padding: 16px !important;
            margin-bottom: 16px !important;
            border-radius: 18px !important;
            background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.045),
                rgba(255, 255, 255, 0.012)
              ),
              #181a1b !important;
            border: 1px solid rgba(0, 255, 224, 0.12) !important;
            box-shadow: 0 14px 34px rgba(0, 0, 0, 0.32),
              inset 0 1px 0 rgba(255, 255, 255, 0.04) !important;
            overflow: hidden;
          }

          .gz-user-admin-header::before {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: radial-gradient(
                circle at top right,
                rgba(0, 255, 224, 0.13),
                transparent 34%
              ),
              radial-gradient(
                circle at bottom left,
                rgba(255, 77, 0, 0.11),
                transparent 36%
              );
          }

          .gz-user-admin-header > * {
            position: relative;
            z-index: 1;
          }

          .gz-user-admin-title {
            margin: 0 !important;
            color: #ffffff !important;
            font-size: 20px !important;
            line-height: 1.2 !important;
            font-weight: 900 !important;
            letter-spacing: -0.3px;
          }

          .gz-user-admin-subtitle {
            margin: 6px 0 0 !important;
            color: #a3aab5 !important;
            font-size: 12px !important;
            line-height: 1.4 !important;
            font-weight: 500 !important;
          }

          .gz-user-add-btn {
            width: 100% !important;
            height: 42px !important;
            border: none !important;
            border-radius: 13px !important;
            color: #ffffff !important;
            font-size: 13px !important;
            font-weight: 900 !important;
            background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
            box-shadow: 0 10px 24px rgba(255, 77, 0, 0.28),
              inset 0 1px 0 rgba(255, 255, 255, 0.18) !important;
          }

          .gz-user-add-btn:hover {
            background: linear-gradient(135deg, #ff6a00, #ff9a00) !important;
            color: #ffffff !important;
            transform: translateY(-1px);
          }

          .gz-user-add-btn:disabled {
            background: #303435 !important;
            color: #8b949e !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UsersTable;
