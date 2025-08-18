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
  App,
} from "antd";
import {
  LockOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  LockTwoTone,
} from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";

const AuthSignUp = () => {
  const router = useRouter();
  const { Title } = Typography;

  const { notification } = App.useApp();

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

  const handleFinish = async (values: typeof formValues) => {
    const { email, password, name } = values;

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
      method: "POST",
      body: { email, password, name },
    });

    if (res?.data) {
      router.push(`/auth/verify/${res?.data?._id}`);
    } else {
      notification.error({
        message: "Register failed",
        description:
          res?.message ||
          res?.error ||
          res?.error?.[0] ||
          "Something went wrong, please try again!",
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
              <Title level={3}>Sign Up</Title>
            </div>

            <Form
              layout="vertical"
              onFinish={handleFinish}
              initialValues={formValues}
              onValuesChange={(changed, all) => setFormValues(all)}
            >
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true }]}
                hasFeedback
              >
                <Input.Password prefix={<LockTwoTone />} />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockTwoTone />} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default AuthSignUp;
