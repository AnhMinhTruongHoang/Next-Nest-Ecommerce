"use client";

import { Form, Input, Button, Typography, Avatar, Row, Col, Space } from "antd";
import {
  LockOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  LockTwoTone,
  PhoneOutlined,
  HomeOutlined,
  ManOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";

const { Title } = Typography;

const AuthSignUp = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    avatarUrl: "",
  });

  const handleFinish = (values: typeof formValues) => {
    console.log("Submit:", values);
    // Gọi API tại đây nếu muốn
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
              >
                <Input.Password prefix={<LockTwoTone />} />
              </Form.Item>

              <Form.Item name="age" label="Age">
                <Input type="number" />
              </Form.Item>

              <Form.Item name="gender" label="Gender">
                <Input prefix={<ManOutlined />} />
              </Form.Item>

              <Form.Item name="address" label="Address">
                <Input prefix={<HomeOutlined />} />
              </Form.Item>

              <Form.Item name="phone" label="Phone">
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>

              <Form.Item name="avatarUrl" label="Avatar URL">
                <Input prefix={<PictureOutlined />} />
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
