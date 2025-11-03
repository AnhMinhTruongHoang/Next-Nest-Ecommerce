"use client";

import { useEffect, useState } from "react";
import { WeeksProfitChart } from "./chart.week";
import { getWeeksProfitData } from "../payments-overview/overview.data";
import { PeriodPicker } from "./period-picker";

type DataPoint = { x: string; y: number };

type WeeksProfitData = {
  sales: DataPoint[];
  revenue: DataPoint[];
};

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export function WeeksProfit({ timeFrame = "TUẦN NÀY" }: PropsType) {
  const [data, setData] = useState<WeeksProfitData | null>(null);

  useEffect(() => {
    getWeeksProfitData(timeFrame).then((res) => setData(res));
  }, [timeFrame]);

  if (!data) {
    return (
      <div
        style={{
          borderRadius: "10px",
          backgroundColor: "white",
          padding: "24px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ color: "#6b7280", textTransform: "uppercase" }}>
          ĐANG TẢI...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: "10px",
        backgroundColor: "white",
        padding: "30px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* TIÊU ĐỀ */}
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
          LỢI NHUẬN
        </h2>
        <PeriodPicker defaultValue={timeFrame} sectionKey="weeks_profit" />
      </div>

      {/* BIỂU ĐỒ */}
      <WeeksProfitChart data={data} />
    </div>
  );
}
