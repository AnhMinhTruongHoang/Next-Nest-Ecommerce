"use client";

import AppHeader from "@/components/header/app.header";
import AppFooter from "@/components/footer/app.footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      {children}
      <div style={{ marginBottom: "100px" }} />
      <AppFooter />
    </>
  );
}
