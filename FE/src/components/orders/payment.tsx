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
  Tooltip,
} from "antd";
import {
  LeftCircleFilled,
  TagOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
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
  const [subtotal, setSubtotal] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  // --- Voucher state ---
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherApplying, setVoucherApplying] = useState(false);
  const [voucherCodeApplied, setVoucherCodeApplied] = useState<string | null>(
    null
  );
  const [voucherDiscount, setVoucherDiscount] = useState<number>(0);
  const [voucherMsg, setVoucherMsg] = useState<string | null>(null);

  useEffect(() => {
    form.setFieldsValue({ method: "COD" as UserMethod });
  }, []); // eslint-disable-line

  useEffect(() => {
    const sum = carts.reduce(
      (acc, item) => acc + item.quantity * item.detail.price,
      0
    );
    setSubtotal(sum);
  }, [carts]);

  // Tính final total
  const finalTotal = useMemo(
    () => Math.max(subtotal - voucherDiscount, 0),
    [subtotal, voucherDiscount]
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  // Chuẩn hoá dữ liệu preview voucher từ carts
  const buildPreviewPayload = () => {
    const productIds = carts.map((c) => c.detail._id);
    const categoryIds = Array.from(
      new Set(
        carts
          .map((c) => c.detail.category)
          .filter(Boolean)
          .map((x: any) => (typeof x === "string" ? x : x?._id || ""))
      )
    ).filter(Boolean) as string[];

    const brands = Array.from(
      new Set(
        carts
          .map((c) => c.detail.brand)
          .filter(Boolean)
          .map((b: any) => String(b))
      )
    ) as string[];

    return { productIds, categoryIds, brands };
  };

  // Gọi preview voucher
  const applyVoucher = async () => {
    const code = voucherInput.trim();
    if (!code) {
      setVoucherDiscount(0);
      setVoucherMsg("Vui lòng nhập mã voucher");
      setVoucherCodeApplied(null);
      return;
    }
    if (!carts.length) {
      setVoucherDiscount(0);
      setVoucherMsg("Giỏ hàng trống");
      setVoucherCodeApplied(null);
      return;
    }

    setVoucherApplying(true);
    setVoucherMsg(null);

    try {
      const { productIds, categoryIds, brands } = buildPreviewPayload();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/vouchers/preview`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            orderSubtotal: subtotal,
            productIds,
            categoryIds,
            brands,
          }),
        }
      );
      const d = await res.json();

      // API của bạn trả { data: {...} } hay trả trực tiếp? – xử lý linh hoạt:
      const payload = d?.data ?? d;

      if (payload?.valid) {
        const discount = Number(payload.discount || 0);
        setVoucherDiscount(discount);
        setVoucherCodeApplied(code);
        setVoucherMsg(`Áp dụng mã thành công: -${formatCurrency(discount)}`);
        message.success("Áp dụng voucher thành công");
      } else {
        const reason = payload?.reason || "Mã không hợp lệ";
        setVoucherDiscount(0);
        setVoucherCodeApplied(null);
        setVoucherMsg(reason);
        message.warning(reason);
      }
    } catch (e: any) {
      setVoucherDiscount(0);
      setVoucherCodeApplied(null);
      setVoucherMsg("Không thể kiểm tra voucher");
      notification.error({ message: "Lỗi khi kiểm tra voucher" });
    } finally {
      setVoucherApplying(false);
    }
  };

  const clearVoucher = () => {
    setVoucherInput("");
    setVoucherDiscount(0);
    setVoucherCodeApplied(null);
    setVoucherMsg(null);
  };

  /// Đặt hàng
  const handlePlaceOrder = async (values: FieldType) => {
    if (!carts.length) {
      message.warning("Giỏ hàng trống");
      return;
    }

    const { fullName, phoneNumber, shippingAddress, method } = values;
    const userId = user?._id ?? "";

    const items = carts.map((item) => ({
      productId: item.detail._id,
      quantity: item.quantity,
      price: item.detail.price,
      name: item.detail.name,
    }));

    // paymentRef chỉ khi VNPAY
    const paymentRef = method === "VNPAY" ? uuidv4() : undefined;

    setIsSubmit(true);
    try {
      // 1) Tạo order (gửi kèm voucherCode nếu đã áp)
      const res = await createOrderAPI(
        userId,
        fullName,
        shippingAddress,
        phoneNumber,
        finalTotal,
        method,
        items,
        paymentRef,
        voucherCodeApplied ?? undefined
      );

      const orderId = res?.data?._id;
      if (!orderId) throw new Error(res?.message || "Không thể tạo đơn hàng");

      // 2) COD
      if (method === "COD") {
        localStorage.removeItem("carts");
        setCarts([]);
        message.success("Mua hàng thành công!");
        setCurrentStep(2);
        return;
      }

      // 3) VNPAY: tạo URL với finalTotal
      const vnpUrl = await getVNPayUrlAPI(finalTotal, "vn", paymentRef);
      if (!vnpUrl) throw new Error("Không thể tạo URL thanh toán");
      window.location.href = vnpUrl;
    } catch (error: any) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: error.message || "Không thể kết nối tới server",
        duration: 5,
      });
    } finally {
      setIsSubmit(false);
    }
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
                    { pattern: /^[0-9]+$/, message: "Chỉ được nhập chữ số!" },
                  ]}
                >
                  <Input
                    maxLength={11}
                    placeholder="Nhập số điện thoại"
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "Delete" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight" &&
                        e.key !== "Tab"
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
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

                {/* Voucher box */}
                <div
                  style={{
                    background: "#fafafa",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px dashed #ddd",
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <TagOutlined />
                  <Input
                    placeholder="Nhập mã voucher (ví dụ: GamerZone)"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    onPressEnter={applyVoucher}
                  />
                  <Space>
                    <Button
                      onClick={clearVoucher}
                      disabled={!voucherInput && !voucherCodeApplied}
                    >
                      Xóa
                    </Button>
                    <Button
                      type="primary"
                      onClick={applyVoucher}
                      disabled={!voucherInput}
                      loading={voucherApplying}
                    >
                      Áp dụng
                    </Button>
                  </Space>
                </div>
                {voucherMsg && (
                  <div style={{ marginTop: -8 }}>
                    <small
                      style={{
                        color: voucherCodeApplied ? "#52c41a" : "#ff4d4f",
                      }}
                    >
                      {voucherApplying ? <LoadingOutlined /> : null}{" "}
                      {voucherMsg}
                    </small>
                  </div>
                )}

                {/* Tạm tính & tổng */}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Tạm tính</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Giảm giá</span>
                  <span
                    style={{ color: voucherDiscount > 0 ? "#52c41a" : "#999" }}
                  >
                    - {formatCurrency(voucherDiscount)}
                  </span>
                </div>

                <Divider />

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Tổng tiền</span>
                  <Tooltip
                    title={
                      voucherCodeApplied
                        ? `Đã áp mã: ${voucherCodeApplied}`
                        : undefined
                    }
                  >
                    <span
                      style={{
                        color: "#fe3834",
                        fontSize: "22px",
                        fontWeight: 500,
                      }}
                    >
                      {formatCurrency(finalTotal)}
                    </span>
                  </Tooltip>
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
