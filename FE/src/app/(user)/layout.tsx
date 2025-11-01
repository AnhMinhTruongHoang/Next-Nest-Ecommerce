"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Layout, App as AntdApp, ConfigProvider } from "antd";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // nhớ có file css

import AppHeader from "@/components/header/app.header";
import AppFooter from "@/components/footer/app.footer";
import { AppProvider } from "@/components/context/app.context";

const { Header, Content, Footer } = Layout;

NProgress.configure({ showSpinner: false });

export default function UnifiedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    const t = setTimeout(() => NProgress.done(), 300);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <ConfigProvider>
      <AntdApp>
        <AppProvider>
          <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ padding: 0, margin: 0 }}>
              <AppHeader />
            </Header>

            <Content style={{ flex: 1, padding: 0, margin: 0 }}>
              {/* children có thể dùng App.useApp() vì đang nằm trong <AntdApp> */}
              <main className="p-4">{children}</main>
            </Content>

            <Footer style={{ padding: 0, margin: 0 }}>
              <AppFooter />
            </Footer>
          </Layout>
        </AppProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
