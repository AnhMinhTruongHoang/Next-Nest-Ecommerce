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
  Typography,
} from "antd";
import {
  LeftCircleFilled,
  TagOutlined,
  LoadingOutlined,
  CreditCardOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useCurrentApp } from "@/components/context/app.context";
import { createOrderAPI, getVNPayUrlAPI } from "@/utils/api";
import { v4 as uuidv4 } from "uuid";
import { getImageUrl } from "@/utils/getImageUrl";

const { TextArea } = Input;
const { Text } = Typography;

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
  const [form] = Form.useForm<FieldType>();
  const [subtotal, setSubtotal] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  const [voucherInput, setVoucherInput] = useState("");
  const [voucherApplying, setVoucherApplying] = useState(false);
  const [voucherCodeApplied, setVoucherCodeApplied] = useState<string | null>(
    null
  );
  const [voucherDiscount, setVoucherDiscount] = useState<number>(0);
  const [voucherMsg, setVoucherMsg] = useState<string | null>(null);

  useEffect(() => {
    form.setFieldsValue({
      method: "COD",
      fullName: user?.name || "",
      phoneNumber: user?.phone || "",
      shippingAddress: user?.address || "",
    });
  }, [form, user]);

  useEffect(() => {
    const sum = carts.reduce(
      (acc, item) => acc + item.quantity * item.detail.price,
      0
    );

    setSubtotal(sum);
  }, [carts]);

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

  const buildPreviewPayload = () => {
    const productIds = carts.map((cart) => cart.detail._id);

    const categoryIds = Array.from(
      new Set(
        carts
          .map((cart) => cart.detail.category)
          .filter(Boolean)
          .map((value: any) =>
            typeof value === "string" ? value : value?._id || ""
          )
      )
    ).filter(Boolean) as string[];

    const brands = Array.from(
      new Set(
        carts
          .map((cart) => cart.detail.brand)
          .filter(Boolean)
          .map((brand: any) => String(brand))
      )
    ) as string[];

    return { productIds, categoryIds, brands };
  };

  const applyVoucher = async () => {
    const code = voucherInput.trim();

    if (!code) {
      setVoucherDiscount(0);
      setVoucherMsg("Please enter a voucher code.");
      setVoucherCodeApplied(null);
      return;
    }

    if (!carts.length) {
      setVoucherDiscount(0);
      setVoucherMsg("Your cart is empty.");
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

      const data = await res.json();
      const payload = data?.data ?? data;

      if (payload?.valid) {
        const discount = Number(payload.discount || 0);

        setVoucherDiscount(discount);
        setVoucherCodeApplied(code);
        setVoucherMsg(`Voucher applied: -${formatCurrency(discount)}`);
        message.success("Voucher applied successfully.");
        return;
      }

      const reason = payload?.reason || "Invalid voucher code.";
      setVoucherDiscount(0);
      setVoucherCodeApplied(null);
      setVoucherMsg(reason);
      message.warning(reason);
    } catch {
      setVoucherDiscount(0);
      setVoucherCodeApplied(null);
      setVoucherMsg("Cannot validate voucher.");
      notification.error({ message: "Voucher validation failed." });
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

  const handlePlaceOrder = async (values: FieldType) => {
    if (!carts.length) {
      message.warning("Your cart is empty.");
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

    const paymentRef = method === "VNPAY" ? uuidv4() : undefined;

    setIsSubmit(true);

    try {
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

      if (!orderId) {
        throw new Error(res?.message || "Cannot create order.");
      }

      if (method === "COD") {
        localStorage.removeItem("carts");
        setCarts([]);
        message.success("Order placed successfully.");
        setCurrentStep(2);
        return;
      }

      const vnpUrl = await getVNPayUrlAPI(finalTotal, "vn", paymentRef);

      if (!vnpUrl) {
        throw new Error("Cannot create payment URL.");
      }

      window.location.href = vnpUrl;
    } catch (error: any) {
      notification.error({
        message: "Checkout failed",
        description: error.message || "Cannot connect to server.",
        duration: 5,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="gz-payment-page">
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <div className="gz-payment-items-card">
            <div className="gz-payment-card-head">
              <div>
                <span>Order Review</span>
                <h2>Items To Pay</h2>
              </div>

              <Button
                type="text"
                icon={<LeftCircleFilled />}
                onClick={() => setCurrentStep(0)}
                className="gz-payment-back-btn"
              >
                Back to cart
              </Button>
            </div>

            <div className="gz-payment-items">
              {carts.map((item) => {
                const price = item.detail.price;
                const imageUrl =
                  getImageUrl(item.detail.thumbnail) || "/images/noimage.png";

                return (
                  <article className="gz-payment-item" key={item._id}>
                    <div className="gz-payment-img-box">
                      <Image
                        src={imageUrl}
                        alt={item.detail.name || "Product thumbnail"}
                        width={82}
                        height={82}
                        className="gz-payment-img"
                      />
                    </div>

                    <div className="gz-payment-item-info">
                      <h4>{item.detail.name}</h4>
                      <Text className="gz-payment-price">
                        {formatCurrency(price)}
                      </Text>
                    </div>

                    <div className="gz-payment-item-total">
                      <span>Qty: {item.quantity}</span>
                      <strong>{formatCurrency(price * item.quantity)}</strong>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handlePlaceOrder}
            autoComplete="off"
            className="gz-payment-form"
          >
            <div className="gz-payment-form-card">
              <div className="gz-payment-form-head">
                <div className="gz-payment-form-icon">
                  <CreditCardOutlined />
                </div>

                <div>
                  <span>Payment Details</span>
                  <h3>Checkout Info</h3>
                </div>
              </div>

              <Form.Item
                name="method"
                label="Payment method"
                rules={[
                  {
                    required: true,
                    message: "Please choose a payment method.",
                  },
                ]}
              >
                <Radio.Group className="gz-payment-radio-group">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Radio value="COD" className="gz-payment-radio">
                      <span>
                        <WalletOutlined /> Cash on delivery
                      </span>
                    </Radio>

                    <Radio value="VNPAY" className="gz-payment-radio">
                      <span>
                        <CreditCardOutlined /> VNPAY wallet
                      </span>
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="fullName"
                label="Full name"
                rules={[
                  {
                    required: true,
                    message: "Full name is required.",
                  },
                ]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item
                name="phoneNumber"
                label="Phone number"
                rules={[
                  {
                    required: true,
                    message: "Phone number is required.",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Only numbers are allowed.",
                  },
                ]}
              >
                <Input
                  maxLength={11}
                  placeholder="Enter phone number"
                  onKeyDown={(event) => {
                    if (
                      !/[0-9]/.test(event.key) &&
                      event.key !== "Backspace" &&
                      event.key !== "Delete" &&
                      event.key !== "ArrowLeft" &&
                      event.key !== "ArrowRight" &&
                      event.key !== "Tab"
                    ) {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                name="shippingAddress"
                label="Shipping address"
                rules={[
                  {
                    required: true,
                    message: "Shipping address is required.",
                  },
                ]}
              >
                <TextArea rows={4} placeholder="Enter shipping address" />
              </Form.Item>

              <div className="gz-voucher-box">
                <div className="gz-voucher-icon">
                  <TagOutlined />
                </div>

                <Input
                  placeholder="Voucher code"
                  value={voucherInput}
                  onChange={(event) => setVoucherInput(event.target.value)}
                  onPressEnter={applyVoucher}
                />

                <div className="gz-voucher-actions">
                  <Button
                    onClick={clearVoucher}
                    disabled={!voucherInput && !voucherCodeApplied}
                  >
                    Clear
                  </Button>

                  <Button
                    type="primary"
                    onClick={applyVoucher}
                    disabled={!voucherInput}
                    loading={voucherApplying}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              {voucherMsg && (
                <div
                  className={`gz-voucher-message ${
                    voucherCodeApplied ? "success" : "error"
                  }`}
                >
                  {voucherApplying ? <LoadingOutlined /> : null}
                  <span>{voucherMsg}</span>
                </div>
              )}

              <div className="gz-payment-summary">
                <div className="gz-payment-summary-row">
                  <span>Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>

                <div className="gz-payment-summary-row">
                  <span>Discount</span>
                  <strong className={voucherDiscount > 0 ? "discount" : ""}>
                    - {formatCurrency(voucherDiscount)}
                  </strong>
                </div>

                <Divider className="gz-payment-divider" />

                <div className="gz-payment-summary-row total">
                  <span>Total</span>

                  <Tooltip
                    title={
                      voucherCodeApplied
                        ? `Applied voucher: ${voucherCodeApplied}`
                        : undefined
                    }
                  >
                    <strong>{formatCurrency(finalTotal)}</strong>
                  </Tooltip>
                </div>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmit}
                block
                className="gz-payment-submit-btn"
              >
                Place Order ({carts.length})
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      <style jsx global>{`
        .gz-payment-page {
          width: 100%;
        }

        .gz-payment-items-card,
        .gz-payment-form-card {
          border-radius: 22px;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.012)
            ),
            #111314;
          border: 1px solid #2a2d2e;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.25);
        }

        .gz-payment-items-card {
          padding: 18px;
        }

        .gz-payment-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #2a2d2e;
        }

        .gz-payment-card-head span,
        .gz-payment-form-head span {
          display: block;
          margin-bottom: 5px;
          color: #00ffe0;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .gz-payment-card-head h2,
        .gz-payment-form-head h3 {
          margin: 0;
          color: #ffffff;
          font-weight: 950;
        }

        .gz-payment-card-head h2 {
          font-size: 24px;
        }

        .gz-payment-form-head h3 {
          font-size: 22px;
        }

        .gz-payment-back-btn {
          color: #00ffe0 !important;
          border-radius: 999px !important;
          font-weight: 900 !important;
        }

        .gz-payment-back-btn:hover {
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .gz-payment-items {
          display: grid;
          gap: 14px;
        }

        .gz-payment-item {
          display: grid;
          grid-template-columns: 82px 1fr auto;
          gap: 14px;
          align-items: center;
          padding: 14px;
          border-radius: 18px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          transition: transform 0.22s ease, border-color 0.22s ease,
            box-shadow 0.22s ease;
        }

        .gz-payment-item:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 255, 224, 0.28);
          box-shadow: 0 12px 26px rgba(0, 255, 224, 0.08);
        }

        .gz-payment-img-box {
          width: 82px;
          height: 82px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 16px;
          background: #0f1112;
          border: 1px solid #303435;
        }

        .gz-payment-img {
          width: 100%;
          height: 100%;
          padding: 8px;
          object-fit: contain;
        }

        .gz-payment-item-info {
          min-width: 0;
        }

        .gz-payment-item-info h4 {
          margin: 0 0 8px;
          color: #ffffff;
          font-size: 15px;
          font-weight: 900;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .gz-payment-price {
          color: #ff4d4f !important;
          font-size: 15px;
          font-weight: 950;
        }

        .gz-payment-item-total {
          text-align: right;
        }

        .gz-payment-item-total span {
          display: block;
          color: #8b949e;
          font-size: 12px;
          font-weight: 800;
        }

        .gz-payment-item-total strong {
          display: block;
          margin-top: 4px;
          color: #ffffff;
          font-size: 15px;
          font-weight: 950;
        }

        .gz-payment-form-card {
          padding: 20px;
        }

        .gz-payment-form-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .gz-payment-form-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 15px;
          color: #00ffe0;
          font-size: 21px;
          background: rgba(0, 255, 224, 0.08);
          border: 1px solid rgba(0, 255, 224, 0.18);
        }

        .gz-payment-form .ant-form-item-label > label {
          color: #e5e7eb !important;
          font-size: 13px !important;
          font-weight: 900 !important;
        }

        .gz-payment-form .ant-input,
        .gz-payment-form .ant-input-affix-wrapper,
        .gz-payment-form textarea {
          color: #ffffff !important;
          background: #0f1112 !important;
          border-color: #303435 !important;
          border-radius: 13px !important;
        }

        .gz-payment-form .ant-input,
        .gz-payment-form .ant-input-affix-wrapper {
          height: 42px !important;
        }

        .gz-payment-form textarea {
          resize: none !important;
          padding: 12px 14px !important;
        }

        .gz-payment-form .ant-input::placeholder,
        .gz-payment-form textarea::placeholder {
          color: #6b7280 !important;
        }

        .gz-payment-form .ant-input:hover,
        .gz-payment-form .ant-input:focus,
        .gz-payment-form textarea:hover,
        .gz-payment-form textarea:focus {
          border-color: #00ffe0 !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.08) !important;
        }

        .gz-payment-form .ant-form-item-explain-error {
          color: #ff7875 !important;
          font-size: 12px !important;
          font-weight: 700;
        }

        .gz-payment-radio-group {
          width: 100%;
        }

        .gz-payment-radio {
          width: 100%;
          min-height: 42px;
          display: flex !important;
          align-items: center;
          padding: 10px 12px;
          border-radius: 14px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
        }

        .gz-payment-radio span {
          color: #e5e7eb;
          font-weight: 800;
        }

        .gz-payment-radio .anticon {
          margin-right: 7px;
          color: #00ffe0;
        }

        .gz-payment-radio .ant-radio-inner {
          background: #0f1112 !important;
          border-color: #303435 !important;
        }

        .gz-payment-radio .ant-radio-checked .ant-radio-inner {
          border-color: #00ffe0 !important;
          background: #00ffe0 !important;
        }

        .gz-voucher-box {
          display: grid;
          grid-template-columns: 38px 1fr auto;
          gap: 10px;
          align-items: center;
          margin-bottom: 10px;
          padding: 12px;
          border-radius: 16px;
          background: rgba(0, 255, 224, 0.04);
          border: 1px dashed rgba(0, 255, 224, 0.22);
        }

        .gz-voucher-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: #00ffe0;
          background: rgba(0, 255, 224, 0.08);
        }

        .gz-voucher-actions {
          display: flex;
          gap: 8px;
        }

        .gz-voucher-actions .ant-btn {
          height: 38px !important;
          border-radius: 12px !important;
          font-weight: 900 !important;
        }

        .gz-voucher-actions .ant-btn-primary {
          color: #061313 !important;
          border: none !important;
          background: linear-gradient(135deg, #00ffe0, #00b894) !important;
        }

        .gz-voucher-message {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 2px 0 14px;
          font-size: 12px;
          font-weight: 800;
        }

        .gz-voucher-message.success {
          color: #22c55e;
        }

        .gz-voucher-message.error {
          color: #ff7875;
        }

        .gz-payment-summary {
          margin-top: 12px;
          padding: 14px;
          border-radius: 16px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
        }

        .gz-payment-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          color: #b8c0cc;
          font-size: 14px;
          font-weight: 700;
        }

        .gz-payment-summary-row + .gz-payment-summary-row {
          margin-top: 10px;
        }

        .gz-payment-summary-row strong {
          color: #ffffff;
          font-weight: 950;
        }

        .gz-payment-summary-row strong.discount {
          color: #22c55e;
        }

        .gz-payment-summary-row.total span {
          color: #ffffff;
          font-size: 16px;
          font-weight: 950;
        }

        .gz-payment-summary-row.total strong {
          color: #ff4d4f;
          font-size: 24px;
        }

        .gz-payment-divider {
          margin: 14px 0 !important;
          border-color: #303435 !important;
        }

        .gz-payment-submit-btn {
          height: 46px !important;
          margin-top: 18px;
          border: none !important;
          border-radius: 999px !important;
          color: #061313 !important;
          background: linear-gradient(135deg, #00ffe0, #00b894) !important;
          font-weight: 950 !important;
          box-shadow: 0 14px 30px rgba(0, 255, 224, 0.14) !important;
        }

        @media (max-width: 992px) {
          .gz-payment-item {
            grid-template-columns: 78px 1fr;
            gap: 12px;
            align-items: center;
          }

          .gz-payment-img-box {
            width: 78px;
            height: 78px;
          }

          .gz-payment-item-total {
            grid-column: 1 / -1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding-top: 12px;
            margin-top: 2px;
            border-top: 1px solid #2a2d2e;
            text-align: left;
          }
        }

        @media (max-width: 620px) {
          .gz-payment-items-card,
          .gz-payment-form-card {
            padding: 14px;
            border-radius: 20px;
          }

          .gz-payment-card-head {
            align-items: stretch;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 14px;
            padding-bottom: 14px;
          }

          .gz-payment-card-head span {
            font-size: 10px;
          }

          .gz-payment-card-head h2 {
            font-size: 20px;
            line-height: 1.25;
          }

          .gz-payment-back-btn {
            width: fit-content !important;
            height: 34px !important;
            padding: 0 12px !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
            border-radius: 999px !important;
            color: #00ffe0 !important;
            background: rgba(0, 255, 224, 0.07) !important;
            border: 1px solid rgba(0, 255, 224, 0.16) !important;
            font-size: 11px !important;
            font-weight: 950 !important;
            letter-spacing: 0.2px;
          }

          .gz-payment-items {
            gap: 12px;
          }

          .gz-payment-item {
            position: relative;
            grid-template-columns: 74px 1fr;
            gap: 12px;
            padding: 12px;
            border-radius: 18px;
            background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.035),
                rgba(255, 255, 255, 0.01)
              ),
              #181a1b;
            border: 1px solid #2a2d2e;
          }

          .gz-payment-img-box {
            width: 74px;
            height: 74px;
            border-radius: 15px;
            background: #f8fafc;
            border: 1px solid rgba(255, 255, 255, 0.08);
          }

          .gz-payment-img {
            padding: 7px;
            object-fit: contain;
          }

          .gz-payment-item-info {
            align-self: center;
            min-width: 0;
          }

          .gz-payment-item-info h4 {
            margin-bottom: 7px;
            color: #ffffff;
            font-size: 13px;
            font-weight: 950;
            line-height: 1.35;
            -webkit-line-clamp: 2;
          }

          .gz-payment-price {
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            border-radius: 999px;
            color: #ff4d4f !important;
            background: rgba(255, 77, 79, 0.08);
            border: 1px solid rgba(255, 77, 79, 0.18);
            font-size: 12px !important;
            font-weight: 950 !important;
          }

          .gz-payment-item-total {
            grid-column: 1 / -1;
            margin-top: 2px;
            padding: 10px 11px;
            border-top: 1px solid #2a2d2e;
            border-radius: 14px;
            background: #111314;
          }

          .gz-payment-item-total span {
            color: #8b949e;
            font-size: 12px;
            font-weight: 900;
          }

          .gz-payment-item-total strong {
            margin-top: 0;
            color: #ffffff;
            font-size: 14px;
            font-weight: 950;
            text-align: right;
          }

          .gz-voucher-box {
            grid-template-columns: 38px 1fr;
          }

          .gz-voucher-actions {
            grid-column: 1 / -1;
            width: 100%;
          }

          .gz-voucher-actions .ant-btn {
            flex: 1;
          }

          .gz-payment-summary-row.total strong {
            font-size: 21px;
          }
        }

        @media (max-width: 380px) {
          .gz-payment-items-card,
          .gz-payment-form-card {
            padding: 12px;
            border-radius: 18px;
          }

          .gz-payment-item {
            grid-template-columns: 68px 1fr;
            gap: 10px;
            padding: 10px;
          }

          .gz-payment-img-box {
            width: 68px;
            height: 68px;
          }

          .gz-payment-item-info h4 {
            font-size: 12.5px;
          }

          .gz-payment-price {
            font-size: 11px !important;
          }

          .gz-payment-item-total {
            padding: 9px 10px;
          }

          .gz-payment-item-total strong {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default Payment;
