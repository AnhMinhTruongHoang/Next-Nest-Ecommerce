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
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
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

      const phone = String(value).trim();

      if (!/^\d{9,11}$/.test(phone)) {
        return Promise.reject(new Error("Số điện thoại chỉ gồm 9–11 chữ số."));
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

const currencyVN = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

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

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "");

  useEffect(() => {
    if (!openManageAccount || !user) return;

    form.setFieldsValue({
      _id: user._id,
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      address: user.address ?? "",
    });
  }, [openManageAccount, user, form]);

  useEffect(() => {
    if (!openManageAccount || !user?._id || !backendURL) {
      setTier(null);
      return;
    }

    const controller = new AbortController();

    const fetchTier = async () => {
      setTierLoading(true);

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : "";

        const headers: HeadersInit = {};

        if (token) {
          headers.Authorization = token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`;
        }

        const res = await fetch(`${backendURL}/memberships/user/${user._id}`, {
          signal: controller.signal,
          headers,
        });

        const json = await res.json();
        const data: TierResp = json?.data ?? json;

        setTier(data ?? null);
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          setTier(null);
        }
      } finally {
        setTierLoading(false);
      }
    };

    fetchTier();

    return () => controller.abort();
  }, [openManageAccount, user?._id, backendURL]);

  const headerTitle = useMemo(
    () => user?.name || "Cập nhật thông tin",
    [user?.name]
  );

  const tierColor = (name?: string) => {
    const value = (name || "").toLowerCase();

    if (value.includes("gold")) return "gold";
    if (value.includes("silver")) return "geekblue";
    if (value.includes("bronze")) return "volcano";

    return "processing";
  };

  const progressInfo = useMemo(() => {
    if (!tier) {
      return {
        percent: 0,
        helper: "Chưa có dữ liệu hạng hội viên",
      };
    }

    if (!tier.nextTier) {
      return {
        percent: 100,
        helper: "Bạn đang ở hạng cao nhất",
      };
    }

    const currentMin = tier.currentTier?.minSpend ?? 0;
    const nextMin = Math.max(tier.nextTier.needMore + tier.totalSpent, 0);
    const denom = Math.max(nextMin - currentMin, 1);
    const numer = Math.max(tier.totalSpent - currentMin, 0);

    const percent = Math.max(
      0,
      Math.min(100, Math.round((numer / denom) * 100))
    );

    return {
      percent,
      helper: `Cần thêm ${currencyVN(tier.nextTier.needMore)} để lên ${
        tier.nextTier.name
      }`,
    };
  }, [tier]);

  const handleClose = () => {
    setOpenManageAccount(false);
    form.resetFields();
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!backendURL) {
      notification.error({
        message: "Thiếu cấu hình API",
        description: "NEXT_PUBLIC_BACKEND_URL chưa được cấu hình.",
      });
      return;
    }

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
        const synced = await fetch(`${backendURL}/auth/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            provider: "OAUTH",
          }),
        }).then((response) => response.json());

        token = synced?.access_token || null;

        if (token) {
          localStorage.setItem("access_token", token);
        }
      }

      if (!token) {
        notification.error({
          message: "Không có quyền cập nhật",
          description: "Vui lòng đăng nhập lại để lấy quyền.",
        });
        return;
      }

      const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

      const res = await fetch(`${backendURL}/users/${payload._id}`, {
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
      });

      const data = await res.json();

      if (res.ok && (data?.data || data?._id)) {
        setUser({
          ...user!,
          name: payload.name,
          phone: payload.phone,
          address: payload.address,
        });

        message.success("Cập nhật thông tin thành công!");
        handleClose();
        return;
      }

      notification.error({
        message: "Cập nhật thất bại",
        description: data?.message || "Server trả về lỗi không xác định.",
      });
    } catch (error: any) {
      notification.error({
        message: "Lỗi kết nối",
        description: error?.message || "Không thể kết nối API.",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <Modal
        open={openManageAccount}
        onCancel={handleClose}
        footer={null}
        centered
        width={680}
        destroyOnHidden
        forceRender
        rootClassName="gz-user-info-modal-root"
        title={
          <div className="gz-user-info-title-wrap">
            <span className="gz-user-info-eyebrow">Account Management</span>
            <h3>{headerTitle}</h3>
            <p>Cập nhật thông tin cá nhân và xem quyền lợi hội viên</p>
          </div>
        }
      >
        <Card className="gz-user-tier-card" variant="borderless">
          {tierLoading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : !tier ? (
            <Typography.Text className="gz-user-tier-empty">
              Không thể tải thông tin hạng hội viên.
            </Typography.Text>
          ) : (
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={10}>
                <div className="gz-user-tier-current">
                  <div className="gz-user-tier-icon">
                    <CrownOutlined />
                  </div>

                  <div>
                    <span>Hạng hiện tại</span>

                    <div className="gz-user-tier-tag-row">
                      <Tag color={tierColor(tier.currentTier?.name)}>
                        {tier.currentTier?.name || "Chưa xếp hạng"}
                      </Tag>
                    </div>

                    <p>
                      Tổng chi tiêu:{" "}
                      <strong>{currencyVN(tier.totalSpent)}</strong>
                    </p>
                  </div>
                </div>
              </Col>

              <Col xs={24} md={14}>
                <div className="gz-user-tier-progress-head">
                  <strong>Tiến độ lên hạng</strong>

                  <Tooltip title="Tính theo tổng giá trị đơn hàng của từng hạng">
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>

                <Progress
                  percent={progressInfo.percent}
                  status={progressInfo.percent === 100 ? "success" : "active"}
                  className="gz-user-tier-progress"
                />

                <p className="gz-user-tier-helper">{progressInfo.helper}</p>
              </Col>
            </Row>
          )}
        </Card>

        <Divider className="gz-user-info-divider" />

        <Form<FieldType>
          form={form}
          name="user-info"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark="optional"
          className="gz-user-info-form"
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
                  {
                    required: true,
                    message: "Email không được để trống!",
                  },
                ]}
              >
                <Input
                  disabled
                  prefix={<MailOutlined />}
                  aria-label="Email"
                  allowClear
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
                  placeholder="Số nhà, đường, phường/xã..."
                  aria-label="Địa chỉ"
                  allowClear
                  maxLength={200}
                />
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="primary"
            loading={isSubmit}
            onClick={() => form.submit()}
            block
            className="gz-user-info-save-btn"
          >
            Lưu thay đổi
          </Button>
        </Form>
      </Modal>

      <style jsx global>{`
        .gz-user-info-modal-root .ant-modal {
          max-width: calc(100vw - 24px) !important;
        }

        .gz-user-info-modal-root .ant-modal-content {
          overflow: hidden;
          border-radius: 22px !important;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.012)
            ),
            #181a1b !important;
          border: 1px solid rgba(0, 255, 224, 0.12) !important;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55) !important;
        }

        .gz-user-info-modal-root .ant-modal-header {
          margin: 0 !important;
          padding: 20px 24px 16px !important;
          background: transparent !important;
          border-bottom: 1px solid #2a2d2e !important;
        }

        .gz-user-info-modal-root .ant-modal-title {
          width: 100%;
        }

        .gz-user-info-modal-root .ant-modal-body {
          max-height: 74vh;
          overflow-y: auto;
          padding: 18px 24px 22px !important;
        }

        .gz-user-info-modal-root .ant-modal-close {
          color: #e5e7eb !important;
        }

        .gz-user-info-modal-root .ant-modal-close:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .gz-user-info-title-wrap {
          width: 100%;
          padding: 0 34px;
          text-align: center;
        }

        .gz-user-info-eyebrow {
          display: block;
          margin-bottom: 6px;
          color: #00ffe0;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.9px;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .gz-user-info-title-wrap h3 {
          margin: 0;
          color: #ffffff;
          font-size: 22px;
          font-weight: 950;
          line-height: 1.25;
        }

        .gz-user-info-title-wrap p {
          max-width: 420px;
          margin: 7px auto 0;
          color: #a3aab5;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.45;
        }

        .gz-user-tier-card {
          border-radius: 18px !important;
          background: radial-gradient(
              circle at top left,
              rgba(0, 255, 224, 0.08),
              transparent 58%
            ),
            #111314 !important;
          border: 1px solid #2a2d2e !important;
        }

        .gz-user-tier-card .ant-card-body {
          padding: 16px !important;
          background: transparent !important;
        }

        .gz-user-tier-empty {
          color: #b8c0cc !important;
          font-weight: 700;
        }

        .gz-user-tier-current {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .gz-user-tier-icon {
          width: 44px;
          height: 44px;
          display: grid;
          flex-shrink: 0;
          place-items: center;
          color: #00ffe0;
          font-size: 20px;
          border-radius: 14px;
          background: rgba(0, 255, 224, 0.08);
          border: 1px solid rgba(0, 255, 224, 0.2);
        }

        .gz-user-tier-current span,
        .gz-user-tier-progress-head strong {
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
        }

        .gz-user-tier-tag-row {
          margin-top: 6px;
        }

        .gz-user-tier-current p,
        .gz-user-tier-helper {
          margin: 7px 0 0;
          color: #b8c0cc;
          font-size: 12px;
          font-weight: 700;
        }

        .gz-user-tier-current p strong {
          color: #ffffff;
        }

        .gz-user-tier-progress-head {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #00ffe0;
        }

        .gz-user-tier-progress .ant-progress-text {
          color: #e5e7eb !important;
          font-weight: 800 !important;
        }

        .gz-user-tier-progress .ant-progress-bg {
          background: linear-gradient(135deg, #00ffe0, #00b894) !important;
        }

        .gz-user-info-divider {
          margin: 16px 0 !important;
          border-color: #303435 !important;
        }

        .gz-user-info-form .ant-form-item {
          margin-bottom: 14px !important;
        }

        .gz-user-info-form .ant-form-item-label > label {
          color: #e5e7eb !important;
          font-size: 13px !important;
          font-weight: 900 !important;
        }

        .gz-user-info-form .ant-input-affix-wrapper:hover,
        .gz-user-info-form .ant-input-affix-wrapper-focused,
        .gz-user-info-form .ant-input:hover,
        .gz-user-info-form .ant-input:focus {
          border-color: #00ffe0 !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.1) !important;
        }

        .gz-user-info-form .ant-input-affix-wrapper-disabled,
        .gz-user-info-form .ant-input[disabled] {
          color: #9ca3af !important;
          background: #0d0f10 !important;
          border-color: #242829 !important;
        }

        .gz-user-info-form .ant-input::placeholder {
          color: #8b949e !important;
        }

        .gz-user-info-form .anticon {
          color: #00ffe0 !important;
        }

        .gz-user-info-form .ant-form-item-explain-error {
          color: #ff7875 !important;
          font-size: 12px !important;
          font-weight: 700;
        }

        .gz-user-info-save-btn {
          height: 46px !important;
          margin-top: 2px;
          border: none !important;
          border-radius: 14px !important;
          color: #061313 !important;
          font-size: 15px !important;
          font-weight: 950 !important;
          background: linear-gradient(135deg, #00ffe0, #00b894) !important;
          box-shadow: 0 12px 28px rgba(0, 255, 224, 0.16) !important;
        }

        .gz-user-info-save-btn:hover {
          color: #061313 !important;
          background: linear-gradient(135deg, #56fff0, #00d1aa) !important;
        }

        @media (max-width: 768px) {
          .gz-user-info-modal-root .ant-modal {
            top: 12px !important;
          }

          .gz-user-info-modal-root .ant-modal-header {
            padding: 18px 16px 14px !important;
          }

          .gz-user-info-modal-root .ant-modal-body {
            padding: 14px 16px 16px !important;
          }

          .gz-user-info-title-wrap {
            padding: 0 30px;
          }

          .gz-user-info-title-wrap h3 {
            font-size: 20px;
          }

          .gz-user-info-title-wrap p {
            max-width: 280px;
            font-size: 12px;
          }

          .gz-user-tier-current {
            justify-content: center;
            text-align: center;
          }

          .gz-user-tier-progress-head {
            justify-content: center;
          }

          .gz-user-tier-helper {
            text-align: center;
          }
        }

        @media (max-width: 420px) {
          .gz-user-info-title-wrap {
            padding: 0 26px;
          }

          .gz-user-info-title-wrap h3 {
            font-size: 18px;
          }

          .gz-user-info-title-wrap p {
            max-width: 230px;
          }

          .gz-user-info-modal-root .ant-modal-body {
            padding: 12px !important;
          }

          .gz-user-tier-card .ant-card-body {
            padding: 14px !important;
          }
        }
      `}</style>
    </>
  );
};

export default UserInfoModal;
