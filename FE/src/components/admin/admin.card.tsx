"use client";

import { RegionLabels } from "../dashboard/map/label";
import OVCard from "../dashboard/overview/ov.card";
import { PaymentsOverview } from "../dashboard/payments-overview/payment.OverView";

interface AdminCardProps {
  searchParams?: any;
}

export default function AdminCard({ searchParams }: AdminCardProps) {
  console.log("searchParams:", searchParams);

  return (
    <div className="wrapper">
      <div className="block">
        <OVCard />
      </div>

      <div className="block">
        <PaymentsOverview timeFrame="monthly" />
      </div>

      <div className="block center">
        <RegionLabels />
      </div>

      <style jsx>{`
        .wrapper {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 1fr; /* mobile-first: 1 cột */
          gap: 12px; /* gap nhỏ trên mobile */
        }

        .block {
          grid-column: 1 / -1; /* full width */
        }

        .center {
          text-align: center;
          margin-top: 12px;
        }

        /* ≥768px (md): 6 cột */
        @media (min-width: 768px) {
          .wrapper {
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 16px;
          }
          .block {
            grid-column: 1 / -1; /* vẫn full width, dễ đổi sau này */
          }
          .center {
            margin-top: 14px;
          }
        }

        /* ≥1024px (lg): 12 cột */
        @media (min-width: 1024px) {
          .wrapper {
            grid-template-columns: repeat(12, minmax(0, 1fr));
            gap: 16px;
          }
          .block {
            grid-column: span 12;
          }
          .center {
            margin-top: 15px;
          }
        }
      `}</style>
    </div>
  );
}
