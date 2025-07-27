import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN"; // nếu cần đa ngôn ngữ
import NextAuthWrapper from "@/lib/next.auth.wrapper";
import NProgressWrapper from "@/lib/nprogress.wrapper";
import { ToastProvider } from "@/utils/toast";
import "antd/dist/reset.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          locale={viVN}
          theme={{ token: { colorPrimary: "#ff3d00" } }}
        >
          <NProgressWrapper>
            <NextAuthWrapper>
              <ToastProvider>
                <div style={{ marginBottom: "100px" }}>{children}</div>
              </ToastProvider>
            </NextAuthWrapper>
          </NProgressWrapper>
        </ConfigProvider>
      </body>
    </html>
  );
}
