"use client";

import ProductsPage from "@/components/products/all.products";

export default function AllProductsPage() {
  return (
    <main className="all-products-page">
      <div className="all-products-container">
        <div className="all-products-head">
          <span>GamerZone Store</span>
          <h1>Tất cả sản phẩm</h1>
          <p>
            Khám phá thiết bị chơi game, phụ kiện và các sản phẩm bán chạy nhất.
          </p>
        </div>

        <ProductsPage />
      </div>

      <style jsx global>{`
        .all-products-page {
          min-height: 100vh;
          padding: 36px 16px 60px;
          color: #ffffff;
          background: radial-gradient(
              circle at top left,
              rgba(0, 255, 224, 0.07),
              transparent 34%
            ),
            radial-gradient(
              circle at top right,
              rgba(255, 77, 0, 0.065),
              transparent 34%
            ),
            #1e2021;
        }

        .all-products-container {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
        }

        .all-products-head {
          max-width: 680px;
          margin: 0 auto 28px;
          text-align: center;
        }

        .all-products-head span {
          display: block;
          margin-bottom: 8px;
          color: #00ffe0;
          font-size: 11px;
          font-weight: 950;
          line-height: 1.2;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        .all-products-head h1 {
          margin: 0;
          color: #ffffff;
          font-size: 38px;
          font-weight: 950;
          line-height: 1.16;
        }

        .all-products-head p {
          max-width: 520px;
          margin: 10px auto 0;
          color: #b8c0cc;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.55;
        }

        @media (max-width: 768px) {
          .all-products-page {
            padding: 24px 10px 50px;
          }

          .all-products-head {
            margin-bottom: 20px;
          }

          .all-products-head h1 {
            font-size: 30px;
          }

          .all-products-head p {
            font-size: 13px;
          }
        }

        @media (max-width: 380px) {
          .all-products-page {
            padding: 20px 8px 42px;
          }

          .all-products-head h1 {
            font-size: 26px;
          }
        }
      `}</style>
    </main>
  );
}
