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
  _id?: string;
  email?: string;
}

interface IProductRef {
  _id?: string;
  name?: string;
}

interface IReview {
  _id: string;
  userId?: IUserRef | string | null;
  productId?: IProductRef | string | null;
  rating?: number | null;
  comment?: string | null;
  createdAt?: string | null;
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
      const token = localStorage.getItem("access_token") || "";
      const pureToken = token.startsWith("Bearer ") ? token.slice(7) : token;
      setAccessToken(pureToken);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      getData(DEFAULT_PAGE, DEFAULT_LIMIT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // ===== Helper chống lỗi null =====
  const getUserEmail = (userId?: IUserRef | string | null) => {
    if (!userId) return "Không xác định";
    if (typeof userId === "string") return userId || "Không xác định";
    return userId.email || "Không xác định";
  };

  const getProductName = (productId?: IProductRef | string | null) => {
    if (!productId) return "Không xác định";
    if (typeof productId === "string") return productId || "Không xác định";
    return productId.name || "Không xác định";
  };

  const getRatingValue = (rating?: number | null) => {
    const value = Number(rating);
    return Number.isFinite(value) ? value : 0;
  };

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

      const items: IReview[] =
        (Array.isArray(d?.items) && d.items) ||
        (Array.isArray(d?.data?.items) && d.data.items) ||
        (Array.isArray(d?.data?.result) && d.data.result) ||
        (Array.isArray(d?.data) && d.data) ||
        [];

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
        position: ["bottomCenter"],
        showTotal: (total: number, range: [number, number]) =>
          `${range[0]}-${range[1]} / ${total} đánh giá`,
        onChange: handleOnChange,
        onShowSizeChange: handleOnChange,
      };

