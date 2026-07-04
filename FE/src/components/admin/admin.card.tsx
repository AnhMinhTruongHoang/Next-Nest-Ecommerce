"use client";

import OVCard from "../dashboard_temp/overview/ov.card";
import { PaymentsOverview } from "../dashboard_temp/payments-overview/payment.OverView";
import { TopSellingProductsOverview } from "../dashboard_temp/top-selling-products/top-selling-products.overview";

interface AdminCardProps {
  searchParams?: any;
}

export default function AdminCard({ searchParams }: AdminCardProps) {
  return (
    <div className="gz-dashboard-wrapper">
      <div className="gz-dashboard-heading">
        <div className="gz-dashboard-heading-inner">
          <h1>Dashboard Overview</h1>
          <p>Theo dõi nhanh người dùng, đơn hàng, sản phẩm và doanh thu.</p>
        </div>
      </div>

      <section className="gz-dashboard-section">
        <OVCard />
      </section>

      <section className="gz-dashboard-section">
        <PaymentsOverview timeFrame="monthly" />
      </section>

      <section className="gz-dashboard-section">
        <TopSellingProductsOverview />
      </section>

      <style jsx>{`
        .gz-dashboard-wrapper {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          text-align: center;
        }

        .gz-dashboard-heading-inner h1 {
          margin: 0;
          color: #ffffff;
          font-size: 28px;
          font-weight: 900;
        }

        .gz-dashboard-heading-inner p {
          margin: 8px 0 0;
          color: #8b949e;
          font-size: 14px;
        }
        .gz-dashboard-heading h1 {
          margin: 0;
          color: #ffffff;
          font-size: 28px;
          text-align: center;

          font-weight: 900;
        }

        .gz-dashboard-heading p {
          margin: 6px 0 0;
          color: #8b949e;
          font-size: 14px;
        }

        .gz-dashboard-section {
          min-width: 0;
        }

        @media (max-width: 768px) {
          .gz-dashboard-wrapper {
            gap: 12px;
          }

          .gz-dashboard-heading {
            padding: 14px;
            border-radius: 14px;
          }

          .gz-dashboard-heading h1 {
            font-size: 22px;
          }

          .gz-dashboard-heading p {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
