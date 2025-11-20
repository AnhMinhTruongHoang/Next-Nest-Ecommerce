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

  // reset modal
  const resetModal = () => {
    setIsModalOpen(false);
    setCurrent(0);
    setUserEmail("");
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div
          style={{ textAlign: "center", width: "100%", marginBottom: "15px" }}
        >
          <b>Đặt lại mật khẩu</b>
        </div>
      }
      onOk={resetModal}
      open={isModalOpen}
      onCancel={resetModal}
      footer={null}
      maskClosable={false}
      style={{ top: 40 }}
    >
      <Steps
        current={current}
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

      <div style={{ marginTop: 24 }}>
        {current === 0 && (
          <>
            <Title level={5}>Bước 1: Nhập email của bạn</Title>
            <Paragraph>
              Vui lòng nhập địa chỉ email đã đăng ký để nhận mã xác minh đặt lại
              mật khẩu.
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
                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
              >
                <Input placeholder="nhapemail@domain.com" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Gửi mã xác minh
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {current === 1 && (
          <>
            <Title level={5}>Bước 2: Nhập mã xác minh & mật khẩu mới</Title>
            <Paragraph>
              Chúng tôi đã gửi mã xác minh đến email của bạn. Vui lòng nhập mã
              và mật khẩu mới.
            </Paragraph>

            <Form layout="vertical" onFinish={onFinishStep1}>
              <Form.Item
                label="Mã xác minh"
                name="code"
                rules={[
                  { required: true, message: "Vui lòng nhập mã xác minh!" },
                ]}
              >
                <Input placeholder="Nhập mã" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Đặt lại mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {current === 2 && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <CheckCircleOutlined style={{ fontSize: 48, color: "#52c41a" }} />
            <Title level={4} style={{ marginTop: 16 }}>
              Đổi mật khẩu thành công!
            </Title>
            <Paragraph>Bạn có thể đăng nhập bằng mật khẩu mới.</Paragraph>

            <Button type="primary" onClick={() => setIsModalOpen(false)}>
              Đóng
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalChangePassword;
