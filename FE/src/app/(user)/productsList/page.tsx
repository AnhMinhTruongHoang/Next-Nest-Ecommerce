"use client";

import ProductsPage from "@/components/products/all.products";

export default function AllProductsPage() {
  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ textAlign: "center" }}>Tất cả sản phẩm</h1>
      <ProductsPage />
    </div>
  );
}
