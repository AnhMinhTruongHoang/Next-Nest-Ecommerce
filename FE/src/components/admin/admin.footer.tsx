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
          padding: 16px 12px !important;
          font-size: 14px;
        }

        .gz-admin-footer-author {
          color: #00ffe0;
          font-weight: 800;
        }

        @media (max-width: 768px) {
          .gz-admin-footer {
            padding: 14px 8px !important;
            font-size: 13px;
          }
        }
      `}</style>
    </Footer>
  );
};

export default AdminFooter;