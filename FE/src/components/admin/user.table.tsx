"use client";

import React, { useEffect, useState } from "react";
import "../../styles/users.css";
import { Table, Button, notification, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { IUser } from "next-auth";
import UpdateUserModal from "./update.user";
import CreateUserModal from "./create.user";
import { deleteUserAction } from "@/lib/actions";

const UsersTable = () => {
  const [listUsers, setListUsers] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [dataUpdate, setDataUpdate] = useState<null | IUser>(null);

  const access_token = localStorage.getItem("access_token") as string;

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  useEffect(() => {
    //update
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
        message: "Xóa user thành công.",
      });
      getData();
    } else {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
  };

  //////////

  const columns: ColumnsType<IUser> = [
    {
      title: "Email",
      dataIndex: "email",
      responsive: ["sm"],
      render: (value, record) => <div>{record.email}</div>,
    },
    {
      title: "Name",
      dataIndex: "name",
      responsive: ["xs", "sm"],
    },
    {
      title: "Role",
      dataIndex: "role",
      responsive: ["md"],
      render: (role: string) => {
        if (role === "ADMIN") return "ADMIN";
        if (role === "USER") return "USER";
        return "UNKNOWN";
      },
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
