"use client";

import OVCard from "../dashboard_temp/overview/ov.card";
import { PaymentsOverview } from "../dashboard_temp/payments-overview/payment.OverView";

interface AdminCardProps {
  searchParams?: any;
}

export default function AdminCard({ searchParams }: AdminCardProps) {
  return (
    <div className="gz-dashboard-wrapper">
      <div className="gz-dashboard-heading">
        <div>
          <h1 style={{ textAlign: "center" }}>Dashboard Overview</h1>
          <p style={{ textAlign: "center" }}>
            Theo dõi nhanh người dùng, đơn hàng, sản phẩm và doanh thu.
          </p>
        </div>
      </div>

      <section className="gz-dashboard-section">
        <OVCard />
      </section>

      <section className="gz-dashboard-section">
        <PaymentsOverview timeFrame="monthly" />
      </section>

      <style jsx>{`
        .gz-dashboard-wrapper {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .gz-dashboard-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 16px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }

        .gz-dashboard-heading h1 {
          margin: 0;
          color: #ffffff;
          font-size: 28px;
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
