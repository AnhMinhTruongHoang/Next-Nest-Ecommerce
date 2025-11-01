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
import { useRouter } from "next/navigation";
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

  // categories
  useEffect(() => {
    const initCategory = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/categories");
        const data = await res.json();
        if (data?.data) {
          const d = data.data.map((item: any) => ({
            label: item.name,
            value: item._id,
          }));
          setListCategory(d);
        }
      } catch (e) {
        console.error("Fetch categories error:", e);
      }
    };
    initCategory();
  }, []);

  // products
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
      const res = await fetch(`http://localhost:8000/api/v1/products?${query}`);
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

  // pagination
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

  // filters
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
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `price>=${values.range.from}&price<=${values.range.to}`;
      if (values?.category?.length)
        f += `&category=${values.category.join(",")}`;
      setFilter(f);
    }
  };

  const items = [
    { key: "sort=-sold", label: `Phổ biến`, children: <></> },
    { key: "sort=-createdAt", label: `Hàng Mới`, children: <></> },
    { key: "sort=price", label: `Giá Thấp → Cao`, children: <></> },
    { key: "sort=-price", label: `Giá Cao → Thấp`, children: <></> },
  ];

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      {/* CSS nhỏ để hiện FAB filter trên mobile */}
      <style jsx>{`
        .mobile-filter-fab {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-filter-fab {
            display: block;
          }
        }
        /* Tabs cuộn ngang trên mobile */
        @media (max-width: 768px) {
          .mobile-tabs {
            overflow-x: auto;
            white-space: nowrap;
            scrollbar-width: thin;
          }
          :global(.mobile-tabs .ant-tabs-nav-list) {
            flex-wrap: nowrap !important;
          }
          :global(.mobile-tabs .ant-tabs-tab) {
            padding-inline: 8px !important;
            font-size: 13px;
          }
        }
      `}</style>

      <div
        className="homepage-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          {/* Sidebar filter (ẩn trên mobile) */}
          <Col md={4} sm={0} xs={0}>
            <div
              style={{ padding: "20px", background: "#fff", borderRadius: 5 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <FilterTwoTone />{" "}
                  <span style={{ fontWeight: 500 }}>Bộ lọc tìm kiếm</span>
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
                      <div> - </div>
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
                  >
                    Áp dụng
                  </Button>
                </Form.Item>

                <Divider />
                <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                  {[5, 4, 3, 2, 1].map((val) => (
                    <div key={val}>
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
              <div
                style={{ padding: "20px", background: "#fff", borderRadius: 5 }}
              >
                {/* Top row (mobile: có icon filter) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  {/* Icon filter chỉ hiện trên mobile */}
                  <Button
                    className="md-hidden"
                    icon={<FilterTwoTone />}
                    type="text"
                    style={{ display: "none" }}
                    onClick={() => setShowMobileFilter(true)}
                  />
                  <Tabs
                    className="mobile-tabs"
                    size="small"
                    defaultActiveKey="sort=-sold"
                    items={items}
                    onChange={(value) => setSortQuery(value)}
                  />
                </div>

                <Row className="customize-row">
                  {listProduct?.map((item, index) => (
                    <div
                      className="column"
                      key={`products-${index}`}
                      onClick={() => router.push(`/product-detail/${item._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="wrapper">
                        <div className="thumbnail">
                          <img
                            src={getImageUrl(item.thumbnail)}
                            alt="thumbnail"
                          />
                        </div>
                        <div
                          style={{ textAlign: "center" }}
                          className="text"
                          title={item.name}
                        >
                          {item.name}
                        </div>
                        <div className="price" style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item?.price ?? 0)}
                        </div>
                        <div
                          className="rating"
                          style={{
                            textAlign: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Rate
                            value={5}
                            disabled
                            style={{ color: "#ffce3d", fontSize: 10 }}
                          />
                          <span style={{ marginLeft: 5 }}>
                            {item?.sold ?? 0} đã bán
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </Row>

                {/* Pagination */}
                <Row
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 30,
                  }}
                >
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
                </Row>
              </div>
            </Spin>
          </Col>
        </Row>
      </div>

      {/* FAB filter icon (mobile only) */}
      <FloatButton
        className="mobile-filter-fab"
        icon={<FilterTwoTone twoToneColor="#52c41a" />}
        type="primary"
        style={{ right: 20, bottom: 20 }}
        onClick={() => setShowMobileFilter(true)}
        tooltip="Bộ lọc"
      />

      {/* Drawer filter (mobile) */}
      <Drawer
        title="Bộ lọc tìm kiếm"
        placement="left"
        open={showMobileFilter}
        onClose={() => setShowMobileFilter(false)}
        width={"80%"}
        styles={{ body: { paddingBottom: 24 } }}
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
              <Col span={2} style={{ textAlign: "center" }}>
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
            >
              Áp dụng
            </Button>
          </Form.Item>

          <Divider />
          <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
            {[5, 4, 3, 2, 1].map((val) => (
              <div key={val}>
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
    </div>
  );
};

export default ProductsPage;
