"use client";

import { Layout } from "antd";
import React from "react";

const { Content } = Layout;

const AdminContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Content className="admin-content">
      {children}

      <style jsx>{`
        .admin-content {
          flex: 1;
          min-height: calc(100dvh - 160px); /* trừ header + footer */
          background: #fafafa;
          padding: 12px;
          padding-left: max(12px, env(safe-area-inset-left));
          padding-right: max(12px, env(safe-area-inset-right));
          overflow: auto;
          border-radius: 8px;
        }

        /* ≥768px */
        @media (min-width: 768px) {
          .admin-content {
            padding: 16px;
          }
        }

        /* ≥1024px */
        @media (min-width: 1024px) {
          .admin-content {
            padding: 20px 24px;
          }
        }
      `}</style>
    </Content>
  );
};

export default AdminContent;
