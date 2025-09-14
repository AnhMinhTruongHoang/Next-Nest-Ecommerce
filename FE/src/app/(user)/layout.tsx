"use client";

import ClientLayout from "@/components/header/ClientLayout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <ClientLayout>
          <main className="p-4">{children}</main>
        </ClientLayout>
      </body>
    </html>
  );
}
