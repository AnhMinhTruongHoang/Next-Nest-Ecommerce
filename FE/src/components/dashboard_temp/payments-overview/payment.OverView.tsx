"use client";

import { useEffect, useState } from "react";
import { getPaymentsOverviewData } from "./overview.data";
import { PaymentsOverviewChart } from "./chart.payment";
import { currencyVND, standardFormat } from "../overview/format";

type DataPoint = { x: string | number; y: number };
type PaymentsOverviewData = { received: DataPoint[]; due: DataPoint[] };

type PropsType = {
  timeFrame?: string; // "monthly" | "yearly"
  className?: string;
};

export function PaymentsOverview({ timeFrame = "monthly" }: PropsType) {
  const [data, setData] = useState<PaymentsOverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setError(null);
    setData(null);

    getPaymentsOverviewData({ timeFrame, signal: ac.signal })
      .then((res) => setData(res))
      .catch((err) => {
        if (err?.name !== "AbortError") setError(err?.message || String(err));
      });

    return () => ac.abort();
  }, [timeFrame]);

  if (error) {
    return (
      <div style={{ borderRadius: 16, background: "#fff", padding: 24 }}>
        Lỗi tải dữ liệu: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div
        style={{
          borderRadius: 16,
          backgroundColor: "white",
          padding: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ color: "#9ca3af", textTransform: "uppercase" }}>
          ĐANG TẢI…
        </p>
      </div>
    );
  }

  const receivedTotal = data.received.reduce((s, i) => s + (i.y || 0), 0);
  const dueTotal = data.due.reduce((s, i) => s + (i.y || 0), 0);

  ///
  return (
    <div
      style={{
        borderRadius: 16,
        backgroundColor: "#181A1B",
        padding: 24,
        boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
        border: "1px solid #2A2D2E",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          borderBottom: "1px solid #303435",
          paddingBottom: 12,
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#FFFFFF",
            flex: 1,
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          TỔNG QUAN THANH TOÁN
        </h2>
      </div>

      {/* CHART */}
      <div style={{ marginTop: 20, minHeight: 240, overflow: "hidden" }}>
        <PaymentsOverviewChart data={data} />
      </div>

      {/* TOTALS */}
      <dl
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderTop: "1px solid #303435",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: 12,
            borderRight: "1px solid #303435",
          }}
        >
          <dt style={{ fontSize: 22, fontWeight: 600, color: "#00C781" }}>
            {currencyVND(receivedTotal)}
          </dt>
          <dd style={{ fontSize: 14, color: "#B8B8B8" }}>ĐÃ NHẬN</dd>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: 12,
          }}
        >
          <dt style={{ fontSize: 22, fontWeight: 600, color: "#FF4D4F" }}>
            {currencyVND(dueTotal)}
          </dt>
          <dd style={{ fontSize: 14, color: "#B8B8B8" }}>CÒN NỢ</dd>
        </div>
      </dl>
    </div>
  );
}
