"use client";

import { Layout } from "antd";
import AppHeader from "@/components/header/app.header";
import AppFooter from "@/components/footer/app.footer";
import { AppProvider } from "@/components/context/app.context";

const { Header, Content, Footer } = Layout;

export default function UnifiedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ padding: 0, margin: 0 }}>
          <AppHeader />
        </Header>

        <Content style={{ flex: 1, padding: 0, margin: 0 }}>
          <main className="p-4">{children}</main>
        </Content>

        <Footer style={{ padding: 0, margin: 0 }}>
          <AppFooter />
        </Footer>
      </Layout>
    </AppProvider>
  );
}
