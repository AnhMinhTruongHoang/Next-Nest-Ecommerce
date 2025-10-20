"use client";

import { useEffect, useState } from "react";
import { getPaymentsOverviewData } from "./overview.data";
import { standardFormat } from "../overview/format";
import { PeriodPicker } from "../Profit/period-picker";
import { PaymentsOverviewChart } from "./chart";

type DataPoint = { x: string | number; y: number };

type PaymentsOverviewData = {
  received: DataPoint[];
  due: DataPoint[];
};

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export function PaymentsOverview({ timeFrame = "MONTHLY" }: PropsType) {
  const [data, setData] = useState<PaymentsOverviewData | null>(null);

  useEffect(() => {
    getPaymentsOverviewData(timeFrame).then((res) => setData(res));
  }, [timeFrame]);

  if (!data) {
    return (
      <div
        style={{
          borderRadius: "16px",
          backgroundColor: "white",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          animation: "pulse 1.5s infinite",
          overflowY: "hidden",
        }}
      >
        <p style={{ color: "#9ca3af", textTransform: "uppercase" }}>
          LOADING...
        </p>
      </div>
    );
  }

  const receivedTotal = data.received.reduce((acc, { y }) => acc + y, 0);
  const dueTotal = data.due.reduce((acc, { y }) => acc + y, 0);

  return (
    <div
      style={{
        borderRadius: "16px",
        backgroundColor: "white",
        padding: "24px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        border: "1px solid #f3f4f6",
        transition: "all 0.3s ease",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          borderBottom: "1px solid #f3f4f6",
          paddingBottom: "12px",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#1f2937",
            flex: 1,
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          PAYMENTS OVERVIEW
        </h2>
        <PeriodPicker defaultValue={timeFrame} sectionKey="payments_overview" />
      </div>

      {/* CHART */}
      <div
        style={{
          marginTop: "20px",
          minHeight: "240px",
          overflowX: "auto",
          overflow: "hidden",
        }}
      >
        <PaymentsOverviewChart data={data} />
      </div>

      {/* TOTALS */}
      <dl
        style={{
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderTop: "1px solid #f3f4f6",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            padding: "12px",
            borderRight: "1px solid #f3f4f6",
          }}
        >
          <dt
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#16a34a",
              textTransform: "uppercase",
            }}
          >
            ${standardFormat(receivedTotal)}
          </dt>
          <dd
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#6b7280",
              textTransform: "uppercase",
            }}
          >
            RECEIVED AMOUNT
          </dd>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            padding: "12px",
          }}
        >
          <dt
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#dc2626",
              textTransform: "uppercase",
            }}
          >
            ${standardFormat(dueTotal)}
          </dt>
          <dd
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#6b7280",
              textTransform: "uppercase",
            }}
          >
            DUE AMOUNT
          </dd>
        </div>
      </dl>
    </div>
  );
}
