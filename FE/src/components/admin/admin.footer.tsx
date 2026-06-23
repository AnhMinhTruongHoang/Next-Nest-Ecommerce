"use client";

import { Layout } from "antd";

const { Footer } = Layout;

const AdminFooter = () => {
  return (
    <Footer className="gz-admin-footer">
      {new Date().getFullYear()} — Created by{" "}
      <span className="gz-admin-footer-author">@M1nh</span>
      <style jsx global>{`
        .gz-admin-footer {
          text-align: center;
          background: transparent !important;
          color: #8b949e !important;
          padding: 14px 12px !important;
          border: none !important;
          box-shadow: none !important;
        }

        .gz-admin-footer-author {
          color: #00ffe0;
          font-weight: 800;
        }
      `}</style>
    </Footer>
  );
};

export default AdminFooter;
