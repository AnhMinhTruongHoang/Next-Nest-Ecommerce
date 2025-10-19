"use client";

import AdminCard from "@/components/admin/admin.card";
import { App } from "antd";

export default function DashboardPage({ searchParams }: { searchParams: any }) {
  return (
    <App>
      <AdminCard searchParams={searchParams} />
    </App>
  );
}
