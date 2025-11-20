"use client";

import { useParams, useRouter } from "next/navigation";
import {
  App,
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import { ArrowLeftOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";
import { sendRequest } from "@/utils/api";

export default function VerifyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { notification } = App.useApp();
  const { Title } = Typography;
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (values: { code: string }) => {
    setSubmitting(true);
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check-code`,
        method: "POST",
        body: { _id: String(id), code: values.code.trim() },
      });

      if (res?.data || res?.message) {
        notification.success({
          message: "Kích hoạt thành công",
          description: "Tài khoản đã được kích hoạt. Vui lòng đăng nhập.",
        });
        router.push("/auth/signin");
        return;
      }
      throw new Error(
        res?.message ||
          (Array.isArray(res?.error) ? res.error[0] : res?.error) ||
          "Mã kích hoạt không hợp lệ"
      );
    } catch (e: any) {
      notification.error({
        message: "Kích hoạt thất bại",
        description: e?.message || "Vui lòng thử lại.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        padding: "48px 16px",
      }}
    >
      <Link
        href="/auth/signin"
        style={{ position: "absolute", top: 16, left: 16 }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          style={{ fontSize: 18 }}
        />
      </Link>

      <Row justify="center" align="middle">
        <Col xs={24} sm={18} md={12} lg={8}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div style={{ textAlign: "center" }}>
              <Avatar
                size={64}
                icon={<LockOutlined />}
                style={{ backgroundColor: "#1890ff", marginBottom: 8 }}
              />
              <Title level={3}>Xác minh tài khoản</Title>
            </div>

            <Form layout="vertical" onFinish={handleFinish}>
              <Form.Item
                name="code"
                label="Mã kích hoạt"
                rules={[
                  { required: true, message: "Vui lòng nhập mã kích hoạt" },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập mã từ email" maxLength={64} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={submitting}
                >
                  Xác minh
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
