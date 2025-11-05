"use client";

import { useCurrentApp } from "@/components/context/app.context";
import {
  App,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Typography,
  Divider,
  Tag,
  Progress,
  Tooltip,
  Card,
  Skeleton,
  InputNumber,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  SaveOutlined,
  CrownOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import type { FormProps } from "antd";

type FieldType = {
  _id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
};

type TierResp = {
  totalSpent: number;
  currentTier: null | {
    _id?: string;
    name: string;
    discountRate?: number;
    pointMultiplier?: number;
    freeShipping?: boolean;
    minSpend?: number;
    maxSpend?: number | null;
  };
  nextTier: null | {
    name: string;
    needMore: number;
  };
};

interface IUserInfoModalProps {
  openManageAccount: boolean;
  setOpenManageAccount: (open: boolean) => void;
}

const phoneRule = [
  { required: true, message: "Số điện thoại không được để trống!" },
  {
    validator(_: any, value?: string) {
      if (!value) return Promise.resolve();
      const v = String(value).trim();
      if (!/^\d{9,11}$/.test(v)) {
        return Promise.reject(
          new Error("Số điện thoại chỉ gồm 9–11 chữ số (không ký tự khác).")
        );
      }
      return Promise.resolve();
    },
  },
];

const nameRule = [
  { required: true, message: "Tên hiển thị không được để trống!" },
  { max: 60, message: "Tên tối đa 60 ký tự." },
];

const addressRule = [
  { required: true, message: "Địa chỉ không được để trống!" },
  { max: 200, message: "Địa chỉ tối đa 200 ký tự." },
];

const currencyVN = (n?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const MEMBERSHIP_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/memberships`;

const UserInfoModal: React.FC<IUserInfoModalProps> = ({
  openManageAccount,
  setOpenManageAccount,
}) => {
  const [form] = Form.useForm<FieldType>();
  const { user, setUser } = useCurrentApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [tierLoading, setTierLoading] = useState(false);
  const [tier, setTier] = useState<TierResp | null>(null);
  const { message, notification } = App.useApp();

  useEffect(() => {
    if (openManageAccount && user) {
      form.setFieldsValue({
        _id: user._id,
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
      });
    }
  }, [openManageAccount, user, form]);

  /// membership
  useEffect(() => {
    const fetchTier = async () => {
      if (!openManageAccount || !user?._id) {
        setTier(null);
        return;
      }
      setTierLoading(true);
      try {
        const res = await fetch(`${MEMBERSHIP_API}/user/${user._id}`);
        const json = await res.json();
        const data: TierResp = json?.data ?? json;
        setTier(data ?? null);
      } catch {
        setTier(null);
      } finally {
        setTierLoading(false);
      }
    };
    fetchTier();
  }, [openManageAccount, user?._id]);

  const headerTitle = useMemo(
    () => (user?.name ? ` ${user.name}` : "Cập nhật thông tin"),
    [user?.name]
  );

  //  tier color
  const tierColor = (name?: string) => {
    const n = (name || "").toLowerCase();
    if (n.includes("gold")) return "gold";
    if (n.includes("silver")) return "geekblue";
    if (n.includes("bronze")) return "volcano";
    return "processing";
  };

  const progressInfo = useMemo(() => {
    if (!tier) return { percent: 0, helper: "" };
    if (!tier.nextTier) {
      return { percent: 100, helper: "Bạn đang ở hạng cao nhất" };
    }
    // Ước luong % tier
    const currentMin = tier.currentTier?.minSpend ?? 0;
    const nextMin = Math.max(tier.nextTier.needMore + tier.totalSpent, 0);
    const denom = Math.max(nextMin - currentMin, 1);
    const numer = Math.max(tier.totalSpent - currentMin, 0);
    const percent = Math.max(
      0,
      Math.min(100, Math.round((numer / denom) * 100))
    );
    const helper = `Cần thêm ${currencyVN(tier.nextTier.needMore)} để lên ${
      tier.nextTier.name
    }`;
    return { percent, helper };
  }, [tier]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const payload = {
      _id: values._id,
      name: values.name.trim(),
      phone: String(values.phone || "").trim(),
      address: values.address.trim(),
    };

    setIsSubmit(true);
    try {
      let token = localStorage.getItem("access_token");

      if (!token && user?.email) {
        const synced = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/sync`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              provider: "OAUTH",
            }),
          }
        ).then((r) => r.json());
        token = synced?.access_token || null;
        if (token) localStorage.setItem("access_token", token);
      }

      if (!token) {
        notification.error({
          message: "Không có quyền cập nhật",
          description: "Vui lòng đăng nhập lại để lấy quyền (token).",
        });
        return;
      }

      const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${payload._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: bearer,
          },
          body: JSON.stringify({
            name: payload.name,
            phone: payload.phone,
            address: payload.address,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && (data?.data || data?._id)) {
        setUser({
          ...user!,
          name: payload.name,
          phone: payload.phone,
          address: payload.address,
        });
        message.success("🎉 Cập nhật thông tin thành công!");
        setOpenManageAccount(false);
        form.resetFields();
      } else {
        notification.error({
          message: "Cập nhật thất bại",
          description: data?.message || "Server trả về lỗi không xác định.",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "Lỗi kết nối",
        description: err?.message || "Không thể kết nối API.",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      open={openManageAccount}
      onCancel={() => {
        setOpenManageAccount(false);
        form.resetFields();
      }}
      footer={null}
      centered
      width={640}
      styles={{
        header: { borderBottom: "none" },
        body: { paddingTop: 8 },
      }}
      title={
        <div style={{ textAlign: "center" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {headerTitle}
          </Typography.Title>
          <Typography.Text type="secondary">
            Cập nhật thông tin & xem quyền lợi hội viên
          </Typography.Text>
        </div>
      }
    >
      {/* Membership Card */}
      <Card size="small" style={{ marginBottom: 14, borderRadius: 10 }}>
        {tierLoading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : !tier ? (
          <Typography.Text type="secondary">
            Không thể tải thông tin hạng hội viên.
          </Typography.Text>
        ) : (
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} md={10}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CrownOutlined />
                <Typography.Text strong>Hạng hiện tại:</Typography.Text>
                <Tag
                  color={tierColor(tier.currentTier?.name)}
                  style={{ marginLeft: 4 }}
                >
                  {tier.currentTier?.name || "Chưa xếp hạng"}
                </Tag>
              </div>
              <div style={{ marginTop: 6 }}>
                <Typography.Text type="secondary">
                  Tổng chi tiêu: <strong>{currencyVN(tier.totalSpent)}</strong>
                </Typography.Text>
              </div>
            </Col>
            <Col xs={24} md={14}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Typography.Text strong>Tiến độ lên hạng</Typography.Text>
                <Tooltip title="Tính theo minSpend/maxSpend của từng hạng">
                  <InfoCircleOutlined />
                </Tooltip>
              </div>
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={progressInfo.percent}
                  status={progressInfo.percent === 100 ? "success" : "active"}
                />
                <Typography.Text type="secondary">
                  {progressInfo.helper}
                </Typography.Text>
              </div>
            </Col>
          </Row>
        )}
      </Card>

      <Divider style={{ margin: "12px 0 16px" }} />

      <Form<FieldType>
        form={form}
        name="user-info"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        requiredMark="optional"
      >
        <Form.Item name="_id" hidden>
          <Input hidden />
        </Form.Item>

        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email không được để trống!" },
              ]}
            >
              <Input
                disabled
                prefix={<MailOutlined />}
                aria-label="Email"
                allowClear
                style={{ height: 42, borderRadius: 10, background: "#f6f7f9" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Tên hiển thị"
              name="name"
              rules={nameRule}
              hasFeedback
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập tên hiển thị"
                aria-label="Tên hiển thị"
                allowClear
                maxLength={60}
                style={{ height: 42, borderRadius: 10 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Số điện thoại"
              name="phone"
              rules={phoneRule}
              hasFeedback
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Ví dụ: 0912345678"
                aria-label="Số điện thoại"
                allowClear
                maxLength={11}
                style={{ height: 42, borderRadius: 10 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Địa chỉ"
              name="address"
              rules={addressRule}
              hasFeedback
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                aria-label="Địa chỉ"
                allowClear
                maxLength={200}
                style={{ height: 42, borderRadius: 10 }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={isSubmit}
          onClick={() => form.submit()}
          block
          style={{
            height: 46,
            borderRadius: 10,
            fontWeight: 600,
            letterSpacing: 0.2,
          }}
        >
          Lưu thay đổi
        </Button>
      </Form>
    </Modal>
  );
};

export default UserInfoModal;
