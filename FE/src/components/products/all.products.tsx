"use client";

import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Form,
  Checkbox,
  Divider,
  InputNumber,
  Button,
  Rate,
  Tabs,
  Pagination,
  Spin,
  Drawer,
  FloatButton,
} from "antd";
import type { FormProps } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../../styles/home.scss";
import { getImageUrl } from "@/utils/getImageUrl";

type IProduct = {
  _id: string;
  thumbnail: string;
  images: string[];
  name: string;
  brand: string;
  price: number;
  stock: number;
  sold: number;
  quantity: number;
  category: string[];
  range: { from: number; to: number };
};

const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listCategory, setListCategory] = useState<
    { label: string; value: string }[]
  >([]);
  const [listProduct, setListProduct] = useState<IProduct[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [sortQuery, setSortQuery] = useState<string>("sort=-sold");

  const [form] = Form.useForm();

  // --- Lấy danh mục
  // Bảng ánh xạ EN -> VI
  const categoryMap: Record<string, string> = {
    Mouse: "Chuột",
    Keyboard: "Bàn phím",
    Monitor: "Màn hình",
    Headset: "Tai nghe",
    Chairs: "Ghế",
    Accessories: "Phụ kiện",
  };

  useEffect(() => {
    const initCategory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`
        );
        const data = await res.json();
        if (data?.data) {
          const d = data.data.map((item: any) => {
            const viName = categoryMap[item.name] || item.name;

            const label =
              viName.charAt(0).toUpperCase() + viName.slice(1).toLowerCase();
            return {
              label,
              value: item._id,
            };
          });
          setListCategory(d);
        }
      } catch (e) {
        console.error("Fetch categories error:", e);
      }
    };
    initCategory();
  }, []);

  // --- Đọc query URL và tạo filter tương ứng
  useEffect(() => {
    if (!listCategory.length) return;

    const q: string[] = [];
    const initialFields: any = {};

    // đọc query từ URL
    const brand = searchParams.get("brand");
    const brandId = searchParams.get("brandId");
    const categoryParam = searchParams.get("category");
    const priceFrom = searchParams.get("priceFrom");
    const priceTo = searchParams.get("priceTo");
    const ratingGte = searchParams.get("ratingGte");
    const sort = searchParams.get("sort");

    // filter theo brand
    if (brand) q.push(`brand=${encodeURIComponent(brand)}`);
    if (brandId) q.push(`brandId=${brandId}`);

    // category
    if (categoryParam) {
      const arr = categoryParam.split(",").filter(Boolean);
      initialFields.category = arr;
      q.push(`category=${arr.join(",")}`);
    }

    // khoảng giá
    if (priceFrom) {
      initialFields.range = {
        ...(initialFields.range || {}),
        from: Number(priceFrom),
      };
      q.push(`price[gte]=${Number(priceFrom)}`);
    }
    if (priceTo) {
      initialFields.range = {
        ...(initialFields.range || {}),
        to: Number(priceTo),
      };
      q.push(`price[lte]=${Number(priceTo)}`);
    }

    // rating
    if (ratingGte) {
      initialFields.rating = Number(ratingGte);
      q.push(`rating[gte]=${Number(ratingGte)}`);
    }

    // sort
    if (sort) setSortQuery(`sort=${sort}`);

    // cập nhật form & filter
    form.setFieldsValue(initialFields);
    setFilter(q.join("&"));
    setCurrent(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, listCategory]);

  // --- Lấy sản phẩm
  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize, filter, sortQuery]);

  const fetchProduct = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) query += `&${filter}`;
    if (sortQuery) query += `&${sortQuery}`;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?${query}`
      );
      const data = await res.json();
      if (data?.data) {
        setListProduct(data.data.result);
        setTotal(data.data.meta.total);
      }
    } catch (e) {
      console.error("Fetch products error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Phân trang
  const handleOnchangePage = (pagination: {
    current: number;
    pageSize: number;
  }) => {
    if (pagination.current !== current) setCurrent(pagination.current);
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  // --- Khi thay đổi filter trong form
  const handleChangeFilter = (_: any, values: any) => {
    const q: string[] = [];
    if (values.category?.length > 0)
      q.push(`category=${values.category.join(",")}`);
    if (values.range?.from) q.push(`price[gte]=${values.range.from}`);
    if (values.range?.to) q.push(`price[lte]=${values.range.to}`);
    if (values.rating) q.push(`rating[gte]=${values.rating}`);
    setFilter(q.join("&"));
    setCurrent(1);
  };

  const onFinish: FormProps<IProduct>["onFinish"] = async (values) => {
    const q: string[] = [];
    if (values?.category?.length)
      q.push(`category=${values.category.join(",")}`);
    if (values?.range?.from >= 0) q.push(`price[gte]=${values.range.from}`);
    if (values?.range?.to >= 0) q.push(`price[lte]=${values.range.to}`);
    setFilter(q.join("&"));
    setCurrent(1);
  };

  const items = [
    { key: "sort=-sold", label: `Phổ biến`, children: <></> },
    { key: "sort=-createdAt", label: `Hàng Mới`, children: <></> },
    { key: "sort=price", label: `Giá Thấp → Cao`, children: <></> },
    { key: "sort=-price", label: `Giá Cao → Thấp`, children: <></> },
  ];

 //// view
  return (
    <div className="products-list-page">
      <div className="homepage-container">
        <Row gutter={[20, 20]}>
          {/* Sidebar filter desktop */}
          <Col md={4} sm={0} xs={0}>
            <div className="filter-sidebar">
              <div className="filter-title">
                <span>
                  <FilterTwoTone /> <span>Bộ lọc tìm kiếm</span>
                </span>
  
                <ReloadOutlined
                  title="Reset"
                  onClick={() => {
                    form.resetFields();
                    setFilter("");
                    setCurrent(1);
                  }}
                />
              </div>
  
              <Divider />
  
              <Form
                onFinish={onFinish}
                form={form}
                onValuesChange={handleChangeFilter}
              >
                <Form.Item
                  name="category"
                  label="Danh mục sản phẩm"
                  labelCol={{ span: 24 }}
                >
                  <Checkbox.Group>
                    <Row>
                      {listCategory?.map((item, index) => (
                        <Col
                          span={24}
                          key={`cat-${index}`}
                          style={{ padding: "7px 0" }}
                        >
                          <Checkbox value={item.value}>{item.label}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
  
                <Divider />
  
                <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                  <Row gutter={[10, 10]} style={{ width: "100%" }}>
                    <Col xl={11} md={24}>
                      <Form.Item name={["range", "from"]} noStyle>
                        <InputNumber
                          min={0}
                          placeholder="đ TỪ"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
  
                    <Col xl={2} md={0}>
                      <div style={{ color: "#b8b8b8", textAlign: "center" }}>
                        -
                      </div>
                    </Col>
  
                    <Col xl={11} md={24}>
                      <Form.Item name={["range", "to"]} noStyle>
                        <InputNumber
                          min={0}
                          placeholder="đ ĐẾN"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
  
                  <Button
                    onClick={() => form.submit()}
                    style={{ width: "100%", marginTop: 10 }}
                    type="primary"
                    className="apply-filter-btn"
                  >
                    Áp dụng
                  </Button>
                </Form.Item>
  
                <Divider />
  
                <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                  {[5, 4, 3, 2, 1].map((val) => (
                    <div key={val} className="rating-filter-row">
                      <Rate
                        value={val}
                        disabled
                        style={{ color: "#ffce3d", fontSize: 15 }}
                      />
                      <span className="ant-rate-text">
                        {val < 5 && "trở lên"}
                      </span>
                    </div>
                  ))}
                </Form.Item>
              </Form>
            </div>
          </Col>
  
          {/* Product list */}
          <Col md={20} xs={24}>
            <Spin spinning={isLoading} tip="Loading...">
              <div className="product-list-panel">
                <Tabs
                  className="mobile-tabs"
                  size="small"
                  defaultActiveKey="sort=-sold"
                  items={items}
                  onChange={(value) => setSortQuery(value)}
                />
  
                <div className="products-grid">
                  {listProduct?.map((item, index) => (
                    <div
                      className="product-item"
                      key={`products-${index}`}
                      onClick={() => router.push(`/product-detail/${item._id}`)}
                    >
                      <div className="product-card-dark">
                        <div className="product-thumbnail">
                          <img src={getImageUrl(item.thumbnail)} alt={item.name} />
                        </div>
  
                        <div className="product-name" title={item.name}>
                          {item.name}
                        </div>
  
                        <div className="product-price">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item?.price ?? 0)}
                        </div>
  
                        <div className="product-rating">
                          <Rate
                            value={5}
                            disabled
                            style={{ color: "#ffce3d", fontSize: 11 }}
                          />
                          <span>{item?.sold ?? 0} đã bán</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
  
                <div className="pagination-wrapper">
                  <Pagination
                    responsive
                    size="small"
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger
                    onChange={(page, ps) =>
                      handleOnchangePage({ current: page, pageSize: ps })
                    }
                  />
                </div>
              </div>
            </Spin>
          </Col>
        </Row>
      </div>
  
      {/* FAB filter mobile */}
      <FloatButton
        className="mobile-filter-fab"
        icon={<FilterTwoTone twoToneColor="#52c41a" />}
        type="primary"
        style={{ right: 20, bottom: 20 }}
        onClick={() => setShowMobileFilter(true)}
        tooltip="Bộ lọc"
      />
  
      {/* Drawer filter mobile */}
      <Drawer
        className="mobile-filter-drawer"
        title="Bộ lọc tìm kiếm"
        placement="left"
        open={showMobileFilter}
        onClose={() => setShowMobileFilter(false)}
        width="86%"
        styles={{
          body: {
            paddingBottom: 24,
            background: "#181A1B",
          },
        }}
      >
        <Form
          onFinish={onFinish}
          form={form}
          onValuesChange={handleChangeFilter}
        >
          <Form.Item
            name="category"
            label="Danh mục sản phẩm"
            labelCol={{ span: 24 }}
          >
            <Checkbox.Group>
              <Row>
                {listCategory?.map((item, index) => (
                  <Col
                    span={24}
                    key={`cat-mobile-${index}`}
                    style={{ padding: "7px 0" }}
                  >
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
  
          <Divider />
  
          <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
            <Row gutter={[10, 10]} style={{ width: "100%" }}>
              <Col span={11}>
                <Form.Item name={["range", "from"]} noStyle>
                  <InputNumber
                    min={0}
                    placeholder="đ TỪ"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
  
              <Col span={2} style={{ textAlign: "center", color: "#b8b8b8" }}>
                -
              </Col>
  
              <Col span={11}>
                <Form.Item name={["range", "to"]} noStyle>
                  <InputNumber
                    min={0}
                    placeholder="đ ĐẾN"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
  
            <Button
              onClick={() => form.submit()}
              style={{ width: "100%", marginTop: 10 }}
              type="primary"
              className="apply-filter-btn"
            >
              Áp dụng
            </Button>
          </Form.Item>
  
          <Divider />
  
          <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
            {[5, 4, 3, 2, 1].map((val) => (
              <div key={val} className="rating-filter-row">
                <Rate
                  value={val}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text">{val < 5 && "trở lên"}</span>
              </div>
            ))}
          </Form.Item>
        </Form>
      </Drawer>
  
      {/* Style */}
      <style jsx global>{`
        .products-list-page {
          background: #1e2021;
          min-height: 100vh;
          padding: 24px 16px 50px;
        }
  
        .homepage-container {
          max-width: 1440px;
          margin: 0 auto;
        }
  
        .filter-sidebar,
        .product-list-panel {
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 14px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }
  
        .filter-sidebar {
          padding: 18px;
          position: sticky;
          top: 90px;
        }
  
        .filter-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #ffffff;
          font-weight: 700;
        }
  
        .product-list-panel {
          width: 100%;
          padding: 18px;
          overflow: hidden;
        }
  
        .products-list-page .ant-divider {
          border-color: #303435 !important;
        }
  
        .products-list-page .ant-form-item-label > label,
        .products-list-page .ant-checkbox-wrapper,
        .products-list-page .ant-rate-text,
        .products-list-page .ant-typography {
          color: #e5e7eb !important;
        }
  
        .products-list-page .ant-checkbox-inner {
          background-color: #111314 !important;
          border-color: #4b5563 !important;
        }
  
        .products-list-page .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #ff4d00 !important;
          border-color: #ff4d00 !important;
        }
  
        .products-list-page .ant-input-number {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
        }
  
        .products-list-page .ant-input-number-input {
          color: #ffffff !important;
        }
  
        .products-list-page .ant-input-number-input::placeholder {
          color: #6b7280 !important;
        }
  
        .products-list-page .ant-input-number:hover,
        .products-list-page .ant-input-number-focused {
          border-color: #00ffe0 !important;
        }
  
        .apply-filter-btn {
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          border: none !important;
          font-weight: 700 !important;
        }
  
        .rating-filter-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
  
        .mobile-tabs {
          width: 100%;
        }
  
        .mobile-tabs .ant-tabs-nav {
          margin-bottom: 18px !important;
        }
  
        .mobile-tabs .ant-tabs-nav::before {
          border-color: #303435 !important;
        }
  
        .mobile-tabs .ant-tabs-tab {
          color: #b8b8b8 !important;
          padding: 8px 12px !important;
        }
  
        .mobile-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #00ffe0 !important;
        }
  
        .mobile-tabs .ant-tabs-ink-bar {
          background: #00ffe0 !important;
        }
  
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 18px;
          width: 100%;
        }
  
        .product-item {
          width: 100%;
          min-width: 0;
          cursor: pointer;
        }
  
        .product-card-dark {
          width: 100%;
          height: 100%;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 14px;
          overflow: hidden;
          padding-bottom: 12px;
          transition: transform 0.3s ease, box-shadow 0.3s ease,
            border-color 0.3s ease;
        }
  
        .product-card-dark:hover {
          transform: translateY(-6px);
          border-color: #00ffe0;
          box-shadow: 0 12px 28px rgba(0, 255, 224, 0.12);
        }
  
        .product-thumbnail {
          width: 100%;
          height: 190px;
          background: #111314;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
  
        .product-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 12px;
          display: block;
          transition: transform 0.45s ease;
        }
  
        .product-card-dark:hover .product-thumbnail img {
          transform: scale(1.08);
        }
  
        .product-name {
          color: #ffffff;
          font-weight: 700;
          font-size: 14px;
          line-height: 1.45;
          min-height: 42px;
          padding: 12px 10px 4px;
          text-align: center;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
  
        .product-price {
          color: #ff4d4f;
          font-weight: 800;
          font-size: 16px;
          text-align: center;
          margin-top: 6px;
        }
  
        .product-rating {
          color: #b8b8b8;
          font-size: 12px;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
          padding: 0 8px;
        }
  
        .pagination-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 30px;
        }
  
        .products-list-page .ant-pagination {
          flex-wrap: wrap;
          gap: 6px;
        }
  
        .products-list-page .ant-pagination-item {
          background: #181a1b !important;
          border-color: #303435 !important;
        }
  
        .products-list-page .ant-pagination-item a {
          color: #e5e7eb !important;
        }
  
        .products-list-page .ant-pagination-item-active {
          border-color: #00ffe0 !important;
        }
  
        .products-list-page .ant-pagination-item-active a {
          color: #00ffe0 !important;
        }
  
        .products-list-page .ant-pagination-prev button,
        .products-list-page .ant-pagination-next button {
          background: #181a1b !important;
          border-color: #303435 !important;
          color: #e5e7eb !important;
        }
  
        .products-list-page .ant-select-selector {
          background: #ffffff !important;
        }
  
        .mobile-filter-fab {
          display: none;
        }
  
        .products-list-page .ant-spin-text {
          color: #00ffe0 !important;
        }
  
        .mobile-filter-drawer .ant-drawer-content {
          background: #181a1b !important;
        }
  
        .mobile-filter-drawer .ant-drawer-header {
          background: #181a1b !important;
          border-bottom: 1px solid #303435 !important;
        }
  
        .mobile-filter-drawer .ant-drawer-title,
        .mobile-filter-drawer .ant-drawer-close {
          color: #ffffff !important;
        }
  
        .mobile-filter-drawer .ant-form-item-label > label,
        .mobile-filter-drawer .ant-checkbox-wrapper,
        .mobile-filter-drawer .ant-rate-text {
          color: #e5e7eb !important;
        }
  
        .mobile-filter-drawer .ant-divider {
          border-color: #303435 !important;
        }
  
        .mobile-filter-drawer .ant-input-number {
          background: #111314 !important;
          border-color: #303435 !important;
        }
  
        .mobile-filter-drawer .ant-input-number-input {
          color: #ffffff !important;
        }
  
        @media (max-width: 1200px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
            gap: 16px;
          }
  
          .product-thumbnail {
            height: 175px;
          }
        }
  
        @media (max-width: 992px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 14px;
          }
  
          .product-thumbnail {
            height: 160px;
          }
        }
  
        @media (max-width: 768px) {
          .products-list-page {
            padding: 16px 10px 80px;
          }
  
          .homepage-container {
            max-width: 100%;
          }
  
          .product-list-panel {
            padding: 12px;
            border-radius: 12px;
          }
  
          .mobile-filter-fab {
            display: block;
          }
  
          .mobile-tabs {
            overflow-x: auto;
            white-space: nowrap;
            scrollbar-width: none;
          }
  
          .mobile-tabs::-webkit-scrollbar {
            display: none;
          }
  
          .mobile-tabs .ant-tabs-nav-list {
            flex-wrap: nowrap !important;
          }
  
          .mobile-tabs .ant-tabs-tab {
            padding: 7px 10px !important;
            font-size: 13px;
          }
  
          .products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
  
          .product-thumbnail {
            height: 145px;
          }
  
          .product-name {
            font-size: 13px;
            min-height: 40px;
            padding: 10px 8px 2px;
          }
  
          .product-price {
            font-size: 14px;
          }
  
          .product-rating {
            font-size: 11px;
            gap: 4px;
            padding: 0 4px;
          }
  
          .product-rating .ant-rate {
            font-size: 9px !important;
          }
  
          .products-list-page .ant-pagination-options {
            display: none !important;
          }
        }
  
        @media (max-width: 380px) {
          .products-grid {
            gap: 10px;
          }
  
          .product-thumbnail {
            height: 130px;
          }
  
          .product-name {
            font-size: 12px;
            min-height: 38px;
          }
  
          .product-price {
            font-size: 13px;
          }
  
          .product-rating {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
  
}

export default ProductsPage;
