import { App, Button, Col, Divider, Form, Radio, Row, Space } from "antd";
import { DeleteTwoTone, LeftCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Input } from "antd";
import { useCurrentApp } from "@/components/context/app.context";
import type { FormProps } from "antd";
import { isMobile } from "react-device-detect";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";

const { TextArea } = Input;

type UserMethod = "COD" | "BANKING";

type FieldType = {
  fullName: string;
  phone: string;
  address: string;
  method: UserMethod;
};

interface IProps {
  setCurrentStep: (v: number) => void;
}

const Payment = (props: IProps) => {
  const { carts, setCarts, user } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState(0);

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const { setCurrentStep } = props;

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.name,
        phone: user.phone,
        method: "COD",
      });
    }
  }, [user]);

  useEffect(() => {
    if (carts && carts.length > 0) {
      const sum = carts.reduce(
        (acc, item) => acc + item.quantity * item.detail.price,
        0
      );
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  const handleRemoveProduct = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage) {
      const carts = JSON.parse(cartStorage) as ICart[];
      const newCarts = carts.filter((item) => item._id !== _id);
      localStorage.setItem("carts", JSON.stringify(newCarts));
      setCarts(newCarts);
    }
  };

  const handlePlaceOrder: FormProps<FieldType>["onFinish"] = async (values) => {
    const { address, fullName, method, phone } = values;
    const detail = carts.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
      productName: item.detail.name,
    }));

    setIsSubmit(true);

    try {
      const res = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          address,
          phone,
          totalPrice,
          method,
          detail,
        }),
      });

      const data = await res.json();

      if (res.ok && data) {
        localStorage.removeItem("carts");
        setCarts([]);
        message.success("Mua hàng thành công!");
        setCurrentStep(2);
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: Array.isArray(data?.message)
            ? data.message[0]
            : data.message,
          duration: 5,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: error.message || "Không thể kết nối tới server",
        duration: 5,
      });
    }

    setIsSubmit(false);
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", overflow: "hidden" }}>
        <Row gutter={[20, 20]}>
          {/* Left: list products */}
          <Col md={16} xs={24}>
            {carts?.map((item, index) => {
              const currentPrice = item?.detail?.price ?? 0;
              return (
                <div
                  key={`index-${index}`}
                  style={{
                    display: "flex",
                    gap: "30px",
                    marginBottom: "20px",
                    background: "white",
                    padding: "20px",
                    borderRadius: "5px",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Product info */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      flex: 1,
                    }}
                  >
                    <Image
                      src={getImageUrl(item.detail?.thumbnail)}
                      alt="thumbnail"
                      width={70}
                      height={70}
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>
                        {item?.detail?.name}
                      </div>
                      <div style={{ color: "#555" }}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(currentPrice)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <div>Số lượng: {item?.quantity}</div>
                    <div>
                      Tổng:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(currentPrice * (item?.quantity ?? 0))}
                    </div>
                    <DeleteTwoTone
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemoveProduct(item._id)}
                      twoToneColor="#eb2f96"
                    />
                  </div>
                </div>
              );
            })}

            <div
              title="tro lai"
              style={{
                cursor: "pointer",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <span onClick={() => setCurrentStep(0)}>
                <a>
                  <LeftCircleFilled style={{ fontSize: "25px" }} />
                </a>
              </span>
            </div>
          </Col>

          {/* Right: form */}
          <Col md={8} xs={24}>
            <Form
              form={form}
              name="payment-form"
              onFinish={handlePlaceOrder}
              autoComplete="off"
              layout="vertical"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "5px",
                  gap: "20px",
                }}
              >
                <Form.Item<FieldType>
                  label="Hình thức thanh toán"
                  name="method"
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value={"COD"}>Thanh toán khi nhận hàng</Radio>
                      <Radio value={"BANKING"}>Chuyển khoản ngân hàng</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>

                <Form.Item<FieldType>
                  label="Họ tên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Họ tên không được để trống!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại không được để trống!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Địa chỉ nhận hàng"
                  name="address"
                  rules={[
                    { required: true, message: "Địa chỉ không được để trống!" },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Tạm tính</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalPrice || 0)}
                  </span>
                </div>
                <Divider style={{ margin: "10px 0" }} />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Tổng tiền</span>
                  <span
                    style={{
                      color: "#fe3834",
                      fontSize: "22px",
                      fontWeight: 500,
                    }}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(totalPrice || 0)}
                  </span>
                </div>
                <Divider style={{ margin: "10px 0" }} />
                <Button
                  type="primary"
                  danger
                  htmlType="submit"
                  loading={isSubmit}
                >
                  Đặt Hàng ({carts?.length ?? 0})
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Payment;
