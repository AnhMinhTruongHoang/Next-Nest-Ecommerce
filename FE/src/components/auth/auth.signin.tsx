"use client";

import {
  LockOutlined,
  GithubOutlined,
  GoogleOutlined,
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Input,
  Typography,
  Form,
  notification,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import ModalChangePassword from "./modal.change.password";
import ModelReactive from "./model.reactive";

const { Title } = Typography;

export default function AuthSignIn() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    setUserEmail("");

    const res = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });

    if (res && !res.error) {
      router.push("/");

      router.refresh();
      return;
    }

    if (res?.error) {
      if (res.error.toLowerCase().includes("not active")) {
        setModalContent(
          "Your account is not activated. Please check your email."
        );
        setUserEmail(values.username);
        setIsModalOpen(true);
      } else {
        api.error({
          message: "Sign In Failed",
          description: res.error || "Invalid username or password",
          placement: "topRight",
        });
      }
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
      {contextHolder}
      <div style={{ maxWidth: 400, margin: "0 auto", position: "relative" }}>
        <Link href="/" style={{ position: "absolute", top: 0, left: 0 }}>
          <Button icon={<ArrowLeftOutlined />} type="link">
            Back
          </Button>
        </Link>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Avatar
            size={64}
            style={{ backgroundColor: "#ff4d4f", marginBottom: 12 }}
          >
            <LockOutlined />
          </Avatar>
          <Title level={3}>Sign In</Title>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Typography.Text>
            Don't have an account?{" "}
            <Link href="/auth/signup">
              <Button type="link" style={{ padding: 0 }}>
                Sign Up
              </Button>
            </Link>
          </Typography.Text>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Typography.Text>
            <Button
              onClick={() => setChangePassword(true)}
              type="link"
              style={{ padding: 0 }}
            >
              Forgot Password?
            </Button>
          </Typography.Text>
        </div>

        <Divider>Or sign in with</Divider>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 24,
          }}
        >
          <Avatar
            style={{ backgroundColor: "#000", cursor: "pointer" }}
            icon={<GithubOutlined />}
            onClick={() => signIn("github", { callbackUrl: "/" })}
          />
          <Avatar
            style={{ backgroundColor: "#db4437", cursor: "pointer" }}
            icon={<GoogleOutlined />}
            onClick={() => signIn("google", { callbackUrl: "/" })}
          />
        </div>
      </div>

      {/* Modal Error */}
      <ModelReactive
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title="Sign In Error"
        content={<p>{modalContent}</p>}
        type="error"
        userEmail={userEmail}
        showSteps
      />

      {/* Modal Forgot Password */}
      <ModalChangePassword
        isModalOpen={changePassword}
        setIsModalOpen={setChangePassword}
      />
    </div>
  );
}
