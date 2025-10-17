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
          User Details
        </div>
      }
    >
      {userData && (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
          <Descriptions.Item label="Name">{userData.name}</Descriptions.Item>
          <Descriptions.Item label="Phone">{userData.phone}</Descriptions.Item>
          <Descriptions.Item label="Role">{userData.role}</Descriptions.Item>
          <Descriptions.Item label="Account Type">
            {userData.accountType}
          </Descriptions.Item>
          <Descriptions.Item label="Active">
            {userData.isActive ? "True" : "False"}
          </Descriptions.Item>
          <Descriptions.Item label="Deleted">
            {userData.isDeleted ? "True" : "False"}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {userData.createdAt
              ? new Date(userData.createdAt).toLocaleString()
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {userData.updatedAt
              ? new Date(userData.updatedAt).toLocaleString()
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default ViewUserModal;
