"use client";

import { useIsMobile } from "@/utils/use-mobile";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
  data: {
    received: { x: unknown; y: number }[];
    due: { x: unknown; y: number }[];
  };
};

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function PaymentsOverviewChart({ data }: PropsType) {
  const isMobile = useIsMobile();

  const options: ApexOptions = {
    legend: {
      show: !isMobile,
      position: "top",
      horizontalAlign: "right",
      fontSize: isMobile ? "10px" : "12px",
    },
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "inherit",
      zoom: { enabled: false },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 220 },
          stroke: { width: 2 },
          grid: { padding: { left: 5, right: 5 } },
        },
      },
      {
        breakpoint: 1280,
        options: {
          chart: { height: 280 },
        },
      },
    ],
    stroke: {
      curve: "smooth",
      width: isMobile ? 2 : 3,
    },
    grid: {
      strokeDashArray: 4,
      borderColor: "#E5E7EB",
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      marker: { show: true },
      style: { fontSize: isMobile ? "11px" : "13px" },
    },
    xaxis: {
      labels: {
        style: { fontSize: isMobile ? "10px" : "12px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: isMobile ? "10px" : "12px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-4">
      <Chart
        options={options}
        series={[
          { name: "Received", data: data.received },
          { name: "Due", data: data.due },
        ]}
        type="area"
        height={isMobile ? 220 : 310}
      />
    </div>
  );
}
