"use client";

import React, { Suspense } from "react";
import { App, Skeleton } from "antd";
import { AppProvider } from "@/components/context/app.context";
import { AdminContextProvider } from "@/lib/admin.context";
import AdminSideBar from "@/components/admin/admin.sidebar";
import AdminHeader from "@/components/admin/admin.header";
import AdminContent from "@/components/admin/admin.content";
import AdminFooter from "@/components/admin/admin.footer";
import NProgressWrapper from "@/lib/nprogress.wrapper";

interface Props {
  children: React.ReactNode;
  session: any;
}

const AdminLayoutClient: React.FC<Props> = ({ children, session }) => {
  return (
    <App>
      <AppProvider>
        <AdminContextProvider>
          <NProgressWrapper>
            <div className="gz-admin-layout">
              <div className="gz-admin-left-side">
                <AdminSideBar />
              </div>

              <div className="gz-admin-right-side">
                <AdminHeader session={session} />

                <main className="gz-admin-main">
                  <Suspense
                    fallback={<Skeleton active paragraph={{ rows: 6 }} />}
                  >
                    <AdminContent>{children}</AdminContent>
                  </Suspense>
                </main>

                <AdminFooter />
              </div>
            </div>

            <style jsx global>{`
              .gz-admin-layout {
                display: flex;
                min-height: 100vh;
                background: #111314;
              }

              .gz-admin-left-side {
                flex-shrink: 0;
                background: #181a1b;
              }

              .gz-admin-right-side {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                background: #111314;
              }

              .gz-admin-main {
                flex: 1;
                min-width: 0;
                padding: 16px;
                overflow-x: hidden;
              }

              @media (max-width: 767px) {
                .gz-admin-layout {
                  display: block;
                }

                .gz-admin-left-side {
                  width: 0;
                }

                .gz-admin-right-side {
                  width: 100%;
                  min-height: 100vh;
                }

                .gz-admin-main {
                  padding: 12px;
                }

                .gz-admin-main .ant-table-wrapper {
                  max-width: 100%;
                }

                .gz-admin-main .ant-table-content {
                  overflow-x: auto !important;
                }

                .gz-admin-main .ant-table-content::-webkit-scrollbar {
                  height: 8px;
                }

                .gz-admin-main .ant-table-content::-webkit-scrollbar-track {
                  background: #111314;
                }

                .gz-admin-main .ant-table-content::-webkit-scrollbar-thumb {
                  background: #303435;
                  border-radius: 999px;
                }

                .gz-admin-main
                  .ant-table-content::-webkit-scrollbar-thumb:hover {
                  background: #00ffe0;
                }

                .gz-admin-main .ant-pagination {
                  flex-wrap: wrap;
                  row-gap: 8px;
                }

                @media (max-width: 767px) {
                  .gz-admin-main .ant-table-wrapper {
                    width: 100%;
                  }

                  .gz-admin-main .ant-table {
                    font-size: 12px !important;
                  }

                  .gz-admin-main .ant-table-thead > tr > th,
                  .gz-admin-main .ant-table-tbody > tr > td {
                    white-space: nowrap;
                  }

                  .gz-admin-main .ant-pagination {
                    justify-content: center !important;
                    padding-inline: 8px !important;
                  }

                  .gz-admin-main .ant-pagination-total-text {
                    width: 100%;
                    text-align: center;
                  }

                  .gz-admin-main .ant-pagination-options {
                    display: none !important;
                  }
                }
              }
            `}</style>
          </NProgressWrapper>
        </AdminContextProvider>
      </AppProvider>
    </App>
  );
};

export default AdminLayoutClient;
