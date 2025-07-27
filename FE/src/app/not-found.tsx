"use client";

import Link from "next/link";
import { Button, Result } from "antd";
import { FrownOutlined } from "@ant-design/icons";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: "24px",
      }}
    >
      <Result
        icon={<FrownOutlined style={{ fontSize: 60, color: "#ff4d4f" }} />}
        title="Page Not Found"
        subTitle="Sorry, the page you are looking for does not exist or has been moved."
        extra={
          <Button type="primary">
            <Link href="/">Return Home</Link>
          </Button>
        }
        style={{ background: "#fff", padding: 32, borderRadius: 8 }}
      />
    </div>
  );
}
