"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Layout, App as AntdApp, ConfigProvider } from "antd";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import AppHeader from "@/components/header/app.header";
import AppFooter from "@/components/footer/app.footer";
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

    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <ConfigProvider>
      <AntdApp>
        <AppProvider>
          <Layout className="gz-app-layout">
            <Header className="gz-app-header">
              <AppHeader />
            </Header>

            <Content className="gz-app-content">
              <main className="gz-app-main">{children}</main>
            </Content>

            <AppFooter />
          </Layout>
        </AppProvider>
      </AntdApp>

      <style jsx global>{`
        .gz-app-layout {
          min-height: 100vh;
          background: #101112;
        }

        .gz-app-header {
          height: auto !important;
          padding: 0 !important;
          margin: 0 !important;
          line-height: normal !important;
          background: transparent !important;
        }

        .gz-app-content {
          flex: 1;
          padding: 0 !important;
          margin: 0 !important;
          background: #101112;
        }

        .gz-app-main {
          width: 100%;
          min-height: calc(100vh - 180px);
          padding: 16px;
        }

        @media (max-width: 768px) {
          .gz-app-main {
            padding: 12px;
          }
        }

        @media (max-width: 420px) {
          .gz-app-main {
            padding: 10px;
          }
        }
      `}</style>
    </ConfigProvider>
  );
}
