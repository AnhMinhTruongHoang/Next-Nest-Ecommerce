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
import { deleteProductAction } from "@/lib/product.actions";
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      getData(1, 999999); // load all khi mở
    }
  }, [accessToken]);

  const getData = async (page = 1, pageSize = 20) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8000/api/v1/products?current=${page}&pageSize=${pageSize}`,
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
        return;
      }
      setListProducts(d.data.result);

      setPagination({
        current: d.data.meta.current,
        pageSize: d.data.meta.pageSize,
        total: pageSize === 999999 ? d.data.result.length : d.data.meta.total,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100", "0"], // 0 = ∞
        showTotal: (total: number, range: [number, number]) =>
          `${range[0]}-${range[1]} / ${total} items`,
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

  const handleDeleteProduct = async (product: IProduct) => {
    const d = await deleteProductAction(product, accessToken);
    if (d.data) {
      notification.success({ message: "Xóa sản phẩm thành công." });
      getData(1, pagination?.pageSize || 999999);
    } else {
      notification.error({ message: JSON.stringify(d.message) });
    }
  };

  const columns: ColumnsType<IProduct> = [
    {
      title: "Name",
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
        String(record.name)
          .toLowerCase()
          .includes((value as string).toLowerCase()),
    },
    {
      title: "Brand",
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
      title: "Category",
      dataIndex: ["category", "name"],
      align: "center",
      filters: [
        { text: "Mouse", value: "Mouse" },
        { text: "Keyboard", value: "Keyboard" },
        { text: "Monitor", value: "Monitor" },
        { text: "Chairs", value: "Chairs" },
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
        return categoryName || "N/A";
      },
    },
    {
      title: "Thumbnail",
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
          <span>No image</span>
        ),
    },
    {
      title: "Price",
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
      title: "Stock",
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
      title: "Sold",
      dataIndex: "sold",
      align: "center",
      sorter: (a, b) => a.sold - b.sold,
    },
    {
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setDataUpdate(record);
              setIsUpdateModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete the product"
            description={`Are you sure to delete ${record.name}?`}
            onConfirm={() => handleDeleteProduct(record)}
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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2>Table products</h2>
        <Space>
          <Button
            type="text"
            icon={<ReloadOutlined style={{ color: "green" }} />}
            onClick={() => getData(1, pagination?.pageSize || 999999)}
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

      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Table
          columns={columns}
          dataSource={listProducts}
          rowKey="_id"
          pagination={pagination}
        />
      </Spin>

      {/* Modal components */}
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
    </div>
  );
};

export default ProductsTable;
