"use client";

import React, { useState } from "react";
import { Form, Input, Modal, Select, InputNumber, App } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

const { Option } = Select;

interface IProps {
  access_token: string;
  getData: () => Promise<void>;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

const CreateUserModal = (props: IProps) => {
  const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } =
    props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { notification } = App.useApp();

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const { name, email, password, age, gender, role, address } = values;

      const data = { name, email, password, age, gender, role, address };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token?.startsWith("Bearer ")
            ? access_token
            : `Bearer ${access_token}`,
        },
        body: JSON.stringify(data),
      });

      const d = await res.json();

      if (res.ok && d.data) {
        await getData();

        notification.success({
          message: "Tạo mới người dùng thành công.",
        });

        handleCloseCreateModal();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: d?.message
            ? JSON.stringify(d.message)
            : "Không thể tạo người dùng",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: error?.message || "Không thể kết nối tới máy chủ.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={isCreateModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCloseCreateModal}
        maskClosable={false}
        confirmLoading={loading}
        okText="Tạo mới"
        cancelText="Hủy"
        centered
        width={560}
        destroyOnHidden
        forceRender
        rootClassName="gz-create-user-modal-root"
        okButtonProps={{
          className: "gz-create-user-ok-btn",
        }}
        cancelButtonProps={{
          className: "gz-create-user-cancel-btn",
        }}
        title={
          <div>
            <div className="gz-create-user-title-content">
              <span className="gz-create-user-eyebrow">User Management</span>
              <h3 style={{ color: "white" }}>Thêm người dùng mới</h3>
            </div>
          </div>
        }
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          preserve={false}
          className="gz-create-user-form"
        >
          <div className="gz-create-user-section">
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input type="email" placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <div className="gz-create-user-grid">
              <Form.Item
                label="Tuổi"
                name="age"
                rules={[{ required: true, message: "Vui lòng nhập tuổi!" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  controls={false}
                  placeholder="Nhập tuổi"
                />
              </Form.Item>

              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select
                  placeholder="Chọn giới tính"
                  allowClear
                  classNames={{
                    popup: {
                      root: "gz-create-user-select-dropdown",
                    },
                  }}
                >
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
                  <Option value="OTHER">Khác</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Select
                placeholder="Chọn vai trò"
                allowClear
                classNames={{
                  popup: {
                    root: "gz-create-user-select-dropdown",
                  },
                }}
              >
                <Option value="USER">Người dùng</Option>
                <Option value="ADMIN">Quản trị viên</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <style jsx global>{`
        .gz-create-user-modal-root .ant-modal {
          max-width: calc(100vw - 24px) !important;
        }

        .gz-create-user-modal-root .ant-modal-content {
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.012)
            ),
            #181a1b !important;
          border: 1px solid rgba(0, 255, 224, 0.12) !important;
          border-radius: 20px !important;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55) !important;
          overflow: hidden;
        }

        .gz-create-user-modal-root .ant-modal-header {
          padding: 20px 24px 16px !important;
          margin: 0 !important;
          background: transparent !important;
          border-bottom: 1px solid #2a2d2e !important;
        }

        .gz-create-user-modal-root .ant-modal-body {
          padding: 18px 24px 10px !important;
          max-height: 70vh;
          overflow-y: auto;
        }

        .gz-create-user-modal-root .ant-modal-footer {
          padding: 14px 24px 18px !important;
          margin: 0 !important;
          border-top: 1px solid #2a2d2e !important;
        }

        .gz-create-user-modal-root .ant-modal-close {
          color: #e5e7eb !important;
        }

        .gz-create-user-modal-root .ant-modal-close:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .gz-create-user-title-wrap {
          display: flex;
          align-items: center;
          justify-content: center; /* căn giữa toàn bộ cụm */
          gap: 12px;
          padding-right: 28px;
        }

        .gz-create-user-eyebrow {
          display: inline-block;
          margin-bottom: 4px;
          color: #00ffe0;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          text-align: center;
        }

        .gz-create-user-title-content {
          display: flex;
          flex-direction: column; /* xếp dọc eyebrow, h3, p */
          align-items: center; /* căn giữa theo chiều ngang */
          text-align: center; /* căn giữa chữ */
        }

        .gz-create-user-title-content p {
          margin: 5px 0 0;
          max-width: 380px;
          color: #a3aab5;
          font-size: 13px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center; /* căn giữa mô tả */
        }

        .gz-create-user-section {
          padding: 14px;
          background: #111314;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
        }

        .gz-create-user-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .gz-create-user-form .ant-form-item {
          margin-bottom: 14px !important;
        }

        .gz-create-user-form .ant-form-item:last-child {
          margin-bottom: 0 !important;
        }

        .gz-create-user-form .ant-form-item-label > label {
          color: #e5e7eb !important;
          font-weight: 800 !important;
        }

        .gz-create-user-form .ant-form-item-explain-error {
          color: #ff7875 !important;
        }

        .gz-create-user-modal-root .ant-input,
        .gz-create-user-modal-root textarea.ant-input,
        .gz-create-user-modal-root .ant-input-password,
        .gz-create-user-modal-root .ant-input-number,
        .gz-create-user-modal-root .ant-select-selector {
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.025)
            ),
            #242829 !important;
          border: 1px solid #3a4042 !important;
          color: #f3f4f6 !important;
          border-radius: 12px !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035) !important;
        }

        .gz-create-user-modal-root .ant-input:hover,
        .gz-create-user-modal-root .ant-input:focus,
        .gz-create-user-modal-root textarea.ant-input:hover,
        .gz-create-user-modal-root textarea.ant-input:focus,
        .gz-create-user-modal-root .ant-input-password:hover,
        .gz-create-user-modal-root .ant-input-password-focused,
        .gz-create-user-modal-root .ant-input-number:hover,
        .gz-create-user-modal-root .ant-input-number-focused,
        .gz-create-user-modal-root .ant-select:hover .ant-select-selector,
        .gz-create-user-modal-root .ant-select-focused .ant-select-selector {
          background: #2a2f31 !important;
          border-color: rgba(0, 255, 224, 0.65) !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.09),
            inset 0 1px 0 rgba(255, 255, 255, 0.045) !important;
        }

        .gz-create-user-modal-root .ant-input::placeholder,
        .gz-create-user-modal-root textarea.ant-input::placeholder,
        .gz-create-user-modal-root .ant-input-password input::placeholder,
        .gz-create-user-modal-root .ant-select-selection-placeholder,
        .gz-create-user-modal-root .ant-input-number-input::placeholder {
          color: #9ca3af !important;
          opacity: 1 !important;
          font-weight: 500 !important;
        }

        .gz-create-user-modal-root .ant-input-number-input,
        .gz-create-user-modal-root .ant-select-selection-item,
        .gz-create-user-modal-root .ant-input-password input {
          color: #f9fafb !important;
        }

        .gz-create-user-modal-root .ant-input-password-icon,
        .gz-create-user-modal-root .ant-select-arrow,
        .gz-create-user-modal-root .ant-input-number-handler-up-inner,
        .gz-create-user-modal-root .ant-input-number-handler-down-inner {
          color: #9ca3af !important;
        }

        .gz-create-user-modal-root .ant-input-number-handler-wrap {
          background: #2a2f31 !important;
          border-start-end-radius: 12px !important;
          border-end-end-radius: 12px !important;
        }

        .gz-create-user-modal-root .ant-input-number-handler {
          border-color: #3a4042 !important;
        }

        .gz-create-user-select-dropdown {
          background: #181a1b !important;
          border: 1px solid #2a2d2e !important;
          border-radius: 12px !important;
        }

        .gz-create-user-select-dropdown .ant-select-item {
          color: #e5e7eb !important;
        }

        .gz-create-user-select-dropdown .ant-select-item-option-active,
        .gz-create-user-select-dropdown .ant-select-item-option-selected {
          background: rgba(0, 255, 224, 0.1) !important;
          color: #00ffe0 !important;
        }

        .gz-create-user-ok-btn {
          height: 40px !important;
          border: none !important;
          border-radius: 12px !important;
          color: #ffffff !important;
          font-weight: 900 !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          box-shadow: 0 10px 24px rgba(255, 77, 0, 0.24) !important;
        }

        .gz-create-user-ok-btn:hover {
          background: linear-gradient(135deg, #ff6a00, #ff9a00) !important;
          color: #ffffff !important;
        }

        .gz-create-user-cancel-btn {
          height: 40px !important;
          border-radius: 12px !important;
          background: #111314 !important;
          border-color: #303435 !important;
          color: #e5e7eb !important;
          font-weight: 800 !important;
        }

        .gz-create-user-cancel-btn:hover {
          border-color: #00ffe0 !important;
          color: #00ffe0 !important;
        }
        @media (max-width: 768px) {
          .gz-create-user-modal-root .ant-modal-header {
            padding: 18px 16px 14px !important;
          }

          .gz-create-user-modal-root .ant-modal-body {
            padding: 14px 16px 8px !important;
            max-height: 72vh;
          }

          .gz-create-user-modal-root .ant-modal-footer {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            padding: 12px 16px 16px !important;
          }

          .gz-create-user-modal-root .ant-modal-footer .ant-btn {
            width: 100%;
            margin-inline-start: 0 !important;
          }

          .gz-create-user-title-wrap {
            align-items: flex-start;
            justify-content: center; /* vẫn giữ căn giữa */
            gap: 10px;
            padding-right: 24px;
          }

          .gz-create-user-title-icon {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            font-size: 17px;
          }

          .gz-create-user-title-content h3 {
            font-size: 19px;
          }

          .gz-create-user-title-content p {
            max-width: 210px;
            font-size: 12px;
            text-align: center;
          }

          .gz-create-user-section {
            padding: 12px;
            border-radius: 14px;
          }

          .gz-create-user-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

        @media (max-width: 420px) {
          .gz-create-user-title-content h3 {
            font-size: 18px;
          }

          .gz-create-user-eyebrow {
            font-size: 10px;
          }

          .gz-create-user-modal-root .ant-modal-footer {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default CreateUserModal;
