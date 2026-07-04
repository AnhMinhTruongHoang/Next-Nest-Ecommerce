"use client";

import {
  Row,
  Col,
  Form,
  Checkbox,
  Divider,
  InputNumber,
  Button,
  Tabs,
  Pagination,
  Spin,
  Drawer,
  FloatButton,
  Empty,
  Grid,
} from "antd";
import { FilterTwoTone, ReloadOutlined, StarFilled } from "@ant-design/icons";
import type { FormProps } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/utils/getImageUrl";

type IProduct = {
  _id: string;
  thumbnail?: string;
  images?: string[];
  name: string;
  brand?: string;
  price: number;
  stock?: number;
  sold?: number;
  quantity?: number;
  category?: string[];
  range?: { from?: number; to?: number };
  rating?: number;
};

const categoryMap: Record<string, string> = {
  Mouse: "Chuột",
  Keyboard: "Bàn phím",
  Monitor: "Màn hình",
  Headset: "Tai nghe",
  Chairs: "Ghế",
  Accessories: "Phụ kiện",
};

const currencyVN = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const SimpleStars = ({
  value = 5,
  size = 12,
}: {
  value?: number;
  size?: number;
}) => {
  const safeValue = Math.max(0, Math.min(5, Number(value) || 0));

  return (
    <span className="gz-simple-stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarFilled
          key={index}
          style={{
            fontSize: size,
            color: index < safeValue ? "#faad14" : "#4b5563",
          }}
        />
      ))}
    </span>
  );
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
  const screens = Grid.useBreakpoint();
  const isDesktopFilter = !!screens.md;

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "");

  useEffect(() => {
    const initCategory = async () => {
      try {
        const res = await fetch(`${backendURL}/categories`);
        const data = await res.json();

        const categories = Array.isArray(data?.data) ? data.data : [];

        const nextCategories = categories.map((item: any) => {
          const viName = categoryMap[item.name] || item.name || "Khác";
          const label =
            viName.charAt(0).toUpperCase() + viName.slice(1).toLowerCase();

          return {
            label,
            value: item._id,
          };
        });

        setListCategory(nextCategories);
      } catch (error) {
        console.error("Fetch categories error:", error);
      }
    };

    if (backendURL) {
      initCategory();
    }
  }, [backendURL]);

  useEffect(() => {
    if (!listCategory.length) return;

    const query: string[] = [];
    const initialFields: any = {};

    const brand = searchParams.get("brand");
    const brandId = searchParams.get("brandId");
    const categoryParam = searchParams.get("category");
    const priceFrom = searchParams.get("priceFrom");
    const priceTo = searchParams.get("priceTo");
    const ratingGte = searchParams.get("ratingGte");
    const sort = searchParams.get("sort");

    if (brand) query.push(`brand=${encodeURIComponent(brand)}`);
    if (brandId) query.push(`brandId=${brandId}`);

    if (categoryParam) {
      const arr = categoryParam.split(",").filter(Boolean);
      initialFields.category = arr;
      query.push(`category=${arr.join(",")}`);
    }

    if (priceFrom) {
      initialFields.range = {
        ...(initialFields.range || {}),
        from: Number(priceFrom),
      };
      query.push(`price[gte]=${Number(priceFrom)}`);
    }

    if (priceTo) {
      initialFields.range = {
        ...(initialFields.range || {}),
        to: Number(priceTo),
      };
      query.push(`price[lte]=${Number(priceTo)}`);
    }

    if (ratingGte) {
      initialFields.rating = Number(ratingGte);
      query.push(`rating[gte]=${Number(ratingGte)}`);
    }

    if (sort) {
      setSortQuery(`sort=${sort}`);
    }

    form.setFieldsValue(initialFields);
    setFilter(query.join("&"));
    setCurrent(1);
  }, [searchParams, listCategory, form]);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize, filter, sortQuery]);

  const fetchProduct = async () => {
    if (!backendURL) return;

    setIsLoading(true);

    let query = `current=${current}&pageSize=${pageSize}`;

    if (filter) query += `&${filter}`;
    if (sortQuery) query += `&${sortQuery}`;

    try {
      const res = await fetch(`${backendURL}/products?${query}`);
      const data = await res.json();

      const result = Array.isArray(data?.data?.result) ? data.data.result : [];

      const meta = data?.data?.meta;

      setListProduct(result);
      setTotal(Number(meta?.total) || result.length);
    } catch (error) {
      console.error("Fetch products error:", error);
      setListProduct([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnchangePage = (pagination: {
    current: number;
    pageSize: number;
  }) => {
    if (pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const buildFilterQuery = (values: any) => {
    const query: string[] = [];

    if (values.category?.length > 0) {
      query.push(`category=${values.category.join(",")}`);
    }

    if (values.range?.from || values.range?.from === 0) {
      query.push(`price[gte]=${values.range.from}`);
    }

    if (values.range?.to || values.range?.to === 0) {
      query.push(`price[lte]=${values.range.to}`);
    }

    if (values.rating) {
      query.push(`rating[gte]=${values.rating}`);
    }

    return query.join("&");
  };

  const handleChangeFilter = (_: any, values: any) => {
    setFilter(buildFilterQuery(values));
    setCurrent(1);
  };

  const onFinish: FormProps<IProduct>["onFinish"] = async (values) => {
    setFilter(buildFilterQuery(values));
    setCurrent(1);
    setShowMobileFilter(false);
  };

  const resetFilter = () => {
    form.resetFields();
    setFilter("");
    setCurrent(1);
  };

  const items = [
    { key: "sort=-sold", label: "Phổ biến", children: <></> },
    { key: "sort=-createdAt", label: "Mới nhất", children: <></> },
    { key: "sort=price", label: "Giá thấp → cao", children: <></> },
    { key: "sort=-price", label: "Giá cao → thấp", children: <></> },
  ];

  const FilterContent = () => (
    <Form
      onFinish={onFinish}
      form={form}
      onValuesChange={handleChangeFilter}
      className="gz-products-filter-form"
    >
      <Form.Item name="category" label="Danh Mục" labelCol={{ span: 24 }}>
        <Checkbox.Group>
          <Row>
            {listCategory?.map((item) => (
              <Col span={24} key={item.value} className="gz-filter-check-row">
                <Checkbox value={item.value}>{item.label}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>

      <Divider />
      <Form.Item
        label="Khoảng Giá"
        labelCol={{ span: 24 }}
        labelAlign="left"
        style={{ textAlign: "center" }}
      >
        <Row gutter={[10, 10]} style={{ width: "100%" }}>
          <Col span={11}>
            <Form.Item name={["range", "from"]} noStyle>
              <InputNumber
                min={0}
                placeholder="Từ"
                formatter={(value) =>
                  `${value || ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={2}>
            <div className="gz-price-separator">-</div>
          </Col>

          <Col span={11}>
            <Form.Item name={["range", "to"]} noStyle>
              <InputNumber
                min={0}
                placeholder="Tới"
                formatter={(value) =>
                  `${value || ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Button
          onClick={() => form.submit()}
          type="primary"
          className="apply-filter-btn"
          block
        >
          Áp dụng
        </Button>
      </Form.Item>

      <Divider />

      <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
        <div className="gz-rating-filter-list">
          {[5, 4, 3, 2, 1].map((value) => (
            <button
              key={value}
              type="button"
              className="rating-filter-row"
              onClick={() => {
                const values = form.getFieldsValue(true);

                setFilter(
                  buildFilterQuery({
                    ...values,
                    rating: value,
                  })
                );

                setCurrent(1);
              }}
            >
              <SimpleStars value={value} size={14} />
              <span>{value < 5 ? "trở lên" : ""}</span>
            </button>
          ))}
        </div>
      </Form.Item>
    </Form>
  );

  return (
    <div className="products-list-page">
      <div className="homepage-container">
        <Row gutter={[20, 20]}>
          {isDesktopFilter && (
            <Col lg={5} md={6}>
              <aside className="filter-sidebar">
                <div className="filter-title">
                  <div>
                    <span>Product Filter</span>
                    <h3>Bộ lọc</h3>
                  </div>

                  <button
                    type="button"
                    title="Reset"
                    onClick={resetFilter}
                    className="gz-filter-reset-btn"
                  >
                    <ReloadOutlined />
                  </button>
                </div>

                <Divider />

                <FilterContent />
              </aside>
            </Col>
          )}

          <Col
            lg={isDesktopFilter ? 19 : 24}
            md={isDesktopFilter ? 18 : 24}
            xs={24}
          >
            <Spin spinning={isLoading} tip="Loading...">
              <section className="product-list-panel">
                <div className="gz-product-toolbar">
                  <Tabs
                    className="mobile-tabs"
                    size="small"
                    activeKey={sortQuery}
                    items={items}
                    onChange={(value) => {
                      setSortQuery(value);
                      setCurrent(1);
                    }}
                  />
                </div>

                {listProduct.length === 0 && !isLoading ? (
                  <div className="gz-product-empty">
                    <Empty
                      description={
                        <span style={{ color: "#b8c0cc", fontWeight: 700 }}>
                          No products found
                        </span>
                      }
                    />
                  </div>
                ) : (
                  <div className="products-grid">
                    {listProduct.map((item) => {
                      const imgSrc =
                        getImageUrl(item.thumbnail) || "/images/noimage.png";

                      return (
                        <article
                          className="product-item"
                          key={item._id}
                          onClick={() =>
                            router.push(`/product-detail/${item._id}`)
                          }
                        >
                          <div className="product-card-dark">
                            <div className="product-thumbnail">
                              <img src={imgSrc} alt={item.name} />
                            </div>

                            <div className="product-name" title={item.name}>
                              {item.name}
                            </div>

                            <div className="product-price">
                              {currencyVN(item.price)}
                            </div>

                            <div className="product-rating">
                              <SimpleStars value={5} size={11} />
                              <span>{item?.sold ?? 0} đã bán</span>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}

                <div className="pagination-wrapper">
                  <Pagination
                    responsive
                    size="small"
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger
                    onChange={(page, pageSizeValue) =>
                      handleOnchangePage({
                        current: page,
                        pageSize: pageSizeValue,
                      })
                    }
                  />
                </div>
              </section>
            </Spin>
          </Col>
        </Row>
      </div>

      {!isDesktopFilter && (
        <FloatButton
          className="mobile-filter-fab"
          icon={<FilterTwoTone twoToneColor="#061313" />}
          type="primary"
          style={{ right: 20, bottom: 20 }}
          onClick={() => setShowMobileFilter(true)}
          tooltip="Bộ lọc"
        />
      )}

      <Drawer
        className="mobile-filter-drawer"
        title="Product Filter"
        placement="left"
        open={showMobileFilter}
        onClose={() => setShowMobileFilter(false)}
        width="86%"
        forceRender
      >
        <div className="mobile-filter-actions">
          <Button onClick={resetFilter} icon={<ReloadOutlined />}>
            Reset
          </Button>
        </div>

        <FilterContent />
      </Drawer>

      <style jsx global>{`
        .products-list-page {
          width: 100%;
        }

        .homepage-container {
          max-width: 1440px;
          margin: 0 auto;
        }

        .filter-sidebar,
        .product-list-panel {
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.012)
            ),
            #111314;
          border: 1px solid #2a2d2e;
          border-radius: 22px;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.25);
        }

        .filter-sidebar {
          padding: 18px;
          position: sticky;
          top: 90px;
        }

        .filter-title {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .filter-title span {
          display: block;
          margin-bottom: 5px;
          color: #00ffe0;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .filter-title h3 {
          margin: 0;
          color: #ffffff;
          font-size: 22px;
          font-weight: 950;
        }

        .gz-filter-reset-btn {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          color: #00ffe0;
          background: rgba(0, 255, 224, 0.08);
          border: 1px solid rgba(0, 255, 224, 0.18);
          border-radius: 12px;
          cursor: pointer;
        }

        .gz-filter-reset-btn:hover {
          color: #061313;
          background: #00ffe0;
        }

        .product-list-panel {
          width: 100%;
          padding: 18px;
          overflow: hidden;
        }

        .gz-product-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid #2a2d2e;
        }

        .gz-product-total {
          flex-shrink: 0;
          padding: 7px 12px;
          color: #00ffe0;
          background: rgba(0, 255, 224, 0.08);
          border: 1px solid rgba(0, 255, 224, 0.18);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
        }

        .products-list-page .ant-divider,
        .mobile-filter-drawer .ant-divider {
          border-color: #303435 !important;
        }

        .gz-products-filter-form .ant-form-item-label > label,
        .products-list-page .ant-checkbox-wrapper,
        .mobile-filter-drawer .ant-checkbox-wrapper,
        .products-list-page .ant-rate-text {
          color: #e5e7eb !important;
          font-weight: 800;
        }

        .gz-filter-check-row {
          padding: 7px 0;
        }

        .products-list-page .ant-checkbox-inner,
        .mobile-filter-drawer .ant-checkbox-inner {
          background-color: #111314 !important;
          border-color: #4b5563 !important;
        }

        .products-list-page .ant-checkbox-checked .ant-checkbox-inner,
        .mobile-filter-drawer .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #00ffe0 !important;
          border-color: #00ffe0 !important;
        }

        .products-list-page .ant-checkbox-checked .ant-checkbox-inner::after,
        .mobile-filter-drawer .ant-checkbox-checked .ant-checkbox-inner::after {
          border-color: #061313 !important;
        }

        .products-list-page .ant-input-number,
        .mobile-filter-drawer .ant-input-number {
          height: 40px !important;
          background: #111314 !important;
          border-color: #303435 !important;
          border-radius: 12px !important;
          color: #ffffff !important;
        }

        .products-list-page .ant-input-number-input,
        .mobile-filter-drawer .ant-input-number-input {
          height: 38px !important;
          color: #ffffff !important;
          font-weight: 700;
        }

        .products-list-page .ant-input-number-input::placeholder,
        .mobile-filter-drawer .ant-input-number-input::placeholder {
          color: #6b7280 !important;
        }

        .products-list-page .ant-input-number:hover,
        .products-list-page .ant-input-number-focused,
        .mobile-filter-drawer .ant-input-number:hover,
        .mobile-filter-drawer .ant-input-number-focused {
          border-color: #00ffe0 !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.08) !important;
        }

        .gz-price-separator {
          height: 40px;
          display: grid;
          place-items: center;
          color: #8b949e;
          font-weight: 900;
        }

        .apply-filter-btn {
          height: 40px !important;
          margin-top: 12px;
          border: none !important;
          border-radius: 999px !important;
          color: #061313 !important;
          background: linear-gradient(135deg, #00ffe0, #00b894) !important;
          font-weight: 950 !important;
        }

        .gz-rating-filter-list {
          display: grid;
          gap: 8px;
        }

        .rating-filter-row {
          width: 100%;
          padding: 7px 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #303435;
          border-radius: 12px;
          background: #181a1b;
          color: #b8c0cc;
          cursor: pointer;
        }

        .rating-filter-row:hover {
          border-color: #00ffe0;
          background: rgba(0, 255, 224, 0.06);
        }

        .rating-filter-row span {
          color: #b8c0cc;
          font-size: 12px;
          font-weight: 800;
        }

        .mobile-tabs {
          flex: 1;
          min-width: 0;
        }

        .mobile-tabs .ant-tabs-nav {
          margin: 0 !important;
        }

        .mobile-tabs .ant-tabs-nav::before {
          border-color: transparent !important;
        }

        .mobile-tabs .ant-tabs-tab {
          color: #b8c0cc !important;
          padding: 8px 12px !important;
          border-radius: 999px !important;
        }

        .mobile-tabs .ant-tabs-tab:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.06);
        }

        .mobile-tabs .ant-tabs-tab-active {
          background: rgba(0, 255, 224, 0.09);
        }

        .mobile-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #00ffe0 !important;
          font-weight: 900;
        }

        .mobile-tabs .ant-tabs-ink-bar {
          display: none !important;
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
          overflow: hidden;
          border-radius: 18px;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.01)
            ),
            #181a1b;
          border: 1px solid #2a2d2e;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
          transition: transform 0.25s ease, box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .product-card-dark:hover {
          transform: translateY(-5px);
          border-color: #00ffe0;
          box-shadow: 0 16px 34px rgba(0, 255, 224, 0.12);
        }

        .product-thumbnail {
          width: 100%;
          height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #0f1112;
          border-bottom: 1px solid #2a2d2e;
        }

        .product-thumbnail img {
          width: 100%;
          height: 100%;
          padding: 14px;
          display: block;
          object-fit: contain;
          transition: transform 0.35s ease;
        }

        .product-card-dark:hover .product-thumbnail img {
          transform: scale(1.055);
        }

        .product-name {
          min-height: 42px;
          padding: 12px 11px 4px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 900;
          line-height: 1.45;
          text-align: center;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-price {
          margin-top: 6px;
          color: #ff4d4f;
          font-size: 17px;
          font-weight: 950;
          text-align: center;
        }

        .product-rating {
          margin-top: 8px;
          padding: 0 8px 13px;
          color: #b8c0cc;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
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
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
        }

        .products-list-page .ant-select-arrow {
          color: #e5e7eb !important;
        }

        .mobile-filter-fab {
          display: none;
        }

        .mobile-filter-fab .ant-float-btn-body {
          background: linear-gradient(135deg, #00ffe0, #00b894) !important;
        }

        .products-list-page .ant-spin-text {
          color: #00ffe0 !important;
        }

        .products-list-page .ant-spin-dot-item {
          background-color: #00ffe0 !important;
        }

        .gz-product-empty {
          padding: 34px 12px;
          border-radius: 18px;
          background: #181a1b;
          border: 1px dashed #303435;
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

        .mobile-filter-drawer .ant-drawer-body {
          background: #181a1b !important;
        }

        .mobile-filter-actions {
          margin-bottom: 14px;
        }

        .mobile-filter-actions .ant-btn {
          width: 100%;
          height: 38px;
          color: #00ffe0;
          background: rgba(0, 255, 224, 0.08);
          border-color: rgba(0, 255, 224, 0.18);
          border-radius: 12px;
          font-weight: 900;
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
          .product-list-panel {
            padding: 12px;
            border-radius: 18px;
          }

          .gz-product-toolbar {
            align-items: stretch;
            flex-direction: column;
            gap: 12px;
          }

          .gz-product-total {
            width: fit-content;
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

          .product-card-dark {
            border-radius: 16px;
          }

          .product-thumbnail {
            height: 145px;
          }

          .product-name {
            min-height: 40px;
            padding: 10px 8px 2px;
            font-size: 13px;
          }

          .product-price {
            font-size: 14px;
          }

          .product-rating {
            gap: 4px;
            padding: 0 4px 12px;
            font-size: 11px;
          }

          .product-rating .ant-rate {
            font-size: 9px !important;
          }

          .products-list-page .ant-pagination-options {
            display: none !important;
          }
        }

        @media (max-width: 380px) {
          .product-list-panel {
            padding: 10px;
          }

          .products-grid {
            gap: 10px;
          }

          .product-thumbnail {
            height: 130px;
          }

          .product-name {
            min-height: 38px;
            font-size: 12px;
          }

          .product-price {
            font-size: 13px;
          }

          .product-rating {
            font-size: 10px;
          }
          .gz-simple-stars {
            display: inline-flex;
            align-items: center;
            gap: 2px;
            line-height: 1;
            flex-shrink: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;
