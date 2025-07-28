"use client";

import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { ReactNode } from "react";

export default function ClientConfigProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{ token: { colorPrimary: "#ff3d00" } }}
    >
      {children}
    </ConfigProvider>
  );
}
