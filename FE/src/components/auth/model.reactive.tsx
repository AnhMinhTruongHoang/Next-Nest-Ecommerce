"use client";
import { useHasMounted } from "@/utils/customHook";
import { Modal, Typography } from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  title?: string;
  content?: React.ReactNode;
  type?: "error" | "info" | "success";
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
  title = "Thông báo",
  content = <p>...</p>,
  type = "info",
}: Props) => {
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  return (
    <Modal
      title={null}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
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
    </Modal>
  );
};

export default ModelReactive;
