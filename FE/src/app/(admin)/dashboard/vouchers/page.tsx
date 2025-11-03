"use client";

import VouchersTable from "@/components/admin/voucher.table";
import { App } from "antd";

export default function ManageVouchersPage() {
  return (
    <App>
      <VouchersTable />
    </App>
  );
}
