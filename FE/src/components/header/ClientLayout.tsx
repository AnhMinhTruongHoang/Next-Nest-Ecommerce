"use client";

import AppHeader from "@/components/header/app.header";
import AppFooter from "@/components/footer/app.footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <AppHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <AppFooter />
    </div>
  );
}
