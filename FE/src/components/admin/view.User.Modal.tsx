"use client";

import React from "react";
import { Modal, Descriptions } from "antd";

interface ViewUserModalProps {
  isOpen: boolean;
  userData: IUser | null;
  setViewUser: (user: IUser | null) => void;
  setIsViewModalOpen: (open: boolean) => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({
  isOpen,
  setViewUser,
  setIsViewModalOpen,
  userData,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        setIsViewModalOpen(false);
        setViewUser(null);
      }}
      footer={null}
      title={
        <div
          style={{ textAlign: "center", width: "100%", marginBottom: "15px" }}
        >
          Thông tin người dùng
        </div>
      }
    >
      {userData && (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
          <Descriptions.Item label="Họ và tên">
            {userData.name}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {userData.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">{userData.role}</Descriptions.Item>
          <Descriptions.Item label="Loại tài khoản">
            {userData.accountType}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {userData.isActive ? "Hoạt động" : "Ngưng hoạt động"}
          </Descriptions.Item>
          <Descriptions.Item label="Đã xóa">
            {userData.isDeleted ? "Có" : "Không"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {userData.createdAt
              ? new Date(userData.createdAt).toLocaleString()
              : "Không có"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {userData.updatedAt
              ? new Date(userData.updatedAt).toLocaleString()
              : "Không có"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default ViewUserModal;
