"use client";

import { App, Layout } from "antd";
import AppHeader from "@/components/header/app.header";
import AppFooter from "@/components/footer/app.footer";
import { AppProvider } from "@/components/context/app.context";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";

const { Header, Content, Footer } = Layout;

export default function UnifiedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Mỗi khi pathname thay đổi => chạy progress
    NProgress.start();
    NProgress.done();
  }, [pathname]);

  return (
    <AppProvider>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ padding: 0, margin: 0 }}>
          <AppHeader />
        </Header>

        <Content style={{ flex: 1, padding: 0, margin: 0 }}>
          <App>
            <main className="p-4">{children}</main>
          </App>
        </Content>

        <Footer style={{ padding: 0, margin: 0 }}>
          <AppFooter />
        </Footer>
      </Layout>
    </AppProvider>
  );
}
