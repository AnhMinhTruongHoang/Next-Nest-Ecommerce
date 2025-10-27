"use client";

import React, { Suspense, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f5f5f5",
        }}
      >
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <App>
      <AppProvider>
        <AdminContextProvider>
          <NProgressWrapper>
            <div style={{ display: "flex", minHeight: "100vh" }}>
              {/* Sidebar */}
              <div className="left-side" style={{ minWidth: 80 }}>
                <AdminSideBar />
              </div>

              {/* Main content */}
              <div
                className="right-side"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <AdminHeader session={session} />
                <div style={{ flex: 1, padding: 16 }}>
                  <Suspense
                    fallback={<Skeleton active paragraph={{ rows: 6 }} />}
                  >
                    <AdminContent>{children}</AdminContent>
                  </Suspense>
                </div>
                <AdminFooter />
              </div>
            </div>
          </NProgressWrapper>
        </AdminContextProvider>
      </AppProvider>
    </App>
  );
};

export default AdminLayoutClient;
