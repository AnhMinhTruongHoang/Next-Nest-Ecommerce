"use client";

import { useCurrentApp } from "@/components/context/app.context";
import { App, Button, Form, Input, InputNumber, Modal } from "antd";
import { useEffect, useState } from "react";
import type { FormProps } from "antd";

type FieldType = {
  _id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
};

interface IUserInfoModalProps {
  openManageAccount: boolean;
  setOpenManageAccount: (open: boolean) => void;
}

const UserInfoModal: React.FC<IUserInfoModalProps> = ({
  openManageAccount,
  setOpenManageAccount,
}) => {
  const [form] = Form.useForm();
  const { user, setUser } = useCurrentApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const token = localStorage.getItem("access_token");
  const { message, notification } = App.useApp();

  useEffect(() => {
    if (openManageAccount && user) {
      form.setFieldsValue({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [openManageAccount, user, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { name, phone, _id } = values;
    setIsSubmit(true);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/users/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token?.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();

      if (res.ok && data?.data) {
        setUser({
          ...user!,
          name,
          phone,
        });
        message.success("Cập nhật thông tin user thành công");
        setOpenManageAccount(false);
      } else {
        notification.error({
          message: "Cập nhật thất bại!",
          description: data?.message || "Lỗi không xác định",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "Lỗi kết nối server!",
        description: err?.message || "Không thể kết nối API",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      open={openManageAccount}
      onCancel={() => {
        setOpenManageAccount(false);
        form.resetFields();
      }}
      footer={null}
    >
      <div className="p-4">
        <Form
          form={form}
          name="user-info"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item<FieldType> name="_id" hidden>
            <Input hidden />
          </Form.Item>
          <h2 style={{ textAlign: "center" }}>Cập nhật thông tin</h2>

          <Form.Item<FieldType>
            label={<span className="font-medium text-gray-700">Email</span>}
            name="email"
            rules={[{ required: true, message: "Email không được để trống!" }]}
          >
            <Input
              disabled
              className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item<FieldType>
            label={
              <span className="font-medium text-gray-700">Tên hiển thị</span>
            }
            name="name"
            rules={[
              { required: true, message: "Tên hiển thị không được để trống!" },
            ]}
          >
            <Input className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Số điện thoại không được để trống!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item<FieldType>
            label={<span className="font-medium text-gray-700">Địa chỉ</span>}
            name="address"
            rules={[
              { required: true, message: "Địa chỉ không được để trống!" },
            ]}
          >
            <Input className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500" />
          </Form.Item>

          <Button
            type="primary"
            loading={isSubmit}
            onClick={() => form.submit()}
            block
            className="!bg-blue-600 hover:!bg-blue-700 !rounded-md !h-11 font-medium"
          >
            Cập nhật
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default UserInfoModal;
