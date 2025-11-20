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
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,.06)",
          padding: 28,
          position: "relative",
        }}
      >
        {/* Back */}
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <Link href="/auth/signin" aria-label="Quay lại đăng nhập">
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
                "conic-gradient(from 180deg at 50% 50%, #597ef7, #2f54eb, #91caff)",
              marginBottom: 12,
              boxShadow: "0 8px 18px rgba(47,84,235,.25)",
            }}
          >
            <LockOutlined style={{ fontSize: 28, color: "#fff" }} />
          </Avatar>
          <Title level={3} style={{ margin: 0 }}>
            Tạo tài khoản
          </Title>
          <Text type="secondary">GamerZone</Text>
        </div>

        {inlineError && (
          <Alert
            type="error"
            message="Không thể đăng ký"
            description={inlineError}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form<SignUpForm>
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
          initialValues={{ agree: true }}
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
              prefix={<UserOutlined style={{ color: "#999" }} />}
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
              prefix={<MailOutlined style={{ color: "#999" }} />}
              allowClear
              autoComplete="email"
            />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
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
                  prefix={<LockTwoTone twoToneColor="#2f54eb" />}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                  prefix={<LockTwoTone twoToneColor="#2f54eb" />}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </Form.Item>
            </Col>
          </Row>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Form.Item name="agree" valuePropName="checked" noStyle>
              <Checkbox>
                Tôi đồng ý với{" "}
                <Button
                  type="link"
                  onClick={() => setIsModalOpen(true)}
                  style={{ padding: 0 }}
                >
                  Điều khoản dịch vụ
                </Button>{" "}
                &{" "}
                <Button
                  type="link"
                  onClick={() => setIsModalOpen(true)}
                  style={{ padding: 0 }}
                >
                  Chính sách bảo mật
                </Button>
              </Checkbox>
            </Form.Item>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              marginTop: 12,
            }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              Đã có tài khoản?{" "}
              <Link href="/auth/signin">
                <Button type="link" style={{ padding: 0, fontSize: 12 }}>
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
              >
                Tạo tài khoản
              </Button>
            )}
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 8 }}>
          <Text type="secondary">
            Bằng việc đăng ký, bạn đồng ý nhận thông tin cập nhật từ chúng tôi.
            Bạn có thể huỷ bất cứ lúc nào.
          </Text>
        </div>
      </div>
      <TermsModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