      setPagination(nextPagination);
    } catch {
      notification.error({
        message: "Lỗi tải dữ liệu đánh giá!",
      });
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

  const handleDelete = async (id?: string) => {
    if (!id) {
      notification.error({
        message: "Không tìm thấy ID đánh giá!",
      });
      return;
    }

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
        notification.success({
          message: "Xoá đánh giá thành công!",
        });

        const cur =
          typeof pagination === "object" && pagination?.current
            ? pagination.current
            : DEFAULT_PAGE;

        const size =
          typeof pagination === "object" && pagination?.pageSize
            ? pagination.pageSize
            : DEFAULT_LIMIT;

        getData(Number(cur), Number(size));
      } else {
        notification.error({
          message: d?.message || "Xoá thất bại!",
        });
      }
    } catch {
      notification.error({
        message: "Không thể xoá đánh giá!",
      });
    }
  };

  // ===== Cột bảng =====
  const columns: ColumnsType<IReview> = [
    {
      title: "Người dùng",
      dataIndex: ["userId", "email"],
      align: "center",
      render: (_v, record) => getUserEmail(record.userId),
    },
    {
      title: "Sản phẩm",
      dataIndex: ["productId", "name"],
      align: "center",
      render: (_v, record) => getProductName(record.productId),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div className="gz-review-filter-dropdown">
          <Input
            placeholder="Tìm sản phẩm"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{
              width: 188,
              marginBottom: 8,
              display: "block",
            }}
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
        <SearchOutlined style={{ color: filtered ? "#00ffe0" : undefined }} />
      ),
      onFilter: (value, record) => {
        const productName = getProductName(record.productId);
        return productName.toLowerCase().includes(String(value).toLowerCase());
      },
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      align: "center",
      filters: [5, 4, 3, 2, 1].map((v) => ({
        text: `${v}⭐`,
        value: v,
      })),
      onFilter: (value, record) =>
        getRatingValue(record.rating) === Number(value),
      render: (rating?: number | null) => (
        <Rate
          disabled
          value={getRatingValue(rating)}
          character={<StarFilled style={{ color: "#faad14" }} />}
        />
      ),
      sorter: (a, b) => getRatingValue(a.rating) - getRatingValue(b.rating),
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      align: "center",
      render: (comment?: string | null) =>
        comment ? (
          <span className="gz-review-comment-text" title={comment}>
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
      render: (value?: string | null) =>
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
          <Button danger size="small" className="gz-review-delete-btn">
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
              const cur =
                typeof pagination === "object" && pagination?.current
                  ? pagination.current
                  : DEFAULT_PAGE;

              const size =
                typeof pagination === "object" && pagination?.pageSize
                  ? pagination.pageSize
                  : DEFAULT_LIMIT;

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
            scroll={{ x: "max-content" }}
            className="gz-review-table"
          />
        </div>
      </Spin>

      <style jsx global>{`
        .gz-review-admin-page {
          width: 100%;
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
          border-radius: 10px !important;
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
          white-space: nowrap;
        }

        .gz-review-table .ant-table-tbody > tr > td {
          background: #181a1b !important;
          color: #d1d5db !important;
          border-bottom: 1px solid #2a2d2e !important;
          vertical-align: middle;
        }

        .gz-review-table .ant-table-tbody > tr:hover > td {
          background: #202324 !important;
        }

        .gz-review-table .ant-table-cell-row-hover {
          background: #202324 !important;
        }

        .gz-review-comment-text {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          display: inline-block;
          max-width: 260px;
          color: #d1d5db;
        }

        .gz-review-delete-btn {
          border-radius: 999px !important;
          font-weight: 700 !important;
        }

        .gz-review-table .ant-empty-description {
          color: #8b949e !important;
        }

        .gz-review-table .ant-table-column-sorter {
          color: #8b949e !important;
        }

        .gz-review-table .ant-table-filter-trigger {
          color: #8b949e !important;
        }

        .gz-review-table .ant-table-filter-trigger:hover {
          color: #00ffe0 !important;
        }

        .gz-review-table .ant-pagination {
          padding: 12px 16px;
          margin: 0 !important;
          justify-content: center !important;
        }

        .gz-review-table .ant-pagination-total-text {
          color: #b8b8b8 !important;
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

        .gz-review-admin-page .ant-spin-text {
          color: #00ffe0 !important;
        }

        .gz-review-admin-page .ant-spin-dot-item {
          background-color: #00ffe0 !important;
        }

        .gz-review-filter-dropdown {
          padding: 10px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 10px;
        }

        .gz-review-filter-dropdown .ant-input {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
        }

        .gz-review-filter-dropdown .ant-input::placeholder {
          color: #6b7280 !important;
        }

        .gz-review-filter-dropdown .ant-input:hover,
        .gz-review-filter-dropdown .ant-input:focus {
          border-color: #00ffe0 !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.08) !important;
        }

        .gz-review-filter-dropdown .ant-btn-primary {
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          border-color: #ff4d00 !important;
        }

        .ant-popconfirm .ant-popover-inner {
          background: #181a1b !important;
          border: 1px solid #2a2d2e !important;
        }

        .ant-popconfirm .ant-popover-title,
        .ant-popconfirm .ant-popover-inner-content {
          color: #ffffff !important;
        }

        @media (max-width: 768px) {
          .gz-review-admin-page {
            padding: 12px;
          }

          .gz-review-admin-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 12px;
            text-align: center;
          }

          .gz-review-admin-header h2 {
            font-size: 22px;
            text-align: center;
          }

          .gz-review-table-wrap {
            border-radius: 12px;
            overflow-x: auto;
          }

          .gz-review-table .ant-table {
            font-size: 13px;
          }

          .gz-review-table .ant-table-thead > tr > th,
          .gz-review-table .ant-table-tbody > tr > td {
            padding: 10px 8px !important;
          }

          .gz-review-table .ant-pagination-options {
            display: none !important;
          }
        }

        @media (max-width: 420px) {
          .gz-review-admin-page {
            padding: 10px;
          }

          .gz-review-admin-header h2 {
            font-size: 20px;
          }

          .gz-review-table .ant-table {
            font-size: 12px;
          }
          @media (max-width: 768px) {
            .gz-review-admin-header {
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

            .gz-review-admin-header::before {
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

            .gz-review-admin-header > * {
              position: relative;
              z-index: 1;
            }

            .gz-review-admin-header h2 {
              margin: 0 !important;
              color: #ffffff !important;
              font-size: 20px !important;
              line-height: 1.2 !important;
              font-weight: 900 !important;
              letter-spacing: -0.3px;
            }

            .gz-review-admin-header .ant-space {
              width: 100% !important;
            }

            .gz-review-admin-header .ant-space-item {
              width: 100% !important;
            }

            .gz-refresh-btn {
              width: 100% !important;
              height: 36px !important;
              border-radius: 12px !important;
              background: rgba(0, 255, 224, 0.065) !important;
              border: 1px solid rgba(0, 255, 224, 0.14) !important;
              color: #00ffe0 !important;
              font-size: 12px !important;
              font-weight: 800 !important;
            }

            .gz-refresh-btn:hover {
              background: rgba(0, 255, 224, 0.13) !important;
              border-color: rgba(0, 255, 224, 0.32) !important;
              color: #ffffff !important;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default ReviewsTable;
