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
          background: #181a1b !important;
          color: #8b949e !important;
          padding: 16px 12px !important;
          border-top: 1px solid #2a2d2e !important;
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