import type { Metadata } from "next";
import "../../styles/global.css";
import { AppProvider } from "@/components/context/app.context";

export const metadata: Metadata = {
  title: "Ecommerce App",
  description: "Next.js + NestJS Ecommerce demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
