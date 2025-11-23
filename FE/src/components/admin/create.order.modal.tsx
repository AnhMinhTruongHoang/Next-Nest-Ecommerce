"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Divider,
  Space,
  App,
} from "antd";

const { Option } = Select;

interface CreateOrderModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  accessToken: string;
  reload: () => Promise<void>;
}

type SimpleProduct = {
  _id: string;
  name: string;
  price?: number;
};

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  setIsOpen,
  accessToken,
  reload,
}) => {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const buildAuthHeader = () =>
    accessToken?.startsWith("Bearer ") ? accessToken : `Bearer ${accessToken}`;

  useEffect(() => {
    if (!isOpen) return;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?current=1&pageSize=9999`,
          {
            headers: {
              Authorization: buildAuthHeader(),
              "Content-Type": "application/json",
            },
          }
        );
        const d = await res.json();
        if (d.data && Array.isArray(d.data.result)) {
          setProducts(
            d.data.result.map((p: any) => ({
              _id: p._id,
              name: p.name,
              price: p.price,
            }))
          );
        } else {
          notification.error({
            message: "Không lấy được danh sách sản phẩm",
            description: JSON.stringify(d.message || d),
          });
        }
      } catch (err: any) {
        notification.error({
          message: "Lỗi tải danh sách sản phẩm",
          description: err?.message || "Không thể gọi API /products",
        });
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const onFinish = async (values: any) => {
    const items = values.items || [];

    if (!items.length) {
      notification.error({ message: "Đơn hàng phải có ít nhất 1 sản phẩm" });
      return;
    }

    const normalizedItems = items.map((it: any) => ({
      productId: it.productId,
      quantity: Number(it.quantity || 0),
      price: Number(it.price || 0),
    }));

    const totalPrice = normalizedItems.reduce(
      (sum: number, it: any) => sum + it.price * it.quantity,
      0
    );

    if (totalPrice <= 0) {
      notification.error({
        message: "Tổng tiền phải lớn hơn 0",
      });
      return;
    }

    const payload = {
      userId: values.userId || undefined,
      items: normalizedItems,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      shippingAddress: values.shippingAddress,
      totalPrice,
      email: values.email || undefined,
      note: values.note || undefined,
      voucherCode: values.voucherCode || undefined,
      paymentRef: values.paymentRef || undefined,
      status: values.status || "PENDING",
      paymentMethod: values.paymentMethod || "COD",
      paymentStatus: values.paymentStatus || "UNPAID",
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: buildAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.data) {
        notification.error({
          message: "Tạo đơn hàng thất bại",
          description: JSON.stringify(data.message || data),
        });
        return;
      }

      notification.success({ message: "Tạo đơn hàng thành công" });
      await reload();
      handleClose();
    } catch (err: any) {
      notification.error({
        message: "Lỗi kết nối máy chủ",
        description: err?.message || "Không thể gọi API /orders",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      maskClosable={false}
      width={900}
      styles={{
        body: { padding: "24px 36px" },
      }}
      title={
        <div style={{ textAlign: "center", fontWeight: 700, fontSize: 20 }}>
          TẠO ĐƠN HÀNG MỚI
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        name="createOrder"
        onFinish={onFinish}
        initialValues={{
          status: "PENDING",
          paymentMethod: "COD",
          paymentStatus: "UNPAID",
        }}
        style={{ width: "100%", marginTop: 12 }}
      >
        {/* =================== CUSTOMER INFO =================== */}
        <Divider orientation="center" style={{ fontWeight: 600 }}>
          Thông tin khách hàng
        </Divider>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          <Form.Item label="User ID (tuỳ chọn)" name="userId">
            <Input placeholder="Nhập _id user nếu có" />
          </Form.Item>

          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[{ required: true, message: "Vui lòng nhập SĐT!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
        </div>

        <Form.Item
          label="Địa chỉ giao hàng"
          name="shippingAddress"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={2} />
        </Form.Item>

        {/* =================== ORDER ITEMS =================== */}
        <Divider orientation="center" style={{ fontWeight: 600 }}>
          Sản phẩm trong đơn
        </Divider>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <div
                  key={field.key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "260px 120px 140px 80px",
                    gap: 16,
                    marginBottom: 12,
                    padding: 12,
                    borderRadius: 8,
                    background: "#fafafa",
                    alignItems: "center",
                  }}
                >
                  <Form.Item
                    {...field}
                    label="Sản phẩm"
                    name={[field.name, "productId"]}
                    rules={[{ required: true, message: "Chọn sản phẩm!" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Chọn sản phẩm"
                      loading={loadingProducts}
                      optionFilterProp="label"
                      filterOption={(input, option) =>
                        (option?.label as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={products.map((p) => ({
                        label: `${p.name} - ${p.price?.toLocaleString(
                          "vi-VN"
                        )} ₫`,
                        value: p._id,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label="Số lượng"
                    name={[field.name, "quantity"]}
                    rules={[{ required: true, message: "Nhập SL!" }]}
                  >
                    <InputNumber min={1} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label="Đơn giá"
                    name={[field.name, "price"]}
                    rules={[{ required: true, message: "Nhập giá!" }]}
                  >
                    <InputNumber<number>
                      min={0}
                      style={{ width: "100%" }}
                      formatter={(v) =>
                        v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
                      }
                      parser={(v) => Number(v?.replace(/\./g, "")) || 0}
                    />
                  </Form.Item>

                  <Button type="link" danger onClick={() => remove(field.name)}>
                    Xoá
                  </Button>
                </div>
              ))}

              <Form.Item style={{ textAlign: "center" }}>
                <Button type="dashed" onClick={() => add()} block>
                  + Thêm sản phẩm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* =================== PAYMENT =================== */}
        <Divider orientation="left" style={{ fontWeight: 600 }}>
          Thanh toán
        </Divider>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 200px 200px 200px",
            gap: 20,
          }}
        >
          <Form.Item label="Trạng thái đơn" name="status">
            <Select>
              <Option value="PENDING">PENDING</Option>
              <Option value="PAID">PAID</Option>
              <Option value="SHIPPED">SHIPPED</Option>
              <Option value="COMPLETED">COMPLETED</Option>
              <Option value="CANCELED">CANCELED</Option>
              <Option value="REFUNDED">REFUNDED</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Phương thức thanh toán" name="paymentMethod">
            <Select>
              <Option value="COD">COD</Option>
              <Option value="BANK">BANK</Option>
              <Option value="MOMO">MOMO</Option>
              <Option value="VNPAY">VNPAY</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Trạng thái thanh toán" name="paymentStatus">
            <Select>
              <Option value="UNPAID">UNPAID</Option>
              <Option value="PAID">PAID</Option>
              <Option value="REFUNDED">REFUNDED</Option>
            </Select>
          </Form.Item>

          <Form.Item
            style={{ flex: "1 1 50%", maxWidth: "400px" }}
            label="Mã giảm giá"
            name="voucherCode"
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Form.Item label="Mã thanh toán (paymentRef)" name="paymentRef">
          <Input style={{ width: 260 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrderModal;
