"use client";

import React, { useState } from "react";
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
  reload: () => Promise<void>; // gọi lại getData ở parent
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  setIsOpen,
  accessToken,
  reload,
}) => {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [submitting, setSubmitting] = useState(false);

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
          Authorization: accessToken.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`,
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
      title={
        <div style={{ textAlign: "center", fontWeight: 600, fontSize: 18 }}>
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
      >
        <Divider>Thông tin khách hàng</Divider>
        <Space style={{ width: "100%" }} direction="vertical">
          <Form.Item label="User ID (tuỳ chọn)" name="userId">
            <Input placeholder="Nhập _id user nếu có (có thể bỏ trống)" />
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
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ giao hàng"
            name="shippingAddress"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Space>

        <Divider>Sản phẩm trong đơn</Divider>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Space
                  key={field.key}
                  style={{
                    display: "flex",
                    marginBottom: 8,
                    alignItems: "flex-start",
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...field}
                    label="Product ID"
                    name={[field.name, "productId"]}
                    rules={[
                      { required: true, message: "Nhập productId (MongoId)!" },
                    ]}
                  >
                    <Input style={{ width: 260 }} />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label="Số lượng"
                    name={[field.name, "quantity"]}
                    rules={[{ required: true, message: "Nhập số lượng!" }]}
                  >
                    <InputNumber min={1} style={{ width: 120 }} />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label="Đơn giá"
                    name={[field.name, "price"]}
                    rules={[{ required: true, message: "Nhập đơn giá!" }]}
                  >
                    <InputNumber<number>
                      min={0}
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        value
                          ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                          : ""
                      }
                      parser={(value) =>
                        value ? Number(value.replace(/\./g, "")) : 0
                      }
                    />
                  </Form.Item>

                  <Button type="link" danger onClick={() => remove(field.name)}>
                    Xoá
                  </Button>
                </Space>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  + Thêm sản phẩm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider>Thanh toán</Divider>

        <Space style={{ width: "100%" }} wrap>
          <Form.Item label="Trạng thái đơn" name="status">
            <Select style={{ width: 180 }}>
              <Option value="PENDING">PENDING</Option>
              <Option value="PAID">PAID</Option>
              <Option value="SHIPPED">SHIPPED</Option>
              <Option value="COMPLETED">COMPLETED</Option>
              <Option value="CANCELED">CANCELED</Option>
              <Option value="REFUNDED">REFUNDED</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Phương thức thanh toán" name="paymentMethod">
            <Select style={{ width: 180 }}>
              <Option value="COD">COD</Option>
              <Option value="BANK">BANK</Option>
              <Option value="MOMO">MOMO</Option>
              <Option value="VNPAY">VNPAY</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Trạng thái thanh toán" name="paymentStatus">
            <Select style={{ width: 180 }}>
              <Option value="UNPAID">UNPAID</Option>
              <Option value="PAID">PAID</Option>
              <Option value="REFUNDED">REFUNDED</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mã giảm giá" name="voucherCode">
            <Input style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Mã thanh toán (paymentRef)" name="paymentRef">
            <Input style={{ width: 220 }} />
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
};

export default CreateOrderModal;
