"use client";

import React, { useEffect, useState } from "react";
import "../../styles/users.css";
import {
  Table,
  Button,
  Popconfirm,
  Input,
  Space,
  Image,
  App,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CreateProductModal from "./create.product";
import UpdateProductModal from "./update.product";
import ViewProductModal from "./view.Product.Modal";
import { getImageUrl } from "@/utils/getImageUrl";

const ProductsTable = () => {
  const [listProducts, setListProducts] = useState<IProduct[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<null | IProduct>(null);
  const [viewProduct, setViewProduct] = useState<IProduct | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<any>(false);

  // Lấy token & chuẩn hoá (bỏ Bearer nếu có)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        const pureToken = token.startsWith("Bearer ") ? token.slice(7) : token;
        setAccessToken(pureToken);
      }
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      getData(1, 20);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const getAuthHeader = () => (accessToken ? `Bearer ${accessToken}` : "");

  const getData = async (page = 1, pageSize = 20) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?current=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      const d = await res.json();
      if (!d.data) {
        notification.error({ message: JSON.stringify(d.message) });
        return;
      }
      setListProducts(d.data.result);
      setPagination({
        current: d.data.meta.current,
        pageSize: d.data.meta.pageSize,
        total: pageSize === 999999 ? d.data.result.length : d.data.meta.total,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"],
        showTotal: (total: number, range: [number, number]) => (
          <span style={{ color: "grey", fontWeight: 700 }}>
            {`${range[0]}-${range[1]} / ${total}`}
          </span>
        ),
        onChange: handleOnChange,
        onShowSizeChange: handleOnChange,
      });
    } catch (error) {
      notification.error({ message: "Lỗi tải dữ liệu!" });
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
    getData(page, realPageSize || 20);
  };

  // ===== DELETE PRODUCT trực tiếp trong table, không dùng deleteProductAction =====
  const handleDeleteProduct = async (product: IProduct) => {
    if (!product?._id) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${product._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      const d = await res.json();

      if (res.ok && d.data) {
        notification.success({ message: "Xóa sản phẩm thành công." });
        getData(1, pagination?.pageSize || 999999);
      } else {
        notification.error({
          message: "Không thể xóa sản phẩm",
          description: JSON.stringify(d.message),
        });
      }
    } catch (error) {
      notification.error({ message: "Lỗi khi xóa sản phẩm!" });
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<IProduct> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      align: "center",
      render: (value, record) => (
        <Button
          type="link"
          onClick={() => {
            setViewProduct(record);
            setIsViewModalOpen(true);
          }}
        >
          {typeof value === "object" && value !== null ? value.name : value}
        </Button>
      ),
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
        String(record.name)
          .toLowerCase()
          .includes((value as string).toLowerCase()),
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      align: "center",
      filters: [
        { text: "Logitech", value: "Logitech" },
        { text: "Razer", value: "Razer" },
        { text: "Asus", value: "Asus" },
        { text: "MSI", value: "MSI" },
      ],
      onFilter: (value, record) =>
        record.brand?.toLowerCase() === (value as string).toLowerCase(),
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "name"],
      align: "center",
      filters: [
        { text: "Chuột", value: "Mouse" },
        { text: "Bàn phím", value: "Keyboard" },
        { text: "Màn hình", value: "Monitor" },
        { text: "Ghế", value: "Chairs" },
      ],
      onFilter: (value, record) => {
        const categoryName =
          typeof record.category === "string"
            ? record.category
            : record.category?.name;
        return categoryName?.toLowerCase() === (value as string).toLowerCase();
      },
      render: (value, record) => {
        const categoryName =
          typeof record.category === "string"
            ? record.category
            : record.category?.name;
        return categoryName || "Không xác định";
      },
    },
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      align: "center",
      render: (thumbnail: string) =>
        thumbnail ? (
          <Image
            src={getImageUrl(thumbnail)}
            alt="thumbnail"
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <span>Không có ảnh</span>
        ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: "center",
      sorter: (a, b) => a.price - b.price,
      render: (price: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
        }).format(price),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      align: "center",
      sorter: (a, b) => a.stock - b.stock,
      filters: [
        { text: "Còn hàng", value: "in" },
        { text: "Hết hàng", value: "out" },
      ],
      onFilter: (value, record) => {
        if (value === "in") return record.stock > 0;
        if (value === "out") return record.stock === 0;
        return true;
      },
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      align: "center",
      sorter: (a, b) => a.sold - b.sold,
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
            title="Xóa sản phẩm"
            description={`Bạn có chắc muốn xóa ${record.name}?`}
            onConfirm={() => handleDeleteProduct(record)}
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
    <div className="gz-product-admin-page">
      <div className="gz-product-admin-header">
        <div>
          <h2 className="gz-product-admin-title">Bảng sản phẩm</h2>
          <p className="gz-product-admin-subtitle">
            Quản lý sản phẩm, tồn kho và doanh số
          </p>
        </div>

        <Space className="gz-product-admin-actions" wrap>
          <Button
            type="text"
            icon={<ReloadOutlined style={{ color: "#00c781" }} />}
            onClick={() => getData(1, pagination?.pageSize || 999999)}
            className="gz-product-refresh-btn"
          >
            Làm mới
          </Button>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="gz-product-add-btn"
          >
            Thêm mới
          </Button>
        </Space>
      </div>

      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <div className="gz-product-table-card">
          <Table<IProduct>
            className="gz-product-admin-table"
            columns={columns}
            dataSource={listProducts}
            rowKey="_id"
            pagination={pagination}
            scroll={{ x: "max-content" }}
          />
        </div>
      </Spin>

      <ViewProductModal
        productData={viewProduct}
        isViewModalOpen={isViewModalOpen}
        setIsViewModalOpen={setIsViewModalOpen}
        setViewProduct={setViewProduct}
      />

      <CreateProductModal
        access_token={accessToken}
        getData={() => getData(1, pagination?.pageSize || 999999)}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      <UpdateProductModal
        access_token={accessToken}
        getData={() => getData(1, pagination?.pageSize || 999999)}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />

      <style jsx global>{`
        .gz-product-admin-page {
          width: 100%;
          color: #ffffff;
        }

        .gz-product-admin-header {
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

        .gz-product-admin-title {
          margin: 0;
          color: #ffffff;
          font-size: 26px;
          font-weight: 800;
          text-align: center;
        }

        .gz-product-admin-subtitle {
          margin: 5px 0 0;
          color: #8b949e;
          font-size: 13px;
          text-align: center;
        }

        .gz-product-admin-actions {
          justify-content: flex-end;
        }

        .gz-product-refresh-btn {
          color: #e5e7eb !important;
          border-radius: 10px !important;
        }

        .gz-product-refresh-btn:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .gz-product-add-btn {
          border: none !important;
          border-radius: 10px !important;
          font-weight: 800 !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          box-shadow: 0 8px 18px rgba(255, 77, 0, 0.18) !important;
        }

        .gz-product-table-card {
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }

        .gz-product-admin-table .ant-table {
          background: #181a1b !important;
          color: #e5e7eb !important;
        }

        .gz-product-admin-table .ant-table-container {
          background: #181a1b !important;
        }

        .gz-product-admin-table .ant-table-thead > tr > th {
          background: #111314 !important;
          color: #ffffff !important;
          border-bottom: 1px solid #303435 !important;
          font-weight: 800 !important;
          white-space: nowrap;
        }

        .gz-product-admin-table .ant-table-tbody > tr > td {
          background: #181a1b !important;
          color: #d1d5db !important;
          border-bottom: 1px solid #2a2d2e !important;
          vertical-align: middle;
        }

        .gz-product-admin-table .ant-table-tbody > tr:hover > td {
          background: #202324 !important;
        }

        .gz-product-admin-table .ant-table-cell-row-hover {
          background: #202324 !important;
        }

        .gz-product-name-btn {
          color: #00ffe0 !important;
          font-weight: 700 !important;
          padding: 0 !important;
          white-space: normal !important;
          text-align: center;
        }

        .gz-product-name-btn:hover {
          color: #ff7a00 !important;
        }

        .gz-product-thumb {
          object-fit: cover !important;
          border-radius: 8px !important;
          border: 1px solid #303435;
          background: #111314;
          padding: 3px;
        }

        .gz-product-edit-btn {
          border: none !important;
          border-radius: 999px !important;
          background: rgba(0, 255, 224, 0.12) !important;
          color: #00ffe0 !important;
          font-weight: 700 !important;
        }

        .gz-product-edit-btn:hover {
          background: rgba(0, 255, 224, 0.22) !important;
          color: #ffffff !important;
        }

        .gz-product-delete-btn {
          border-radius: 999px !important;
          font-weight: 700 !important;
        }

        .gz-product-admin-table .ant-table-column-sorter {
          color: #8b949e !important;
        }

        .gz-product-admin-table .ant-table-filter-trigger {
          color: #8b949e !important;
        }

        .gz-product-admin-table .ant-table-filter-trigger:hover {
          color: #00ffe0 !important;
        }

        .gz-product-admin-table .ant-empty-description {
          color: #8b949e !important;
        }

        .gz-product-admin-table .ant-pagination {
          padding: 12px 16px;
          margin: 0 !important;
          justify-content: center !important;
        }

        .gz-product-admin-table .ant-pagination-item {
          background: #111314 !important;
          border-color: #303435 !important;
        }

        .gz-product-admin-table .ant-pagination-item a {
          color: #e5e7eb !important;
        }

        .gz-product-admin-table .ant-pagination-item-active {
          border-color: #00ffe0 !important;
        }

        .gz-product-admin-table .ant-pagination-item-active a {
          color: #00ffe0 !important;
        }

        .gz-product-admin-table .ant-pagination-prev button,
        .gz-product-admin-table .ant-pagination-next button {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #e5e7eb !important;
        }

        .gz-product-admin-table .ant-select-selector {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
        }

        .gz-product-admin-page .ant-spin-text {
          color: #00ffe0 !important;
        }

        .gz-product-admin-page .ant-spin-dot-item {
          background-color: #00ffe0 !important;
        }

        .gz-product-filter-dropdown {
          padding: 10px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 10px;
        }

        .gz-product-filter-dropdown .ant-input {
          width: 188px;
          margin-bottom: 8px;
          display: block;
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
        }

        .gz-product-filter-dropdown .ant-input::placeholder {
          color: #6b7280 !important;
        }

        .gz-product-filter-dropdown .ant-input:hover,
        .gz-product-filter-dropdown .ant-input:focus {
          border-color: #00ffe0 !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.08) !important;
        }

        @media (max-width: 992px) {
          .gz-product-admin-header {
            flex-direction: column;
            align-items: stretch;
          }

          .gz-product-admin-actions {
            justify-content: flex-start;
          }
        }

        @media (max-width: 768px) {
          .gz-product-admin-header {
            padding: 14px;
            border-radius: 14px;
          }

          .gz-product-admin-title {
            font-size: 22px;
          }

          .gz-product-admin-subtitle {
            font-size: 12px;
          }

          .gz-product-admin-actions {
            display: grid !important;
            grid-template-columns: 1fr;
            gap: 10px !important;
          }

          .gz-product-admin-actions .ant-space-item {
            width: 100%;
          }

          .gz-product-refresh-btn,
          .gz-product-add-btn {
            width: 100%;
            height: 40px;
          }

          .gz-product-table-card {
            border-radius: 14px;
            overflow-x: auto;
          }

          .gz-product-admin-table .ant-table {
            font-size: 13px;
          }

          .gz-product-admin-table .ant-table-thead > tr > th,
          .gz-product-admin-table .ant-table-tbody > tr > td {
            padding: 10px 8px !important;
          }

          .gz-product-admin-table .ant-pagination-options {
            display: none !important;
          }
        }

        @media (max-width: 420px) {
          .gz-product-admin-title {
            font-size: 20px;
          }

          .gz-product-admin-table .ant-table {
            font-size: 12px;
          }
        }
        @media (max-width: 768px) {
          .gz-product-admin-header {
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

          .gz-product-admin-header::before {
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

          .gz-product-admin-header > * {
            position: relative;
            z-index: 1;
          }

          .gz-product-admin-title {
            margin: 0 !important;
            color: #ffffff !important;
            font-size: 20px !important;
            line-height: 1.2 !important;
            font-weight: 900 !important;
            letter-spacing: -0.3px;
          }

          .gz-product-admin-subtitle {
            margin: 6px 0 0 !important;
            color: #a3aab5 !important;
            font-size: 12px !important;
            line-height: 1.4 !important;
            font-weight: 500 !important;
          }

          .gz-product-admin-actions {
            width: 100%;
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }

          .gz-product-admin-actions .ant-space-item {
            width: 100% !important;
          }

          .gz-product-refresh-btn {
            width: 100% !important;
            height: 36px !important;
            border-radius: 12px !important;
            background: rgba(0, 255, 224, 0.065) !important;
            border: 1px solid rgba(0, 255, 224, 0.14) !important;
            color: #00ffe0 !important;
            font-size: 12px !important;
            font-weight: 800 !important;
          }

          .gz-product-refresh-btn:hover {
            background: rgba(0, 255, 224, 0.13) !important;
            border-color: rgba(0, 255, 224, 0.32) !important;
            color: #ffffff !important;
          }

          .gz-product-add-btn {
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

          .gz-product-add-btn:hover {
            background: linear-gradient(135deg, #ff6a00, #ff9a00) !important;
            color: #ffffff !important;
            transform: translateY(-1px);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsTable;
