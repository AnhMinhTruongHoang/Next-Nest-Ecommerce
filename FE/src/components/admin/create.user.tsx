"use client";

import React, { useState } from "react";
import { Form, Input, Modal, Select, InputNumber, App } from "antd";

const { Option } = Select;

interface IProps {
  access_token: string; // raw token truyền từ UsersTable
  getData: () => Promise<void>;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

const CreateUserModal = (props: IProps) => {
  const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } =
    props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { notification } = App.useApp();

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { name, email, password, age, gender, role, address } = values;

      const data = { name, email, password, age, gender, role, address };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // chuẩn hoá token giống UpdateUserModal
          Authorization: access_token?.startsWith("Bearer ")
            ? access_token
            : `Bearer ${access_token}`,
        },
        body: JSON.stringify(data),
      });

      const d = await res.json();

      if (res.ok && d.data) {
        await getData();
        notification.success({
          message: "Tạo mới người dùng thành công.",
        });
        handleCloseCreateModal();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: d?.message
            ? JSON.stringify(d.message)
            : "Không thể tạo người dùng",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: error?.message || "Không thể kết nối tới máy chủ.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>Thêm người dùng mới</div>}
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      maskClosable={false}
      confirmLoading={loading}
    >
      <Form form={form} name="basic" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          style={{ marginBottom: 5 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          style={{ marginBottom: 5 }}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          style={{ marginBottom: 5 }}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Tuổi"
          name="age"
          rules={[{ required: true, message: "Vui lòng nhập tuổi!" }]}
          style={{ marginBottom: 5 }}
        >
          <InputNumber
            style={{ width: "100%" }}
            className="no-arrows"
            controls={false}
            type="number"
          />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          style={{ marginBottom: 5 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          style={{ marginBottom: 5 }}
        >
          <Select placeholder="Chọn giới tính">
            <Option value="MALE">Nam</Option>
            <Option value="FEMALE">Nữ</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          style={{ marginBottom: 5 }}
        >
          <Select placeholder="Chọn vai trò">
            <Option value="USER">Người dùng</Option>
            <Option value="ADMIN">Quản trị viên</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
