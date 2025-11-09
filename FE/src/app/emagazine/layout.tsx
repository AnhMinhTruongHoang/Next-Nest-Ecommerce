"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Layout, App as AntdApp, ConfigProvider } from "antd";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import AppHeader from "@/components/header/app.header";
import { AppProvider } from "@/components/context/app.context";

const { Header, Content } = Layout;

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

  const isEMagazine = pathname.toLowerCase().startsWith("/emagazine");

  return (
    <ConfigProvider>
      <AntdApp>
        <AppProvider>
          <Layout style={{ minHeight: "100vh" }}>
            {/* Giữ header cho mọi trang */}
            <Header style={{ padding: 0, margin: 0, background: "#000" }}>
              <AppHeader />
            </Header>
            <Content
              style={{
                flex: 1,
                padding: 0,
                margin: 0,
                overflow: "hidden",
                background: "transparent",
              }}
              className={isEMagazine ? "!p-0 !m-0 !bg-transparent" : ""}
            >
              <main
                className={isEMagazine ? "m-0 p-0 overflow-x-hidden" : "p-4"}
              >
                {children}
              </main>
            </Content>
          </Layout>
        </AppProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
