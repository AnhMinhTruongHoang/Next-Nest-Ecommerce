"use client";

import {
  Form,
  Input,
  Button,
  Typography,
  Avatar,
  Row,
  Col,
  Space,
  notification,
  message,
} from "antd";
import { LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";

const AuthVerify = (props: any) => {
  const { id } = props;
  const router = useRouter();
  const { Title } = Typography;

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    avatarUrl: "",
  });

  const handleFinish = async (values: any) => {
    const { _id, code } = values;

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`, /// goi api back end update is active = 1
      method: "POST",
      body: {
        _id,
        code,
      },
    });

    if (res?.data) {
      message.info("Active Success !");
      router.push(`/auth/signin`); // da ve trang dang nhap
      notification.error({
        message: "Register error",
        description: res?.message,
      });
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
      <Link href="signin" style={{ position: "absolute", top: 16, left: 16 }}>
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
              <Title level={3}>Verify</Title>
            </div>

            <Form
              layout="vertical"
              onFinish={handleFinish}
              initialValues={formValues}
              onValuesChange={(changed, all) => setFormValues(all)}
            >
              <Form.Item name="_id" label="ID" initialValue={id} hidden>
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="code"
                label=" Active Code"
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default AuthVerify;
