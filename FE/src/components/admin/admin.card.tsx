"use client";

import { RegionLabels } from "../DashBoard/map/label";
import { PaymentsOverview } from "../DashBoard/payments-overview/payment.OverView";
import OVCard from "../DashBoard/overview/ov.card";

interface AdminCardProps {
  searchParams?: any;
}

export default function AdminCard({ searchParams }: AdminCardProps) {
  console.log("searchParams:", searchParams);

  return (
    <div
      style={{
        marginTop: "16px",
        display: "grid",
        gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
        gap: "16px",
      }}
    >
      <div style={{ gridColumn: "span 12 / span 12" }}>
        <OVCard />
      </div>

      <div style={{ gridColumn: "span 12 / span 12" }}>
        <PaymentsOverview timeFrame="monthly" />
      </div>

      <div
        style={{
          gridColumn: "span 12 / span 12",
          textAlign: "center",
          marginTop: "15px",
        }}
      >
        <RegionLabels />
      </div>
    </div>
  );
}
