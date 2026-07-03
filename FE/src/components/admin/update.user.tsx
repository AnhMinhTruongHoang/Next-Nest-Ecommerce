"use client";

import React, { useEffect, useState } from "react";
import { Modal, Input, Select, Form, InputNumber, App } from "antd";

const { Option } = Select;

interface IProps {
  access_token: string;
  getData: any;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: null | IUser;
  setDataUpdate: any;
}

const UpdateUserModal = (props: IProps) => {
  const {
    access_token,
    getData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    dataUpdate,
    setDataUpdate,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { notification } = App.useApp();

  useEffect(() => {
    if (!isUpdateModalOpen || !dataUpdate) return;

    form.setFieldsValue({
      name: dataUpdate.name || "",
      email: dataUpdate.email || "",
      age: dataUpdate.age ?? undefined,
      address: dataUpdate.address || "",
      gender: dataUpdate.gender || undefined,
    });
  }, [isUpdateModalOpen, dataUpdate, form]);

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setDataUpdate(null);
  };
  const onFinish = async (values: any) => {
    if (!dataUpdate) return;

    const { name, email, age, gender, address } = values;

    const data = {
      _id: dataUpdate._id,
      name,
      email,
      age,
      gender,
      role: dataUpdate.role,
      address,
    };

    setIsSubmit(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${data._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: access_token.startsWith("Bearer ")
              ? access_token
              : `Bearer ${access_token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (res.ok && result?.data) {
        notification.success({
          message: "Cập nhật người dùng thành công!",
        });

        await getData();
        handleCloseUpdateModal();
      } else {
        notification.error({
          message: "Cập nhật thất bại!",
          description: result?.message || "Lỗi không xác định",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "Lỗi kết nối máy chủ!",
        description: err?.message || "Không thể kết nối API",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <Modal
        open={isUpdateModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCloseUpdateModal}
        maskClosable={false}
        confirmLoading={isSubmit}
        okText="Cập nhật"
        cancelText="Hủy"
        centered
        width={560}
        destroyOnHidden
        forceRender
        afterOpenChange={(open) => {
          if (open && dataUpdate) {
            form.setFieldsValue({
              name: dataUpdate.name || "",
              email: dataUpdate.email || "",
              age: dataUpdate.age ?? undefined,
              address: dataUpdate.address || "",
              gender: dataUpdate.gender || undefined,
            });
          }

          if (!open) {
            form.resetFields();
          }
        }}
        rootClassName="gz-update-user-modal-root"
        okButtonProps={{
          className: "gz-update-user-ok-btn",
        }}
        cancelButtonProps={{
          className: "gz-update-user-cancel-btn",
        }}
        title={
          <div className="gz-update-user-title-wrap">
            <span className="gz-update-user-eyebrow">User Management</span>
            <h3>Cập nhật người dùng</h3>
            <p>{dataUpdate?.email || "Chỉnh sửa thông tin tài khoản"}</p>
          </div>
        }
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          preserve={false}
          className="gz-update-user-form"
        >
          <div className="gz-update-user-section">
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

            <Form.Item label="Mật khẩu" name="password">
              <Input.Password
                disabled
                placeholder="Không thể thay đổi mật khẩu tại đây"
              />
            </Form.Item>

            <div className="gz-update-user-grid">
              <Form.Item
                label="Tuổi"
                name="age"
                rules={[{ required: true, message: "Vui lòng nhập tuổi!" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="Nhập tuổi"
                />
              </Form.Item>

              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select
                  placeholder="Chọn giới tính"
                  allowClear
                  classNames={{
                    popup: {
                      root: "gz-update-user-select-dropdown",
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
        .gz-update-user-modal-root .ant-modal {
          max-width: calc(100vw - 24px) !important;
        }

        .gz-update-user-modal-root .ant-modal-content {
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

        .gz-update-user-modal-root .ant-modal-header {
          padding: 20px 24px 16px !important;
          margin: 0 !important;
          background: transparent !important;
          border-bottom: 1px solid #2a2d2e !important;
        }

        .gz-update-user-modal-root .ant-modal-title {
          width: 100%;
        }

        .gz-update-user-modal-root .ant-modal-body {
          padding: 18px 24px 10px !important;
          max-height: 70vh;
          overflow-y: auto;
        }

        .gz-update-user-modal-root .ant-modal-footer {
          padding: 14px 24px 18px !important;
          margin: 0 !important;
          border-top: 1px solid #2a2d2e !important;
        }

        .gz-update-user-modal-root .ant-modal-close {
          color: #e5e7eb !important;
        }

        .gz-update-user-modal-root .ant-modal-close:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .gz-update-user-title-wrap {
          width: 100%;
          padding: 0 34px;
          text-align: center;
        }

        .gz-update-user-eyebrow {
          display: block;
          margin: 0 0 6px;
          color: #00ffe0;
          font-size: 10px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: 0.9px;
          text-transform: uppercase;
          text-align: center;
        }

        .gz-update-user-title-wrap h3 {
          margin: 0;
          color: #ffffff;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.25;
          text-align: center;
        }

        .gz-update-user-title-wrap p {
          margin: 7px auto 0;
          max-width: 420px;
          color: #a3aab5;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.4;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .gz-update-user-section {
          padding: 14px;
          background: #111314;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
        }

        .gz-update-user-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .gz-update-user-form .ant-form-item {
          margin-bottom: 14px !important;
        }

        .gz-update-user-form .ant-form-item:last-child {
          margin-bottom: 0 !important;
        }

        .gz-update-user-form .ant-form-item-label {
          padding-bottom: 6px !important;
        }

        .gz-update-user-form .ant-form-item-label > label {
          color: #e5e7eb !important;
          font-size: 13px !important;
          font-weight: 800 !important;
        }

        .gz-update-user-form .ant-form-item-required::before {
          color: #ff4d4f !important;
        }

        .gz-update-user-form .ant-form-item-explain-error {
          color: #ff7875 !important;
          font-size: 12px !important;
          margin-top: 4px !important;
        }

        .gz-update-user-modal-root .ant-input,
        .gz-update-user-modal-root textarea.ant-input,
        .gz-update-user-modal-root .ant-input-password,
        .gz-update-user-modal-root .ant-input-number,
        .gz-update-user-modal-root .ant-select-selector {
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

        .gz-update-user-modal-root .ant-input:hover,
        .gz-update-user-modal-root .ant-input:focus,
        .gz-update-user-modal-root textarea.ant-input:hover,
        .gz-update-user-modal-root textarea.ant-input:focus,
        .gz-update-user-modal-root .ant-input-password:hover,
        .gz-update-user-modal-root .ant-input-password-focused,
        .gz-update-user-modal-root .ant-input-number:hover,
        .gz-update-user-modal-root .ant-input-number-focused,
        .gz-update-user-modal-root .ant-select:hover .ant-select-selector,
        .gz-update-user-modal-root .ant-select-focused .ant-select-selector {
          background: #2a2f31 !important;
          border-color: rgba(0, 255, 224, 0.65) !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.09),
            inset 0 1px 0 rgba(255, 255, 255, 0.045) !important;
        }

        .gz-update-user-modal-root .ant-input::placeholder,
        .gz-update-user-modal-root textarea.ant-input::placeholder,
        .gz-update-user-modal-root .ant-input-password input::placeholder,
        .gz-update-user-modal-root .ant-select-selection-placeholder,
        .gz-update-user-modal-root .ant-input-number-input::placeholder {
          color: #9ca3af !important;
          opacity: 1 !important;
          font-weight: 500 !important;
        }

        .gz-update-user-modal-root .ant-input-number-input,
        .gz-update-user-modal-root .ant-select-selection-item,
        .gz-update-user-modal-root .ant-input-password input {
          color: #f9fafb !important;
        }

        .gz-update-user-modal-root .ant-input[disabled],
        .gz-update-user-modal-root .ant-input-password-disabled {
          background: #1b1f20 !important;
          border-color: #303435 !important;
          color: #8b949e !important;
          cursor: not-allowed;
          opacity: 1 !important;
        }

        .gz-update-user-modal-root .ant-input-password-icon,
        .gz-update-user-modal-root .ant-select-arrow,
        .gz-update-user-modal-root .ant-input-number-handler-up-inner,
        .gz-update-user-modal-root .ant-input-number-handler-down-inner {
          color: #9ca3af !important;
        }

        .gz-update-user-modal-root .ant-input-number-handler-wrap {
          background: #2a2f31 !important;
          border-start-end-radius: 12px !important;
          border-end-end-radius: 12px !important;
        }

        .gz-update-user-modal-root .ant-input-number-handler {
          border-color: #3a4042 !important;
        }

        .gz-update-user-select-dropdown {
          background: #181a1b !important;
          border: 1px solid #2a2d2e !important;
          border-radius: 12px !important;
        }

        .gz-update-user-select-dropdown .ant-select-item {
          color: #e5e7eb !important;
        }

        .gz-update-user-select-dropdown .ant-select-item-option-active,
        .gz-update-user-select-dropdown .ant-select-item-option-selected {
          background: rgba(0, 255, 224, 0.1) !important;
          color: #00ffe0 !important;
        }

        .gz-update-user-ok-btn {
          height: 40px !important;
          border: none !important;
          border-radius: 12px !important;
          color: #ffffff !important;
          font-weight: 900 !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          box-shadow: 0 10px 24px rgba(255, 77, 0, 0.24) !important;
        }

        .gz-update-user-ok-btn:hover {
          background: linear-gradient(135deg, #ff6a00, #ff9a00) !important;
          color: #ffffff !important;
        }

        .gz-update-user-cancel-btn {
          height: 40px !important;
          border-radius: 12px !important;
          background: #111314 !important;
          border-color: #303435 !important;
          color: #e5e7eb !important;
          font-weight: 800 !important;
        }

        .gz-update-user-cancel-btn:hover {
          border-color: #00ffe0 !important;
          color: #00ffe0 !important;
        }

        @media (max-width: 768px) {
          .gz-update-user-modal-root .ant-modal {
            top: 12px !important;
            max-width: calc(100vw - 20px) !important;
          }

          .gz-update-user-modal-root .ant-modal-header {
            padding: 18px 16px 14px !important;
          }

          .gz-update-user-modal-root .ant-modal-body {
            padding: 14px 16px 8px !important;
            max-height: 72vh;
          }

          .gz-update-user-modal-root .ant-modal-footer {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            padding: 12px 16px 16px !important;
          }

          .gz-update-user-modal-root .ant-modal-footer .ant-btn {
            width: 100%;
            margin-inline-start: 0 !important;
          }

          .gz-update-user-title-wrap {
            padding: 0 30px;
          }

          .gz-update-user-title-wrap h3 {
            font-size: 20px;
          }

          .gz-update-user-title-wrap p {
            max-width: 260px;
            font-size: 12px;
          }

          .gz-update-user-section {
            padding: 12px;
            border-radius: 14px;
          }

          .gz-update-user-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

        @media (max-width: 420px) {
          .gz-update-user-title-wrap {
            padding: 0 26px;
          }

          .gz-update-user-eyebrow {
            font-size: 10px;
          }

          .gz-update-user-title-wrap h3 {
            font-size: 18px;
          }

          .gz-update-user-title-wrap p {
            max-width: 210px;
            font-size: 12px;
          }

          .gz-update-user-modal-root .ant-modal-footer {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default UpdateUserModal;
