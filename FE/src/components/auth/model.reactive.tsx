"use client";

import { useEffect, useState } from "react";
import { useHasMounted } from "@/utils/customHook";
import { sendRequest } from "@/utils/api";
import {
  App,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Steps,
  Typography,
  Alert,
} from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MailOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  title?: string;
  content?: React.ReactNode;
  type?: "error" | "info" | "success";
  showSteps?: boolean;
  userEmail?: string;
}

const iconMap = {
  error: (
    <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: 28 }} />
  ),
  success: <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 28 }} />,
  info: (
    <ExclamationCircleOutlined style={{ color: "#1677ff", fontSize: 28 }} />
  ),
};

const ModelReactive = ({
  isModalOpen,
  setIsModalOpen,
  userEmail,
  title = "Tài khoản của bạn chưa được kích hoạt",
  content = (
    <p>
      Vui lòng xác minh email để kích hoạt tài khoản. Nếu bạn chưa nhận được
      email, hãy bấm <b>Gửi lại email</b>.
    </p>
  ),
  type = "info",
  showSteps = true,
}: Props) => {
  const hasMounted = useHasMounted();
  const { notification } = App.useApp();

  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const [loadingStep1, setLoadingStep1] = useState(false);
  const [loadingStep2, setLoadingStep2] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  // Điền sẵn email lên form
  useEffect(() => {
    if (userEmail) form.setFieldValue("email", userEmail);
  }, [userEmail, form]);

  // Chưa mount thì không render để tránh lệch hydration
  if (!hasMounted) return null;

  // Step 1: Gửi lại email kích hoạt
  const handleResendEmail = async (values: any) => {
    setInlineError(null);
    setLoadingStep1(true);

    try {
      const { email } = values;

      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/retry-active`,
        method: "POST",
        body: { email },
      });

      if (res?.data?._id) {
        setUserId(res.data._id);
        setCurrentStep(1);
        notification.success({
          message: "Đã gửi lại email xác minh",
          description: "Vui lòng kiểm tra hộp thư (hoặc mục Spam).",
        });
      } else {
        const msg =
          res?.message ||
          (Array.isArray(res?.error) ? res.error[0] : res?.error) ||
          "Không thể gửi email xác minh.";
        setInlineError(msg);
        notification.error({ message: "Thất bại", description: msg });
      }
    } catch (e: any) {
      const msg = e?.message || "Không thể kết nối máy chủ.";
      setInlineError(msg);
      notification.error({ message: "Thất bại", description: msg });
    } finally {
      setLoadingStep1(false);
    }
  };

  // Step 2: Nhập mã xác minh
  const handleVerifyCode = async (values: any) => {
    setInlineError(null);
    setLoadingStep2(true);

    try {
      const { code } = values;

      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check-code`,
        method: "POST",
        body: {
          _id: userId,
          code,
        },
      });

      if (res?.data?._id) {
        setCurrentStep(2);
        notification.success({
          message: "Kích hoạt thành công",
          description: "Tài khoản của bạn đã được kích hoạt.",
        });
        // Đóng modal sau 1.2s
        setTimeout(() => {
          setCurrentStep(0);
          setIsModalOpen(false);
        }, 1200);
      } else {
        const msg =
          res?.message ||
          (Array.isArray(res?.error) ? res.error[0] : res?.error) ||
          "Mã xác minh không hợp lệ.";
        setInlineError(msg);
        notification.error({ message: "Thất bại", description: msg });
      }
    } catch (e: any) {
      const msg = e?.message || "Không thể kết nối máy chủ.";
      setInlineError(msg);
      notification.error({ message: "Thất bại", description: msg });
    } finally {
      setLoadingStep2(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setInlineError(null);
    setUserId(undefined);
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleClose}
      footer={null}
      centered
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {iconMap[type]}
          <span>{title}</span>
        </div>
      }
      styles={{
        body: { paddingTop: 16, paddingBottom: 16 },
      }}
    >
      <Typography.Paragraph style={{ marginBottom: 8 }}>
        {content}
      </Typography.Paragraph>

      {inlineError ? (
        <Alert
          type="error"
          message="Có lỗi xảy ra"
          description={inlineError}
          showIcon
          style={{ marginBottom: 12 }}
        />
      ) : null}

      {showSteps && (
        <>
          <Steps
            size="small"
            current={currentStep}
            style={{ margin: "8px 0 16px" }}
            items={[
              {
                title: "Email",
                icon:
                  currentStep === 0 ? <LoadingOutlined /> : <MailOutlined />,
              },
              { title: "Xác minh", icon: <MailOutlined /> },
              { title: "Hoàn tất", icon: <CheckCircleOutlined /> },
            ]}
          />

          <Divider plain>
            <i>Tài khoản chưa kích hoạt?</i>
          </Divider>

          {/* Bước 0: Nhập email (đã khóa, chỉ nhấn gửi lại) */}
          {currentStep === 0 && (
            <Form
              form={form}
              name="resend-email"
              layout="vertical"
              onFinish={handleResendEmail}
              style={{ marginTop: 8 }}
              initialValues={{ email: userEmail }}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Vui lòng nhập email" }]}
              >
                <Input placeholder="Nhập email" disabled />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loadingStep1}
                >
                  Gửi lại email xác minh
                </Button>
              </Form.Item>
            </Form>
          )}

          {/* Bước 1: Nhập mã xác minh */}
          {currentStep === 1 && (
            <Form
              name="verify-code"
              layout="vertical"
              onFinish={handleVerifyCode}
              autoComplete="off"
              style={{ marginTop: 8 }}
            >
              <Form.Item
                label="Mã xác minh"
                name="code"
                rules={[
                  { required: true, message: "Vui lòng nhập mã xác minh" },
                ]}
              >
                <Input placeholder="Nhập mã gồm 6 ký tự" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loadingStep2}
                >
                  Kích hoạt tài khoản
                </Button>
              </Form.Item>

              <Button
                type="link"
                onClick={() => setCurrentStep(0)}
                style={{ padding: 0 }}
              >
                ← Gửi lại email khác
              </Button>
            </Form>
          )}

          {/* Bước 2: Hoàn tất */}
          {currentStep === 2 && (
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 40 }} />
              <Typography.Title level={5} style={{ marginTop: 12 }}>
                Tài khoản đã được kích hoạt
              </Typography.Title>
              <Typography.Paragraph>
                Bạn có thể đóng cửa sổ này và đăng nhập ngay bây giờ.
              </Typography.Paragraph>
              <Button type="primary" onClick={handleClose}>
                Đóng
              </Button>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default ModelReactive;
