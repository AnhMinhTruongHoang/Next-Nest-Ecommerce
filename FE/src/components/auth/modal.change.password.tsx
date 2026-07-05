"use client";

import { useHasMounted } from "@/utils/customHook";
import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Steps,
  Typography,
} from "antd";
import {
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
  LockOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { sendRequest } from "@/utils/api";

const { Paragraph, Title } = Typography;

const ModalChangePassword = ({ isModalOpen, setIsModalOpen }: any) => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [userEmail, setUserEmail] = useState("");

  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;

  const onFinishStep0 = async (values: any) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/retry-password`,
      method: "POST",
      body: { email },
    });

    if (res?.data) {
      setUserEmail(res.data?.email);
      setCurrent(1);
    } else {
      notification.error({
        message: "Lỗi",
        description: res?.message || "Có lỗi xảy ra, vui lòng thử lại!",
      });
    }
  };

  const onFinishStep1 = async (values: any) => {
    const { code, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      notification.error({
        message: "Lỗi xác thực",
        description: "Mật khẩu nhập lại không khớp.",
      });
      return;
    }

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`,
      method: "POST",
      body: {
        code,
        password,
        confirmPassword,
        email: userEmail,
      },
    });

    if (res?.data) {
      setCurrent(2);
    } else {
      notification.error({
        message: "Lỗi",
        description: res?.message || "Mã không hợp lệ hoặc đã hết hạn.",
      });
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setCurrent(0);
    setUserEmail("");
    form.resetFields();
  };

  return (
    <>
      <Modal
        className="gz-change-password-modal"
        wrapClassName="gz-change-password-wrap"
        title={
          <div className="gz-change-password-title">
            <span>Account Security</span>
            <b>Đặt lại mật khẩu</b>
          </div>
        }
        open={isModalOpen}
        onOk={resetModal}
        onCancel={resetModal}
        footer={null}
        maskClosable={false}
        centered
        width={560}
      >
        <div className="gz-change-password-body">
          <Steps
            className="gz-change-password-steps"
            current={current}
            responsive
            items={[
              {
                title: "Email",
                icon: <UserOutlined />,
              },
              {
                title: "Xác minh",
                icon: <SolutionOutlined />,
              },
              {
                title: "Hoàn tất",
                icon: <SmileOutlined />,
              },
            ]}
          />

          <div className="gz-change-password-content">
            {current === 0 && (
              <>
                <Title level={5} className="gz-step-heading">
                  Bước 1: Nhập email của bạn
                </Title>

                <Paragraph className="gz-step-desc">
                  Vui lòng nhập địa chỉ email đã đăng ký để nhận mã xác minh đặt
                  lại mật khẩu.
                </Paragraph>

                <Form
                  layout="vertical"
                  onFinish={onFinishStep0}
                  form={form}
                  autoComplete="off"
                  className="gz-reset-form"
                >
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="nhapemail@domain.com"
                      className="gz-reset-input"
                    />
                  </Form.Item>

                  <Form.Item className="gz-form-submit-item">
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      className="gz-reset-button"
                    >
                      Gửi mã xác minh
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}

            {current === 1 && (
              <>
                <Title level={5} className="gz-step-heading">
                  Bước 2: Nhập mã xác minh & mật khẩu mới
                </Title>

                <Paragraph className="gz-step-desc">
                  Chúng tôi đã gửi mã xác minh đến email của bạn. Vui lòng nhập
                  mã và mật khẩu mới.
                </Paragraph>

                <Form
                  layout="vertical"
                  onFinish={onFinishStep1}
                  className="gz-reset-form"
                >
                  <Form.Item
                    label="Mã xác minh"
                    name="code"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mã xác minh!",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Nhập mã"
                      className="gz-reset-input"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Mật khẩu mới"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu mới!",
                      },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      prefix={<LockOutlined />}
                      className="gz-reset-input"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập lại mật khẩu!",
                      },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      prefix={<LockOutlined />}
                      className="gz-reset-input"
                    />
                  </Form.Item>

                  <Form.Item className="gz-form-submit-item">
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      className="gz-reset-button"
                    >
                      Đặt lại mật khẩu
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}

            {current === 2 && (
              <div className="gz-reset-success">
                <CheckCircleOutlined className="gz-reset-success-icon" />

                <Title level={4} className="gz-reset-success-title">
                  Đổi mật khẩu thành công!
                </Title>

                <Paragraph className="gz-reset-success-desc">
                  Bạn có thể đăng nhập bằng mật khẩu mới.
                </Paragraph>

                <Button
                  type="primary"
                  onClick={resetModal}
                  size="large"
                  className="gz-reset-button gz-reset-close-button"
                >
                  Đóng
                </Button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .gz-change-password-wrap {
          padding: 14px;
          background: rgba(0, 0, 0, 0.62);
          backdrop-filter: blur(5px);
        }

        .gz-change-password-modal {
          max-width: calc(100vw - 24px);
        }

        .gz-change-password-modal .ant-modal-content {
          overflow: hidden;
          border-radius: 22px;
          padding: 0;
          background: radial-gradient(
              circle at top right,
              rgba(0, 255, 224, 0.14),
              transparent 32%
            ),
            linear-gradient(180deg, #101318 0%, #07090d 100%);
          border: 1px solid rgba(0, 255, 224, 0.18);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .gz-change-password-modal .ant-modal-header {
          margin: 0;
          padding: 24px 26px 18px;
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .gz-change-password-modal .ant-modal-title {
          width: 100%;
        }

        .gz-change-password-modal .ant-modal-close {
          top: 18px;
          right: 18px;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          color: #d7f9ff;
          background: rgba(255, 255, 255, 0.06);
          transition: background 0.18s ease, color 0.18s ease,
            transform 0.18s ease;
        }

        .gz-change-password-modal .ant-modal-close:hover {
          color: #05070a;
          background: #00ffe0;
          transform: rotate(90deg);
        }

        .gz-change-password-title {
          width: 100%;
          padding-right: 38px;
          text-align: center;
        }

        .gz-change-password-title span {
          display: block;
          color: #00ffe0;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .gz-change-password-title b {
          display: block;
          margin-top: 6px;
          color: #ffffff;
          font-size: 26px;
          line-height: 1.2;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .gz-change-password-body {
          padding: 22px 26px 26px;
        }

        .gz-change-password-steps {
          padding: 14px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .gz-change-password-steps .ant-steps-item-title {
          color: #cbd5e1 !important;
          font-weight: 800;
        }

        .gz-change-password-steps .ant-steps-item-description {
          color: #94a3b8 !important;
        }

        .gz-change-password-steps .ant-steps-icon {
          color: inherit;
        }

        .gz-change-password-steps .ant-steps-item-process .ant-steps-item-icon {
          background: #00ffe0;
          border-color: #00ffe0;
        }

        .gz-change-password-steps .ant-steps-item-process .ant-steps-icon {
          color: #05070a;
        }

        .gz-change-password-steps .ant-steps-item-finish .ant-steps-item-icon {
          background: rgba(0, 255, 224, 0.12);
          border-color: #00ffe0;
        }

        .gz-change-password-steps .ant-steps-item-finish .ant-steps-icon {
          color: #00ffe0;
        }

        .gz-change-password-steps .ant-steps-item-wait .ant-steps-item-icon {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.18);
        }

        .gz-change-password-steps .ant-steps-item-wait .ant-steps-icon {
          color: #94a3b8;
        }

        .gz-change-password-steps .ant-steps-item-tail::after {
          background-color: rgba(255, 255, 255, 0.18) !important;
        }

        .gz-change-password-content {
          margin-top: 24px;
        }

        .gz-step-heading.ant-typography {
          margin: 0 0 8px;
          color: #ffffff;
          font-size: 18px;
          font-weight: 900;
        }

        .gz-step-desc.ant-typography {
          margin-bottom: 20px;
          color: #a7b0c0;
          font-size: 14px;
          line-height: 1.7;
        }

        .gz-reset-form .ant-form-item-label > label {
          color: #e5e7eb;
          font-weight: 800;
        }

        .gz-reset-input,
        .gz-reset-input.ant-input-affix-wrapper {
          border-radius: 13px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.065);
          border-color: rgba(255, 255, 255, 0.14);
          box-shadow: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease,
            background 0.18s ease;
        }

        .gz-reset-input::placeholder,
        .gz-reset-input input::placeholder {
          color: #758195;
        }

        .gz-reset-input:hover,
        .gz-reset-input.ant-input-affix-wrapper:hover {
          border-color: rgba(0, 255, 224, 0.55);
        }

        .gz-reset-input:focus,
        .gz-reset-input.ant-input-affix-wrapper-focused {
          background: rgba(255, 255, 255, 0.09);
          border-color: #00ffe0;
          box-shadow: 0 0 0 4px rgba(0, 255, 224, 0.12);
        }

        .gz-reset-input.ant-input-affix-wrapper input {
          color: #ffffff;
          background: transparent;
        }

        .gz-reset-input .anticon {
          color: #00ffe0;
        }

        .gz-reset-input .ant-input-password-icon {
          color: #9ca3af;
        }

        .gz-reset-input .ant-input-password-icon:hover {
          color: #00ffe0;
        }

        .gz-form-submit-item {
          margin-bottom: 0;
        }

        .gz-reset-button {
          height: 44px;
          border: none;
          border-radius: 999px;
          color: #05070a;
          background: linear-gradient(135deg, #00ffe0, #40a9ff);
          font-weight: 950;
          letter-spacing: 0.02em;
          box-shadow: 0 14px 30px rgba(0, 255, 224, 0.18);
          transition: transform 0.18s ease, box-shadow 0.18s ease,
            filter 0.18s ease;
        }

        .gz-reset-button:hover,
        .gz-reset-button:focus {
          color: #05070a !important;
          background: linear-gradient(135deg, #52fff0, #69c0ff) !important;
          transform: translateY(-1px);
          box-shadow: 0 18px 34px rgba(0, 255, 224, 0.24);
          filter: brightness(1.04);
        }

        .gz-reset-success {
          padding: 22px 0 4px;
          text-align: center;
        }

        .gz-reset-success-icon {
          color: #52c41a;
          font-size: 58px;
          filter: drop-shadow(0 8px 18px rgba(82, 196, 26, 0.22));
        }

        .gz-reset-success-title.ant-typography {
          margin: 16px 0 8px;
          color: #ffffff;
          font-weight: 950;
        }

        .gz-reset-success-desc.ant-typography {
          color: #a7b0c0;
        }

        .gz-reset-close-button {
          width: min(100%, 260px);
          margin-top: 12px;
        }

        @media (max-width: 576px) {
          .gz-change-password-wrap {
            padding: 10px;
          }

          .gz-change-password-modal {
            max-width: calc(100vw - 20px);
          }

          .gz-change-password-modal .ant-modal-header {
            padding: 20px 18px 14px;
          }

          .gz-change-password-modal .ant-modal-close {
            top: 14px;
            right: 14px;
          }

          .gz-change-password-title {
            padding-right: 34px;
            text-align: left;
          }

          .gz-change-password-title span {
            font-size: 10px;
            letter-spacing: 0.12em;
          }

          .gz-change-password-title b {
            font-size: 22px;
          }

          .gz-change-password-body {
            padding: 18px 16px 20px;
          }

          .gz-change-password-steps {
            padding: 12px 10px;
            overflow-x: auto;
          }

          .gz-change-password-steps .ant-steps-item-title {
            font-size: 12px;
          }

          .gz-change-password-content {
            margin-top: 20px;
          }

          .gz-step-heading.ant-typography {
            font-size: 16px;
          }

          .gz-step-desc.ant-typography {
            font-size: 13px;
          }

          .gz-reset-button {
            height: 42px;
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
};

export default ModalChangePassword;
