import "antd/dist/reset.css";

import ClientConfigProvider from "@/lib/ClientConfigProvider";
import NextAuthWrapper from "@/lib/next.auth.wrapper";
import NProgressWrapper from "@/lib/nprogress.wrapper";
import { ToastProvider } from "@/utils/toast";
import { App } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import InternalChatBot from "@/components/contacts/InternalChatBot";

export const metadata = {
  title: "Gamer Zone",
  description: "Base Next.js app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning={true}>
        <AntdRegistry>
          <ClientConfigProvider>
            <NextAuthWrapper>
              <ToastProvider>
                <NProgressWrapper>
                  <App>{children}</App>
                  {typeof window !== "undefined" && <InternalChatBot />}
                </NProgressWrapper>
              </ToastProvider>
            </NextAuthWrapper>
          </ClientConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
