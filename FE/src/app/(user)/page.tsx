"use client";

import { ConfigProvider, Layout } from "antd";
import viVN from "antd/locale/vi_VN";
import NextAuthWrapper from "@/lib/next.auth.wrapper";
import NProgressWrapper from "@/lib/nprogress.wrapper";
import { ToastProvider } from "@/utils/toast";

const { Header, Content, Footer } = Layout;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <ConfigProvider
          locale={viVN}
          theme={{ token: { colorPrimary: "#ff3d00" } }}
        >
          <NProgressWrapper>
            <NextAuthWrapper>
              <ToastProvider>
                <Layout style={{ minHeight: "100vh" }}>
                  <Header style={{ background: "#001529", color: "white" }}>
                    My Header
                  </Header>
                  <Content style={{ padding: 24 }}>{children}</Content>
                  <Footer style={{ textAlign: "center" }}>
                    ©2025 Created by You
                  </Footer>
                </Layout>
              </ToastProvider>
            </NextAuthWrapper>
          </NProgressWrapper>
        </ConfigProvider>
      </body>
    </html>
  );
}
