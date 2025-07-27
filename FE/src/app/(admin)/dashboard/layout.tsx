import AdminContent from "@/components/admin/admin.content";
import AdminFooter from "@/components/admin/admin.footer";
import AdminHeader from "@/components/admin/admin.header";
import AdminSideBar from "@/components/admin/admin.sidebar";
import { AdminContextProvider } from "@/lib/admin.context";

const AdminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // const session = await auth();
  return (
    <AdminContextProvider>
      <div style={{ display: "flex" }}>
        <div className="left-side" style={{ minWidth: 80 }}>
          <AdminSideBar />
        </div>
        <div className="right-side" style={{ flex: 1 }}>
          {/* <AdminHeader session={session} /> */}
          <AdminHeader />
          <AdminContent>{children}</AdminContent>
          <AdminFooter />
        </div>
      </div>
    </AdminContextProvider>
  );
};

export default AdminLayout;
