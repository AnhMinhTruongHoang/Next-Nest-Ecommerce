import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.options";
import { AdminContextProvider } from "@/lib/admin.context";
import AdminSideBar from "@/components/admin/admin.sidebar";
import AdminHeader from "@/components/admin/admin.header";
import AdminContent from "@/components/admin/admin.content";
import AdminFooter from "@/components/admin/admin.footer";
import "antd/dist/reset.css";
import { App } from "antd";

const AdminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getServerSession(authOptions);

  return (
    <App>
      <AdminContextProvider>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <div className="left-side" style={{ minWidth: 80 }}>
            <AdminSideBar />
          </div>

          <div
            className="right-side"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <AdminHeader session={session} />
            <div style={{ flex: 1 }}>
              <AdminContent>{children}</AdminContent>
            </div>
            <AdminFooter />
          </div>
        </div>
      </AdminContextProvider>
    </App>
  );
};

export default AdminLayout;
