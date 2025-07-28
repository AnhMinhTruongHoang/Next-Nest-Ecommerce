import "antd/dist/reset.css";
import ClientConfigProvider from "@/lib/ClientConfigProvider";
import NextAuthWrapper from "@/lib/next.auth.wrapper";
import NProgressWrapper from "@/lib/nprogress.wrapper";
import { ToastProvider } from "@/utils/toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <ClientConfigProvider>
          <NProgressWrapper>
            <NextAuthWrapper>
              <ToastProvider>
                <div style={{ marginBottom: "100px" }}>{children}</div>
              </ToastProvider>
            </NextAuthWrapper>
          </NProgressWrapper>
        </ClientConfigProvider>
      </body>
    </html>
  );
}
