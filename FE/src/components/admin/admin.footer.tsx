"use client";
import { Layout } from "antd";

const AdminFooter = () => {
  const { Footer } = Layout;

  return (
    <Footer
      style={{
        textAlign: "center",
        background: "transparent",
        color: "#ccc",
        padding: "16px 0",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {new Date().getFullYear()} — Created by{" "}
      <span style={{ color: "#00ffe0", fontWeight: 500 }}>@M1nh</span>
    </Footer>
  );
};

export default AdminFooter;
