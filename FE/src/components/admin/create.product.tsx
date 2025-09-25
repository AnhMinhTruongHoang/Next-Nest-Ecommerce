"use client";

import React, { useState } from "react";
import { Form, Input, Modal, notification, Select, InputNumber } from "antd";

const { Option } = Select;

interface IProps {
  access_token: any;
  getData: () => Promise<void>;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

const CreateProductModal = (props: IProps) => {
  const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } =
    props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const d = await res.json();

      if (d.data) {
        await getData();
        notification.success({
          message: "Tạo mới product thành công.",
        });
        handleCloseCreateModal();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: JSON.stringify(d.message),
        });
      }
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: "Không thể kết nối tới server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>Add new product</div>}
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      maskClosable={false}
      confirmLoading={loading}
    >
      <Form
        form={form}
        name="createProduct"
        onFinish={onFinish}
        layout="vertical"
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

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select category!" }]}
        >
          <Select placeholder="Select category">
            <Option value="68d05ecd4bf0f2b18e61ba5f">Mouse</Option>
            <Option value="68d05ecd4bf0f2b18e61ba60">Keyboard</Option>
            <Option value="68d05ecd4bf0f2b18e61ba61">Monitor</Option>
            <Option value="68d05ecd4bf0f2b18e61ba62">Chairs</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProductModal;
