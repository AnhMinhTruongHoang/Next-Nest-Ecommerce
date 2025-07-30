"use client";

import { Skeleton, Layout } from "antd";

const { Header, Sider, Content, Footer } = Layout;

export default function AdminSkeletonLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar giả */}
      <Sider width={80} style={{ background: "#fff", padding: "20px 10px" }}>
        <Skeleton.Avatar active shape="square" size="large" />
        <Skeleton.Button active block style={{ marginTop: 20 }} />
        <Skeleton.Button active block style={{ marginTop: 10 }} />
        <Skeleton.Button active block style={{ marginTop: 10 }} />
      </Sider>

      {/* Nội dung chính */}
      <Layout>
        {/* Header giả */}
        <Header style={{ background: "#fff", padding: "0 24px" }}>
          <Skeleton.Input active size="large" style={{ width: 200 }} />
        </Header>

        {/* Content giả */}
        <Content style={{ margin: "24px", background: "#fff", padding: 24 }}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Content>

        {/* Footer giả */}
        <Footer style={{ textAlign: "center" }}>
          <Skeleton.Input active size="small" style={{ width: 150 }} />
        </Footer>
      </Layout>
    </Layout>
  );
}
