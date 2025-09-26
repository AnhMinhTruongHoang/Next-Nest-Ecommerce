"use client";

import React, { useEffect, useState } from "react";
import { Modal, Input, notification, Select, Form, InputNumber } from "antd";
import { updateProductAction } from "@/lib/product.actions";
import { IProduct } from "next-auth";

const { Option } = Select;

interface ICategory {
  _id: string;
  name: string;
}

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
  const [categories, setCategories] = useState<ICategory[]>([]);

  // Lấy danh sách category khi modal mở
  useEffect(() => {
    if (isUpdateModalOpen) {
      fetch("http://localhost:8000/api/v1/categories", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
        .then((res) => res.json())
        .then((d) => {
          if (d.data) setCategories(d.data);
        });
    }
  }, [isUpdateModalOpen]);

  // Set giá trị form khi có dataUpdate
  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        brand: dataUpdate.brand,
        thumbnail: dataUpdate.thumbnail,
        slider: dataUpdate.slider?.join(", "),
        price: dataUpdate.price,
        stock: dataUpdate.stock,
        category:
          typeof dataUpdate.category === "object"
            ? (dataUpdate.category as any)._id
            : dataUpdate.category,
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

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select category!" }]}
        >
          <Select placeholder="Select category">
            {categories.map((cat) => (
              <Option key={cat._id} value={cat._id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProductModal;
