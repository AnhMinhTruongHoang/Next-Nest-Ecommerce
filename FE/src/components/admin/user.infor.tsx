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
    const { name, phone, address, _id } = values;
    setIsSubmit(true);

    try {
      let token = localStorage.getItem("access_token");

      if (!token && user?.email) {
        const synced = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/sync`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              provider: "OAUTH",
            }),
          }
        ).then((r) => r.json());
        token = synced?.access_token || null;
        if (token) localStorage.setItem("access_token", token);
      }

      if (!token) {
        notification.error({
          message: "Không có quyền cập nhật",
          description: "Vui lòng đăng nhập lại để lấy quyền (token).",
        });
        setIsSubmit(false);
        return;
      }

      const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: bearer,
          },
          body: JSON.stringify({ name, phone, address }),
        }
      );

      const data = await res.json();
      if (res.ok && data?.data) {
        setUser({ ...user!, name, phone, address });
        message.success("🎉 Cập nhật thông tin thành công!");
        setOpenManageAccount(false);
        form.resetFields();
      } else {
        notification.error({
          message: "Cập nhật thất bại!",
          description: data?.message || "Server trả về lỗi không xác định.",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "Lỗi kết nối server!",
        description: err?.message || "Không thể kết nối API.",
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
      centered
      width={450}
      style={{
        borderRadius: 12,
        overflow: "hidden",
      }}
      title={
        <h2
          style={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: 20,
            color: "#222",
            margin: 0,
            paddingBottom: 8,
          }}
        >
          👤 Cập nhật thông tin
        </h2>
      }
    >
      <Form
        form={form}
        name="user-info"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <Form.Item<FieldType> name="_id" hidden>
          <Input hidden />
        </Form.Item>

        {/* Email */}
        <Form.Item<FieldType>
          label={<span style={{ fontWeight: 600, color: "#333" }}>Email</span>}
          name="email"
          rules={[{ required: true, message: "Email không được để trống!" }]}
        >
          <Input
            disabled
            style={{
              background: "#f5f5f5",
              borderRadius: 8,
              height: 40,
              borderColor: "#d9d9d9",
            }}
          />
        </Form.Item>

        {/* Tên hiển thị */}
        <Form.Item<FieldType>
          label={
            <span style={{ fontWeight: 600, color: "#333" }}>Tên hiển thị</span>
          }
          name="name"
          rules={[
            { required: true, message: "Tên hiển thị không được để trống!" },
          ]}
        >
          <Input
            placeholder="Nhập tên hiển thị..."
            style={{
              borderRadius: 8,
              height: 40,
              borderColor: "#d9d9d9",
            }}
          />
        </Form.Item>

        {/* Số điện thoại */}
        <Form.Item<FieldType>
          label={
            <span style={{ fontWeight: 600, color: "#333" }}>
              Số điện thoại
            </span>
          }
          name="phone"
          rules={[
            { required: true, message: "Số điện thoại không được để trống!" },
          ]}
        >
          <InputNumber
            style={{
              width: "100%",
              borderRadius: 8,
              height: 40,
              borderColor: "#d9d9d9",
            }}
            placeholder="Nhập số điện thoại..."
          />
        </Form.Item>

        {/* Địa chỉ */}
        <Form.Item<FieldType>
          label={
            <span style={{ fontWeight: 600, color: "#333" }}>Địa chỉ</span>
          }
          name="address"
          rules={[{ required: true, message: "Địa chỉ không được để trống!" }]}
        >
          <Input.TextArea
            placeholder="Nhập địa chỉ của bạn..."
            autoSize={{ minRows: 2, maxRows: 3 }}
            style={{
              borderRadius: 8,
              borderColor: "#d9d9d9",
              resize: "none",
            }}
          />
        </Form.Item>

        <Button
          type="primary"
          loading={isSubmit}
          onClick={() => form.submit()}
          block
          style={{
            height: 44,
            borderRadius: 8,
            background: "#1677ff",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: 0.3,
          }}
        >
          Lưu thay đổi
        </Button>
      </Form>
    </Modal>
  );
};

export default UserInfoModal;
