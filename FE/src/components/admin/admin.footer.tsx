"use client";
import { Layout } from "antd";

const AdminFooter = () => {
  const { Footer } = Layout;

  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        Antd ©{new Date().getFullYear()} Created by @M1nh
      </Footer>
    </>
  );
};

export default AdminFooter;
