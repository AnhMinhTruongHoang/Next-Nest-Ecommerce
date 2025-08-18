"use client";

import React, { useState } from "react";
import { Form, Input, Modal, notification, Select, InputNumber } from "antd";

const { Option } = Select;

interface IProps {
  access_token: string;
  getData: () => Promise<void>;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

const CreateUserModal = (props: IProps) => {
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
      const { name, email, password, age, gender, role, address } = values;

      const data = {
        name,
        email,
        password,
        age,
        gender,
        role,
        address,
      };

      const res = await fetch("http://localhost:8000/api/v1/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const d = await res.json();

      if (d.data) {
        await getData();
        notification.success({
          message: "Tạo mới user thành công.",
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
      title={<div style={{ textAlign: "center" }}>Add new user</div>}
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      maskClosable={false}
      confirmLoading={loading}
    >
      <Form form={form} name="basic" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
          style={{ marginBottom: 5 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
          style={{ marginBottom: 5 }}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          style={{ marginBottom: 5 }}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          rules={[{ required: true, message: "Please input your age!" }]}
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
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
          style={{ marginBottom: 5 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select your gender!" }]}
          style={{ marginBottom: 5 }}
        >
          <Select placeholder="Select a gender">
            <Option value="MALE">male</Option>
            <Option value="FEMALE">female</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role!" }]}
          style={{ marginBottom: 5 }}
        >
          <Select placeholder="Select a role">
            <Option value="USER">USER</Option>
            <Option value="ADMIN">ADMIN</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
