import type { Metadata } from "next";
import "../../styles/global.css";
import { AppProvider } from "@/components/context/app.context";
import ClientLayout from "@/components/header/ClientLayout";

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
    <html lang="en">
      <body>
        <AppProvider>
          <ClientLayout>{children}</ClientLayout>
        </AppProvider>
      </body>
    </html>
  );
}
