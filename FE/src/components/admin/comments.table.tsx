"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Input,
  Space,
  Rate,
  App,
  Spin,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TablePaginationConfig } from "antd/es/table/interface";
import { ReloadOutlined, SearchOutlined, StarFilled } from "@ant-design/icons";

// ===== Types =====
interface IUserRef {
  _id: string;
  email: string;
}
interface IProductRef {
  _id: string;
  name: string;
}
interface IReview {
  _id: string;
  userId: IUserRef | string;
  productId: IProductRef | string;
  rating: number;
  comment?: string;
  createdAt?: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const ReviewsTable: React.FC = () => {
  const [listReviews, setListReviews] = useState<IReview[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig | false>(
    false
  );
  const { notification } = App.useApp();

  // get token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    if (accessToken) getData(DEFAULT_PAGE, DEFAULT_LIMIT);
  }, [accessToken]);

  // ===== API =====
  const getData = async (page = DEFAULT_PAGE, limit = DEFAULT_LIMIT) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8000/api/v1/reviews?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const d = await res.json();

      // normalize items (ALWAYS array)
      const items: IReview[] =
        (Array.isArray(d?.items) && d.items) ||
        (Array.isArray(d?.data?.items) && d.data.items) ||
        (Array.isArray(d?.data?.result) && d.data.result) ||
        (Array.isArray(d?.data) && d.data) ||
        [];

      // normalize meta
      const meta = d?.pagination ||
        d?.data?.pagination ||
        d?.data?.meta || {
          page,
          limit,
          total: items.length,
        };

      setListReviews(items);

      const nextPagination: TablePaginationConfig = {
        current: Number(meta.page) || page,
        pageSize: Number(meta.limit) || limit,
        total: Number(meta.total) || items.length,
        showSizeChanger: true,
        showTotal: (total: number, range: [number, number]) =>
          `${range[0]}-${range[1]} / ${total} items`,
        onChange: handleOnChange,
        onShowSizeChange: handleOnChange,
      };
      setPagination(nextPagination);
    } catch (e) {
      notification.error({ message: "Lỗi tải dữ liệu reviews!" });
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (page: number, pageSize?: number) => {
    const nextSize: number =
      pageSize ??
      (typeof pagination === "object" && pagination?.pageSize
        ? pagination.pageSize
        : DEFAULT_LIMIT);

    getData(page, nextSize);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const d = await res.json();
      if (res.ok || d?.ok) {
        notification.success({ message: "Xoá review thành công!" });
        const cur = (pagination && pagination.current) || DEFAULT_PAGE;
        const size = (pagination && pagination.pageSize) || DEFAULT_LIMIT;
        getData(Number(cur), Number(size));
      } else {
        notification.error({ message: "Xoá thất bại!" });
      }
    } catch {
      notification.error({ message: "Không thể xoá review!" });
    }
  };

  // ===== Columns =====
  const columns: ColumnsType<IReview> = [
    {
      title: "User",
      dataIndex: ["userId", "email"],
      align: "center",
      render: (_v, record) =>
        typeof record.userId === "object"
          ? record.userId.email
          : String(record.userId),
    },
    {
      title: "Product",
      dataIndex: ["productId", "name"],
      align: "center",
      render: (_v, record) =>
        typeof record.productId === "object"
          ? record.productId.name
          : String(record.productId),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search product"
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
            <Button onClick={() => clearFilters?.()} size="small">
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) => {
        const productName =
          typeof record.productId === "object"
            ? record.productId.name
            : String(record.productId);
        return productName?.toLowerCase().includes(String(value).toLowerCase());
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      align: "center",
      filters: [5, 4, 3, 2, 1].map((v) => ({ text: `${v}⭐`, value: v })),
      onFilter: (value, record) => record.rating === value,
      render: (rating: number) => (
        <Rate
          disabled
          value={rating}
          character={<StarFilled style={{ color: "#faad14" }} />}
        />
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      align: "center",
      render: (comment?: string) =>
        comment ? (
          <span
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "inline-block",
              maxWidth: 260,
            }}
            title={comment}
          >
            {comment}
          </span>
        ) : (
          <Tag color="default">No comment</Tag>
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      align: "center",
      sorter: (a, b) =>
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime(),
      render: (value?: string) =>
        value ? new Date(value).toLocaleString("vi-VN") : "-",
    },
    {
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Xoá đánh giá"
          description="Bạn có chắc muốn xoá đánh giá này?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger size="small">
            Delete
          </Button>
        </Popconfirm>
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
          marginBottom: 16,
        }}
      >
        <h2>Table Reviews</h2>
        <Space>
          <Button
            type="text"
            icon={<ReloadOutlined style={{ color: "green" }} />}
            onClick={() => {
              const cur = (pagination && pagination.current) || DEFAULT_PAGE;
              const size = (pagination && pagination.pageSize) || DEFAULT_LIMIT;
              getData(Number(cur), Number(size));
            }}
          >
            Refresh
          </Button>
        </Space>
      </div>

      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Table<IReview>
          columns={columns}
          dataSource={Array.isArray(listReviews) ? listReviews : []}
          rowKey="_id"
          pagination={pagination}
        />
      </Spin>
    </div>
  );
};

export default ReviewsTable;
