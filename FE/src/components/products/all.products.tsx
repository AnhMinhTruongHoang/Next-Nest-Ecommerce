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
} from "antd";
import type { FormProps } from "antd";
import { useEffect, useState } from "react";
import "../../styles/home.scss";

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
};

const ProductsPage = () => {
  const [listCategory, setListCategory] = useState<
    { label: string; value: string }[]
  >([]);
  const [listBook, setListBook] = useState<IProduct[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [sortQuery, setSortQuery] = useState<string>("sort=-sold");

  const [form] = Form.useForm();

  useEffect(() => {
    const initCategory = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/categories");
        const data = await res.json();
        if (data && data.data) {
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

  useEffect(() => {
    fetchBook();
  }, [current, pageSize, filter, sortQuery]);

  const fetchBook = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) query += `&${filter}`;
    if (sortQuery) query += `&${sortQuery}`;

    try {
      const res = await fetch(`http://localhost:8000/api/v1/products?${query}`);
      const data = await res.json();
      if (data && data.data) {
        setListBook(data.data.result);
        setTotal(data.data.meta.total);
      }
    } catch (e) {
      console.error("Fetch products error:", e);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleChangeFilter = (changedValues: any, values: any) => {
    let queryParts: string[] = [];

    // lọc theo category
    if (values.category?.length > 0) {
      queryParts.push(`category[in]=${values.category.join(",")}`);
    }

    // lọc theo khoảng giá
    if (values.range?.from) {
      queryParts.push(`price[gte]=${values.range.from}`);
    }
    if (values.range?.to) {
      queryParts.push(`price[lte]=${values.range.to}`);
    }

    // lọc theo rating (nếu bạn muốn)
    if (values.rating) {
      queryParts.push(`rating[gte]=${values.rating}`);
    }

    setFilter(queryParts.join("&"));
    setCurrent(1); // reset về trang 1
  };

  const onFinish: FormProps<IProduct>["onFinish"] = async (values) => {};

  const items = [
    { key: "sort=-sold", label: `Phổ biến`, children: <></> },
    { key: "sort=-createdAt", label: `Hàng Mới`, children: <></> },
    { key: "sort=price", label: `Giá Thấp Đến Cao`, children: <></> },
    { key: "sort=-price", label: `Giá Cao Đến Thấp`, children: <></> },
  ];

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="homepage-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          {/* Sidebar bộ lọc */}
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
                  onClick={() => form.resetFields()}
                />
              </div>
              <Divider />
              <Form
                onFinish={onFinish}
                form={form}
                onValuesChange={(changedValues, values) =>
                  handleChangeFilter(changedValues, values)
                }
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
                      <Form.Item name={["range", "from"]}>
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
                      <Form.Item name={["range", "to"]}>
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

          {/* Danh sách sản phẩm */}
          <Col md={20} xs={24}>
            <Spin spinning={isLoading} tip="Loading...">
              <div
                style={{ padding: "20px", background: "#fff", borderRadius: 5 }}
              >
                <Tabs
                  defaultActiveKey="sort=-sold"
                  items={items}
                  onChange={(value) => setSortQuery(value)}
                  style={{ overflowX: "auto" }}
                />
                <Row className="customize-row">
                  {listBook?.map((item, index) => (
                    <div className="column" key={`book-${index}`}>
                      <div className="wrapper">
                        <div className="thumbnail">
                          <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.thumbnail}`}
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
                          <span style={{ textAlign: "center" }}>
                            {item?.sold ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </Row>
                <Row
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 30,
                  }}
                >
                  <Pagination
                    current={current}
                    total={total}
                    pageSize={pageSize}
                    responsive
                    onChange={(p, s) =>
                      handleOnchangePage({ current: p, pageSize: s })
                    }
                  />
                </Row>
              </div>
            </Spin>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductsPage;
