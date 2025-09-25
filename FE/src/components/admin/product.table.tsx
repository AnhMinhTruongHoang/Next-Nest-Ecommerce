"use client";

import React, { useEffect, useState } from "react";
import "../../styles/users.css";
import {
  Table,
  Button,
  notification,
  Popconfirm,
  Input,
  Space,
  Image,
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
import { IProduct } from "next-auth";
import ViewProductModal from "./view.Product.Modal";

const ProductsTable = () => {
  const [listProducts, setListProducts] = useState<IProduct[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<null | IProduct>(null);
  const [viewProduct, setViewProduct] = useState<IProduct | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 20,
    pages: 0,
    total: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    if (accessToken) getData(meta.current, meta.pageSize);
  }, [accessToken]);

  const getData = async (current = 1, pageSize = 20) => {
    const res = await fetch(
      `http://localhost:8000/api/v1/products?current=${current}&pageSize=${pageSize}`,
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
    setMeta(d.data.meta);
  };

  const handleOnChange = async (page: number, pageSize: number) => {
    getData(page, pageSize);
  };

  const handleDeleteProduct = async (product: IProduct) => {
    const d = await deleteProductAction(product, accessToken);
    if (d.data) {
      notification.success({ message: "Xóa sản phẩm thành công." });
      getData(meta.current, meta.pageSize);
    } else {
      notification.error({ message: JSON.stringify(d.message) });
    }
  };

  const columns: ColumnsType<IProduct> = [
    {
      title: "Name",
      dataIndex: "name",
      align: "center",
      responsive: ["xs", "sm", "md", "lg"],
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
      responsive: ["xs", "sm", "md", "lg"],
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search brand"
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
        record.brand?.toLowerCase().includes((value as string).toLowerCase()),
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
            src={
              thumbnail.startsWith("http")
                ? thumbnail
                : `http://localhost:8000${thumbnail}`
            }
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
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => `$${price}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      align: "center",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Sold",
      dataIndex: "sold",
      align: "center",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a, b) => a.sold - b.sold,
    },
    {
      title: "Actions",
      align: "center",
      responsive: ["xs", "sm", "md", "lg"],
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
        }}
      >
        <h2>Table products</h2>
        <ReloadOutlined
          onClick={() => getData(meta.current, meta.pageSize)}
          style={{ color: "green" }}
        />
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
        dataSource={listProducts}
        rowKey="_id"
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

      {/* Modal components */}
      <ViewProductModal
        isOpen={isViewModalOpen}
        setViewProduct={setViewProduct}
        setIsViewModalOpen={setIsViewModalOpen}
        productData={viewProduct}
      />
      <CreateProductModal
        access_token={accessToken}
        getData={() => getData(meta.current, meta.pageSize)}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />
      <UpdateProductModal
        access_token={accessToken}
        getData={() => getData(meta.current, meta.pageSize)}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </div>
  );
};

export default ProductsTable;
