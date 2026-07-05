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
    <div className="signin-page">
      {contextHolder}

      <div className="signin-card">
        {/* Back */}
        <div className="signin-back">
          <Link href="/" aria-label="Quay lại trang chủ">
            <Button
              icon={<ArrowLeftOutlined />}
              type="text"
              className="back-btn"
            >
              Quay lại
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="signin-header">
          <Avatar
            size={72}
            src="/images/logos/gz.png"
            className="signin-avatar"
          />

          <Title level={3} className="signin-title">
            Đăng nhập
          </Title>

          <Text className="signin-subtitle">GamerZone</Text>
        </div>

        {/* Error inline */}
        {errorInline && (
          <Alert
            type="error"
            message="Không thể đăng nhập"
            description={errorInline}
            showIcon
            className="signin-alert"
          />
        )}

        {/* Form */}
        <Form<SignInValues>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          initialValues={{ remember: true }}
          className="signin-form"
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
              prefix={<MailOutlined style={{ color: "#8b949e" }} />}
              placeholder="Nhập email hoặc tên đăng nhập (admin@gmail.com)"
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
              placeholder="Nhập mật khẩu (123)"
              prefix={<LockOutlined style={{ color: "#8b949e" }} />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              autoComplete="current-password"
            />
          </Form.Item>

          <div className="signin-options">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
          </div>

          <Form.Item style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={submitting}
              className="signin-submit-btn"
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="signup-text">
            <Text>Chưa có tài khoản? </Text>
            <Link href="/auth/signup" className="signup-link">
              Đăng ký ngay
            </Link>
            <br />
            <Typography.Link
              onClick={() => setChangePassword(true)}
              className="forgot-link"
            >
              Quên mật khẩu?
            </Typography.Link>
          </div>
        </Form>

        <Divider plain>
          <Text className="divider-text">Hoặc đăng nhập với</Text>
        </Divider>

        {/* Social buttons */}
        <div className="social-login">
          <Button
            size="large"
            icon={<GoogleOutlined />}
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="google-btn"
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

      <style jsx global>{`
        .signin-page {
          min-height: 100vh;
          background: radial-gradient(
              900px 500px at 80% -10%,
              rgba(0, 255, 224, 0.14),
              transparent 60%
            ),
            radial-gradient(
              700px 420px at -10% 20%,
              rgba(255, 77, 0, 0.13),
              transparent 60%
            ),
            linear-gradient(180deg, #1e2021, #111314);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .signin-card {
          width: 100%;
          max-width: 440px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 18px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.38);
          padding: 30px 28px 28px;
          position: relative;
        }

        .signin-back {
          position: absolute;
          top: 12px;
          left: 12px;
        }

        .back-btn {
          color: #e5e7eb !important;
        }

        .back-btn:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .signin-header {
          text-align: center;
          margin-top: 12px;
          margin-bottom: 14px;
        }

        .signin-avatar {
          background: transparent !important;
          margin-bottom: 12px;
          box-shadow: 0 10px 24px rgba(0, 255, 224, 0.2);
          border: 2px solid #00ffe0;
        }

        .signin-avatar img {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          padding: 2px;
        }

        .signin-title {
          margin: 0 !important;
          color: #ffffff !important;
          font-weight: 800 !important;
        }

        .signin-subtitle {
          color: #00ffe0 !important;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .signin-alert {
          margin-bottom: 16px;
          background: rgba(255, 77, 79, 0.12) !important;
          border-color: rgba(255, 77, 79, 0.35) !important;
        }

        .signin-alert .ant-alert-message {
          color: #ff7875 !important;
        }

        .signin-alert .ant-alert-description {
          color: #e5e7eb !important;
        }

        .signin-form .ant-form-item-label > label {
          color: #e5e7eb !important;
          font-weight: 600;
        }

        .signin-form .ant-input,
        .signin-form .ant-input-affix-wrapper {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
          border-radius: 10px !important;
        }

        .signin-form .ant-input-affix-wrapper:hover,
        .signin-form .ant-input-affix-wrapper-focused,
        .signin-form .ant-input:hover,
        .signin-form .ant-input:focus {
          border-color: #00ffe0 !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.08) !important;
        }

        .signin-form .ant-input::placeholder,
        .signin-form .ant-input-password input::placeholder {
          color: #6b7280 !important;
        }

        .signin-form .ant-input-password-icon {
          color: #8b949e !important;
        }

        .signin-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .signin-options .ant-checkbox-wrapper {
          color: #e5e7eb !important;
        }

        .signin-options .ant-checkbox-inner {
          background-color: #111314 !important;
          border-color: #4b5563 !important;
        }

        .signin-options .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #00b894 !important;
          border-color: #00b894 !important;
        }

        .forgot-link,
        .signup-link {
          color: #00ffe0 !important;
          font-weight: 600;
        }

        .forgot-link:hover,
        .signup-link:hover {
          color: #4dfff0 !important;
        }

        .signin-submit-btn {
          height: 46px !important;
          border-radius: 12px !important;
          border: none !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          font-weight: 800 !important;
          box-shadow: 0 10px 24px rgba(255, 77, 0, 0.22) !important;
        }

        .signin-submit-btn:hover {
          background: linear-gradient(135deg, #ff6a1a, #ff8c1a) !important;
        }

        .signup-text {
          text-align: center;
          margin-bottom: 8px;
        }

        .signup-text .ant-typography {
          color: #b8b8b8 !important;
        }

        .signin-card .ant-divider {
          border-color: #303435 !important;
        }

        .signin-card .ant-divider-inner-text {
          color: #8b949e !important;
        }

        .divider-text {
          color: #8b949e !important;
          font-size: 13px;
        }

        .social-login {
          display: flex;
          justify-content: center;
        }

        .google-btn {
          width: 100%;
          max-width: 180px;
          height: 44px !important;
          border-radius: 12px !important;
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
          font-weight: 700 !important;
        }

        .google-btn:hover {
          color: #00ffe0 !important;
          border-color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        @media (max-width: 576px) {
          .signin-page {
            padding: 16px;
            align-items: flex-start;
            padding-top: 48px;
          }

          .signin-card {
            max-width: 100%;
            padding: 56px 18px 22px;
            border-radius: 16px;
          }

          .signin-back {
            top: 10px;
            left: 10px;
          }

          .signin-header {
            margin-top: 0;
          }

          .signin-avatar {
            width: 64px !important;
            height: 64px !important;
            line-height: 64px !important;
          }

          .signin-title {
            font-size: 24px !important;
          }

          .signin-options {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }

          .signin-submit-btn {
            height: 44px !important;
          }

          .google-btn {
            max-width: 100%;
          }
        }

        @media (max-width: 380px) {
          .signin-page {
            padding: 12px;
            padding-top: 36px;
          }

          .signin-card {
            padding: 54px 14px 20px;
          }

          .signin-title {
            font-size: 22px !important;
          }
        }
      `}</style>
    </div>
  );
}
