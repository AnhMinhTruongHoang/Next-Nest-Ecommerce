"use client";

import OrderTable from "@/components/admin/order.table";
import { App } from "antd";

export default function ManageProductPage() {
  return (
    <App>
      <OrderTable />
    </App>
  );
}
