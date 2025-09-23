"use client";

import React, { useEffect, useState } from "react";
import "../../styles/users.css";
import { Table, Button, notification, Popconfirm, Input, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { IUser } from "next-auth";
import UpdateUserModal from "./update.user";
import CreateUserModal from "./create.user";
import { deleteUserAction } from "@/lib/user.actions";
import ViewUserModal from "./view.User.Modal";

const UsersTable = () => {
  const [listUsers, setListUsers] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [dataUpdate, setDataUpdate] = useState<null | IUser>(null);

  const access_token = localStorage.getItem("access_token") as string;

  const [viewUser, setViewUser] = useState<IUser | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  useEffect(() => {
    getData();
  }, []);

  //Promise fetch data
  const getData = async () => {
    const res = await fetch(
      `http://localhost:8000/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const d = await res.json();
    if (!d.data) {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
    setListUsers(d.data.result);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total,
    });
  };

  ////////// change page
  const handleOnChange = async (page: number, pageSize: number) => {
    const res = await fetch(
      `http://localhost:8000/api/v1/users?current=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const d = await res.json();
    if (!d.data) {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
    setListUsers(d.data.result);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total,
    });
  };

  ////////////Delete
  const handleDeleteUser = async (user: any) => {
    const d = await deleteUserAction(user, access_token);
    if (d.data) {
      notification.success({
        message: "Xóa product thành công.",
      });
      getData();
    } else {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
  };

  ///

  const columns: ColumnsType<IUser> = [
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      responsive: ["sm"],
      sorter: (a, b) => a.email.localeCompare(b.email),
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
      title: "Name",
      dataIndex: "name",
      align: "center",
      responsive: ["xs", "sm"],
      sorter: (a, b) => a.name?.localeCompare(b.name),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button type="primary" onClick={() => confirm()} size="small">
              Search
            </Button>
            <Button onClick={() => clearFilters && clearFilters()} size="small">
              Reset
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
      title: "Role",
      dataIndex: "role",
      align: "center",
      responsive: ["md"],
      sorter: (a, b) => a.role.localeCompare(b.role),
      filters: [
        { text: "ADMIN", value: "ADMIN" },
        { text: "USER", value: "USER" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role: string) => {
        if (role === "ADMIN") return "ADMIN";
        if (role === "USER") return "USER";
        return "UNKNOWN";
      },
    },
    {
      title: "Active",
      dataIndex: "isActive",
      align: "center",
      responsive: ["md"],
      sorter: (a, b) => Number(a.isActive) - Number(b.isActive),
      render: (isActive: boolean) =>
        isActive ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        ),
    },
    {
      title: "Actions",
      align: "center",
      responsive: ["xs", "sm", "md", "lg"],
      render: (value, record) => (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => {
              setDataUpdate(record);
              setIsUpdateModalOpen(true);
            }}
            type="default"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete the user"
            description={`Are you sure to delete this user. name = ${record.name}?`}
            onConfirm={() => handleDeleteUser(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  ///
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Table Users</h2>
        <div>
          <Button
            icon={<PlusOutlined />}
            type={"primary"}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add new
          </Button>
        </div>
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
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page: number, pageSize: number) =>
            handleOnChange(page, pageSize),
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
        access_token={access_token}
        getData={getData}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      <UpdateUserModal
        access_token={access_token}
        getData={getData}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </div>
  );
};

export default UsersTable;
