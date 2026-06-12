"use client";

import ProductsPage from "@/components/products/all.products";

export default function AllProductsPage() {
  return (
    <main className="all-products-page">
      <div className="all-products-container">
        <h1 className="all-products-title">Tất cả sản phẩm</h1>
        <ProductsPage />
      </div>

      <style jsx global>{`
        .all-products-page {
          min-height: 100vh;
          background: #1e2021;
          padding: 40px 16px 60px;
          color: #ffffff;
        }

        .all-products-container {
          max-width: 1440px;
          margin: 0 auto;
        }

        .all-products-title {
          text-align: center;
          color: #ffffff;
          font-size: 36px;
          font-weight: 800;
          margin: 0 0 32px;
          letter-spacing: 0.4px;
        }

        @media (max-width: 768px) {
          .all-products-page {
            padding: 24px 10px 50px;
          }

          .all-products-title {
            font-size: 28px;
            margin-bottom: 22px;
          }
        }

        @media (max-width: 380px) {
          .all-products-page {
            padding: 20px 8px 40px;
          }

          .all-products-title {
            font-size: 24px;
          }
        }
      `}</style>
    </main>
  );
}