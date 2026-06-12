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

  // Lấy token
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const d = await res.json();

      // Chuẩn hoá dữ liệu (luôn là mảng)
      const items: IReview[] =
        (Array.isArray(d?.items) && d.items) ||
        (Array.isArray(d?.data?.items) && d.data.items) ||
        (Array.isArray(d?.data?.result) && d.data.result) ||
        (Array.isArray(d?.data) && d.data) ||
        [];

      // Chuẩn hoá meta
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
          `${range[0]}-${range[1]} / ${total} đánh giá`,
        onChange: handleOnChange,
        onShowSizeChange: handleOnChange,
      };
      setPagination(nextPagination);
    } catch (e) {
      notification.error({ message: "Lỗi tải dữ liệu đánh giá!" });
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const d = await res.json();
      if (res.ok || d?.ok) {
        notification.success({ message: "Xoá đánh giá thành công!" });
        const cur = (pagination && pagination.current) || DEFAULT_PAGE;
        const size = (pagination && pagination.pageSize) || DEFAULT_LIMIT;
        getData(Number(cur), Number(size));
      } else {
        notification.error({ message: "Xoá thất bại!" });
      }
    } catch {
      notification.error({ message: "Không thể xoá đánh giá!" });
    }
  };

  // ===== Cột bảng =====
  const columns: ColumnsType<IReview> = [
    {
      title: "Người dùng",
      dataIndex: ["userId", "email"],
      align: "center",
      render: (_v, record) =>
        typeof record.userId === "object"
          ? record.userId.email
          : String(record.userId),
    },
    {
      title: "Sản phẩm",
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
            placeholder="Tìm sản phẩm"
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
            <Button onClick={() => clearFilters?.()} size="small">
              Đặt lại
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
      title: "Đánh giá",
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
      title: "Bình luận",
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
          <Tag color="default">Không có bình luận</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      align: "center",
      sorter: (a, b) =>
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime(),
      render: (value?: string) =>
        value ? new Date(value).toLocaleString("vi-VN") : "-",
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Xoá đánh giá"
          description="Bạn có chắc muốn xoá đánh giá này?"
          onConfirm={() => handleDelete(record._id)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger size="small">
            Xoá
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="gz-review-admin-page">
      <div className="gz-review-admin-header">
        <h2>Bảng đánh giá</h2>
  
        <Space>
          <Button
            type="text"
            icon={<ReloadOutlined style={{ color: "#00c781" }} />}
            onClick={() => {
              const cur = (pagination && pagination.current) || DEFAULT_PAGE;
              const size = (pagination && pagination.pageSize) || DEFAULT_LIMIT;
              getData(Number(cur), Number(size));
            }}
            className="gz-refresh-btn"
          >
            Làm mới
          </Button>
        </Space>
      </div>
  
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <div className="gz-review-table-wrap">
          <Table<IReview>
            columns={columns}
            dataSource={Array.isArray(listReviews) ? listReviews : []}
            rowKey="_id"
            pagination={pagination}
            scroll={{ x: 950 }}
            className="gz-review-table"
          />
        </div>
      </Spin>
  
      {/* Style */}
      <style jsx global>{`
        .gz-review-admin-page {
          background: #1e2021;
          min-height: 100vh;
          padding: 20px;
          color: #ffffff;
        }
  
        .gz-review-admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 14px;
          padding: 14px 16px;
        }
  
        .gz-review-admin-header h2 {
          margin: 0;
          color: #ffffff;
          font-weight: 800;
        }
  
        .gz-refresh-btn {
          color: #e5e7eb !important;
        }
  
        .gz-refresh-btn:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }
  
        .gz-review-table-wrap {
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 14px;
          overflow: hidden;
        }
  
        .gz-review-table .ant-table {
          background: #181a1b !important;
          color: #e5e7eb !important;
        }
  
        .gz-review-table .ant-table-container {
          background: #181a1b !important;
        }
  
        .gz-review-table .ant-table-thead > tr > th {
          background: #111314 !important;
          color: #ffffff !important;
          border-bottom: 1px solid #303435 !important;
          font-weight: 800 !important;
        }
  
        .gz-review-table .ant-table-tbody > tr > td {
          background: #181a1b !important;
          color: #d1d5db !important;
          border-bottom: 1px solid #2a2d2e !important;
        }
  
        .gz-review-table .ant-table-tbody > tr:hover > td {
          background: #202324 !important;
        }
  
        .gz-review-table .ant-table-cell-row-hover {
          background: #202324 !important;
        }
  
        .gz-review-table .ant-empty-description {
          color: #8b949e !important;
        }
  
        .gz-review-table .ant-table-column-sorter {
          color: #8b949e !important;
        }
  
        .gz-review-table .ant-pagination-item {
          background: #181a1b !important;
          border-color: #303435 !important;
        }
  
        .gz-review-table .ant-pagination-item a {
          color: #e5e7eb !important;
        }
  
        .gz-review-table .ant-pagination-item-active {
          border-color: #00ffe0 !important;
        }
  
        .gz-review-table .ant-pagination-item-active a {
          color: #00ffe0 !important;
        }
  
        .gz-review-table .ant-pagination-prev button,
        .gz-review-table .ant-pagination-next button {
          background: #181a1b !important;
          border-color: #303435 !important;
          color: #e5e7eb !important;
        }
  
        .gz-review-table .ant-select-selector {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
        }
  
        .gz-review-table .ant-table-filter-trigger {
          color: #8b949e !important;
        }
  
        .gz-review-table .ant-table-filter-trigger:hover {
          color: #00ffe0 !important;
        }
  
        .gz-review-admin-page .ant-spin-text {
          color: #00ffe0 !important;
        }
  
        @media (max-width: 768px) {
          .gz-review-admin-page {
            padding: 12px;
          }
  
          .gz-review-admin-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 12px;
          }
  
          .gz-review-admin-header h2 {
            font-size: 22px;
          }
  
          .gz-review-table-wrap {
            border-radius: 12px;
            overflow-x: auto;
          }
  
          .gz-review-table .ant-table {
            font-size: 13px;
          }
  
          .gz-review-table .ant-pagination-options {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReviewsTable;
