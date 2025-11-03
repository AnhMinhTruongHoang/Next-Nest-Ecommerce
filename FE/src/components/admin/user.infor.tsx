"use client";

import { useCurrentApp } from "@/components/context/app.context";
import {
  App,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Typography,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
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

const phoneRule = [
  { required: true, message: "Số điện thoại không được để trống!" },
  {
    validator(_: any, value?: string) {
      if (!value) return Promise.resolve();
      const v = String(value).trim();
      // 9–11 chữ số
      if (!/^\d{9,11}$/.test(v)) {
        return Promise.reject(
          new Error("Số điện thoại chỉ gồm 9–11 chữ số (không ký tự khác).")
        );
      }
      return Promise.resolve();
    },
  },
];

const nameRule = [
  { required: true, message: "Tên hiển thị không được để trống!" },
  {
    max: 60,
    message: "Tên tối đa 60 ký tự.",
  },
];

const addressRule = [
  { required: true, message: "Địa chỉ không được để trống!" },
  { max: 200, message: "Địa chỉ tối đa 200 ký tự." },
];

const UserInfoModal: React.FC<IUserInfoModalProps> = ({
  openManageAccount,
  setOpenManageAccount,
}) => {
  const [form] = Form.useForm<FieldType>();
  const { user, setUser } = useCurrentApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  // điền form khi mở modal
  useEffect(() => {
    if (openManageAccount && user) {
      form.setFieldsValue({
        _id: user._id,
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
      });
    }
  }, [openManageAccount, user, form]);

  const headerTitle = useMemo(
    () => (user?.name ? `Xin chào, ${user.name}` : "Cập nhật thông tin"),
    [user?.name]
  );

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const payload = {
      _id: values._id,
      name: values.name.trim(),
      phone: String(values.phone || "").trim(),
      address: values.address.trim(),
    };

    setIsSubmit(true);
    try {
      let token = localStorage.getItem("access_token");

      // fallback: nếu user đăng nhập OAUTH nhưng chưa có token, sync để lấy
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
        return;
      }

      const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${payload._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: bearer,
          },
          body: JSON.stringify({
            name: payload.name,
            phone: payload.phone,
            address: payload.address,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && (data?.data || data?._id)) {
        setUser({
          ...user!,
          name: payload.name,
          phone: payload.phone,
          address: payload.address,
        });
        message.success("🎉 Cập nhật thông tin thành công!");
        setOpenManageAccount(false);
        form.resetFields();
      } else {
        notification.error({
          message: "Cập nhật thất bại",
          description: data?.message || "Server trả về lỗi không xác định.",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "Lỗi kết nối",
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
      width={560}
      styles={{
        header: { borderBottom: "none" },
        body: { paddingTop: 8 },
      }}
      title={
        <div style={{ textAlign: "center" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            👤 {headerTitle}
          </Typography.Title>
          <Typography.Text type="secondary">
            Cập nhật thông tin liên hệ & giao hàng của bạn
          </Typography.Text>
        </div>
      }
    >
      <Divider style={{ margin: "12px 0 20px" }} />

      <Form<FieldType>
        form={form}
        name="user-info"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        requiredMark="optional"
      >
        <Form.Item name="_id" hidden>
          <Input hidden />
        </Form.Item>

        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email không được để trống!" },
              ]}
            >
              <Input
                disabled
                prefix={<MailOutlined />}
                aria-label="Email"
                allowClear
                style={{ height: 42, borderRadius: 10, background: "#f6f7f9" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Tên hiển thị"
              name="name"
              rules={nameRule}
              hasFeedback
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập tên hiển thị"
                aria-label="Tên hiển thị"
                allowClear
                maxLength={60}
                style={{ height: 42, borderRadius: 10 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Số điện thoại"
              name="phone"
              rules={phoneRule}
              hasFeedback
            >
              <Input
                prefix={<PhoneOutlined />}
                inputMode="numeric"
                placeholder="Ví dụ: 0912345678"
                aria-label="Số điện thoại"
                maxLength={11}
                onKeyDown={(e) => {
                  const ok =
                    /[0-9]/.test(e.key) ||
                    [
                      "Backspace",
                      "Delete",
                      "Tab",
                      "ArrowLeft",
                      "ArrowRight",
                    ].includes(e.key);
                  if (!ok) e.preventDefault();
                }}
                allowClear
                style={{ height: 42, borderRadius: 10 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Địa chỉ"
              name="address"
              rules={addressRule}
              hasFeedback
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                aria-label="Địa chỉ"
                allowClear
                maxLength={200}
                style={{ height: 42, borderRadius: 10 }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={isSubmit}
          onClick={() => form.submit()}
          block
          style={{
            height: 46,
            borderRadius: 10,
            fontWeight: 600,
            letterSpacing: 0.2,
          }}
        >
          Lưu thay đổi
        </Button>
      </Form>
    </Modal>
  );
};

export default UserInfoModal;
