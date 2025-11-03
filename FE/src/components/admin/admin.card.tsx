"use client";

import { RegionLabels } from "../DashBoard/map/label";
import { WeeksProfit } from "../DashBoard/Profit/Profit.week";
import { PaymentsOverview } from "../DashBoard/payments-overview/payment.overView";
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
      {/* TỔNG QUAN */}
      <div style={{ gridColumn: "span 12 / span 12" }}>
        <OVCard />
      </div>

      {/* TỔNG QUAN THANH TOÁN */}
      <div style={{ gridColumn: "span 12 / span 12" }}>
        <PaymentsOverview timeFrame="monthly" />
      </div>

      {/* LỢI NHUẬN THEO TUẦN */}
      <div style={{ gridColumn: "span 12 / span 12" }}>
        <WeeksProfit timeFrame="this week" />
      </div>

      {/* BẢN ĐỒ KHU VỰC */}
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
