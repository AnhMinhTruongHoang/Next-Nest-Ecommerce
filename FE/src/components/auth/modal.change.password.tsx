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
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-password`,
      method: "POST",
      body: { email },
    });

    if (res?.data) {
      setUserEmail(res.data?.email);
      setCurrent(1);
    } else {
      notification.error({
        message: "Error",
        description: res?.message || "Something went wrong!",
      });
    }
  };

  const onFinishStep1 = async (values: any) => {
    const { code, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      notification.error({
        message: "Validation Error",
        description: "Passwords do not match.",
      });
      return;
    }

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/change-password`,
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
        message: "Error",
        description: res?.message || "Invalid code or expired.",
      });
    }
  };

  // reset modal
  const resetModal = () => {
    setIsModalOpen(false), setCurrent(0);
    setUserEmail("");
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div
          style={{ textAlign: "center", width: "100%", marginBottom: "15px" }}
        >
          <b> Reset Your Password</b>
        </div>
      }
      onOk={resetModal}
      open={isModalOpen}
      onCancel={resetModal}
      footer={null}
      maskClosable={false}
    >
      <Steps
        current={current}
        items={[
          {
            title: "Email",
            icon: <UserOutlined />,
          },
          {
            title: "Verification",
            icon: <SolutionOutlined />,
          },
          {
            title: "Done",
            icon: <SmileOutlined />,
          },
        ]}
      />

      <div style={{ marginTop: 24 }}>
        {current === 0 && (
          <>
            <Title level={5}>Step 1: Enter your email</Title>
            <Paragraph>
              To reset your password, please provide the email associated with
              your account.
            </Paragraph>

            <Form
              layout="vertical"
              onFinish={onFinishStep0}
              form={form}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input placeholder="your@email.com" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Send Verification Code
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {current === 1 && (
          <>
            <Title level={5}>
              Step 2: Enter verification code & new password
            </Title>
            <Paragraph>
              We’ve sent a code to your email. Enter it here along with your new
              password.
            </Paragraph>

            <Form layout="vertical" onFinish={onFinishStep1}>
              <Form.Item
                label="Verification Code"
                name="code"
                rules={[{ required: true, message: "Please input the code!" }]}
              >
                <Input placeholder="Enter code" />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Please confirm your password!" },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {current === 2 && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <CheckCircleOutlined style={{ fontSize: 48, color: "#52c41a" }} />
            <Title level={4} style={{ marginTop: 16 }}>
              Password changed successfully!
            </Title>
            <Paragraph>
              Please go back and login with your new password.
            </Paragraph>

            <Button type="primary" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalChangePassword;
