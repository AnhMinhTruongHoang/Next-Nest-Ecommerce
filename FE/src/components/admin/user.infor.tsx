"use client";

import { useCurrentApp } from "@/components/context/app.context";
import { App, Button, Form, Input, Modal } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";

type FieldType = {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
};

interface UserInfoModalProps {
  openManageAccount: boolean;
  setOpenManageAccount: (value: boolean) => void;
}

const UserInfoModal = ({
  openManageAccount,
  setOpenManageAccount,
}: UserInfoModalProps) => {
  const [form] = Form.useForm();
  const { user, setUser } = useCurrentApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  useEffect(() => {
    if (openManageAccount && user) {
      form.setFieldsValue({
        _id: user._id,
        email: user.email,
        phone: user.phone,
        fullName: user.name,
      });
    }
  }, [openManageAccount, user]);

  // Đóng modal
  const handleClose = () => {
    setOpenManageAccount(false);
  };

  // Submit update
  const handleUpdate = async (values: FieldType) => {
    setIsSubmit(true);
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/${values._id}`,
        {
          fullName: values.fullName,
          phone: values.phone,
        }
      );

      if (res.data) {
        // Update Context
        setUser({
          ...user!,
          name: values.fullName,
          phone: values.phone,
        });

        message.success("Cập nhật thông tin thành công");
        localStorage.removeItem("access_token");
        handleClose();
      }
    } catch (err: any) {
      notification.error({
        message: "Lỗi cập nhật",
        description: err.response?.data?.message || "Không xác định",
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      open={openManageAccount}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okText="Lưu thay đổi"
      cancelText="Huỷ"
      confirmLoading={isSubmit}
      title="Cập nhật thông tin người dùng"
    >
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item name="_id" hidden>
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Tên hiển thị"
          name="fullName"
          rules={[{ required: true, message: "Tên không được để trống!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Số điện thoại không được để trống!" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserInfoModal;
