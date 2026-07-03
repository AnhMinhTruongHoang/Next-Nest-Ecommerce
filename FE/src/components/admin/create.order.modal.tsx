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
  App,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

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

  const formatVND = (value?: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Math.round(Number(value) || 0));

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
    <>
      <Modal
        open={isOpen}
        onCancel={handleClose}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        maskClosable={false}
        centered
        width={900}
        rootClassName="gz-create-order-modal-root"
        className="gz-create-order-modal"
        okText="Tạo đơn hàng"
        cancelText="Hủy"
        okButtonProps={{
          className: "gz-create-order-ok-btn",
        }}
        cancelButtonProps={{
          className: "gz-create-order-cancel-btn",
        }}
        title={
          <div className="gz-create-order-title-wrap">
            <div>
              <span className="gz-create-order-eyebrow">Order Management</span>
              <h3 style={{ textAlign: "center" }}>Tạo đơn hàng mới</h3>
              <p style={{ textAlign: "center" }}>
                Nhập thông tin khách hàng, sản phẩm và thanh toán
              </p>
            </div>
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
            items: [{}],
          }}
          className="gz-create-order-form"
        >
          <section className="gz-create-order-section">
            <Divider orientation="left" className="gz-create-order-divider">
              Thông tin khách hàng
            </Divider>

            <div className="gz-create-order-grid gz-create-order-grid-2">
              <Form.Item label="User ID" name="userId">
                <Input placeholder="Nhập _id user nếu có" />
              </Form.Item>

              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[{ required: true, message: "Vui lòng nhập SĐT!" }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input placeholder="Nhập email nếu có" />
              </Form.Item>
            </div>

            <Form.Item
              label="Địa chỉ giao hàng"
              name="shippingAddress"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input.TextArea rows={2} placeholder="Nhập địa chỉ giao hàng" />
            </Form.Item>

            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea rows={2} placeholder="Ghi chú cho đơn hàng" />
            </Form.Item>
          </section>

          <section className="gz-create-order-section">
            <Divider orientation="left" className="gz-create-order-divider">
              Sản phẩm trong đơn
            </Divider>
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  <div className="gz-create-order-items">
                    {fields.map(({ key, name, ...restField }, index) => (
                      <div key={key} className="gz-create-order-item-card">
                        <div className="gz-create-order-item-head">
                          <span>Sản phẩm #{index + 1}</span>

                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                            className="gz-create-order-remove-btn"
                          >
                            Xoá
                          </Button>
                        </div>

                        <div className="gz-create-order-item-grid">
                          <Form.Item
                            {...restField}
                            label="Sản phẩm"
                            name={[name, "productId"]}
                            rules={[
                              { required: true, message: "Chọn sản phẩm!" },
                            ]}
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
                                label: `${p.name} - ${formatVND(p.price)}`,
                                value: p._id,
                              }))}
                              onChange={(productId) => {
                                const selectedProduct = products.find(
                                  (p) => p._id === productId
                                );

                                if (selectedProduct?.price) {
                                  form.setFieldValue(
                                    ["items", name, "price"],
                                    selectedProduct.price
                                  );
                                }
                              }}
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            label="Số lượng"
                            name={[name, "quantity"]}
                            rules={[{ required: true, message: "Nhập SL!" }]}
                          >
                            <InputNumber
                              min={1}
                              style={{ width: "100%" }}
                              placeholder="SL"
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            label="Đơn giá"
                            name={[name, "price"]}
                            rules={[{ required: true, message: "Nhập giá!" }]}
                          >
                            <InputNumber<number>
                              min={0}
                              style={{ width: "100%" }}
                              placeholder="Đơn giá"
                              formatter={(v) =>
                                v
                                  ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                  : ""
                              }
                              parser={(v) => Number(v?.replace(/\./g, "")) || 0}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Form.Item className="gz-create-order-add-product-wrap">
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      block
                      className="gz-create-order-add-product-btn"
                    >
                      Thêm sản phẩm
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </section>

          <section className="gz-create-order-section">
            <Divider orientation="left" className="gz-create-order-divider">
              Thanh toán
            </Divider>

            <div className="gz-create-order-grid gz-create-order-grid-4">
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

              <Form.Item label="Mã giảm giá" name="voucherCode">
                <Input placeholder="Nhập mã voucher" />
              </Form.Item>
            </div>

            <Form.Item label="Mã thanh toán" name="paymentRef">
              <Input placeholder="Nhập paymentRef nếu có" />
            </Form.Item>
          </section>
        </Form>
      </Modal>

      <style jsx global>{`
        .gz-create-order-modal-root .ant-modal {
          max-width: calc(100vw - 28px) !important;
        }

        .gz-create-order-modal-root .ant-modal-content {
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.012)
            ),
            #181a1b !important;
          border: 1px solid rgba(0, 255, 224, 0.12) !important;
          border-radius: 20px !important;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55) !important;
          overflow: hidden;
        }

        .gz-create-order-modal-root .ant-modal-header {
          padding: 20px 24px 16px !important;
          margin: 0 !important;
          background: transparent !important;
          border-bottom: 1px solid #2a2d2e !important;
        }

        .gz-create-order-modal-root .ant-modal-body {
          padding: 18px 24px 10px !important;
          max-height: 70vh;
          overflow-y: auto;
        }

        .gz-create-order-modal-root .ant-modal-footer {
          padding: 14px 24px 18px !important;
          margin: 0 !important;
          border-top: 1px solid #2a2d2e !important;
        }

        .gz-create-order-modal-root .ant-modal-close {
          color: #e5e7eb !important;
        }

        .gz-create-order-modal-root .ant-modal-close:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .gz-create-order-modal-root .ant-modal-title {
          width: 100%;
        }

        .gz-create-order-title-wrap {
          width: 100%;
          padding: 0 34px;
          text-align: center;
        }

        .gz-create-order-eyebrow {
          display: block;
          margin: 0 0 6px;
          color: #00ffe0;
          font-size: 10px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: 0.9px;
          text-transform: uppercase;
          text-align: center;
        }

        .gz-create-order-title-wrap h3 {
          margin: 0;
          color: #ffffff;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.25;
          text-align: center;
        }

        .gz-create-order-title-wrap p {
          margin: 7px auto 0;
          max-width: 420px;
          color: #a3aab5;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.4;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .gz-create-order-title-wrap {
            padding: 0 30px;
          }

          .gz-create-order-title-wrap h3 {
            font-size: 20px;
          }

          .gz-create-order-title-wrap p {
            max-width: 260px;
            font-size: 12px;
          }
        }

        @media (max-width: 420px) {
          .gz-create-order-title-wrap {
            padding: 0 26px;
          }

          .gz-create-order-eyebrow {
            font-size: 10px;
          }

          .gz-create-order-title-wrap h3 {
            font-size: 18px;
          }

          .gz-create-order-title-wrap p {
            max-width: 210px;
            font-size: 12px;
          }
        }

        .gz-create-order-form {
          width: 100%;
        }

        .gz-create-order-section {
          padding: 14px;
          margin-bottom: 14px;
          background: #111314;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
        }

        .gz-create-order-divider {
          margin: 0 0 16px !important;
          color: #00ffe0 !important;
          border-color: #303435 !important;
          font-weight: 900 !important;
        }

        .gz-create-order-divider .ant-divider-inner-text {
          color: #00ffe0 !important;
          font-size: 13px;
          font-weight: 900;
        }

        .gz-create-order-grid {
          display: grid;
          gap: 12px;
        }

        .gz-create-order-grid-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .gz-create-order-grid-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .gz-create-order-form .ant-form-item-label > label {
          color: #e5e7eb !important;
          font-weight: 800 !important;
        }

        .gz-create-order-form .ant-form-item-explain-error {
          color: #ff7875 !important;
        }

        .gz-create-order-modal-root .ant-input,
        .gz-create-order-modal-root .ant-input-number,
        .gz-create-order-modal-root .ant-select-selector,
        .gz-create-order-modal-root .ant-picker {
          background: #202324 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
          border-radius: 12px !important;
        }

        .gz-create-order-modal-root .ant-input:hover,
        .gz-create-order-modal-root .ant-input:focus,
        .gz-create-order-modal-root .ant-input-number:hover,
        .gz-create-order-modal-root .ant-input-number-focused,
        .gz-create-order-modal-root .ant-select-focused .ant-select-selector,
        .gz-create-order-modal-root .ant-picker:hover,
        .gz-create-order-modal-root .ant-picker-focused {
          border-color: #00ffe0 !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.08) !important;
        }

        .gz-create-order-modal-root .ant-input::placeholder,
        .gz-create-order-modal-root .ant-select-selection-placeholder {
          color: #8b949e !important;
        }

        .gz-create-order-modal-root .ant-input-number-input,
        .gz-create-order-modal-root .ant-select-selection-item {
          color: #ffffff !important;
        }

        .gz-create-order-modal-root .ant-input-number-handler-wrap {
          background: #202324 !important;
        }

        .gz-create-order-modal-root .ant-input-number-handler {
          border-color: #303435 !important;
        }

        .gz-create-order-modal-root .ant-input-number-handler-up-inner,
        .gz-create-order-modal-root .ant-input-number-handler-down-inner,
        .gz-create-order-modal-root .ant-select-arrow {
          color: #8b949e !important;
        }

        .gz-create-order-items {
          display: grid;
          gap: 12px;
        }

        .gz-create-order-item-card {
          padding: 12px;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.01)
            ),
            #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 14px;
        }

        .gz-create-order-item-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .gz-create-order-item-head span {
          color: #00ffe0;
          font-size: 13px;
          font-weight: 900;
        }

        .gz-create-order-item-grid {
          display: grid;
          grid-template-columns: minmax(240px, 1fr) 120px 160px;
          gap: 12px;
          align-items: start;
        }

        .gz-create-order-remove-btn {
          border-radius: 999px !important;
          font-weight: 800 !important;
          background: rgba(255, 77, 79, 0.1) !important;
          border: 1px solid rgba(255, 77, 79, 0.35) !important;
          color: #ff4d4f !important;
        }

        .gz-create-order-remove-btn:hover {
          background: rgba(255, 77, 79, 0.22) !important;
          color: #ffffff !important;
        }

        .gz-create-order-add-product-wrap {
          margin-top: 12px !important;
          margin-bottom: 0 !important;
        }

        .gz-create-order-add-product-btn {
          height: 42px !important;
          border-radius: 13px !important;
          background: rgba(0, 255, 224, 0.065) !important;
          border-color: rgba(0, 255, 224, 0.22) !important;
          color: #00ffe0 !important;
          font-weight: 900 !important;
        }

        .gz-create-order-add-product-btn:hover {
          background: rgba(0, 255, 224, 0.13) !important;
          border-color: rgba(0, 255, 224, 0.36) !important;
          color: #ffffff !important;
        }

        .gz-create-order-ok-btn {
          height: 40px !important;
          border: none !important;
          border-radius: 12px !important;
          color: #ffffff !important;
          font-weight: 900 !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          box-shadow: 0 10px 24px rgba(255, 77, 0, 0.24) !important;
        }

        .gz-create-order-ok-btn:hover {
          background: linear-gradient(135deg, #ff6a00, #ff9a00) !important;
          color: #ffffff !important;
        }

        .gz-create-order-cancel-btn {
          height: 40px !important;
          border-radius: 12px !important;
          background: #111314 !important;
          border-color: #303435 !important;
          color: #e5e7eb !important;
          font-weight: 800 !important;
        }

        .gz-create-order-cancel-btn:hover {
          border-color: #00ffe0 !important;
          color: #00ffe0 !important;
        }

        @media (max-width: 992px) {
          .gz-create-order-grid-4 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .gz-create-order-item-grid {
            grid-template-columns: 1fr 120px 160px;
          }
        }

        @media (max-width: 768px) {
          .gz-create-order-modal-root .ant-modal {
            max-width: calc(100vw - 20px) !important;
            top: 12px !important;
          }

          .gz-create-order-modal-root .ant-modal-header {
            padding: 18px 16px 14px !important;
          }

          .gz-create-order-modal-root .ant-modal-body {
            padding: 14px 16px 8px !important;
            max-height: 72vh;
          }

          .gz-create-order-modal-root .ant-modal-footer {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            padding: 12px 16px 16px !important;
          }

          .gz-create-order-modal-root .ant-modal-footer .ant-btn {
            width: 100%;
            margin-inline-start: 0 !important;
          }

          .gz-create-order-title-wrap {
            align-items: flex-start;
            padding-right: 24px;
          }

          .gz-create-order-icon {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            font-size: 17px;
          }

          .gz-create-order-title-wrap h3 {
            font-size: 19px;
          }

          .gz-create-order-title-wrap p {
            font-size: 12px;
          }

          .gz-create-order-section {
            padding: 12px;
            border-radius: 14px;
          }

          .gz-create-order-grid-2,
          .gz-create-order-grid-4,
          .gz-create-order-item-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .gz-create-order-item-head {
            align-items: flex-start;
          }

          .gz-create-order-remove-btn {
            height: 34px !important;
            padding-inline: 12px !important;
          }
        }

        @media (max-width: 420px) {
          .gz-create-order-title-wrap {
            gap: 10px;
          }

          .gz-create-order-title-wrap h3 {
            font-size: 18px;
          }

          .gz-create-order-eyebrow {
            font-size: 10px;
          }

          .gz-create-order-modal-root .ant-modal-body {
            max-height: 70vh;
          }

          .gz-create-order-modal-root .ant-modal-footer {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default CreateOrderModal;
