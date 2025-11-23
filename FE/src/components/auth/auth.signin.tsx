"use client";

import {
  LockOutlined,
  GithubOutlined,
  GoogleOutlined,
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Input,
  Typography,
  Form,
  notification,
  App,
  Checkbox,
  Alert,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useCallback, useState } from "react";
import ModalChangePassword from "./modal.change.password";
import ModelReactive from "./model.reactive";

const { Title, Text } = Typography;

type SignInValues = {
  username: string;
  password: string;
  remember?: boolean;
};

export default function AuthSignIn() {
  const router = useRouter();
  const [form] = Form.useForm<SignInValues>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [submitting, setSubmitting] = useState(false);
  const [errorInline, setErrorInline] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (values: SignInValues) => {
      setErrorInline(null);
      setUserEmail("");
      setSubmitting(true);

      const res = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (res && !res.error) {
        const session = await getSession();
        const token =
          (session as any)?.access_token ??
          (session as any)?.user?.access_token;

        if (token) {
          localStorage.setItem("access_token", token);
        }

        router.push("/");
        router.refresh();
        setSubmitting(false);
        return;
      }

      setSubmitting(false);

      if (res?.error) {
        const msg = res.error.toLowerCase();
        if (msg.includes("not active")) {
          setModalContent(
            "Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email."
          );
          setUserEmail(values.username);
          setIsModalOpen(true);
        } else {
          setErrorInline(res.error || "Sai tài khoản hoặc mật khẩu");
          api.error({
            message: "Đăng nhập thất bại",
            description: res.error || "Sai tài khoản hoặc mật khẩu",
            placement: "topRight",
          });
        }
      }
    },
    [api, router]
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 80% -10%, #ffe6e6, transparent 60%), radial-gradient(900px 500px at -10% 20%, #e6f7ff, transparent 60%), linear-gradient(180deg, #fafafa, #f5f5f5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {contextHolder}

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,.06)",
          padding: 28,
          position: "relative",
        }}
      >
        {/* Back */}
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <Link href="/" aria-label="Quay lại trang chủ">
            <Button icon={<ArrowLeftOutlined />} type="text">
              Quay lại
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginTop: 8, marginBottom: 10 }}>
          <Avatar
            size={72}
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, #ff7875, #ff4d4f, #ff9c6e)",
              marginBottom: 12,
              boxShadow: "0 8px 18px rgba(255,77,79,.25)",
            }}
          >
            <LockOutlined style={{ fontSize: 28, color: "#fff" }} />
          </Avatar>
          <Title level={3} style={{ margin: 0 }}>
            Đăng nhập
          </Title>
          <Text type="secondary">GamerZone</Text>
        </div>

        {/* Error inline */}
        {errorInline && (
          <Alert
            type="error"
            message="Không thể đăng nhập"
            description={errorInline}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Form */}
        <Form<SignInValues>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            label="Email / Tên đăng nhập"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email hoặc tên đăng nhập",
              },
              { min: 3, message: "Tối thiểu 3 ký tự" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined style={{ color: "#999" }} />}
              placeholder="Nhập email hoặc tên đăng nhập"
              autoComplete="username"
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu"
              prefix={<LockOutlined style={{ color: "#999" }} />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              autoComplete="current-password"
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>

            <Typography.Link onClick={() => setChangePassword(true)}>
              Quên mật khẩu?
            </Typography.Link>
          </div>

          <Form.Item style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={submitting}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <Text>Chưa có tài khoản? </Text>
            <Link
              href="/auth/signup"
              style={{ color: "#1677ff", fontWeight: 500 }}
            >
              Đăng ký ngay
            </Link>
          </div>
        </Form>

        <Divider plain>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Hoặc đăng nhập với
          </Text>
        </Divider>

        {/* Social buttons */}
        <div
          style={{
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <Button
            size="large"
            icon={<GoogleOutlined />}
            onClick={() => signIn("google", { callbackUrl: "/" })}
            style={{
              borderRadius: 10,
              textAlign: "center",
              justifyContent: "center",
              color: "#1677ff",
            }}
          >
            Google
          </Button>
        </div>
      </div>

      <ModelReactive
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title="Lỗi đăng nhập"
        content={<p>{modalContent}</p>}
        type="error"
        userEmail={userEmail}
        showSteps
      />

      <ModalChangePassword
        isModalOpen={changePassword}
        setIsModalOpen={setChangePassword}
      />
    </div>
  );
}
