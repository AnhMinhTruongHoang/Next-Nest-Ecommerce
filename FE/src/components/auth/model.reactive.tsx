"use client";
import { useHasMounted } from "@/utils/customHook";
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Steps,
  Typography,
  notification,
  theme,
} from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";

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
    <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: 32 }} />
  ),
  success: <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 32 }} />,
  info: (
    <ExclamationCircleOutlined style={{ color: "#1890ff", fontSize: 32 }} />
  ),
};

const ModelReactive = ({
  isModalOpen,
  setIsModalOpen,
  userEmail,
  title = "Notification",
  content = <p>...</p>,
  type = "info",
  showSteps = false,
}: Props) => {
  const hasMounted = useHasMounted();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [userId, setUserId] = useState();

  /// set form value
  useEffect(() => {
    if (userEmail) {
      form.setFieldValue("email", userEmail);
    }
  }, [userEmail]);

  ///

  if (!hasMounted) return null;

  ///step 1
  const handleResend1 = async (values: any) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
      method: "POST",
      body: {
        email,
      },
    });
    /// nest step
    if (res?.data) {
      setUserId(res?.data?._id);
      setCurrentStep(1); // go to Verification
    } else {
      notification.error({
        message: "Failed to call APIs ...",
        description: res?.message,
      });
    }
  };
  const handleResend2 = async (values: any) => {
    const { code } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      method: "POST",
      body: {
        _id: userId,
        code,
      },
    });

    /// nest step
    if (res?.data) {
      setUserId(res?.data?._id);
      setCurrentStep(2); // go to complete
    } else {
      notification.error({
        message: "Failed to call APIs ...",
        description: res?.message,
      });
    }
  };

  return (
    <Modal
      title={"Active account"}
      open={isModalOpen}
      onCancel={() => {
        setCurrentStep(0);
        setIsModalOpen(false);
      }}
      footer={null}
      centered
      bodyStyle={{
        textAlign: "center",
        padding: 32,
        backgroundColor: "#1f1f1f",
        borderRadius: 8,
      }}
    >
      <div style={{ marginBottom: 16 }}>{iconMap[type]}</div>

      <Typography.Title level={4} style={{ color: "#fff" }}>
        {title}
      </Typography.Title>

      <Typography.Paragraph style={{ color: "#d9d9d9" }}>
        {content}
      </Typography.Paragraph>

      {showSteps && (
        <>
          <Steps
            size="small"
            current={currentStep}
            style={{ marginBottom: 20 }}
            items={[
              {
                title: "Email",
                icon: <LoadingOutlined />,
              },
              {
                title: "Verification",
                icon: <MailOutlined />,
              },
              {
                title: "Done",
                icon: <CheckCircleOutlined />,
              },
            ]}
          />
          <Divider>
            <i>Account is InActive?</i>
          </Divider>
          {/* Step content */}
          {currentStep === 0 && (
            <Form
              name="verify1"
              layout="vertical"
              onFinish={handleResend1}
              style={{ marginTop: 20 }}
              form={form}
            >
              <Form.Item
                name="email"
                label=""
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input
                  placeholder="Enter your email"
                  disabled
                  value={userEmail}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Resend Verification Email
                </Button>
              </Form.Item>
            </Form>
          )}

          {currentStep === 1 && (
            <Form
              name="verify2"
              layout="vertical"
              autoComplete="off"
              onFinish={handleResend2}
              style={{ marginTop: 20 }}
            >
              <Form.Item
                name="code"
                label="Code"
                rules={[{ required: true, message: "Please enter your code" }]}
              >
                <Input placeholder="Enter your verify code" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Active
                </Button>
              </Form.Item>
            </Form>
          )}
          {currentStep === 2 && (
            <div>
              <div style={{ margin: "20px 0" }}>
                <p>Your account is active !</p>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default ModelReactive;
