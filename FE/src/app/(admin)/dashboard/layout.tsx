import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.options";
import { AdminContextProvider } from "@/lib/admin.context";
import AdminSideBar from "@/components/admin/admin.sidebar";
import AdminHeader from "@/components/admin/admin.header";
import AdminContent from "@/components/admin/admin.content";
import AdminFooter from "@/components/admin/admin.footer";
import { App, Skeleton } from "antd";
import { AppProvider } from "@/components/context/app.context";
import "antd/dist/reset.css";
import NProgressWrapper from "@/lib/nprogress.wrapper";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

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

export default AdminLayout;
