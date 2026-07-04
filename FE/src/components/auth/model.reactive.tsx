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
    <ExclamationCircleOutlined style={{ color: "#00ffe0", fontSize: 28 }} />
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

  useEffect(() => {
    if (userEmail) form.setFieldValue("email", userEmail);
  }, [userEmail, form]);

  if (!hasMounted) return null;

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
          description: "Vui lòng kiểm tra hộp thư hoặc mục Spam.",
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
      className="gz-reactive-modal"
      open={isModalOpen}
      onCancel={handleClose}
      footer={null}
      centered
      title={
        <div className="gz-reactive-title">
          <span className={`gz-reactive-title-icon ${type}`}>
            {iconMap[type]}
          </span>
          <span>{title}</span>
        </div>
      }
      styles={{
        body: { paddingTop: 16, paddingBottom: 16 },
      }}
    >
      <Typography.Paragraph className="gz-reactive-desc">
        {content}
      </Typography.Paragraph>

      {inlineError ? (
        <Alert
          type="error"
          message="Có lỗi xảy ra"
          description={inlineError}
          showIcon
          className="gz-reactive-alert"
        />
      ) : null}

      {showSteps && (
        <>
          <Steps
            size="small"
            current={currentStep}
            className="gz-reactive-steps"
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

          <Divider plain className="gz-reactive-divider">
            <i>Tài khoản chưa kích hoạt?</i>
          </Divider>

          {currentStep === 0 && (
            <Form
              form={form}
              name="resend-email"
              layout="vertical"
              onFinish={handleResendEmail}
              className="gz-reactive-form"
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
                  className="gz-reactive-primary-btn"
                >
                  Gửi lại email xác minh
                </Button>
              </Form.Item>
            </Form>
          )}

          {currentStep === 1 && (
            <Form
              name="verify-code"
              layout="vertical"
              onFinish={handleVerifyCode}
              autoComplete="off"
              className="gz-reactive-form"
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
                  className="gz-reactive-primary-btn"
                >
                  Kích hoạt tài khoản
                </Button>
              </Form.Item>

              <Button
                type="link"
                onClick={() => setCurrentStep(0)}
                className="gz-reactive-back-link"
              >
                ← Gửi lại email khác
              </Button>
            </Form>
          )}

          {currentStep === 2 && (
            <div className="gz-reactive-success">
              <CheckCircleOutlined />
              <Typography.Title level={5}>
                Tài khoản đã được kích hoạt
              </Typography.Title>
              <Typography.Paragraph>
                Bạn có thể đóng cửa sổ này và đăng nhập ngay bây giờ.
              </Typography.Paragraph>
              <Button
                type="primary"
                onClick={handleClose}
                className="gz-reactive-primary-btn"
              >
                Đóng
              </Button>
            </div>
          )}
        </>
      )}

      <style jsx global>{`
        .gz-reactive-modal .ant-modal-content {
          overflow: hidden;
          border-radius: 22px !important;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.018)
            ),
            #151718 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(0, 255, 224, 0.04) !important;
        }

        .gz-reactive-modal .ant-modal-header {
          margin-bottom: 0 !important;
          background: transparent !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          padding-bottom: 14px !important;
        }

        .gz-reactive-modal .ant-modal-title {
          color: #ffffff !important;
        }

        .gz-reactive-modal .ant-modal-close {
          color: #d1d5db !important;
        }

        .gz-reactive-modal .ant-modal-close:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .gz-reactive-title {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ffffff;
          font-size: 18px;
          font-weight: 950;
          line-height: 1.3;
        }

        .gz-reactive-title-icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: rgba(0, 255, 224, 0.08);
          border: 1px solid rgba(0, 255, 224, 0.22);
        }

        .gz-reactive-title-icon.error {
          background: rgba(255, 77, 79, 0.1);
          border-color: rgba(255, 77, 79, 0.28);
        }

        .gz-reactive-title-icon.success {
          background: rgba(82, 196, 26, 0.1);
          border-color: rgba(82, 196, 26, 0.28);
        }

        .gz-reactive-desc {
          color: #d1d5db !important;
          font-size: 14.5px;
          line-height: 1.65;
          margin-bottom: 14px !important;
        }

        .gz-reactive-desc b {
          color: #00ffe0;
        }

        .gz-reactive-alert {
          margin-bottom: 14px;
          border-radius: 14px !important;
          background: rgba(255, 77, 79, 0.12) !important;
          border-color: rgba(255, 77, 79, 0.34) !important;
        }

        .gz-reactive-alert .ant-alert-message {
          color: #ff8f8b !important;
          font-weight: 850;
        }

        .gz-reactive-alert .ant-alert-description {
          color: #e5e7eb !important;
        }

        .gz-reactive-steps {
          margin: 10px 0 18px !important;
        }

        .gz-reactive-steps .ant-steps-item-title {
          color: #d1d5db !important;
          font-size: 12px !important;
          font-weight: 800;
        }

        .gz-reactive-steps .ant-steps-item-description {
          color: #8b949e !important;
        }

        .gz-reactive-steps .ant-steps-item-icon {
          background: #0b0f10 !important;
          border-color: rgba(255, 255, 255, 0.14) !important;
        }

        .gz-reactive-steps .ant-steps-icon {
          color: #8b949e !important;
        }

        .gz-reactive-steps .ant-steps-item-active .ant-steps-item-icon,
        .gz-reactive-steps .ant-steps-item-process .ant-steps-item-icon {
          background: rgba(0, 255, 224, 0.12) !important;
          border-color: #00ffe0 !important;
        }

        .gz-reactive-steps .ant-steps-item-active .ant-steps-icon,
        .gz-reactive-steps .ant-steps-item-process .ant-steps-icon {
          color: #00ffe0 !important;
        }

        .gz-reactive-steps .ant-steps-item-finish .ant-steps-item-icon {
          background: rgba(0, 184, 148, 0.12) !important;
          border-color: #00b894 !important;
        }

        .gz-reactive-steps .ant-steps-item-finish .ant-steps-icon {
          color: #00b894 !important;
        }

        .gz-reactive-steps .ant-steps-item-tail::after {
          background: rgba(255, 255, 255, 0.14) !important;
        }

        .gz-reactive-divider {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        .gz-reactive-divider .ant-divider-inner-text {
          color: #8b949e !important;
          font-size: 13px;
        }

        .gz-reactive-form .ant-form-item-label > label {
          color: #e5e7eb !important;
          font-weight: 800;
        }

        .gz-reactive-form .ant-input,
        .gz-reactive-form .ant-input-affix-wrapper {
          height: 44px;
          border-radius: 13px !important;
          color: #ffffff !important;
          background: #0b0f10 !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
        }

        .gz-reactive-form .ant-input:hover,
        .gz-reactive-form .ant-input:focus {
          border-color: #00ffe0 !important;
          box-shadow: 0 0 0 3px rgba(0, 255, 224, 0.08) !important;
        }

        .gz-reactive-form .ant-input::placeholder {
          color: #6b7280 !important;
        }

        .gz-reactive-form .ant-input[disabled] {
          color: #9ca3af !important;
          background: rgba(255, 255, 255, 0.055) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }

        .gz-reactive-form .ant-form-item-explain-error {
          color: #ff7875 !important;
          font-size: 12px;
        }

        .gz-reactive-primary-btn {
          height: 44px !important;
          border-radius: 13px !important;
          border: none !important;
          color: #061313 !important;
          background: linear-gradient(135deg, #00ffe0, #00b894) !important;
          font-weight: 950 !important;
          box-shadow: 0 12px 26px rgba(0, 255, 224, 0.16) !important;
        }

        .gz-reactive-primary-btn:hover {
          filter: brightness(1.08);
        }

        .gz-reactive-back-link {
          padding: 0 !important;
          color: #00ffe0 !important;
          font-weight: 800 !important;
        }

        .gz-reactive-back-link:hover {
          color: #7dfff5 !important;
        }

        .gz-reactive-success {
          padding: 12px 0 4px;
          text-align: center;
        }

        .gz-reactive-success > .anticon {
          color: #52c41a;
          font-size: 48px;
          filter: drop-shadow(0 8px 20px rgba(82, 196, 26, 0.18));
        }

        .gz-reactive-success h5.ant-typography {
          margin-top: 14px !important;
          color: #ffffff !important;
          font-weight: 950 !important;
        }

        .gz-reactive-success .ant-typography {
          color: #d1d5db !important;
        }

        @media (max-width: 576px) {
          .gz-reactive-modal {
            width: calc(100vw - 24px) !important;
            max-width: calc(100vw - 24px) !important;
          }

          .gz-reactive-title {
            align-items: flex-start;
            font-size: 16px;
            padding-right: 18px;
          }

          .gz-reactive-title-icon {
            width: 38px;
            height: 38px;
          }

          .gz-reactive-steps .ant-steps-item-title {
            font-size: 11px !important;
          }

          .gz-reactive-desc {
            font-size: 13.5px;
          }
        }
      `}</style>
    </Modal>
  );
};

export default ModelReactive;
