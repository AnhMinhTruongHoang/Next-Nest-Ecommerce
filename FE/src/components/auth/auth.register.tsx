"use client";

import {
  ArrowLeftOutlined,
  LockOutlined,
  LockTwoTone,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Avatar,
  Button,
  Checkbox,
  Form,
  Input,
  Row,
  Col,
  Typography,
  Alert,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { sendRequest } from "@/utils/api";
import TermsModal from "./model.policy";

const { Title, Text } = Typography;

type SignUpForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree?: boolean;
};

export default function AuthSignUp() {
  const router = useRouter();
  const [form] = Form.useForm<SignUpForm>();
  const { notification } = App.useApp();
  const [submitting, setSubmitting] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFinish = useCallback(
    async (values: SignUpForm) => {
      setInlineError(null);
      setSubmitting(true);

      try {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
          method: "POST",
          body: {
            name: values.name.trim(),
            email: values.email.trim(),
            password: values.password,
          },
        });

        if (res?.data?._id) {
          notification.success({
            message: "Đăng ký thành công",
            description:
              "Vui lòng kiểm tra email để xác minh tài khoản trước khi đăng nhập.",
          });
          router.push(`/auth/verify/${res.data._id}`);
          return;
        }

        const errMsg =
          res?.message ||
          (Array.isArray(res?.error) ? res.error[0] : res?.error) ||
          "Đăng ký thất bại. Vui lòng thử lại!";
        setInlineError(errMsg);
        notification.error({
          message: "Đăng ký thất bại",
          description: errMsg,
        });
      } catch (e: any) {
        const errMsg =
          e?.message || "Không thể kết nối máy chủ. Vui lòng thử lại!";
        setInlineError(errMsg);
        notification.error({
          message: "Đăng ký thất bại",
          description: errMsg,
        });
      } finally {
        setSubmitting(false);
      }
    },
    [notification, router]
  );

  return (
    <div className="signup-page">
      <div className="signup-card">
        {/* Back */}
        <div className="signup-back">
          <Link href="/auth/signin" aria-label="Quay lại đăng nhập">
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
        <div className="signup-header">
          <Avatar
            size={72}
            src="/images/logos/gz.png"
            className="signup-avatar"
          />

          <Title level={3} className="signup-title">
            Tạo tài khoản
          </Title>

          <Text className="signup-subtitle">GamerZone</Text>
        </div>

        {inlineError && (
          <Alert
            type="error"
            message="Không thể đăng ký"
            description={inlineError}
            showIcon
            className="signup-alert"
          />
        )}

        <Form<SignUpForm>
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
          initialValues={{ agree: true }}
          className="signup-form"
        >
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[
              { required: true, message: "Vui lòng nhập họ tên" },
              { min: 2, message: "Họ tên tối thiểu 2 ký tự" },
            ]}
          >
            <Input
              size="large"
              placeholder="Nguyễn Văn A"
              prefix={<UserOutlined style={{ color: "#8b949e" }} />}
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              size="large"
              placeholder="email@domain.com"
              prefix={<MailOutlined style={{ color: "#8b949e" }} />}
              allowClear
              autoComplete="email"
            />
          </Form.Item>

          <Row gutter={[12, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu" },
                  {
                    min: 6,
                    message: "Mật khẩu tối thiểu 6 ký tự",
                  },
                ]}
                tooltip="Tối thiểu 6 ký tự, nên có chữ hoa, chữ thường và số"
              >
                <Input.Password
                  size="large"
                  prefix={<LockTwoTone twoToneColor="#00ffe0" />}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="confirmPassword"
                label="Nhập lại mật khẩu"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu nhập lại không khớp")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockTwoTone twoToneColor="#00ffe0" />}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="terms-row">
            <Form.Item name="agree" valuePropName="checked" noStyle>
              <Checkbox className="signup-terms-checkbox">
                <span className="terms-text">
                  Tôi đồng ý với{" "}
                  <span
                    role="button"
                    tabIndex={0}
                    className="terms-link"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsModalOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsModalOpen(true);
                      }
                    }}
                  >
                    Điều khoản dịch vụ
                  </span>{" "}
                  &{" "}
                  <span
                    role="button"
                    tabIndex={0}
                    className="terms-link"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsModalOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsModalOpen(true);
                      }
                    }}
                  >
                    Chính sách bảo mật
                  </span>
                </span>
              </Checkbox>
            </Form.Item>
          </div>
          <div className="signin-text">
            <Text>
              Đã có tài khoản?{" "}
              <Link href="/auth/signin">
                <Button type="link" className="signin-link-btn">
                  Đăng nhập
                </Button>
              </Link>
            </Text>
          </div>

          <Form.Item
            shouldUpdate
            rules={[
              ({ getFieldValue }) => ({
                validator() {
                  if (getFieldValue("agree")) return Promise.resolve();
                  return Promise.reject(
                    new Error("Bạn cần đồng ý điều khoản để tiếp tục")
                  );
                },
              }),
            ]}
          >
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={submitting}
                disabled={!form.getFieldValue("agree")}
                className="signup-submit-btn"
              >
                Tạo tài khoản
              </Button>
            )}
          </Form.Item>
        </Form>

        <div className="signup-note">
          <Text>
            Bằng việc đăng ký, bạn đồng ý nhận thông tin cập nhật từ chúng tôi.
            Bạn có thể huỷ bất cứ lúc nào.
          </Text>
        </div>
      </div>

      <TermsModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      {/* Style */}
      <style jsx global>{`
        .signup-page {
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

        .signup-card {
          width: 100%;
          max-width: 480px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 18px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.38);
          padding: 30px 28px 28px;
          position: relative;
        }

        .signup-back {
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

        .signup-header {
          text-align: center;
          margin-top: 12px;
          margin-bottom: 14px;
        }

        .signup-avatar {
          background: transparent !important;
          margin-bottom: 12px;
          box-shadow: 0 10px 24px rgba(0, 255, 224, 0.2);
          border: 2px solid #00ffe0;
        }

        .signup-avatar img {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          padding: 2px;
        }

        .signup-title {
          margin: 0 !important;
          color: #ffffff !important;
          font-weight: 800 !important;
        }

        .signup-subtitle {
          color: #00ffe0 !important;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .signup-alert {
          margin-bottom: 16px;
          background: rgba(255, 77, 79, 0.12) !important;
          border-color: rgba(255, 77, 79, 0.35) !important;
        }

        .signup-alert .ant-alert-message {
          color: #ff7875 !important;
        }

        .signup-alert .ant-alert-description {
          color: #e5e7eb !important;
        }

        .signup-form .ant-form-item-label > label {
          color: #e5e7eb !important;
          font-weight: 600;
        }

        .signup-form .ant-input,
        .signup-form .ant-input-affix-wrapper {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
          border-radius: 10px !important;
        }

        .signup-form .ant-input-affix-wrapper:hover,
        .signup-form .ant-input-affix-wrapper-focused,
        .signup-form .ant-input:hover,
        .signup-form .ant-input:focus {
          border-color: #00ffe0 !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.08) !important;
        }

        .signup-form .ant-input::placeholder,
        .signup-form .ant-input-password input::placeholder {
          color: #6b7280 !important;
        }

        .signup-form .ant-input-password-icon {
          color: #8b949e !important;
        }

        .signup-form .ant-form-item-explain-error {
          color: #ff7875 !important;
          font-size: 12px;
        }

        .signup-form .ant-form-item-tooltip {
          color: #00ffe0 !important;
        }

        /* ===== FIX CHECKBOX ĐIỀU KHOẢN ===== */

        .terms-row {
          margin: 8px 0 16px;
        }

        .signup-terms-checkbox {
          width: 100%;
          display: flex !important;
          align-items: flex-start !important;
          color: #e5e7eb !important;
          line-height: 1.7 !important;
        }

        .signup-terms-checkbox .ant-checkbox {
          top: 1px !important;
          flex-shrink: 0;
        }

        .signup-terms-checkbox .ant-checkbox + span {
          padding-inline-start: 10px !important;
          padding-inline-end: 0 !important;
          color: #e5e7eb !important;
        }

        .signup-terms-checkbox .ant-checkbox-inner {
          width: 18px !important;
          height: 18px !important;
          border-radius: 5px !important;
          background: #111314 !important;
          border-color: #6b7280 !important;
        }

        .signup-terms-checkbox .ant-checkbox-checked .ant-checkbox-inner {
          background: #00b894 !important;
          border-color: #00b894 !important;
        }

        .signup-terms-checkbox
          .ant-checkbox-checked
          .ant-checkbox-inner::after {
          border-color: #ffffff !important;
        }

        .signup-terms-checkbox:hover .ant-checkbox-inner {
          border-color: #00ffe0 !important;
        }

        .terms-text {
          color: #e5e7eb;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.7;
        }

        .terms-link {
          display: inline;
          color: #00ffe0;
          font-size: inherit;
          font-weight: 800;
          line-height: inherit;
          cursor: pointer;
          outline: none;
        }

        .terms-link:hover {
          color: #7dfff5;
          text-decoration: underline;
        }

        .terms-link:focus-visible {
          color: #7dfff5;
          text-decoration: underline;
        }

        @media (max-width: 576px) {
          .terms-text {
            font-size: 13px;
            line-height: 1.75;
          }

          .signup-terms-checkbox .ant-checkbox {
            top: 4px !important;
          }
        }

        .signin-link-btn {
          color: #00ffe0 !important;
          padding: 0 !important;
          font-weight: 600 !important;
        }

        .signin-link-btn:hover {
          color: #4dfff0 !important;
        }

        .signin-text {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          margin-top: 12px;
          margin-bottom: 10px;
        }

        .signin-text .ant-typography {
          color: #b8b8b8 !important;
          font-size: 13px;
        }

        .signup-submit-btn {
          height: 46px !important;
          border-radius: 12px !important;
          border: none !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          font-weight: 800 !important;
          box-shadow: 0 10px 24px rgba(255, 77, 0, 0.22) !important;
        }

        .signup-submit-btn:hover {
          background: linear-gradient(135deg, #ff6a1a, #ff8c1a) !important;
        }

        .signup-submit-btn:disabled {
          background: #303435 !important;
          color: #777 !important;
          box-shadow: none !important;
        }

        .signup-note {
          text-align: center;
          margin-top: 8px;
        }

        .signup-note .ant-typography {
          color: #8b949e !important;
          font-size: 13px;
          line-height: 1.6;
        }

        @media (max-width: 576px) {
          .signup-page {
            padding: 16px;
            align-items: flex-start;
            padding-top: 42px;
          }

          .signup-card {
            max-width: 100%;
            padding: 56px 18px 22px;
            border-radius: 16px;
          }

          .signup-back {
            top: 10px;
            left: 10px;
          }

          .signup-header {
            margin-top: 0;
          }

          .signup-avatar {
            width: 64px !important;
            height: 64px !important;
            line-height: 64px !important;
          }

          .signup-title {
            font-size: 24px !important;
          }

          .terms-row .ant-checkbox + span {
            font-size: 13px;
            line-height: 1.75;
          }

          .terms-row .ant-checkbox {
            top: 4px !important;
          }

          .inline-link-btn,
          .signin-link-btn {
            font-size: 13px !important;
          }

          .signup-submit-btn {
            height: 44px !important;
          }
        }

        @media (max-width: 380px) {
          .signup-page {
            padding: 12px;
            padding-top: 32px;
          }

          .signup-card {
            padding: 54px 14px 20px;
          }

          .signup-title {
            font-size: 22px !important;
          }

          .terms-row .ant-checkbox + span {
            font-size: 12.5px;
          }
        }
      `}</style>
    </div>
  );
}
