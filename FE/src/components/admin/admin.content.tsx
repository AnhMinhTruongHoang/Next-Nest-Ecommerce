"use client";

import { Layout } from "antd";
import React from "react";

const { Content } = Layout;

const AdminContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Content className="admin-content">
      {children}

      <style jsx global>{`
        html,
        body {
          background: #1e2021 !important;
        }

        .ant-layout,
        .ant-layout-content {
          background: #1e2021 !important;
        }

        .ant-layout-footer {
          background: #181a1b !important;
        }

        .admin-content {
          flex: 1;
          min-height: calc(100dvh - 128px);
          background: #1e2021 !important;
          padding: 12px;
          padding-left: max(12px, env(safe-area-inset-left));
          padding-right: max(12px, env(safe-area-inset-right));
          overflow: auto;
          border-radius: 0;
          color: #ffffff;
        }

        .admin-content h1,
        .admin-content h2,
        .admin-content h3,
        .admin-content h4,
        .admin-content h5 {
          color: #ffffff;
        }

        .admin-content p,
        .admin-content span,
        .admin-content label {
          color: inherit;
        }

        .admin-content::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .admin-content::-webkit-scrollbar-track {
          background: #181a1b;
        }

        .admin-content::-webkit-scrollbar-thumb {
          background: #303435;
          border-radius: 999px;
        }

        .admin-content::-webkit-scrollbar-thumb:hover {
          background: #00ffe0;
        }

        @media (min-width: 768px) {
          .admin-content {
            padding: 16px;
          }
        }

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