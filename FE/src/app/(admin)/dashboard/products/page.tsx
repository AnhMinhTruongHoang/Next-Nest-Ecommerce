"use client";

import ProductsTable from "@/components/admin/product.table";
import { App } from "antd";

export default function ManageProductPage() {
  return (
    <App>
      <ProductsTable />
    </App>
  );
}
