"use client";

import React, { useEffect, useState } from "react";
import { Modal, Input, notification, Select, Form, InputNumber } from "antd";
import { updateProductAction } from "@/lib/product.actions";
import { IProduct } from "next-auth";

const { Option } = Select;

interface IProps {
  access_token: string;
  getData: () => Promise<void>;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: null | IProduct;
  setDataUpdate: (v: null | IProduct) => void;
}

const UpdateProductModal = (props: IProps) => {
  const {
    access_token,
    getData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    dataUpdate,
    setDataUpdate,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        brand: dataUpdate.brand,
        thumbnail: dataUpdate.thumbnail,
        slider: dataUpdate.slider?.join(", "),
        price: dataUpdate.price,
        stock: dataUpdate.stock,
        sold: dataUpdate.sold,
        quantity: dataUpdate.quantity,
        category: dataUpdate.category,
      });
    }
  }, [dataUpdate]);

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    form.resetFields();
    setDataUpdate(null);
  };

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    if (dataUpdate) {
      const payload = {
        _id: dataUpdate._id,
        ...values,
        slider: values.slider
          ? values.slider.split(",").map((s: string) => s.trim())
          : [],
      };

      const d = await updateProductAction(payload, access_token);
      if (d.data) {
        await getData();
        notification.success({
          message: "Cập nhật product thành công.",
        });
        handleCloseModal();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: JSON.stringify(d.message),
        });
      }
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>Update product</div>}
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseModal}
      maskClosable={false}
      confirmLoading={isSubmit}
    >
      <Form
        name="updateProduct"
        onFinish={onFinish}
        layout="vertical"
        form={form}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input product name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Brand"
          name="brand"
          rules={[{ required: true, message: "Please input brand!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Thumbnail URL"
          name="thumbnail"
          rules={[{ required: true, message: "Please input thumbnail URL!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Slider URLs" name="slider">
          <Input placeholder="Comma separated image URLs" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please input price!" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[{ required: true, message: "Please input stock quantity!" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item label="Sold" name="sold">
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item label="Quantity" name="quantity">
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select category!" }]}
        >
          <Select placeholder="Select category">
            {/* Option list có thể fetch từ API categories */}
            <Option value="Mouse">Mouse</Option>
            <Option value="Keyboard">Keyboard</Option>
            <Option value="Monitor">Monitor</Option>
            <Option value="Chairs">Chairs</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProductModal;
