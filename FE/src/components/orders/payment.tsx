"use client";
import {
  App,
  Button,
  Col,
  Divider,
  Form,
  Radio,
  Row,
  Space,
  Input,
} from "antd";
import { LeftCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useCurrentApp } from "@/components/context/app.context";
import { createOrderAPI, getVNPayUrlAPI } from "@/utils/api";
import { v4 as uuidv4 } from "uuid";
import { getImageUrl } from "@/utils/getImageUrl";

const { TextArea } = Input;

type UserMethod = "COD" | "VNPAY";

type FieldType = {
  fullName: string;
  phoneNumber: string;
  shippingAddress: string;
  method: UserMethod;
};

interface IProps {
  setCurrentStep: (v: number) => void;
}

const Payment = ({ setCurrentStep }: IProps) => {
  const { carts, setCarts, user } = useCurrentApp();
  const [form] = Form.useForm();
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  useEffect(() => {
    form.setFieldsValue({ method: "COD" });
  }, []);

  useEffect(() => {
    const sum = carts.reduce(
      (acc, item) => acc + item.quantity * item.detail.price,
      0
    );
    setTotalPrice(sum);
  }, [carts]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  /// Order logic
  const handlePlaceOrder = async (values: FieldType) => {
    const { fullName, phoneNumber, shippingAddress, method } = values;
    const userId = user?._id ?? "";

    const items = carts.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
      price: item.detail.price,
      name: item.detail.name,
    }));

    const paymentRef = uuidv4();
    setIsSubmit(true);

    try {
      // 1. Tạo đơn hàng
      const res = await createOrderAPI(
        userId,
        fullName,
        shippingAddress,
        phoneNumber,
        totalPrice,
        method,
        items,
        method === "VNPAY" ? paymentRef : undefined
      );

      if (!res?.data?._id) {
        throw new Error(res?.message || "Không thể tạo đơn hàng");
      }

      const orderId = res.data._id;

      // 2. Nếu COD → hoàn tất
      if (method === "COD") {
        localStorage.removeItem("carts");
        setCarts([]);
        message.success("Mua hàng thành công!");
        setCurrentStep(2);
        return;
      }

      // 3. Nếu VNPAY → gọi API lấy URL thanh toán
      const vnpUrl = await getVNPayUrlAPI(totalPrice, "vn", orderId);

      if (!vnpUrl) {
        throw new Error("Không thể tạo URL thanh toán");
      }

      // 4. Redirect sang VNPay
      window.location.href = vnpUrl;
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
    <div style={{ background: "#efefef", padding: "50px 0" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <Row gutter={[20, 20]}>
          {/* Left: Cart items */}
          <Col md={16} xs={24}>
            {carts.map((item, index) => {
              const price = item.detail.price;
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "30px",
                    marginBottom: "20px",
                    background: "white",
                    padding: "20px",
                    borderRadius: "5px",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", gap: "15px", flex: 1 }}>
                    <Image
                      src={getImageUrl(item.detail.thumbnail)}
                      alt="thumbnail"
                      width={70}
                      height={70}
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.detail.name}</div>
                      <div style={{ color: "#555" }}>
                        {formatCurrency(price)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div>Số lượng: {item.quantity}</div>
                    <div>Tổng: {formatCurrency(price * item.quantity)}</div>
                  </div>
                </div>
              );
            })}
            <div style={{ textAlign: "center", cursor: "pointer" }}>
              <span onClick={() => setCurrentStep(0)}>
                <LeftCircleFilled style={{ fontSize: "25px" }} />
              </span>
            </div>
          </Col>

          {/* Right: Form */}
          <Col md={8} xs={24}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handlePlaceOrder}
              autoComplete="off"
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "5px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <Form.Item name="method" label="Hình thức thanh toán">
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value="COD">Thanh toán khi nhận hàng</Radio>
                      <Radio value="VNPAY">Thanh toán ví VNPAY</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="fullName"
                  label="Họ tên"
                  rules={[
                    { required: true, message: "Họ tên không được để trống!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="phoneNumber"
                  label="Số điện thoại"
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại không được để trống!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="shippingAddress"
                  label="Địa chỉ nhận hàng"
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
                  <span>{formatCurrency(totalPrice)}</span>
                </div>

                <Divider />

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
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                <Divider />

                <Button
                  type="primary"
                  danger
                  htmlType="submit"
                  loading={isSubmit}
                >
                  Đặt Hàng ({carts.length})
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
